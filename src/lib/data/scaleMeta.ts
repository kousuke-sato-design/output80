import type { ScoreData } from '$lib/types';

/**
 * 尺度メタデータ（単一の真実源）
 * - 新職業性ストレス簡易調査票 80項目版で算出される42尺度＋4合計。
 * - 採点はすべて「高得点ほど良好」に統一済み（scoreCalculator.ts / 80sample.xls「基準点」注1）。
 *   したがって direction は全て 'higherIsBetter'。色分け・並べ替えはこの前提で行う。
 * - nationalKey は nationalAverages.ts（＝基準点）のキー。null は無し。
 * - 80項目版に存在しない尺度（新奇性/予測可能性/グループの有能感/業務の遂行/創造性/積極的な学習）は
 *   ここに含めない（scoreCalculator では NaN）。
 */
export type ScaleField = keyof ScoreData;

export interface ScaleDef {
	field: ScaleField;
	label: string;
	group: string;
	nationalKey: string | null;
}

export const SCALES: ScaleDef[] = [
	// 仕事の負担
	{ field: 'quantitativeLoad', label: '量的負担', group: '仕事の負担', nationalKey: '仕事の量的負担' },
	{ field: 'qualitativeLoad', label: '質的負担', group: '仕事の負担', nationalKey: '仕事の質的負担' },
	{ field: 'physicalLoad', label: '身体的負担', group: '仕事の負担', nationalKey: '身体的負担度' },
	{ field: 'interpersonalRelations', label: '対人関係', group: '仕事の負担', nationalKey: '職場での対人関係' },
	{ field: 'workplaceEnvironment', label: '職場環境', group: '仕事の負担', nationalKey: '職場環境' },
	{ field: 'emotionalLoad', label: '情緒的負担', group: '仕事の負担', nationalKey: '情緒的負担' },
	{ field: 'roleConflict', label: '役割葛藤', group: '仕事の負担', nationalKey: '役割葛藤' },
	{ field: 'workSelfBalanceNegative', label: 'WSB(ネガ)', group: '仕事の負担', nationalKey: 'ワーク・セルフ・バランス（ネガティブ）' },
	// 作業レベル資源
	{ field: 'jobControl', label: 'コントロール', group: '作業レベル資源', nationalKey: '仕事のコントロール' },
	{ field: 'jobFitness', label: '適性', group: '作業レベル資源', nationalKey: '仕事の適性' },
	{ field: 'skillUtilization', label: '技能の活用', group: '作業レベル資源', nationalKey: '技能の活用' },
	{ field: 'jobSignificance', label: '仕事の意義', group: '作業レベル資源', nationalKey: '仕事の意義' },
	{ field: 'roleClarification', label: '役割明確さ', group: '作業レベル資源', nationalKey: '役割明確さ' },
	{ field: 'growthOpportunity', label: '成長の機会', group: '作業レベル資源', nationalKey: '成長の機会' },
	// 部署レベル資源
	{ field: 'supervisorSupport', label: '上司の支援', group: '部署レベル資源', nationalKey: '上司のサポート' },
	{ field: 'colleagueSupport', label: '同僚の支援', group: '部署レベル資源', nationalKey: '同僚のサポート' },
	{ field: 'familySupport', label: '家族・友人の支援', group: '部署レベル資源', nationalKey: '家族・友人のサポート' },
	{ field: 'economicReward', label: '経済・地位報酬', group: '部署レベル資源', nationalKey: '経済・地位報酬' },
	{ field: 'respectReward', label: '尊重報酬', group: '部署レベル資源', nationalKey: '尊重報酬' },
	{ field: 'stabilityReward', label: '安定報酬', group: '部署レベル資源', nationalKey: '安定報酬' },
	{ field: 'supervisorLeadership', label: 'リーダーシップ', group: '部署レベル資源', nationalKey: '上司のリーダーシップ' },
	{ field: 'supervisorFairness', label: '上司の公正', group: '部署レベル資源', nationalKey: '上司の公正な態度' },
	{ field: 'praisableWorkplace', label: 'ほめる職場', group: '部署レベル資源', nationalKey: 'ほめてもらえる職場' },
	{ field: 'failureAcceptance', label: '失敗を認める', group: '部署レベル資源', nationalKey: '失敗を認める職場' },
	// 事業場レベル資源
	{ field: 'managementTrust', label: '経営層信頼', group: '事業場レベル資源', nationalKey: '経営層との信頼関係' },
	{ field: 'changeAdaptation', label: '変化対応', group: '事業場レベル資源', nationalKey: '変化への対応' },
	{ field: 'individualRespect', label: '個人の尊重', group: '事業場レベル資源', nationalKey: '個人の尊重' },
	{ field: 'fairEvaluation', label: '公正な評価', group: '事業場レベル資源', nationalKey: '公正な人事評価' },
	{ field: 'diversitySupport', label: '多様性対応', group: '事業場レベル資源', nationalKey: '多様な労働者への対応' },
	{ field: 'careerDevelopment', label: 'キャリア形成', group: '事業場レベル資源', nationalKey: 'キャリア形成' },
	{ field: 'workSelfBalancePositive', label: 'WSB(ポジ)', group: '事業場レベル資源', nationalKey: 'ワーク・セルフ・バランス（ポジティブ）' },
	// いきいきアウトカム
	{ field: 'vigor', label: '活気', group: 'いきいき', nationalKey: '活気' },
	{ field: 'workplaceUnity', label: '職場の一体感', group: 'いきいき', nationalKey: '職場の一体感' },
	{ field: 'workEngagement', label: 'ワーク・エンゲイジメント', group: 'いきいき', nationalKey: 'ワーク・エンゲイジメント' },
	// 心身の健康
	{ field: 'irritation', label: 'イライラ感', group: '心身の健康', nationalKey: 'イライラ感' },
	{ field: 'fatigue', label: '疲労感', group: '心身の健康', nationalKey: '疲労感' },
	{ field: 'anxiety', label: '不安感', group: '心身の健康', nationalKey: '不安感' },
	{ field: 'depression', label: '抑うつ感', group: '心身の健康', nationalKey: '抑うつ感' },
	{ field: 'physicalComplaints', label: '身体愁訴', group: '心身の健康', nationalKey: '身体愁訴' },
	{ field: 'psychologicalStress', label: '心理的ストレス反応', group: '心身の健康', nationalKey: '心理的ストレス反応合計' },
	// 職場のハラスメント・満足度
	{ field: 'harassment', label: 'ハラスメントの少なさ', group: 'ハラスメント・満足', nationalKey: '職場のハラスメント' },
	{ field: 'jobSatisfaction', label: '仕事満足度', group: 'ハラスメント・満足', nationalKey: '仕事満足度' },
	{ field: 'familySatisfaction', label: '家庭満足度', group: 'ハラスメント・満足', nationalKey: '家庭満足度' },
	// 合計（対策領域別）
	{ field: 'totalWorkload', label: '仕事の負担(合計)', group: '合計', nationalKey: '仕事の負担合計' },
	{ field: 'totalTaskLevelResources', label: '作業レベル資源(合計)', group: '合計', nationalKey: '作業レベル資源合計' },
	{ field: 'totalDepartmentLevelResources', label: '部署レベル資源(合計)', group: '合計', nationalKey: '部署レベル資源合計' },
	{ field: 'totalOrganizationLevelResources', label: '事業場レベル資源(合計)', group: '合計', nationalKey: '事業場レベル資源合計' }
];

