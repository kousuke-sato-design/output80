// ユーザーデータ型
export interface UserData {
	id: string;
	name: string;
	department: string;
	gender?: string;
	email?: string;
	responses: number[]; // 80項目の回答（1-4点）
	scores?: ScoreData; // 計算後の尺度得点
}

// 尺度得点データ型
export interface ScoreData {
	// 仕事の負担
	quantitativeLoad: number; // 量的負担
	qualitativeLoad: number; // 質的負担
	physicalLoad: number; // 身体的負担
	interpersonalRelations: number; // 対人関係
	workplaceEnvironment: number; // 職場環境
	emotionalLoad: number; // 情緒的負担
	roleConflict: number; // 役割葛藤
	workSelfBalanceNegative: number; // ワーク・セルフ・バランス（ネガティブ）

	// 仕事の資源（作業レベル）
	jobControl: number; // 仕事のコントロール
	jobFitness: number; // 仕事の適性
	skillUtilization: number; // 技能の活用
	jobSignificance: number; // 仕事の意義
	roleClarification: number; // 役割明確さ
	growthOpportunity: number; // 成長の機会
	novelty: number; // 新奇性
	predictability: number; // 予測可能性

	// 仕事の資源（部署レベル）
	supervisorSupport: number; // 上司のサポート
	colleagueSupport: number; // 同僚のサポート
	familySupport: number; // 家族・友人のサポート
	economicReward: number; // 経済・地位報酬
	respectReward: number; // 尊重報酬
	stabilityReward: number; // 安定報酬
	supervisorLeadership: number; // 上司のリーダーシップ
	supervisorFairness: number; // 上司の公正な態度
	praisableWorkplace: number; // ほめてもらえる職場
	failureAcceptance: number; // 失敗を認める職場
	groupEfficacy: number; // グループの有能感

	// 仕事の資源（事業場レベル）
	managementTrust: number; // 経営層との信頼関係
	changeAdaptation: number; // 変化への対応
	individualRespect: number; // 個人の尊重
	fairEvaluation: number; // 公正な人事評価
	diversitySupport: number; // 多様な労働者への対応
	careerDevelopment: number; // キャリア形成
	workSelfBalancePositive: number; // ワーク・セルフ・バランス（ポジティブ）

	// いきいきアウトカム
	vigor: number; // 活気
	workplaceUnity: number; // 職場の一体感
	workEngagement: number; // ワーク・エンゲイジメント

	// 心身の健康
	irritation: number; // イライラ感
	fatigue: number; // 疲労感
	anxiety: number; // 不安感
	depression: number; // 抑うつ感
	physicalComplaints: number; // 身体愁訴
	psychologicalStress: number; // 心理的ストレス反応合計

	// その他
	harassment: number; // 職場のハラスメント
	jobSatisfaction: number; // 仕事満足度
	familySatisfaction: number; // 家庭満足度
	taskPerformance: number; // 業務の遂行
	creativity: number; // 創造性の発揮
	activeLearn: number; // 積極的な学習

	// 合計点
	totalWorkload: number; // 仕事の負担合計
	totalTaskLevelResources: number; // 作業レベル資源合計
	totalDepartmentLevelResources: number; // 部署レベル資源合計
	totalOrganizationLevelResources: number; // 事業場レベル資源合計
}

// 全国平均データ型
export interface NationalAverage {
	scaleName: string; // 尺度名
	itemCount: number; // 項目数
	average: number; // 全国平均
	standardDeviation: number; // 標準偏差
}

// CSVアップロード結果型
export interface UploadResult {
	success: boolean;
	data?: UserData[];
	error?: string;
}

// 部署データ型
export interface DepartmentData {
	name: string;
	userCount: number;
	averageScores: ScoreData;
}

// チャートデータ型
export interface ChartData {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
		backgroundColor?: string;
		borderColor?: string;
		borderWidth?: number;
	}[];
}
