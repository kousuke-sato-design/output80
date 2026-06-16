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

const AXIS_LABEL: Record<string, string> = {
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
 * すべての内容を **1枚のシート** にセクション分けして縦に並べる。
 * セクション: メタ情報 → いきいきプロフィール → 組織全体×全国 → 各グループ軸別（部署/男女/…）→ 全国平均参照 → 注記。
 */
export function exportOrgExcel(
	users: UserData[],
	overallAverage: ScoreData | null,
	dateStr: string
): void {
	const totalUsers = users.length;
	const scaleFields = ALL_SCALES.map((s) => s.field);
	const nv = (f: ScaleField) => {
		const n = nationalOf(f);
		return n ? r2(n.average) : '';
	};

	// 1枚のシートに積む全行
	const rows: (string | number)[][] = [];
	const blank = () => rows.push([]);
	const section = (title: string) => rows.push([title]);

	// ===== ヘッダー（メタ情報） =====
	rows.push(['新職業性ストレス簡易調査票 80項目版　組織レポート']);
	rows.push(['出力日時', dateStr]);
	rows.push(['総回答者数', totalUsers, '名']);
	rows.push(['対象', '組織全体']);
	blank();

	// ===== ① いきいきプロフィール全体図 =====
	section('■ いきいきプロフィール全体図');
	rows.push(['指標', '組織', '全国平均']);
	rows.push(['いきいき度分布図 X：職場の一体感', cell(overallAverage, 'workplaceUnity'), nv('workplaceUnity')]);
	rows.push(['いきいき度分布図 Y：ワーク・エンゲイジメント', cell(overallAverage, 'workEngagement'), nv('workEngagement')]);
	rows.push(['4領域レーダー：作業レベル資源(合計)', cell(overallAverage, 'totalTaskLevelResources'), nv('totalTaskLevelResources')]);
	rows.push(['4領域レーダー：部署レベル資源(合計)', cell(overallAverage, 'totalDepartmentLevelResources'), nv('totalDepartmentLevelResources')]);
	rows.push(['4領域レーダー：事業場レベル資源(合計)', cell(overallAverage, 'totalOrganizationLevelResources'), nv('totalOrganizationLevelResources')]);
	rows.push(['4領域レーダー：仕事の負担(合計)', cell(overallAverage, 'totalWorkload'), nv('totalWorkload')]);
	blank();

	// ===== ② 組織全体 × 全国平均（全42尺度プロフィール） =====
	section('■ 組織全体 × 全国平均（尺度プロフィール）');
	rows.push(['尺度', '領域', '組織値', '全国平均', '全国比(差)']);
	orgVsNational(overallAverage, scaleFields).forEach((row) => {
		rows.push([
			row.label,
			row.group,
			row.org === null ? '' : r2(row.org),
			row.national === null ? '' : r2(row.national),
			row.diff === null ? '' : r2(row.diff)
		]);
	});
	blank();

	// ===== ③ グループ軸別（データのある軸ごと、同じシートに連続して） =====
	const groupHeader = ['グループ', '人数', ...ALL_SCALES.map((s) => s.label)];
	for (const axis of availableAxes(users)) {
		const groups = groupAverages(users, axis);
		if (groups.size === 0) continue;
		section(`■ ${AXIS_LABEL[axis] ?? `${axis}別`}`);
		rows.push(groupHeader);
		for (const g of groups.values()) {
			rows.push([g.name, g.userCount, ...ALL_SCALES.map((s) => cell(g.averageScores, s.field))]);
		}
		if (overallAverage) {
			rows.push(['組織全体', totalUsers, ...ALL_SCALES.map((s) => cell(overallAverage, s.field))]);
		}
		rows.push([
			'全国平均(参考)',
			'',
			...ALL_SCALES.map((s) => {
				const n = nationalOf(s.field);
				return n ? r2(n.average) : '';
			})
		]);
		blank();
	}

	// ===== ④ 全国平均参照 =====
	section('■ 全国平均参照（基準データ）');
	rows.push(['尺度名', '項目数', '全国平均', '標準偏差']);
	nationalAverages.forEach((n) => rows.push([n.scaleName, n.itemCount, n.average, n.standardDeviation]));
	blank();

	// ===== ⑤ 注記 =====
	section('■ 注記');
	rows.push(['・得点は1〜4点（項目数で除した平均）。すべて高得点ほど良好な状態を示すよう変換済み。']);
	rows.push(['・未回答（空白）の項目は尺度平均から除外して算出（0扱いにせず、回答済み項目のみで平均）。']);
	rows.push(['・全国平均は参考値（新職業性ストレス簡易調査票 基準点データ N≒1620）。全国標準値ではない。']);
	rows.push(['・合計4指標(仕事の負担/作業/部署/事業場資源)は構成尺度の平均。']);
	rows.push(['・グループ軸別はデータが存在する属性のみ出力。']);

	// シート生成（1枚）
	const ws = XLSX.utils.aoa_to_sheet(rows);
	// 列幅：A列はラベルで広め、以降は数値・尺度ラベル用に一定幅
	ws['!cols'] = [{ wch: 40 }, { wch: 10 }, ...Array(ALL_SCALES.length + 2).fill({ wch: 13 })];

	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, '組織レポート');
	XLSX.writeFile(wb, `組織レポート_${dateStr}.xlsx`);
}
