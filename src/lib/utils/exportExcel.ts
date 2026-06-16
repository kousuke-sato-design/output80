import * as XLSX from 'xlsx';
import type { UserData, ScoreData } from '$lib/types';
import { ALL_SCALES, type ScaleField } from '$lib/data/scaleMeta';
import { nationalAverages } from '$lib/data/nationalAverages';
import { nationalOf, orgVsNational } from './orgMatrix';
import { availableAxes, groupAverages } from './groupBy';

const r2 = (v: number) => Math.round(v * 100) / 100;

function cell(scores: ScoreData | null, field: ScaleField): number | string {
	if (!scores) return '';
	const v = scores[field] as number;
	if (v === undefined || Number.isNaN(v)) return '';
	return r2(v);
}

const AXIS_SHEET: Record<string, string> = {
	部署: '部署別',
	性別: '男女別',
	年代: '年代別',
	役職: '役職別',
	職種: '職種別',
	事業所: '事業所別',
	所属: '所属別',
	職場診断用1: '職場診断用別'
};

/**
 * 組織レポートの数値をExcel(.xlsx)で出力（グラフなし・数値のみ）。
 * シート: ①組織全体×全国 ②各グループ軸別（部署/男女/所属…データのある軸） ③全国平均参照 ④メタ情報
 */
export function exportOrgExcel(
	users: UserData[],
	overallAverage: ScoreData | null,
	dateStr: string
): void {
	const wb = XLSX.utils.book_new();
	const totalUsers = users.length;
	const scaleFields = ALL_SCALES.map((s) => s.field);
	const nv = (f: ScaleField) => {
		const n = nationalOf(f);
		return n ? r2(n.average) : '';
	};

	// ⓪ いきいきプロフィール全体図の数値（散布図座標＋4領域レーダー）
	const vit: (string | number)[][] = [
		['いきいきプロフィール全体図', '組織', '全国平均'],
		['いきいき度分布図 X：職場の一体感', cell(overallAverage, 'workplaceUnity'), nv('workplaceUnity')],
		['いきいき度分布図 Y：ワーク・エンゲイジメント', cell(overallAverage, 'workEngagement'), nv('workEngagement')],
		['4領域レーダー：作業レベル資源(合計)', cell(overallAverage, 'totalTaskLevelResources'), nv('totalTaskLevelResources')],
		['4領域レーダー：部署レベル資源(合計)', cell(overallAverage, 'totalDepartmentLevelResources'), nv('totalDepartmentLevelResources')],
		['4領域レーダー：事業場レベル資源(合計)', cell(overallAverage, 'totalOrganizationLevelResources'), nv('totalOrganizationLevelResources')],
		['4領域レーダー：仕事の負担(合計)', cell(overallAverage, 'totalWorkload'), nv('totalWorkload')]
	];
	XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(vit), 'いきいきプロフィール');

	// ① 組織全体 × 全国平均（尺度プロフィール）
	const ovn = orgVsNational(overallAverage, scaleFields);
	const s1: (string | number)[][] = [['尺度', '領域', '組織値', '全国平均', '全国比(差)']];
	ovn.forEach((row) => {
		s1.push([
			row.label,
			row.group,
			row.org === null ? '' : r2(row.org),
			row.national === null ? '' : r2(row.national),
			row.diff === null ? '' : r2(row.diff)
		]);
	});
	XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s1), '組織全体×全国');

	// ② グループ軸別（データのある軸ごと）
	const header = ['グループ', '人数', ...ALL_SCALES.map((s) => s.label)];
	for (const axis of availableAxes(users)) {
		const groups = groupAverages(users, axis);
		if (groups.size === 0) continue;
		const aoa: (string | number)[][] = [header];
		for (const g of groups.values()) {
			aoa.push([g.name, g.userCount, ...ALL_SCALES.map((s) => cell(g.averageScores, s.field))]);
		}
		if (overallAverage) {
			aoa.push(['組織全体', totalUsers, ...ALL_SCALES.map((s) => cell(overallAverage, s.field))]);
		}
		aoa.push([
			'全国平均(参考)',
			'',
			...ALL_SCALES.map((s) => {
				const n = nationalOf(s.field);
				return n ? r2(n.average) : '';
			})
		]);
		XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), AXIS_SHEET[axis] ?? `${axis}別`);
	}

	// ③ 全国平均参照
	const ref: (string | number)[][] = [['尺度名', '項目数', '全国平均', '標準偏差']];
	nationalAverages.forEach((n) => ref.push([n.scaleName, n.itemCount, n.average, n.standardDeviation]));
	XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ref), '全国平均参照');

	// ④ メタ情報
	const meta: (string | number)[][] = [
		['新職業性ストレス簡易調査票 80項目版 組織レポート'],
		['出力日時', dateStr],
		['総回答者数', totalUsers],
		['対象', '組織全体'],
		[''],
		['注記'],
		['・得点は1〜4点（項目数で除した平均）。すべて高得点ほど良好な状態を示すよう変換済み。'],
		['・全国平均は参考値（新職業性ストレス簡易調査票 基準点データ N≒1620）。全国標準値ではない。'],
		['・合計4指標(仕事の負担/作業/部署/事業場資源)は構成尺度の平均。'],
		['・グループ軸別シートはデータが存在する属性のみ出力。']
	];
	XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(meta), 'メタ情報');

	XLSX.writeFile(wb, `組織レポート_${dateStr}.xlsx`);
}
