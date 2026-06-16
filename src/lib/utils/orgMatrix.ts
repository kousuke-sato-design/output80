import type { ScoreData, DepartmentData } from '$lib/types';
import { nationalAveragesMap } from '$lib/data/nationalAverages';
import { SCALE_BY_FIELD, type ScaleField } from '$lib/data/scaleMeta';

export type CellColor = 'good' | 'mid' | 'bad' | 'na';
export interface MatrixCell {
	field: ScaleField;
	value: number | null; // NaN/未算出は null
	z: number | null; // 全国比のzスコア（方向補正済み＝大きいほど良い）
	color: CellColor;
}
export interface MatrixRow {
	label: string;
	count: number | null;
	kind: 'dept' | 'org' | 'national';
	cells: MatrixCell[];
}

/** 全国平均(average, sd)を取得。合計4指標も nationalAverages に含めてある。 */
export function nationalOf(field: ScaleField): { average: number; sd: number } | null {
	const def = SCALE_BY_FIELD.get(field);
	if (!def || !def.nationalKey) return null;
	const nat = nationalAveragesMap.get(def.nationalKey);
	if (!nat) return null;
	return { average: nat.average, sd: nat.standardDeviation || 0 };
}

function num(v: number | undefined): number | null {
	return v === undefined || Number.isNaN(v) ? null : v;
}

/** 全尺度「高い＝良い」前提。zスコアで色分け（+0.5以上=良 / -0.5以下=要改善 / 中間）。 */
export function cellColorFor(field: ScaleField, value: number | null): { z: number | null; color: CellColor } {
	if (value === null) return { z: null, color: 'na' };
	const nat = nationalOf(field);
	if (!nat || !nat.sd) return { z: null, color: 'na' };
	const z = (value - nat.average) / nat.sd;
	const color: CellColor = z >= 0.5 ? 'good' : z <= -0.5 ? 'bad' : 'mid';
	return { z, color };
}

function rowFromScores(label: string, count: number | null, kind: MatrixRow['kind'], scores: ScoreData | null, fields: ScaleField[]): MatrixRow {
	const cells: MatrixCell[] = fields.map((field) => {
		const value = scores ? num(scores[field] as number) : null;
		const { z, color } = cellColorFor(field, value);
		// 全国平均の行は自己比較しないので色なし
		return { field, value, z: kind === 'national' ? null : z, color: kind === 'national' ? 'na' : color };
	});
	return { label, count, kind, cells };
}

/**
 * 行=各部署→組織全体→全国平均(参考)、列=fields のマトリクスを構築。
 */
export function buildMatrix(
	departmentAverages: Map<string, DepartmentData>,
	overallAverage: ScoreData | null,
	departments: string[],
	fields: ScaleField[],
	sortMode: SortMode = 'code',
	sortField?: ScaleField
): MatrixRow[] {
	const orderedDepts = sortDepartments(departmentAverages, departments, sortMode, sortField);
	const rows: MatrixRow[] = orderedDepts
		.map((d) => {
			const dd = departmentAverages.get(d);
			if (!dd) return null;
			return rowFromScores(dd.name, dd.userCount, 'dept', dd.averageScores, fields);
		})
		.filter((r): r is MatrixRow => r !== null);

	if (overallAverage) {
		const totalCount = Array.from(departmentAverages.values()).reduce((s, d) => s + d.userCount, 0);
		rows.push(rowFromScores('組織全体', totalCount || null, 'org', overallAverage, fields));
	}
	// 全国平均(参考)行：各fieldの全国平均値を表示
	const natScores: Record<string, number> = {};
	fields.forEach((f) => {
		const nat = nationalOf(f);
		natScores[f] = nat ? nat.average : NaN;
	});
	rows.push(rowFromScores('全国平均(参考)', null, 'national', natScores as unknown as ScoreData, fields));
	return rows;
}

export type SortMode = 'code' | 'good' | 'bad';

/** 部署の並べ替え（コード順＝departments順 / 良い順＝指標降順 / 悪い順＝指標昇順）。全尺度 高=良。 */
export function sortDepartments(
	departmentAverages: Map<string, DepartmentData>,
	departments: string[],
	mode: SortMode,
	field?: ScaleField
): string[] {
	if (mode === 'code' || !field) return [...departments];
	const val = (d: string): number => {
		const v = departmentAverages.get(d)?.averageScores?.[field] as number | undefined;
		return v === undefined || Number.isNaN(v) ? -Infinity : v;
	};
	const sorted = [...departments].sort((a, b) => (mode === 'good' ? val(b) - val(a) : val(a) - val(b)));
	return sorted;
}

export interface ComparisonSeries {
	labels: string[]; // 部署名... + '組織全体'
	values: number[]; // 各バーの値（NaNはそのまま）
	orgIndex: number; // 「組織全体」バーの位置（強調用）
	nationalValue: number | null; // 全国平均（基準線）。無ければ null
	scaleLabel: string;
}

/** 比較グラフ用：選択した1指標について、各部署＋組織全体のバー値と全国基準線を返す。 */
export function comparisonSeries(
	departmentAverages: Map<string, DepartmentData>,
	overallAverage: ScoreData | null,
	departments: string[],
	field: ScaleField,
	sortMode: SortMode = 'code'
): ComparisonSeries {
	const ordered = sortDepartments(departmentAverages, departments, sortMode, field);
	const labels: string[] = [];
	const values: number[] = [];
	ordered.forEach((d) => {
		const dd = departmentAverages.get(d);
		if (!dd) return;
		labels.push(dd.name);
		values.push(dd.averageScores[field] as number);
	});
	let orgIndex = -1;
	if (overallAverage) {
		orgIndex = labels.length;
		labels.push('組織全体');
		values.push(overallAverage[field] as number);
	}
	const nat = nationalOf(field);
	const def = SCALE_BY_FIELD.get(field);
	return {
		labels,
		values,
		orgIndex,
		nationalValue: nat ? nat.average : null,
		scaleLabel: def ? def.label : String(field)
	};
}

export interface ScaleVsNational {
	field: ScaleField;
	label: string;
	group: string;
	org: number | null;
	national: number | null;
	diff: number | null; // org - national（正＝全国より良好。全尺度 高=良）
	z: number | null;
	color: CellColor;
}

/** 組織全体 vs 全国平均：指定尺度ごとに組織値・全国平均・差・色を返す（組織ビュー用）。 */
export function orgVsNational(overallAverage: ScoreData | null, fields: ScaleField[]): ScaleVsNational[] {
	return fields.map((field) => {
		const def = SCALE_BY_FIELD.get(field);
		const org = overallAverage ? num(overallAverage[field] as number) : null;
		const nat = nationalOf(field);
		const national = nat ? nat.average : null;
		const diff = org !== null && national !== null ? org - national : null;
		const { z, color } = cellColorFor(field, org);
		return {
			field,
			label: def ? def.label : String(field),
			group: def ? def.group : '',
			org,
			national,
			diff,
			z,
			color
		};
	});
}
