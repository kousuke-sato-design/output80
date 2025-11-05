<script lang="ts">
	import type { ScoreData } from '$lib/types';
	import ScatterPlot from './ScatterPlot.svelte';
	import RadarChart from './RadarChart.svelte';
	import SmallBarChart from './SmallBarChart.svelte';
	import { nationalAveragesMap } from '$lib/data/nationalAverages';
	import { createIkiikiScatterData } from '$lib/utils/chartUtils';

	export let userScore: ScoreData;
	export let organizationAvg: ScoreData | undefined = undefined;
	export let userName: string = '';
	export let userDepartment: string = '';

	// いきいきプロフィール全体図データ（散布図）
	$: ikiikiData = createIkiikiScatterData(userScore, organizationAvg);

	// レーダーチャート用データ
	$: radarData = (() => {
		const labels = [
			'作業レベル\n資源合計',
			'部署レベル\n資源合計',
			'事業場レベル\n資源合計',
			'仕事の負担\n合計'
		];

		const currentData = [
			userScore.totalTaskLevelResources,
			userScore.totalDepartmentLevelResources,
			userScore.totalOrganizationLevelResources,
			userScore.totalWorkload
		];

		const datasets = [
			{
				label: '当該職場',
				data: currentData,
				borderColor: 'rgb(75, 85, 99)',
				backgroundColor: 'rgba(75, 85, 99, 0.2)',
				pointBackgroundColor: 'rgb(75, 85, 99)'
			}
		];

		if (organizationAvg) {
			datasets.push({
				label: '事業場平均',
				data: [
					organizationAvg.totalTaskLevelResources,
					organizationAvg.totalDepartmentLevelResources,
					organizationAvg.totalOrganizationLevelResources,
					organizationAvg.totalWorkload
				],
				borderColor: 'rgb(59, 130, 246)',
				backgroundColor: 'rgba(59, 130, 246, 0.2)',
				pointBackgroundColor: 'rgb(59, 130, 246)'
			});
		}

		// 全国平均を追加
		const nationalTaskLevel = nationalAveragesMap.get('仕事の資源（作業レベル）合計')?.average || 2.90;
		const nationalDeptLevel = 2.52; // 部署レベル合計の全国平均
		const nationalOrgLevel = 2.30; // 事業場レベル合計の全国平均
		const nationalWorkload = nationalAveragesMap.get('仕事の負担合計')?.average || 2.58;

		datasets.push({
			label: '全国平均',
			data: [nationalTaskLevel, nationalDeptLevel, nationalOrgLevel, nationalWorkload],
			borderColor: 'rgb(251, 146, 60)',
			backgroundColor: 'rgba(251, 146, 60, 0.2)',
			pointBackgroundColor: 'rgb(251, 146, 60)'
		});

		return { labels, datasets };
	})();
</script>

