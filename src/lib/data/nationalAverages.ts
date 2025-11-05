import type { NationalAverage } from '$lib/types';

// 資料6: 現行および新職業性ストレス簡易調査票の尺度の全国平均データ（標準版）
export const nationalAverages: NationalAverage[] = [
	// 仕事の負担
	{ scaleName: '仕事の量的負担', itemCount: 3, average: 2.14, standardDeviation: 0.76 },
	{ scaleName: '仕事の質的負担', itemCount: 3, average: 2.16, standardDeviation: 0.71 },
	{ scaleName: '身体的負担度', itemCount: 1, average: 2.49, standardDeviation: 1.08 },
	{ scaleName: '職場での対人関係', itemCount: 3, average: 2.88, standardDeviation: 0.66 },
	{ scaleName: '職場環境', itemCount: 1, average: 2.78, standardDeviation: 0.99 },
	{ scaleName: '情緒的負担', itemCount: 3, average: 2.65, standardDeviation: 0.82 },
	{ scaleName: '役割葛藤', itemCount: 3, average: 2.78, standardDeviation: 0.77 },
	{ scaleName: 'ワーク・セルフ・バランス（ネガティブ）', itemCount: 2, average: 2.78, standardDeviation: 0.88 },

	// 仕事の資源（作業レベル）
	{ scaleName: '仕事のコントロール', itemCount: 3, average: 2.53, standardDeviation: 0.74 },
	{ scaleName: '仕事の適性', itemCount: 1, average: 2.92, standardDeviation: 0.80 },
	{ scaleName: '技能の活用', itemCount: 1, average: 3.00, standardDeviation: 0.85 },
	{ scaleName: '仕事の意義', itemCount: 3, average: 3.09, standardDeviation: 0.67 },
	{ scaleName: '役割明確さ', itemCount: 3, average: 3.16, standardDeviation: 0.59 },
	{ scaleName: '成長の機会', itemCount: 3, average: 2.68, standardDeviation: 0.81 },
	{ scaleName: '新奇性', itemCount: 3, average: 2.78, standardDeviation: 0.80 },
	{ scaleName: '予測可能性', itemCount: 3, average: 2.46, standardDeviation: 0.73 },

	// 仕事の資源（部署レベル）
	{ scaleName: '上司のサポート', itemCount: 3, average: 2.87, standardDeviation: 0.75 },
	{ scaleName: '同僚のサポート', itemCount: 3, average: 2.68, standardDeviation: 0.70 },
	{ scaleName: '家族・友人のサポート', itemCount: 3, average: 3.31, standardDeviation: 0.68 },
	{ scaleName: '経済・地位報酬', itemCount: 2, average: 2.41, standardDeviation: 0.79 },
	{ scaleName: '尊重報酬', itemCount: 2, average: 2.72, standardDeviation: 0.87 },
	{ scaleName: '安定報酬', itemCount: 3, average: 2.46, standardDeviation: 0.75 },
	{ scaleName: '上司のリーダーシップ', itemCount: 3, average: 2.18, standardDeviation: 0.77 },
	{ scaleName: '上司の公正な態度', itemCount: 3, average: 2.55, standardDeviation: 0.80 },
	{ scaleName: 'ほめてもらえる職場', itemCount: 3, average: 2.42, standardDeviation: 0.82 },
	{ scaleName: '失敗を認める職場', itemCount: 2, average: 2.26, standardDeviation: 0.78 },
	{ scaleName: 'グループの有能感', itemCount: 3, average: 2.49, standardDeviation: 0.74 },

	// 仕事の資源（事業場レベル）
	{ scaleName: '経営層との信頼関係', itemCount: 3, average: 2.53, standardDeviation: 0.71 },
	{ scaleName: '変化への対応', itemCount: 3, average: 2.48, standardDeviation: 0.72 },
	{ scaleName: '個人の尊重', itemCount: 3, average: 2.12, standardDeviation: 0.72 },
	{ scaleName: '公正な人事評価', itemCount: 3, average: 2.15, standardDeviation: 0.77 },
	{ scaleName: '多様な労働者への対応', itemCount: 3, average: 2.52, standardDeviation: 0.70 },
	{ scaleName: 'キャリア形成', itemCount: 5, average: 2.19, standardDeviation: 0.74 },
	{ scaleName: 'ワーク・セルフ・バランス（ポジティブ）', itemCount: 2, average: 2.10, standardDeviation: 0.78 },
	{ scaleName: '手続きの公正性', itemCount: 3, average: 2.27, standardDeviation: 0.73 },

	// いきいきアウトカム
	{ scaleName: 'ワーク・エンゲイジメント', itemCount: 2, average: 2.52, standardDeviation: 0.77 },
	{ scaleName: '職場の一体感', itemCount: 3, average: 2.74, standardDeviation: 0.69 },

	// 心身の健康
	{ scaleName: '活気', itemCount: 3, average: 2.26, standardDeviation: 0.79 },
	{ scaleName: 'イライラ感', itemCount: 3, average: 2.70, standardDeviation: 0.85 },
	{ scaleName: '疲労感', itemCount: 3, average: 2.70, standardDeviation: 0.88 },
	{ scaleName: '不安感', itemCount: 3, average: 2.87, standardDeviation: 0.80 },
	{ scaleName: '抑うつ感', itemCount: 6, average: 3.27, standardDeviation: 0.67 },
	{ scaleName: '心理的ストレス反応合計', itemCount: 18, average: 2.85, standardDeviation: 0.61 },
	{ scaleName: '身体愁訴', itemCount: 11, average: 3.22, standardDeviation: 0.54 },

	// 職場のハラスメント
	{ scaleName: '職場のハラスメント', itemCount: 2, average: 3.58, standardDeviation: 0.67 },

	// 満足度
	{ scaleName: '仕事満足度', itemCount: 1, average: 2.60, standardDeviation: 0.85 },
	{ scaleName: '家庭満足度', itemCount: 1, average: 3.06, standardDeviation: 0.81 },

	// 仕事のパフォーマンス
	{ scaleName: '業務の遂行', itemCount: 3, average: 2.98, standardDeviation: 0.57 },
	{ scaleName: '創造性の発揮', itemCount: 3, average: 2.67, standardDeviation: 0.72 },
	{ scaleName: '積極的な学習', itemCount: 3, average: 2.55, standardDeviation: 0.72 }
];

// 尺度名をキーとした検索用のマップ
export const nationalAveragesMap = new Map<string, NationalAverage>(
	nationalAverages.map(avg => [avg.scaleName, avg])
);

// 尺度得点を全国平均と比較する関数
export function compareWithNationalAverage(
	scaleName: string,
	score: number
): {
	average: number;
	difference: number;
	percentile: number;
} | null {
	const nationalData = nationalAveragesMap.get(scaleName);
	if (!nationalData) return null;

	const difference = score - nationalData.average;
	// 簡易的なパーセンタイル計算（正規分布を仮定）
	const zScore = difference / nationalData.standardDeviation;
	const percentile = normalCDF(zScore) * 100;

	return {
		average: nationalData.average,
		difference,
		percentile
	};
}

// 標準正規分布の累積分布関数（簡易版）
function normalCDF(x: number): number {
	const t = 1 / (1 + 0.2316419 * Math.abs(x));
	const d = 0.3989423 * Math.exp(-x * x / 2);
	const prob =
		d *
		t *
		(0.3193815 +
			t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
	return x > 0 ? 1 - prob : prob;
}
