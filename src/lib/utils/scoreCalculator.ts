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
	// 配列のインデックスは0始まりだが、項目番号は1始まりなので注意
	const q = (n: number) => responses[n - 1] || 0;
	// 逆転項目の処理（4点満点の場合、5から引く）
	const reverse = (n: number) => 5 - q(n);
	const avg = (...items: number[]) => items.reduce((acc, val) => acc + val, 0) / items.length;

	// ============ No1〜57：現行57項目版（変更しない） ============
	// A. 仕事の負担（設問は「1=そうだ〜4=ちがう」。逆転せず高得点=負担が軽い=良好）
	const quantitativeLoad = avg(q(1), q(2), q(3)); // 仕事の量的負担
	const qualitativeLoad = avg(q(4), q(5), q(6)); // 仕事の質的負担
	const physicalLoad = q(7); // 身体的負担度
	const interpersonalRelations = avg(q(12), q(13), q(14)); // 職場での対人関係
	const workplaceEnvironment = q(15); // 職場環境

	// B. 仕事の資源（作業レベル）：reverse で高得点=良好
	const jobControl = avg(reverse(8), reverse(9), reverse(10)); // 仕事のコントロール
	const jobFitness = reverse(16); // 仕事の適性
	const skillUtilization = reverse(11); // 技能の活用
	const jobSignificance = reverse(17); // 仕事の意義（働きがい：A17）

	// E. いきいきアウトカム／F. 心身の健康（No18〜46）。すべて「高得点=良好」に揃える。
	// 活気(No18-20)は肯定項目のため逆転しない（高=活気が高い=良好）。
	const vigor = avg(q(18), q(19), q(20)); // 活気
	// 否定的反応(イライラ〜身体愁訴)は逆転して高=症状が少ない=良好。
	const irritation = avg(reverse(21), reverse(22), reverse(23)); // イライラ感
	const fatigue = avg(reverse(24), reverse(25), reverse(26)); // 疲労感
	const anxiety = avg(reverse(27), reverse(28), reverse(29)); // 不安感
	const depression = avg(reverse(30), reverse(31), reverse(32), reverse(33), reverse(34), reverse(35)); // 抑うつ感
	const physicalComplaints = avg(
		reverse(36), reverse(37), reverse(38), reverse(39), reverse(40), reverse(41),
		reverse(42), reverse(43), reverse(44), reverse(45), reverse(46)
	); // 身体愁訴
	// 心理的ストレス反応合計（No18〜35）。基準点に合わせ「高=良好」に変換：
	// 活気(18-20)はそのまま、否定的反応(21-35)は逆転して合算し項目数で除す。
	const psychologicalStress =
		(q(18) + q(19) + q(20) +
			reverse(21) + reverse(22) + reverse(23) + reverse(24) + reverse(25) + reverse(26) +
			reverse(27) + reverse(28) + reverse(29) + reverse(30) + reverse(31) + reverse(32) +
			reverse(33) + reverse(34) + reverse(35)) / 18;

	// C. 周囲のサポート（No47〜55）：reverse で高得点=良好
	const supervisorSupport = avg(reverse(47), reverse(50), reverse(53)); // 上司のサポート
	const colleagueSupport = avg(reverse(48), reverse(51), reverse(54)); // 同僚のサポート
	const familySupport = avg(reverse(49), reverse(52), reverse(55)); // 家族・友人のサポート

	// D. 満足度（No56〜57）
	const jobSatisfaction = reverse(56); // 仕事満足度
	const familySatisfaction = reverse(57); // 家庭満足度

	// ============ No58〜80：新職業性ストレス簡易調査票 短縮版（各1項目） ============
	// 負担系（情緒的負担・役割葛藤・WSBネガ）は逆転なしで高=良好。資源系は reverse。
	const emotionalLoad = q(58); // 情緒的負担
	const roleConflict = q(59); // 役割葛藤
	// 順序は本番CSV（ユーザー一覧）のオリジナル質問の並び＝公式80項目版の並びに一致させる。
	const roleClarification = reverse(60); // 役割明確さ（職務が分かっている）
	const growthOpportunity = reverse(61); // 成長の機会（長所をのばす機会）
	const economicReward = reverse(62); // 経済・地位報酬（見合う給料）
	const respectReward = reverse(63); // 尊重報酬（ふさわしい評価）
	const stabilityReward = q(64); // 安定報酬（職を失う恐れ＝逆転なし）
	const supervisorLeadership = reverse(65); // 上司のリーダーシップ
	const supervisorFairness = reverse(66); // 上司の公正な態度（誠実な態度）
	const praisableWorkplace = reverse(67); // ほめてもらえる職場
	const failureAcceptance = reverse(68); // 失敗を認める職場（挽回チャンス）
	const managementTrust = reverse(69); // 経営層との信頼関係
	const changeAdaptation = reverse(70); // 変化への対応（意見が聞かれている）
	const individualRespect = reverse(71); // 個人の尊重（価値観を大事に）
	const fairEvaluation = reverse(72); // 公正な人事評価（十分な説明）
	const diversitySupport = reverse(73); // 多様な労働者への対応
	const careerDevelopment = reverse(74); // キャリア形成（教育）
	const workSelfBalanceNegative = q(75); // ワーク・セルフ・バランス（ネガ：生活を充実させられない＝逆転なし）
	const workSelfBalancePositive = reverse(76); // ワーク・セルフ・バランス（ポジ：生活がさらに充実）
	const harassment = q(77); // 職場のハラスメント（いじめ＝逆転なしで高=少ない=良好）
	const workplaceUnity = reverse(78); // 職場の一体感（理解し認め合う）
	const workEngagement = avg(reverse(79), reverse(80)); // ワーク・エンゲイジメント（活気がみなぎる/誇り）

	// ============ 80項目版には無い尺度（標準版のみ）→ 算出不可 ============
	const novelty = NaN; // 新奇性
	const predictability = NaN; // 予測可能性
	const groupEfficacy = NaN; // グループの有能感
	const taskPerformance = NaN; // 業務の遂行
	const creativity = NaN; // 創造性の発揮
	const activeLearn = NaN; // 積極的な学習

	// ============ 合計点（対策領域別） ============
	const totalWorkload =
		(quantitativeLoad + qualitativeLoad + physicalLoad + interpersonalRelations +
			workplaceEnvironment + emotionalLoad + roleConflict + workSelfBalanceNegative) / 8;

	const totalTaskLevelResources =
		(jobControl + jobFitness + skillUtilization + jobSignificance +
			roleClarification + growthOpportunity) / 6;

	const totalDepartmentLevelResources =
		(supervisorSupport + colleagueSupport + economicReward + respectReward +
			stabilityReward + supervisorLeadership + supervisorFairness +
			praisableWorkplace + failureAcceptance) / 9;

	const totalOrganizationLevelResources =
		(managementTrust + changeAdaptation + individualRespect + fairEvaluation +
			diversitySupport + careerDevelopment + workSelfBalancePositive) / 7;

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
 * 80項目版で算出不可の尺度（新奇性など）は NaN のまま平均され NaN になる。
 */
export function calculateAverageScores(scores: ScoreData[]): ScoreData {
	const keys = Object.keys(scores[0]) as (keyof ScoreData)[];
	const result = {} as ScoreData;
	for (const key of keys) {
		const sum = scores.reduce((acc, s) => acc + (s[key] as number), 0);
		result[key] = sum / scores.length;
	}
	return result;
}