<div class="space-y-8">
	<!-- ヘッダー -->
	{#if userName}
		<div class="bg-white rounded-lg shadow-sm p-6">
			<h2 class="text-xl font-bold text-gray-900">新職業性ストレス簡易調査票　部署別フィードバック</h2>
			<p class="text-gray-600 mt-2">
				部署名　{userDepartment}
			</p>
			<p class="text-sm text-gray-500 mt-1">
				このフィードバックは短縮版用に作成されたものです。
			</p>
		</div>
	{/if}

	<!-- 1. いきいきプロフィール全体図 -->
	<div class="bg-white rounded-lg shadow-sm p-6">
		<h3 class="text-lg font-bold text-gray-900 mb-4">1.いきいきプロフィール全体図</h3>

		<!-- 散布図 -->
		<div class="mb-6">
			<h4 class="text-sm font-semibold text-gray-700 mb-2">いきいき度分布図</h4>
			<ScatterPlot
				datasets={ikiikiData.datasets}
				title=""
				xLabel="低い ← 職場のいきいき（職場の一体感） → 高い"
				yLabel="低い ← 個人と職場のいきいき → 高い"
			/>
			<p class="text-xs text-gray-600 mt-2">
				●当該職場　■事業場平均　◆全国平均
			</p>
		</div>

		<!-- レーダーチャート -->
		<div>
			<RadarChart
				labels={radarData.labels}
				datasets={radarData.datasets}
				title=""
			/>
			<p class="text-xs text-gray-600 mt-2">
				◆事業場平均:対象となった事業場全体の平均<br />
				◆得点は最高4点、最低1点になるよう変換されており、高い方が良好な状態を示す
			</p>
		</div>
	</div>

	<!-- 2. 仕事の負担プロフィール -->
	<div class="bg-white rounded-lg shadow-sm p-6">
		<h3 class="text-lg font-bold text-gray-900 mb-4">2.仕事の負担プロフィール</h3>

		<SmallBarChart
			label="仕事の量的負担"
			description="仕事の量が多いことや時間内に仕事が処理しきれないことによる業務負担"
			currentValue={userScore.quantitativeLoad}
			orgValue={organizationAvg?.quantitativeLoad}
			nationalValue={nationalAveragesMap.get('仕事の量的負担')?.average || 2.14}
		/>

		<SmallBarChart
			label="仕事の質的負担"
			description="仕事で必要な注意集中の程度や知識、技術の高さなど質的な業務負担"
			currentValue={userScore.qualitativeLoad}
			orgValue={organizationAvg?.qualitativeLoad}
			nationalValue={nationalAveragesMap.get('仕事の質的負担')?.average || 2.16}
		/>

		<SmallBarChart
			label="身体的負担度"
			description="仕事でからだを動かす必要があるなど身体的な負担"
			currentValue={userScore.physicalLoad}
			orgValue={organizationAvg?.physicalLoad}
			nationalValue={nationalAveragesMap.get('身体的負担度')?.average || 2.49}
		/>

		<SmallBarChart
			label="職場での対人関係"
			description="部署内での意見の相違、あるいは部署間志向の対立など対人関係に関する負担"
			currentValue={userScore.interpersonalRelations}
			orgValue={organizationAvg?.interpersonalRelations}
			nationalValue={nationalAveragesMap.get('職場での対人関係')?.average || 2.88}
		/>

		<SmallBarChart
			label="職場環境"
			description="騒音、照明、温度、換気などの物理的な職場環境の問題による負担"
			currentValue={userScore.workplaceEnvironment}
			orgValue={organizationAvg?.workplaceEnvironment}
			nationalValue={nationalAveragesMap.get('職場環境')?.average || 2.78}
		/>

		<SmallBarChart
			label="情緒的負担"
			description="仕事の上で気持ちや感情がかき乱されるなど、感情面での負担"
			currentValue={userScore.emotionalLoad}
			orgValue={organizationAvg?.emotionalLoad}
			nationalValue={nationalAveragesMap.get('情緒的負担')?.average || 2.65}
		/>

		<SmallBarChart
			label="役割葛藤"
			description="方針や要求が互いに相容れないために業務が困難になること"
			currentValue={userScore.roleConflict}
			orgValue={organizationAvg?.roleConflict}
			nationalValue={nationalAveragesMap.get('役割葛藤')?.average || 2.78}
		/>

		<SmallBarChart
			label="ワーク・セルフ・バランス（ネガティブ）"
			description="仕事が、個人生活に対して好ましくない影響を及ぼしていること"
			currentValue={userScore.workSelfBalanceNegative}
			orgValue={organizationAvg?.workSelfBalanceNegative}
			nationalValue={nationalAveragesMap.get('ワーク・セルフ・バランス（ネガティブ）')?.average || 2.78}
		/>

		<p class="text-xs text-gray-600 mt-4">
			◆事業場平均:対象となった事業場全体の平均<br />
			◆得点は最高4点、最低1点になるよう変換されており、高い方が良好な状態を示す
		</p>
	</div>

	<!-- 3. 仕事の資源（作業レベル）プロフィール -->
	<div class="bg-white rounded-lg shadow-sm p-6">
		<h3 class="text-lg font-bold text-gray-900 mb-4">3.仕事の資源（作業レベル）プロフィール</h3>

		<SmallBarChart
			label="仕事のコントロール"
			description="仕事の内容や予定や手順などを自分で決められる程度"
			currentValue={userScore.jobControl}
			orgValue={organizationAvg?.jobControl}
			nationalValue={nationalAveragesMap.get('仕事のコントロール')?.average || 2.53}
		/>

		<SmallBarChart
			label="仕事の適性"
			description="仕事の内容が自分に合っている、合っていること"
			currentValue={userScore.jobFitness}
			orgValue={organizationAvg?.jobFitness}
			nationalValue={nationalAveragesMap.get('仕事の適性')?.average || 2.92}
		/>

		<SmallBarChart
			label="技能の活用"
			description="持っている技術、知識、資格などが仕事上活用されていること"
			currentValue={userScore.skillUtilization}
			orgValue={organizationAvg?.skillUtilization}
			nationalValue={nationalAveragesMap.get('技能の活用')?.average || 3.00}
		/>

		<SmallBarChart
			label="仕事の意義"
			description="仕事の意義が認識でき、働きがいを感じていること"
			currentValue={userScore.jobSignificance}
			orgValue={organizationAvg?.jobSignificance}
			nationalValue={nationalAveragesMap.get('仕事の意義')?.average || 3.09}
		/>

		<SmallBarChart
			label="役割明確さ"
			description="仕事の上で集たすべき役割が明確に理解されていること"
			currentValue={userScore.roleClarification}
			orgValue={organizationAvg?.roleClarification}
			nationalValue={nationalAveragesMap.get('役割明確さ')?.average || 3.16}
		/>

		<SmallBarChart
			label="成長の機会"
			description="知識や技術を得たり、あるいはその他の自己成長の機会があること"
			currentValue={userScore.growthOpportunity}
			orgValue={organizationAvg?.growthOpportunity}
			nationalValue={nationalAveragesMap.get('成長の機会')?.average || 2.68}
		/>

		<p class="text-xs text-gray-600 mt-4">
			◆事業場平均:対象となった事業場全体の平均<br />
			◆得点は最高4点、最低1点になるよう変換されており、高い方が良好な状態を示す
		</p>
	</div>

	<!-- 4. 仕事の資源（部署レベル）プロフィール -->
	<div class="bg-white rounded-lg shadow-sm p-6">
		<h3 class="text-lg font-bold text-gray-900 mb-4">4.仕事の資源（部署レベル）プロフィール</h3>

		<SmallBarChart
			label="上司のサポート"
			description="話しかけやすく、頼りになり、相談にのってくれるなど上司からの支援"
			currentValue={userScore.supervisorSupport}
			orgValue={organizationAvg?.supervisorSupport}
			nationalValue={nationalAveragesMap.get('上司のサポート')?.average || 2.87}
		/>

		<SmallBarChart
			label="同僚のサポート"
			description="話しかけやすく、頼りになり、相談にのってくれるなど同僚間の支援"
			currentValue={userScore.colleagueSupport}
			orgValue={organizationAvg?.colleagueSupport}
			nationalValue={nationalAveragesMap.get('同僚のサポート')?.average || 2.68}
		/>

		<SmallBarChart
			label="家族・友人のサポート"
			description="配偶者、家族、友人等からの支援"
			currentValue={userScore.familySupport}
			orgValue={organizationAvg?.familySupport}
			nationalValue={nationalAveragesMap.get('家族・友人のサポート')?.average || 3.31}
		/>

		<SmallBarChart
			label="経済・地位報酬"
			description="仕事上の努力に対し金を報酬的報酬や処遇を受けていること"
			currentValue={userScore.economicReward}
			orgValue={organizationAvg?.economicReward}
			nationalValue={nationalAveragesMap.get('経済・地位報酬')?.average || 2.41}
		/>

		<SmallBarChart
			label="尊重報酬"
			description="上司や同僚から、仕事の努力にふさわしい尊敬や賞賛を受けていること"
			currentValue={userScore.respectReward}
			orgValue={organizationAvg?.respectReward}
			nationalValue={nationalAveragesMap.get('尊重報酬')?.average || 2.72}
		/>

		<SmallBarChart
			label="安定報酬"
			description="仕事が不安定、将来の見通しがない、職を失う可能性があること"
			currentValue={userScore.stabilityReward}
			orgValue={organizationAvg?.stabilityReward}
			nationalValue={nationalAveragesMap.get('安定報酬')?.average || 2.46}
		/>

		<SmallBarChart
			label="上司のリーダーシップ"
			description="上司が、仕事の出来栄えフィードバックし、部下が問題解決できるよう指導していること"
			currentValue={userScore.supervisorLeadership}
			orgValue={organizationAvg?.supervisorLeadership}
			nationalValue={nationalAveragesMap.get('上司のリーダーシップ')?.average || 2.18}
		/>

		<SmallBarChart
			label="上司の公正な態度"
			description="上司が、偏見を持たず、都下に思いやりと誠実さを対応してくれること"
			currentValue={userScore.supervisorFairness}
			orgValue={organizationAvg?.supervisorFairness}
			nationalValue={nationalAveragesMap.get('上司の公正な態度')?.average || 2.55}
		/>

		<SmallBarChart
			label="ほめてもらえる職場"
			description="ねぎらいや感謝の言葉、職場でポジティブな評価を受けられること"
			currentValue={userScore.praisableWorkplace}
			orgValue={organizationAvg?.praisableWorkplace}
			nationalValue={nationalAveragesMap.get('ほめてもらえる職場')?.average || 2.42}
		/>

		<SmallBarChart
			label="失敗を認める職場"
			description="失敗しても取り戻す機会があったり、失敗を認めて成功に導くことができること"
			currentValue={userScore.failureAcceptance}
			orgValue={organizationAvg?.failureAcceptance}
			nationalValue={nationalAveragesMap.get('失敗を認める職場')?.average || 2.26}
		/>

		<p class="text-xs text-gray-600 mt-4">
			◆事業場平均:対象となった事業場全体の平均<br />
			◆得点は最高4点、最低1点になるよう変換されており、高い方が良好な状態を示す
		</p>
	</div>

	<!-- 5. 仕事の資源（事業場レベル）プロフィール -->
	<div class="bg-white rounded-lg shadow-sm p-6">
		<h3 class="text-lg font-bold text-gray-900 mb-4">5.仕事の資源（事業場レベル）プロフィール</h3>

		<SmallBarChart
			label="経営層との信頼関係"
			description="経営層と従業員の間に相互の信頼関係があること"
			currentValue={userScore.managementTrust}
			orgValue={organizationAvg?.managementTrust}
			nationalValue={nationalAveragesMap.get('経営層との信頼関係')?.average || 2.53}
		/>

		<SmallBarChart
			label="変化への対応"
			description="職場やに事でどんな変化があるか、上司にたずる機会があること"
			currentValue={userScore.changeAdaptation}
			orgValue={organizationAvg?.changeAdaptation}
			nationalValue={nationalAveragesMap.get('変化への対応')?.average || 2.48}
		/>

		<SmallBarChart
			label="個人の尊重"
			description="一人ひとりの長所や得意分野を考えて仕事が与えられていること"
			currentValue={userScore.individualRespect}
			orgValue={organizationAvg?.individualRespect}
			nationalValue={nationalAveragesMap.get('個人の尊重')?.average || 2.12}
		/>

		<SmallBarChart
			label="公正な人事評価"
			description="人事評価の結果について十分な説明がなされていること"
			currentValue={userScore.fairEvaluation}
			orgValue={organizationAvg?.fairEvaluation}
			nationalValue={nationalAveragesMap.get('公正な人事評価')?.average || 2.15}
		/>

		<SmallBarChart
			label="多様な労働者への対応"
			description="女性、高齢者あるいは障がい者が働きやすい職場だ"
			currentValue={userScore.diversitySupport}
			orgValue={organizationAvg?.diversitySupport}
			nationalValue={nationalAveragesMap.get('多様な労働者への対応')?.average || 2.52}
		/>

		<SmallBarChart
			label="キャリア形成"
			description="従業員のキャリア形成について方針や目標が明確にされ、教育訓練が提供されていること"
			currentValue={userScore.careerDevelopment}
			orgValue={organizationAvg?.careerDevelopment}
			nationalValue={nationalAveragesMap.get('キャリア形成')?.average || 2.19}
		/>

		<SmallBarChart
			label="ワーク・セルフ・バランス（ポジティブ）"
			description="仕事により、個人生活を豊かにすることができること"
			currentValue={userScore.workSelfBalancePositive}
			orgValue={organizationAvg?.workSelfBalancePositive}
			nationalValue={nationalAveragesMap.get('ワーク・セルフ・バランス（ポジティブ）')?.average || 2.10}
		/>

		<p class="text-xs text-gray-600 mt-4">
			◆事業場平均:対象となった事業場全体の平均<br />
			◆得点は最高4点、最低1点になるよう変換されており、高い方が良好な状態を示す
		</p>
	</div>

	<!-- 6. 健康および満足度プロフィール -->
	<div class="bg-white rounded-lg shadow-sm p-6">
		<h3 class="text-lg font-bold text-gray-900 mb-4">6.健康および満足度プロフィール</h3>

		<SmallBarChart
			label="活気"
			description="活気、いきいきなどのポジティブな感情"
			currentValue={userScore.vigor}
			orgValue={organizationAvg?.vigor}
			nationalValue={nationalAveragesMap.get('活気')?.average || 2.26}
		/>

		<SmallBarChart
			label="イライラ感"
			description="怒り、立腹、イライラなどの症状"
			currentValue={userScore.irritation}
			orgValue={organizationAvg?.irritation}
			nationalValue={nationalAveragesMap.get('イライラ感')?.average || 2.70}
		/>

		<SmallBarChart
			label="疲労感"
			description="疲れ、へとへと、だるさなどの疲労に関連した症状"
			currentValue={userScore.fatigue}
			orgValue={organizationAvg?.fatigue}
			nationalValue={nationalAveragesMap.get('疲労感')?.average || 2.70}
		/>

		<SmallBarChart
			label="不安感"
			description="気がはりつめている、不安、落ち着かないなどの不安に関する症状"
			currentValue={userScore.anxiety}
			orgValue={organizationAvg?.anxiety}
			nationalValue={nationalAveragesMap.get('不安感')?.average || 2.87}
		/>

		<SmallBarChart
			label="抑うつ感"
			description="ゆううつ感、集中力の低下など、抑うつ気分に関する症状"
			currentValue={userScore.depression}
			orgValue={organizationAvg?.depression}
			nationalValue={nationalAveragesMap.get('抑うつ感')?.average || 2.70}
		/>

		<SmallBarChart
			label="心理的ストレス反応合計"
			description="活気（のなさ）、イライラ感、疲労感、不安感、抑うつ感の症状の合計"
			currentValue={userScore.psychologicalStress}
			orgValue={organizationAvg?.psychologicalStress}
			nationalValue={nationalAveragesMap.get('心理的ストレス反応合計')?.average || 2.85}
		/>

		<SmallBarChart
			label="身体愁訴"
			description="身体的な症状の合計"
			currentValue={userScore.physicalComplaints}
			orgValue={organizationAvg?.physicalComplaints}
			nationalValue={nationalAveragesMap.get('身体愁訴')?.average || 3.27}
		/>

		<SmallBarChart
			label="職場のハラスメント"
			description="職場でいじめ、嫌がらせを受けていること、セクシャルハラスメント、パワーハラスメントを含む"
			currentValue={userScore.harassment}
			orgValue={organizationAvg?.harassment}
			nationalValue={nationalAveragesMap.get('職場のハラスメント')?.average || 3.58}
		/>

		<SmallBarChart
			label="仕事満足度"
			description="仕事に関する全般的な満足度"
			currentValue={userScore.jobSatisfaction}
			orgValue={organizationAvg?.jobSatisfaction}
			nationalValue={nationalAveragesMap.get('仕事満足度')?.average || 2.60}
		/>

		<SmallBarChart
			label="家庭満足度"
			description="家庭生活に関する全般的な満足度"
			currentValue={userScore.familySatisfaction}
			orgValue={organizationAvg?.familySatisfaction}
			nationalValue={nationalAveragesMap.get('家庭満足度')?.average || 3.06}
		/>

		<p class="text-xs text-gray-600 mt-4">
			◆事業場平均:対象となった事業場全体の平均<br />
			◆得点は最高4点、最低1点になるよう変換されており、高い方が良好な状態を示す
		</p>
	</div>
</div>
