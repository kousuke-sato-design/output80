import type { NationalAverage } from '$lib/types';

// 資料6/基準点: 新職業性ストレス簡易調査票 全国平均データ（80sample.xls「基準点」シート N≒1620 準拠）
// 値は同梱 80sample.xls の公式基準点に一致させてある。
export const nationalAverages: NationalAverage[] = [
	{ scaleName: "仕事の量的負担", itemCount: 3, average: 2.1396, standardDeviation: 0.764 },
	{ scaleName: "仕事の質的負担", itemCount: 3, average: 2.1629, standardDeviation: 0.714 },
	{ scaleName: "身体的負担度", itemCount: 1, average: 2.4923, standardDeviation: 1.0754 },
	{ scaleName: "職場での対人関係", itemCount: 3, average: 2.8822, standardDeviation: 0.6612 },
	{ scaleName: "職場環境", itemCount: 1, average: 2.7812, standardDeviation: 0.9895 },
	{ scaleName: "情緒的負担", itemCount: 3, average: 2.6554, standardDeviation: 0.9562 },
	{ scaleName: "役割葛藤", itemCount: 3, average: 2.8679, standardDeviation: 0.9265 },
	{ scaleName: "ワーク・セルフ・バランス（ネガティブ）", itemCount: 2, average: 2.8345, standardDeviation: 0.8893 },
	{ scaleName: "仕事のコントロール", itemCount: 3, average: 2.5315, standardDeviation: 0.7352 },
	{ scaleName: "仕事の適性", itemCount: 1, average: 2.9165, standardDeviation: 0.7982 },
	{ scaleName: "技能の活用", itemCount: 1, average: 3.0012, standardDeviation: 0.851 },
	{ scaleName: "仕事の意義", itemCount: 3, average: 2.8672, standardDeviation: 0.866 },
	{ scaleName: "役割明確さ", itemCount: 3, average: 3.4103, standardDeviation: 0.6271 },
	{ scaleName: "成長の機会", itemCount: 3, average: 2.6156, standardDeviation: 0.9351 },
	{ scaleName: "新奇性", itemCount: 3, average: 2.78, standardDeviation: 0.8 },
	{ scaleName: "予測可能性", itemCount: 3, average: 2.46, standardDeviation: 0.73 },
	{ scaleName: "上司のサポート", itemCount: 3, average: 2.3706, standardDeviation: 0.7528 },
	{ scaleName: "同僚のサポート", itemCount: 3, average: 2.6788, standardDeviation: 0.7016 },
	{ scaleName: "家族・友人のサポート", itemCount: 3, average: 3.314, standardDeviation: 0.6771 },
	{ scaleName: "経済・地位報酬", itemCount: 2, average: 2.2529, standardDeviation: 0.9248 },
	{ scaleName: "尊重報酬", itemCount: 2, average: 2.591, standardDeviation: 0.7988 },
	{ scaleName: "安定報酬", itemCount: 3, average: 2.8372, standardDeviation: 1.0184 },
	{ scaleName: "上司のリーダーシップ", itemCount: 3, average: 2.2514, standardDeviation: 0.9175 },
	{ scaleName: "上司の公正な態度", itemCount: 3, average: 2.6482, standardDeviation: 0.858 },
	{ scaleName: "ほめてもらえる職場", itemCount: 3, average: 2.5856, standardDeviation: 0.9094 },
	{ scaleName: "失敗を認める職場", itemCount: 2, average: 2.4519, standardDeviation: 0.8509 },
	{ scaleName: "グループの有能感", itemCount: 3, average: 2.49, standardDeviation: 0.74 },
	{ scaleName: "経営層との信頼関係", itemCount: 3, average: 2.5762, standardDeviation: 0.8058 },
	{ scaleName: "変化への対応", itemCount: 3, average: 2.3498, standardDeviation: 0.8609 },
	{ scaleName: "個人の尊重", itemCount: 3, average: 2.1425, standardDeviation: 0.8241 },
	{ scaleName: "公正な人事評価", itemCount: 3, average: 2.0427, standardDeviation: 0.8606 },
	{ scaleName: "多様な労働者への対応", itemCount: 3, average: 2.7221, standardDeviation: 0.8694 },
	{ scaleName: "キャリア形成", itemCount: 5, average: 2.2254, standardDeviation: 0.87 },
	{ scaleName: "ワーク・セルフ・バランス（ポジティブ）", itemCount: 2, average: 2.072, standardDeviation: 0.8662 },
	{ scaleName: "手続きの公正性", itemCount: 3, average: 2.27, standardDeviation: 0.73 },
	{ scaleName: "ワーク・エンゲイジメント", itemCount: 2, average: 2.516, standardDeviation: 0.769 },
	{ scaleName: "職場の一体感", itemCount: 3, average: 2.6632, standardDeviation: 0.7665 },
	{ scaleName: "活気", itemCount: 3, average: 2.2568, standardDeviation: 0.7896 },
	{ scaleName: "イライラ感", itemCount: 3, average: 2.6974, standardDeviation: 0.8478 },
	{ scaleName: "疲労感", itemCount: 3, average: 2.6987, standardDeviation: 0.8776 },
	{ scaleName: "不安感", itemCount: 3, average: 2.8679, standardDeviation: 0.8017 },
	{ scaleName: "抑うつ感", itemCount: 6, average: 3.2737, standardDeviation: 0.667 },
	{ scaleName: "心理的ストレス反応合計", itemCount: 18, average: 2.8461, standardDeviation: 0.607 },
	{ scaleName: "身体愁訴", itemCount: 11, average: 3.2195, standardDeviation: 0.5395 },
	{ scaleName: "職場のハラスメント", itemCount: 2, average: 3.7017, standardDeviation: 0.6346 },
	{ scaleName: "仕事満足度", itemCount: 1, average: 2.6, standardDeviation: 0.8523 },
	{ scaleName: "家庭満足度", itemCount: 1, average: 3.0583, standardDeviation: 0.8098 },
	{ scaleName: "業務の遂行", itemCount: 3, average: 2.98, standardDeviation: 0.57 },
	{ scaleName: "創造性の発揮", itemCount: 3, average: 2.67, standardDeviation: 0.72 },
	{ scaleName: "積極的な学習", itemCount: 3, average: 2.55, standardDeviation: 0.72 },
	{ scaleName: "仕事の負担合計", itemCount: 8, average: 2.6003, standardDeviation: 0.5211 },
	{ scaleName: "作業レベル資源合計", itemCount: 6, average: 2.8916, standardDeviation: 0.52956 },
	{ scaleName: "部署レベル資源合計", itemCount: 9, average: 2.5218, standardDeviation: 0.56731 },
	{ scaleName: "事業場レベル資源合計", itemCount: 7, average: 2.3029, standardDeviation: 0.60324 }
];

// 尺度名をキーとした検索用のマップ
export const nationalAveragesMap = new Map<string, NationalAverage>(
	nationalAverages.map((avg) => [avg.scaleName, avg])
);

// 尺度得点を全国平均と比較する関数
export function compareWithNationalAverage(
	scaleName: string,
	score: number
): { average: number; difference: number; percentile: number } | null {
	const nationalData = nationalAveragesMap.get(scaleName);
	if (!nationalData) return null;
	const difference = score - nationalData.average;
	const zScore = difference / nationalData.standardDeviation;
	const percentile = normalCDF(zScore) * 100;
	return { average: nationalData.average, difference, percentile };
}

// 標準正規分布の累積分布関数（簡易版）
function normalCDF(x: number): number {
	const t = 1 / (1 + 0.2316419 * Math.abs(x));
	const d = 0.3989423 * Math.exp((-x * x) / 2);
	const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
	return x > 0 ? 1 - prob : prob;
}