/** 比較グラフのドロップダウン用（全42尺度＋4合計） */
export const ALL_SCALES = SCALES;

/** マトリクス表の列（1〜2ページに収まる主要指標） */
export const MAIN_SCALE_FIELDS: ScaleField[] = [
	'totalWorkload',
	'totalTaskLevelResources',
	'totalDepartmentLevelResources',
	'totalOrganizationLevelResources',
	'workEngagement',
	'workplaceUnity',
	'vigor',
	'psychologicalStress',
	'jobSatisfaction',
	'harassment'
];

export const SCALE_BY_FIELD: Map<ScaleField, ScaleDef> = new Map(SCALES.map((s) => [s.field, s]));
export const MAIN_SCALES: ScaleDef[] = MAIN_SCALE_FIELDS.map((f) => SCALE_BY_FIELD.get(f)!);

/** KPIに使う4合計 */
export const TOTAL_FIELDS: ScaleField[] = [
	'totalWorkload',
	'totalTaskLevelResources',
	'totalDepartmentLevelResources',
	'totalOrganizationLevelResources'
];

/** 組織サマリーの見出し指標（領域サマリー＝全国比で表示する主要指標） */
export const HEADLINE_FIELDS: ScaleField[] = [
	'totalWorkload',
	'totalTaskLevelResources',
	'totalDepartmentLevelResources',
	'totalOrganizationLevelResources',
	'workEngagement',
	'workplaceUnity',
	'vigor',
	'psychologicalStress'
];
export const HEADLINE_SCALES: ScaleDef[] = HEADLINE_FIELDS.map((f) => SCALE_BY_FIELD.get(f)!);

/** 尺度プロフィール（全42尺度）をグループ順に */
export const PROFILE_GROUP_ORDER = [
	'仕事の負担',
	'作業レベル資源',
	'部署レベル資源',
	'事業場レベル資源',
	'いきいき',
	'心身の健康',
	'ハラスメント・満足'
];
