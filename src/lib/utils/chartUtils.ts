import type { ScoreData } from '$lib/types';
import { nationalAveragesMap } from '$lib/data/nationalAverages';

/**
 * 仕事の負担のレーダーチャートデータを作成
 */
export function createWorkloadRadarData(
	currentScores: ScoreData,
	organizationAvg?: ScoreData,
	nationalAvg: boolean = true
) {
	const labels = [
		'量的負担',
		'質的負担',
		'身体的負担',
		'対人関係',
		'職場環境',
		'情緒的負担',
		'役割葛藤',
		'WLB(ネガ)'
	];

	const datasets = [
		{
			label: '当該職場',
			data: [
				currentScores.quantitativeLoad,
				currentScores.qualitativeLoad,
				currentScores.physicalLoad,
				currentScores.interpersonalRelations,
				currentScores.workplaceEnvironment,
				currentScores.emotionalLoad,
				currentScores.roleConflict,
				currentScores.workSelfBalanceNegative
			],
			backgroundColor: 'rgba(59, 130, 246, 0.2)',
			borderColor: 'rgb(59, 130, 246)',
			borderWidth: 2
		}
	];

	if (organizationAvg) {
		datasets.push({
			label: '事業場平均',
			data: [
				organizationAvg.quantitativeLoad,
				organizationAvg.qualitativeLoad,
				organizationAvg.physicalLoad,
				organizationAvg.interpersonalRelations,
				organizationAvg.workplaceEnvironment,
				organizationAvg.emotionalLoad,
				organizationAvg.roleConflict,
				organizationAvg.workSelfBalanceNegative
			],
			backgroundColor: 'rgba(156, 163, 175, 0.2)',
			borderColor: 'rgb(156, 163, 175)',
			borderWidth: 2
		});
	}

	if (nationalAvg) {
		const scaleNames = [
			'仕事の量的負担',
			'仕事の質的負担',
			'身体的負担度',
			'職場での対人関係',
			'職場環境',
			'情緒的負担',
			'役割葛藤',
			'ワーク・セルフ・バランス（ネガティブ）'
		];

		datasets.push({
			label: '全国平均',
			data: scaleNames.map((name) => nationalAveragesMap.get(name)?.average || 0),
			backgroundColor: 'rgba(251, 146, 60, 0.2)',
			borderColor: 'rgb(251, 146, 60)',
			borderWidth: 2
		});
	}

	return { labels, datasets };
}

/**
 * 作業レベル資源のレーダーチャートデータを作成
 */
export function createTaskLevelRadarData(
	currentScores: ScoreData,
	organizationAvg?: ScoreData,
	nationalAvg: boolean = true
) {
	const labels = [
		'コントロール',
		'適性',
		'技能活用',
		'意義',
		'役割明確さ',
		'成長機会'
	];

	const datasets = [
		{
			label: '当該職場',
			data: [
				currentScores.jobControl,
				currentScores.jobFitness,
				currentScores.skillUtilization,
				currentScores.jobSignificance,
				currentScores.roleClarification,
				currentScores.growthOpportunity
			],
			backgroundColor: 'rgba(59, 130, 246, 0.2)',
			borderColor: 'rgb(59, 130, 246)',
			borderWidth: 2
		}
	];

	if (organizationAvg) {
		datasets.push({
			label: '事業場平均',
			data: [
				organizationAvg.jobControl,
				organizationAvg.jobFitness,
				organizationAvg.skillUtilization,
				organizationAvg.jobSignificance,
				organizationAvg.roleClarification,
				organizationAvg.growthOpportunity
			],
			backgroundColor: 'rgba(156, 163, 175, 0.2)',
			borderColor: 'rgb(156, 163, 175)',
			borderWidth: 2
		});
	}

	if (nationalAvg) {
		const scaleNames = [
			'仕事のコントロール',
			'仕事の適性',
			'技能の活用',
			'仕事の意義',
			'役割明確さ',
			'成長の機会'
		];

		datasets.push({
			label: '全国平均',
			data: scaleNames.map((name) => nationalAveragesMap.get(name)?.average || 0),
			backgroundColor: 'rgba(251, 146, 60, 0.2)',
			borderColor: 'rgb(251, 146, 60)',
			borderWidth: 2
		});
	}

	return { labels, datasets };
}

/**
 * 部署レベル資源のレーダーチャートデータを作成
 */
