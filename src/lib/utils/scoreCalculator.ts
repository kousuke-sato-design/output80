import type { ScoreData } from '$lib/types';

/**
 * 80項目の回答から尺度得点を計算する
 * @param responses 1-4点の80項目の回答配列（インデックス0が項目1）
 * @param useStandardVersion 標準版を使用するか（デフォルト: true）
 * @returns 計算された尺度得点
 */
export function calculateScores(
	responses: number[],
	useStandardVersion: boolean = true
): ScoreData {
	// 配列のインデックスは0始まりだが、項目番号は1始まりなので注意
	const q = (n: number) => responses[n - 1] || 0;

	// 逆転項目の処理（4点満点の場合、5から引く）
	const reverse = (n: number) => 5 - q(n);

	// 平均値を計算するヘルパー関数
	const avg = (...items: number[]) => {
		const sum = items.reduce((acc, val) => acc + val, 0);
		return sum / items.length;
	};

	// A. 仕事の負担
	const quantitativeLoad = avg(q(1), q(2), q(3)); // 仕事の量的負担
	const qualitativeLoad = avg(q(4), q(5), q(6)); // 仕事の質的負担
	const physicalLoad = q(7); // 身体的負担度
	const interpersonalRelations = avg(q(12), q(13), q(14)); // 職場での対人関係
	const workplaceEnvironment = q(15); // 職場環境
	const emotionalLoad = useStandardVersion
		? avg(q(58), q(59), q(60))
		: q(59); // 情緒的負担
	const roleConflict = useStandardVersion
		? avg(q(61), q(62), q(63))
		: q(62); // 役割葛藤
	const workSelfBalanceNegative = useStandardVersion
		? avg(q(122), q(123))
		: q(122); // ワーク・セルフ・バランス（ネガティブ）

	// B. 仕事の資源（作業レベル）
	const jobControl = avg(reverse(8), reverse(9), reverse(10)); // 仕事のコントロール
	const jobFitness = reverse(16); // 仕事の適性
	const skillUtilization = reverse(11); // 技能の活用
	const jobSignificance = useStandardVersion
		? avg(reverse(17), reverse(64), reverse(65))
		: reverse(17); // 仕事の意義
	const roleClarification = useStandardVersion
		? avg(reverse(66), reverse(67), reverse(68))
		: reverse(66); // 役割明確さ
	const growthOpportunity = useStandardVersion
		? avg(reverse(69), reverse(70), reverse(71))
		: reverse(70); // 成長の機会
	const novelty = avg(q(72), q(73), q(74)); // 新奇性
	const predictability = avg(reverse(75), reverse(76), reverse(77)); // 予測可能性

	// C. 仕事の資源（部署レベル）
	const supervisorSupport = avg(reverse(47), reverse(50), reverse(53)); // 上司のサポート
	const colleagueSupport = avg(reverse(48), reverse(51), reverse(54)); // 同僚のサポート
	const familySupport = avg(reverse(49), reverse(52), reverse(55)); // 家族・友人のサポート
	const economicReward = useStandardVersion
		? avg(reverse(78), reverse(79))
		: reverse(78); // 経済・地位報酬
	const respectReward = useStandardVersion
		? avg(reverse(80), reverse(81))
		: reverse(80); // 尊重報酬
	const stabilityReward = useStandardVersion
		? avg(q(82), q(83), q(84))
		: q(83); // 安定報酬
	const supervisorLeadership = useStandardVersion
		? avg(reverse(85), reverse(86), reverse(87))
		: reverse(86); // 上司のリーダーシップ
	const supervisorFairness = useStandardVersion
		? avg(reverse(88), reverse(89), reverse(90))
		: reverse(90); // 上司の公正な態度
	const praisableWorkplace = useStandardVersion
		? avg(reverse(91), reverse(92), reverse(93))
		: reverse(92); // ほめてもらえる職場
	const failureAcceptance = avg(reverse(94), reverse(95)); // 失敗を認める職場
	const groupEfficacy = avg(reverse(96), reverse(97), reverse(98)); // グループの有能感

	// D. 仕事の資源（事業場レベル）
	const managementTrust = useStandardVersion
		? avg(reverse(99), reverse(100), reverse(101))
		: reverse(100); // 経営層との信頼関係
	const changeAdaptation = useStandardVersion
		? avg(reverse(102), reverse(103), reverse(104))
		: reverse(103); // 変化への対応
	const individualRespect = useStandardVersion
		? avg(reverse(108), reverse(109), reverse(110))
		: reverse(109); // 個人の尊重
	const fairEvaluation = useStandardVersion
		? avg(reverse(111), reverse(112), reverse(113))
		: reverse(111); // 公正な人事評価
	const diversitySupport = useStandardVersion
		? avg(reverse(114), reverse(115), reverse(116))
		: reverse(116); // 多様な労働者への対応
	const careerDevelopment = useStandardVersion
		? avg(reverse(117), reverse(118), reverse(119), reverse(120), reverse(121))
		: reverse(117); // キャリア形成
	const workSelfBalancePositive = useStandardVersion
		? avg(reverse(124), reverse(125))
		: reverse(125); // ワーク・セルフ・バランス（ポジティブ）

	// E. いきいきアウトカム
	const vigor = avg(reverse(18), reverse(19), reverse(20)); // 活気
	const workplaceUnity = useStandardVersion
		? avg(reverse(128), reverse(129), reverse(130))
		: reverse(129); // 職場の一体感
	const workEngagement = avg(reverse(131), reverse(132)); // ワーク・エンゲイジメント

	// F. 心身の健康
	const irritation = avg(reverse(21), reverse(22), reverse(23)); // イライラ感
	const fatigue = avg(reverse(24), reverse(25), reverse(26)); // 疲労感
	const anxiety = avg(reverse(27), reverse(28), reverse(29)); // 不安感
	const depression = avg(
		reverse(30),
		reverse(31),
		reverse(32),
		reverse(33),
		reverse(34),
		reverse(35)
	); // 抑うつ感
	const physicalComplaints = avg(
		reverse(36),
		reverse(37),
		reverse(38),
		reverse(39),
		reverse(40),
		reverse(41),
		reverse(42),
		reverse(43),
		reverse(44),
		reverse(45),
		reverse(46)
	); // 身体愁訴

	// 心理的ストレス反応合計（項目18～35の合計）/ 18
	const psychologicalStress =
		(q(18) +
			q(19) +
			q(20) +
			q(21) +
			q(22) +
			q(23) +
			q(24) +
			q(25) +
			q(26) +
			q(27) +
			q(28) +
			q(29) +
			q(30) +
			q(31) +
			q(32) +
			q(33) +
			q(34) +
			q(35)) /
		18;

	// G. 職場のハラスメント
	const harassment = useStandardVersion
		? avg(q(126), q(127))
		: q(126); // 職場のハラスメント

	// H. 満足度
	const jobSatisfaction = reverse(56); // 仕事満足度
	const familySatisfaction = reverse(57); // 家庭満足度

	// I. 仕事のパフォーマンス
	const taskPerformance = avg(reverse(133), reverse(134), reverse(135)); // 業務の遂行
	const creativity = avg(reverse(136), reverse(137), reverse(138)); // 創造性の発揮
	const activeLearn = avg(reverse(139), reverse(140), reverse(141)); // 積極的な学習

	// 合計点の計算
	const totalWorkload =
		(quantitativeLoad +
			qualitativeLoad +
			physicalLoad +
			interpersonalRelations +
			workplaceEnvironment +
			emotionalLoad +
			roleConflict +
			workSelfBalanceNegative) /
		8;

	const totalTaskLevelResources =
		(jobControl +
			jobFitness +
			skillUtilization +
			jobSignificance +
			roleClarification +
			growthOpportunity) /
		6;

	const totalDepartmentLevelResources =
		(supervisorSupport +
			colleagueSupport +
			economicReward +
			respectReward +
			stabilityReward +
			supervisorLeadership +
			supervisorFairness +
			praisableWorkplace +
			failureAcceptance) /
		9;

	const totalOrganizationLevelResources =
		(managementTrust +
			changeAdaptation +
			individualRespect +
			fairEvaluation +
			diversitySupport +
			careerDevelopment +
			workSelfBalancePositive) /
		7;

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
 * 複数のユーザーの平均スコアを計算する
 */
export function calculateAverageScores(scores: ScoreData[]): ScoreData {
	if (scores.length === 0) {
		throw new Error('No scores provided for averaging');
	}

	const keys = Object.keys(scores[0]) as (keyof ScoreData)[];
	const averages: Partial<ScoreData> = {};

	for (const key of keys) {
		const sum = scores.reduce((acc, score) => acc + (score[key] as number), 0);
		averages[key] = sum / scores.length;
	}

	return averages as ScoreData;
}
