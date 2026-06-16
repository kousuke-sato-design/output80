import type { ScoreData } from '$lib/types';

/**
 * 80項目の回答から尺度得点を計算する（新職業性ストレス簡易調査票 80項目版）
 *
 * 【重要・採点仕様の根拠】
 * 80項目版 = 現行の職業性ストレス簡易調査票57項目（No1〜57）
 *          + 新職業性ストレス簡易調査票「推奨尺度セット短縮版」23項目（No58〜80）。
 * - No1〜57 は旧57項目版そのもの（A:仕事17 / B:心身29 / C:サポート9 / D:満足2）。
 * - No58〜80 は短縮版（各尺度ほぼ1項目）。順序は Inoue & Kawakami (2014, Industrial Health 52:535)
 *   Table 1 の推奨尺度セット順 ＝ 同梱 80sample.xls「基準点」シートの尺度順 と一致（全国平均値で照合・確定）。
 * - 採点は公式同様「高得点ほど良好な状態」に揃える（負担・ハラスメントは設問の向きにより逆転なしで高=軽度=良好、
 *   資源・いきいきは reverse() で高=良好）。
 *
 * 【未回答（空白）の扱い・重要】
 * - 未回答項目（1〜4以外＝空白/範囲外）は、その尺度の平均から**除外**する（0として混ぜない）。
 *   0扱いにすると非逆転尺度は下振れ・逆転尺度は 5-0=5 で上振れし、集団平均が歪むため。
 * - 尺度を構成する項目が**全て未回答**なら、その尺度は NaN（算出不可）。
 *   集団平均（calculateAverageScores）側で NaN を除外して平均するため、未回答者は当該尺度の平均母数に入らない。
 *
 * 【80項目版には存在しない尺度（標準版/120項目版のみ）】
 *   新奇性 / 予測可能性 / グループの有能感 / 業務の遂行 / 創造性の発揮 / 積極的な学習 → NaN（算出不可）。
 *
 * @param responses 1-4点の80項目の回答配列（インデックス0が項目No1）
 * @returns 計算された尺度得点
 */
