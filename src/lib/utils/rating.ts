/**
 * 全国比 zスコア（(組織値−全国平均)/SD、全尺度 高=良好）に基づく判定。
 * - rateByZ: 尺度単位の5段階判定（◎○−△⚠）
 * - gradeByZ: 4領域合計の平均zによる総合判定（A〜D）
 * しきい値は orgMatrix.cellColorFor の色分け（±0.3SD）より細かい5段階。
 */

export interface FiveLevel {
	grade: 5 | 4 | 3 | 2 | 1;
	symbol: string;
	label: string;
	text: string; // 文字色クラス
	badge: string; // バッジ背景クラス
}

export function rateByZ(z: number | null): FiveLevel | null {
	if (z === null || Number.isNaN(z)) return null;
	if (z >= 0.5) return { grade: 5, symbol: '◎', label: '良好', text: 'text-green-700', badge: 'bg-green-100 text-green-800' };
	if (z >= 0.15) return { grade: 4, symbol: '○', label: 'やや良好', text: 'text-green-600', badge: 'bg-green-50 text-green-700' };
	if (z > -0.15) return { grade: 3, symbol: '−', label: '平均的', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-600' };
	if (z > -0.5) return { grade: 2, symbol: '△', label: 'やや注意', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-800' };
	return { grade: 1, symbol: '⚠', label: '要対策', text: 'text-red-700', badge: 'bg-red-100 text-red-800' };
}

export type OrgGrade = 'A' | 'B' | 'C' | 'D';
export interface GradeInfo {
	grade: OrgGrade;
	label: string;
	text: string;
	badge: string;
}

export function gradeByZ(zMean: number | null): GradeInfo | null {
	if (zMean === null || Number.isNaN(zMean)) return null;
	if (zMean >= 0.5) return { grade: 'A', label: '全国平均を大きく上回る良好な状態', text: 'text-green-700', badge: 'bg-green-600' };
	if (zMean >= 0) return { grade: 'B', label: '全国平均並み〜やや良好な状態', text: 'text-primary-700', badge: 'bg-primary-600' };
	if (zMean > -0.5) return { grade: 'C', label: '全国平均をやや下回る（注意）', text: 'text-amber-700', badge: 'bg-amber-500' };
	return { grade: 'D', label: '全国平均を大きく下回る（要対策）', text: 'text-red-700', badge: 'bg-red-600' };
}