export function createDepartmentLevelRadarData(
	currentScores: ScoreData,
	organizationAvg?: ScoreData,
	nationalAvg: boolean = true
) {
	const labels = [
		'上司サポート',
		'同僚サポート',
		'経済報酬',
		'尊重報酬',
		'安定報酬',
		'リーダーシップ',
		'公正な態度',
		'ほめる職場',
		'失敗認める'
	];

	const datasets = [
		{
			label: '当該職場',
			data: [
				currentScores.supervisorSupport,
				currentScores.colleagueSupport,
				currentScores.economicReward,
				currentScores.respectReward,
				currentScores.stabilityReward,
				currentScores.supervisorLeadership,
				currentScores.supervisorFairness,
				currentScores.praisableWorkplace,
				currentScores.failureAcceptance
			],
			backgroundColor: 'rgba(59, 130, 246, 0.2)',
			borderColor: 'rgb(59, 130, 246)',
			borderWidth: 2
		}
	];

	if (organizationAvg) {
		datasets.push({
			label: '事業場平均',
			data: [
				organizationAvg.supervisorSupport,
				organizationAvg.colleagueSupport,
				organizationAvg.economicReward,
				organizationAvg.respectReward,
				organizationAvg.stabilityReward,
				organizationAvg.supervisorLeadership,
				organizationAvg.supervisorFairness,
				organizationAvg.praisableWorkplace,
				organizationAvg.failureAcceptance
			],
			backgroundColor: 'rgba(156, 163, 175, 0.2)',
			borderColor: 'rgb(156, 163, 175)',
			borderWidth: 2
		});
	}

	if (nationalAvg) {
		const scaleNames = [
			'上司のサポート',
			'同僚のサポート',
			'経済・地位報酬',
			'尊重報酬',
			'安定報酬',
			'上司のリーダーシップ',
			'上司の公正な態度',
			'ほめてもらえる職場',
			'失敗を認める職場'
		];

		datasets.push({
			label: '全国平均',
			data: scaleNames.map((name) => nationalAveragesMap.get(name)?.average || 0),
			backgroundColor: 'rgba(251, 146, 60, 0.2)',
			borderColor: 'rgb(251, 146, 60)',
			borderWidth: 2
		});
	}

	return { labels, datasets };
}

/**
 * 事業場レベル資源のレーダーチャートデータを作成
 */
export function createOrganizationLevelRadarData(
	currentScores: ScoreData,
	organizationAvg?: ScoreData,
	nationalAvg: boolean = true
) {
	const labels = [
		'経営信頼',
		'変化対応',
		'個人尊重',
		'公正評価',
		'多様性',
		'キャリア',
		'WLB(ポジ)'
	];

	const datasets = [
		{
			label: '当該職場',
			data: [
				currentScores.managementTrust,
				currentScores.changeAdaptation,
				currentScores.individualRespect,
				currentScores.fairEvaluation,
				currentScores.diversitySupport,
				currentScores.careerDevelopment,
				currentScores.workSelfBalancePositive
			],
			backgroundColor: 'rgba(59, 130, 246, 0.2)',
			borderColor: 'rgb(59, 130, 246)',
			borderWidth: 2
		}
	];

	if (organizationAvg) {
		datasets.push({
			label: '事業場平均',
			data: [
				organizationAvg.managementTrust,
				organizationAvg.changeAdaptation,
				organizationAvg.individualRespect,
				organizationAvg.fairEvaluation,
				organizationAvg.diversitySupport,
				organizationAvg.careerDevelopment,
				organizationAvg.workSelfBalancePositive
			],
			backgroundColor: 'rgba(156, 163, 175, 0.2)',
			borderColor: 'rgb(156, 163, 175)',
			borderWidth: 2
		});
	}

	if (nationalAvg) {
		const scaleNames = [
			'経営層との信頼関係',
			'変化への対応',
			'個人の尊重',
			'公正な人事評価',
			'多様な労働者への対応',
			'キャリア形成',
			'ワーク・セルフ・バランス（ポジティブ）'
		];

		datasets.push({
			label: '全国平均',
			data: scaleNames.map((name) => nationalAveragesMap.get(name)?.average || 0),
			backgroundColor: 'rgba(251, 146, 60, 0.2)',
			borderColor: 'rgb(251, 146, 60)',
			borderWidth: 2
		});
	}

	return { labels, datasets };
}

/**
 * いきいきプロフィール散布図データを作成
 */
export function createIkiikiScatterData(
	currentScores: ScoreData,
	organizationAvg?: ScoreData,
	nationalAvg: boolean = true
) {
	// 個人と職場のいきいき = ワークエンゲイジメント + 活気 + 職場の一体感
	const personalIkiiki = (currentScores.workEngagement + currentScores.vigor + currentScores.workplaceUnity) / 3;
	const workplaceIkiiki = currentScores.workplaceUnity;

	const datasets = [
		{
			label: '当該職場',
			data: [{ x: workplaceIkiiki, y: personalIkiiki }],
			backgroundColor: 'rgba(59, 130, 246, 0.8)',
			borderColor: 'rgb(59, 130, 246)',
			pointRadius: 10
		}
	];

	if (organizationAvg) {
		const orgPersonalIkiiki = (organizationAvg.workEngagement + organizationAvg.vigor + organizationAvg.workplaceUnity) / 3;
		const orgWorkplaceIkiiki = organizationAvg.workplaceUnity;
		datasets.push({
			label: '事業場平均',
			data: [{ x: orgWorkplaceIkiiki, y: orgPersonalIkiiki }],
			backgroundColor: 'rgba(156, 163, 175, 0.8)',
			borderColor: 'rgb(156, 163, 175)',
			pointRadius: 10
		});
	}

	if (nationalAvg) {
		const workEngagementAvg = nationalAveragesMap.get('ワーク・エンゲイジメント')?.average || 0;
		const vigorAvg = nationalAveragesMap.get('活気')?.average || 0;
		const unityAvg = nationalAveragesMap.get('職場の一体感')?.average || 0;
		const natPersonalIkiiki = (workEngagementAvg + vigorAvg + unityAvg) / 3;
		datasets.push({
			label: '全国平均',
			data: [{ x: unityAvg, y: natPersonalIkiiki }],
			backgroundColor: 'rgba(251, 146, 60, 0.8)',
			borderColor: 'rgb(251, 146, 60)',
			pointRadius: 10
		});
	}

	return { datasets };
}