export function calculateScores(
	responses: number[],
	_useStandardVersion: boolean = true // 互換のため残置（80項目版では未使用）
): ScoreData {
	// 配列のインデックスは0始まりだが、項目番号は1始まり。
	// 有効回答（1〜4）のみ返し、空白/範囲外は null（＝平均から除外）。
	const raw = (n: number): number | null => {
		const v = responses[n - 1];
		return typeof v === 'number' && v >= 1 && v <= 4 ? v : null;
	};
	/**
	 * 尺度得点＝指定項目のうち回答済み(1-4)のみの平均。reversed=true で 5-値（高=良好に変換）。
	 * 全項目未回答なら NaN。
	 */
	const scale = (reversed: boolean, ...nums: number[]): number => {
		const vals: number[] = [];
		for (const n of nums) {
			const v = raw(n);
			if (v !== null) vals.push(reversed ? 5 - v : v);
		}
		return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : NaN;
	};
	/** 合計点＝構成尺度のうち算出できた(非NaN)もののみの平均。全てNaNなら NaN。 */
	const avgScales = (...vals: number[]): number => {
		const v = vals.filter((x) => !Number.isNaN(x));
		return v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN;
	};

	// ============ No1〜57：現行57項目版 ============
	// A. 仕事の負担（設問は「1=そうだ〜4=ちがう」。逆転せず高得点=負担が軽い=良好）
	const quantitativeLoad = scale(false, 1, 2, 3); // 仕事の量的負担
	const qualitativeLoad = scale(false, 4, 5, 6); // 仕事の質的負担
	const physicalLoad = scale(false, 7); // 身体的負担度
	const interpersonalRelations = scale(false, 12, 13, 14); // 職場での対人関係
	const workplaceEnvironment = scale(false, 15); // 職場環境

	// B. 仕事の資源（作業レベル）：reverse で高得点=良好
	const jobControl = scale(true, 8, 9, 10); // 仕事のコントロール
	const jobFitness = scale(true, 16); // 仕事の適性
	const skillUtilization = scale(true, 11); // 技能の活用
	const jobSignificance = scale(true, 17); // 仕事の意義（働きがい：A17）

	// E. いきいきアウトカム／F. 心身の健康（No18〜46）。すべて「高得点=良好」に揃える。
	// 活気(No18-20)は肯定項目のため逆転しない（高=活気が高い=良好）。
	const vigor = scale(false, 18, 19, 20); // 活気
	// 否定的反応(イライラ〜身体愁訴)は逆転して高=症状が少ない=良好。
	const irritation = scale(true, 21, 22, 23); // イライラ感
	const fatigue = scale(true, 24, 25, 26); // 疲労感
	const anxiety = scale(true, 27, 28, 29); // 不安感
	const depression = scale(true, 30, 31, 32, 33, 34, 35); // 抑うつ感
	const physicalComplaints = scale(true, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46); // 身体愁訴
	// 心理的ストレス反応合計（No18〜35）。活気(18-20)はそのまま、否定的反応(21-35)は逆転して合算。
	// 未回答は除外して回答済み項目数で平均する。
	const psychologicalStress = (() => {
		const vals: number[] = [];
		for (let n = 18; n <= 20; n++) {
			const v = raw(n);
			if (v !== null) vals.push(v);
		}
		for (let n = 21; n <= 35; n++) {
			const v = raw(n);
			if (v !== null) vals.push(5 - v);
		}
		return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : NaN;
	})();

	// C. 周囲のサポート（No47〜55）：reverse で高得点=良好
	const supervisorSupport = scale(true, 47, 50, 53); // 上司のサポート
	const colleagueSupport = scale(true, 48, 51, 54); // 同僚のサポート
	const familySupport = scale(true, 49, 52, 55); // 家族・友人のサポート

	// D. 満足度（No56〜57）
	const jobSatisfaction = scale(true, 56); // 仕事満足度
	const familySatisfaction = scale(true, 57); // 家庭満足度

	// ============ No58〜80：新職業性ストレス簡易調査票 短縮版（各1項目） ============
	// 負担系（情緒的負担・役割葛藤・WSBネガ）は逆転なしで高=良好。資源系は reverse。
	const emotionalLoad = scale(false, 58); // 情緒的負担
	const roleConflict = scale(false, 59); // 役割葛藤
	// 順序は本番CSV（ユーザー一覧）のオリジナル質問の並び＝公式80項目版の並びに一致。
	const roleClarification = scale(true, 60); // 役割明確さ（職務が分かっている）
	const growthOpportunity = scale(true, 61); // 成長の機会（長所をのばす機会）
	const economicReward = scale(true, 62); // 経済・地位報酬（見合う給料）
	const respectReward = scale(true, 63); // 尊重報酬（ふさわしい評価）
	const stabilityReward = scale(false, 64); // 安定報酬（職を失う恐れ＝逆転なし）
	const supervisorLeadership = scale(true, 65); // 上司のリーダーシップ
	const supervisorFairness = scale(true, 66); // 上司の公正な態度（誠実な態度）
	const praisableWorkplace = scale(true, 67); // ほめてもらえる職場
	const failureAcceptance = scale(true, 68); // 失敗を認める職場（挽回チャンス）
	const managementTrust = scale(true, 69); // 経営層との信頼関係
	const changeAdaptation = scale(true, 70); // 変化への対応（意見が聞かれている）
	const individualRespect = scale(true, 71); // 個人の尊重（価値観を大事に）
	const fairEvaluation = scale(true, 72); // 公正な人事評価（十分な説明）
	const diversitySupport = scale(true, 73); // 多様な労働者への対応
	const careerDevelopment = scale(true, 74); // キャリア形成（教育）
	const workSelfBalanceNegative = scale(false, 75); // ワーク・セルフ・バランス（ネガ：生活を充実させられない＝逆転なし）
	const workSelfBalancePositive = scale(true, 76); // ワーク・セルフ・バランス（ポジ：生活がさらに充実）
	const harassment = scale(false, 77); // 職場のハラスメント（いじめ＝逆転なしで高=少ない=良好）
	const workplaceUnity = scale(true, 78); // 職場の一体感（理解し認め合う）
	const workEngagement = scale(true, 79, 80); // ワーク・エンゲイジメント（活気がみなぎる/誇り）

	// ============ 80項目版には無い尺度（標準版のみ）→ 算出不可 ============
	const novelty = NaN; // 新奇性
	const predictability = NaN; // 予測可能性
	const groupEfficacy = NaN; // グループの有能感
	const taskPerformance = NaN; // 業務の遂行
	const creativity = NaN; // 創造性の発揮
	const activeLearn = NaN; // 積極的な学習

	// ============ 合計点（対策領域別） ============
	// 構成尺度のうち算出できたものだけで平均（未回答による NaN は除外）。
	const totalWorkload = avgScales(
		quantitativeLoad, qualitativeLoad, physicalLoad, interpersonalRelations,
		workplaceEnvironment, emotionalLoad, roleConflict, workSelfBalanceNegative
	);

	const totalTaskLevelResources = avgScales(
		jobControl, jobFitness, skillUtilization, jobSignificance,
		roleClarification, growthOpportunity
	);

	const totalDepartmentLevelResources = avgScales(
		supervisorSupport, colleagueSupport, economicReward, respectReward,
		stabilityReward, supervisorLeadership, supervisorFairness,
		praisableWorkplace, failureAcceptance
	);

	const totalOrganizationLevelResources = avgScales(
		managementTrust, changeAdaptation, individualRespect, fairEvaluation,
		diversitySupport, careerDevelopment, workSelfBalancePositive
	);

	return {
		quantitativeLoad,
		qualitativeLoad,
		physicalLoad,
		interpersonalRelations,
		workplaceEnvironment,
		emotionalLoad,
		roleConflict,
		workSelfBalanceNegative,
		jobControl,
		jobFitness,
		skillUtilization,
		jobSignificance,
		roleClarification,
		growthOpportunity,
		novelty,
		predictability,
		supervisorSupport,
		colleagueSupport,
		familySupport,
		economicReward,
		respectReward,
		stabilityReward,
		supervisorLeadership,
		supervisorFairness,
		praisableWorkplace,
		failureAcceptance,
		groupEfficacy,
		managementTrust,
		changeAdaptation,
		individualRespect,
		fairEvaluation,
		diversitySupport,
		careerDevelopment,
		workSelfBalancePositive,
		vigor,
		workplaceUnity,
		workEngagement,
		irritation,
		fatigue,
		anxiety,
		depression,
		physicalComplaints,
		psychologicalStress,
		harassment,
		jobSatisfaction,
		familySatisfaction,
		taskPerformance,
		creativity,
		activeLearn,
		totalWorkload,
		totalTaskLevelResources,
		totalDepartmentLevelResources,
		totalOrganizationLevelResources
	};
}

/**
 * 複数人の尺度得点を平均して1つのScoreDataにまとめる（部署平均・全社平均で使用）。
 * 各尺度ごとに、値が算出できている人(NaNでない)だけで平均する。
 * → 未回答でその尺度が NaN の人は当該尺度の母数から除外され、平均が歪まない。
 * 80項目版で常に算出不可の尺度（新奇性など）は全員 NaN のため結果も NaN。
 */
export function calculateAverageScores(scores: ScoreData[]): ScoreData {
	const keys = Object.keys(scores[0]) as (keyof ScoreData)[];
	const result = {} as ScoreData;
	for (const key of keys) {
		let sum = 0;
		let count = 0;
		for (const s of scores) {
			const v = s[key] as number;
			if (typeof v === 'number' && !Number.isNaN(v)) {
				sum += v;
				count++;
			}
		}
		result[key] = count > 0 ? sum / count : NaN;
	}
	return result;
}
