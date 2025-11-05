<script lang="ts">
	import { userData, overallAverage } from '$lib/stores/dataStore';
	import RadarChart from '$lib/components/RadarChart.svelte';
	import ScatterPlot from '$lib/components/ScatterPlot.svelte';
	import SmallBarChart from '$lib/components/SmallBarChart.svelte';
	import { nationalAveragesMap } from '$lib/data/nationalAverages';

	$: hasData = $overallAverage !== null;
	$: orgAvg = $overallAverage;

	// いきいき度分布図データ（散布図）
	$: ikiikiScatterData = (() => {
		if (!hasData || !orgAvg) return null;

		const datasets = [];

		// 全国平均
		const nationalWorkEngagement = 2.52;
		const nationalWorkplaceUnity = 2.66;
		datasets.push({
			label: '全国平均',
			data: [{ x: nationalWorkplaceUnity, y: nationalWorkEngagement }],
			backgroundColor: 'rgb(76, 175, 80)',
			pointRadius: 8,
			pointHoverRadius: 10
		});

		// 事業場平均（組織平均）
		datasets.push({
			label: '事業場平均',
			data: [{ x: orgAvg.workplaceUnity, y: orgAvg.workEngagement }],
			backgroundColor: 'rgb(244, 67, 54)',
			pointRadius: 8,
			pointHoverRadius: 10
		});

		return { datasets };
	})();

	// 4つのレーダーチャートデータ
	$: radarChartData = (() => {
		if (!hasData || !orgAvg) return null;

		// 1. 仕事の負担合計
		const workloadLabels = [
			'仕事の量的負担',
			'仕事の質的負担',
			'身体的負担度',
			'職場での対人関係',
			'職場環境',
			'情緒的負担',
			'役割葛藤',
			'ワーク・セルフ・バランス（ネガティブ）'
		];
		const workloadCurrent = [
			orgAvg.quantitativeLoad,
			orgAvg.qualitativeLoad,
			orgAvg.physicalLoad,
			orgAvg.interpersonalRelations,
			orgAvg.workplaceEnvironment,
			orgAvg.emotionalLoad,
			orgAvg.roleConflict,
			orgAvg.workSelfBalanceNegative
		];
		const workloadNational = [2.14, 2.16, 2.49, 2.88, 2.78, 2.66, 2.87, 2.83];

		// 2. 作業レベル資源合計
		const taskLabels = [
			'仕事のコントロール',
			'仕事の適性',
			'技能の活用',
			'仕事の意義',
			'役割明確さ',
			'成長の機会'
		];
		const taskCurrent = [
			orgAvg.jobControl,
			orgAvg.jobFitness,
			orgAvg.skillUtilization,
			orgAvg.jobSignificance,
			orgAvg.roleClarification,
			orgAvg.growthOpportunity
		];
		const taskNational = [2.53, 2.92, 3.0, 2.87, 3.41, 2.62];

		// 3. 部署レベル資源合計
		const deptLabels = [
			'上司のサポート',
			'同僚のサポート',
			'家族・友人のサポート',
			'経済・地位報酬',
			'尊重報酬',
			'安定報酬',
			'上司のリーダーシップ',
			'上司の公正な態度',
			'ほめてもらえる職場',
			'失敗を認める職場'
		];
		const deptCurrent = [
			orgAvg.supervisorSupport,
			orgAvg.colleagueSupport,
			orgAvg.familySupport,
			orgAvg.economicReward,
			orgAvg.respectReward,
			orgAvg.stabilityReward,
			orgAvg.supervisorLeadership,
			orgAvg.supervisorFairness,
			orgAvg.praisableWorkplace,
			orgAvg.failureAcceptance
		];
		const deptNational = [2.37, 2.68, 3.31, 2.25, 2.59, 2.84, 2.25, 2.65, 2.59, 2.45];

		// 4. 事業場レベル資源合計
		const orgLabels = [
			'経営層との信頼関係',
			'変化への対応',
			'個人の尊重',
			'公正な人事評価',
			'多様な労働者への対応',
			'キャリア形成',
			'ワーク・セルフ・バランス（ポジティブ）'
		];
		const orgCurrent = [
			orgAvg.managementTrust,
			orgAvg.changeAdaptation,
			orgAvg.individualRespect,
			orgAvg.fairEvaluation,
			orgAvg.diversitySupport,
			orgAvg.careerDevelopment,
			orgAvg.workSelfBalancePositive
		];
		const orgNational = [2.58, 2.35, 2.14, 2.04, 2.72, 2.23, 2.07];

		return {
			workload: {
				labels: workloadLabels,
				datasets: [
					{
						label: '当該職場',
						data: workloadCurrent,
						borderColor: 'rgb(33, 150, 243)',
						backgroundColor: 'rgba(33, 150, 243, 0.1)',
						pointBackgroundColor: 'rgb(33, 150, 243)',
						borderWidth: 2
					},
					{
						label: '全国平均',
						data: workloadNational,
						borderColor: 'rgb(76, 175, 80)',
						backgroundColor: 'rgba(76, 175, 80, 0.1)',
						pointBackgroundColor: 'rgb(76, 175, 80)',
						borderWidth: 2
					}
				]
			},
			task: {
				labels: taskLabels,
				datasets: [
					{
						label: '当該職場',
						data: taskCurrent,
						borderColor: 'rgb(33, 150, 243)',
						backgroundColor: 'rgba(33, 150, 243, 0.1)',
						pointBackgroundColor: 'rgb(33, 150, 243)',
						borderWidth: 2
					},
					{
						label: '全国平均',
						data: taskNational,
						borderColor: 'rgb(76, 175, 80)',
						backgroundColor: 'rgba(76, 175, 80, 0.1)',
						pointBackgroundColor: 'rgb(76, 175, 80)',
						borderWidth: 2
					}
				]
			},
			dept: {
				labels: deptLabels,
				datasets: [
					{
						label: '当該職場',
						data: deptCurrent,
						borderColor: 'rgb(33, 150, 243)',
						backgroundColor: 'rgba(33, 150, 243, 0.1)',
						pointBackgroundColor: 'rgb(33, 150, 243)',
						borderWidth: 2
					},
					{
						label: '全国平均',
						data: deptNational,
						borderColor: 'rgb(76, 175, 80)',
						backgroundColor: 'rgba(76, 175, 80, 0.1)',
						pointBackgroundColor: 'rgb(76, 175, 80)',
						borderWidth: 2
					}
				]
			},
			org: {
				labels: orgLabels,
				datasets: [
					{
						label: '当該職場',
						data: orgCurrent,
						borderColor: 'rgb(33, 150, 243)',
						backgroundColor: 'rgba(33, 150, 243, 0.1)',
						pointBackgroundColor: 'rgb(33, 150, 243)',
						borderWidth: 2
					},
					{
						label: '全国平均',
						data: orgNational,
						borderColor: 'rgb(76, 175, 80)',
						backgroundColor: 'rgba(76, 175, 80, 0.1)',
						pointBackgroundColor: 'rgb(76, 175, 80)',
						borderWidth: 2
					}
				]
			}
		};
	})();
</script>

<svelte:head>
	<title>組織全体レポート - 新職業性ストレス簡易調査票</title>
</svelte:head>

{#if !hasData}
	<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
		<div class="flex items-start">
			<svg class="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
					clip-rule="evenodd"
				/>
			</svg>
			<div>
				<h3 class="text-sm font-medium text-yellow-800">データがありません</h3>
				<p class="text-sm text-yellow-700 mt-1">CSVファイルをアップロードしてください。</p>
			</div>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-white">
		<!-- Page 1: はじめに -->
		<div class="max-w-4xl mx-auto p-8 page-break">
			<div class="text-right text-sm text-gray-600 mb-4">1/10</div>

			<div class="border border-gray-300 p-4 mb-6">
				<h1 class="text-xl font-bold text-center mb-4">
					新職業性ストレス簡易調査票フィードバックについて
				</h1>
				<div class="bg-yellow-300 text-center py-2 mb-4">
					<p class="font-bold">このフィードバックは短縮版用に作成されたものです。</p>
				</div>

				<div class="mb-6">
					<h2 class="font-bold mb-2">はじめに</h2>
					<p class="text-sm leading-relaxed text-gray-800">
						新職業性ストレス簡易調査票は、平成21-23年度厚生労働科学研究費補助金（労働安全衛生総合研究事業）「労働者のメンタルヘルス不調の第一次予防の浸透手法に関する調査研究」（H21-労働-一般-001）（以下「本研究班」）の研究成果です。労働者や職場のストレス要因やストレス反応の測定には、開発以来これまで職業性ストレス簡易調査票が広く使用されてきました。しかし今日、労働者のストレスやメンタルヘルスはより広い職場要因によって影響を受けています。新職業性ストレス簡易調査票(New BJSQ)では、現行版の職業性ストレス簡易調査票20尺度に、22の新しい尺度（推奨尺度セットの場合）を追加することで、より広い職場の心理社会的要因、特に部署や事業場レベルでの仕事の資源および労働者の仕事へのポジティブな関わりを測定できるようになりました。
					</p>
				</div>

				<div class="mb-6">
					<h2 class="font-bold mb-2">新職業性ストレス簡易調査票と「健康いきいき職場」づくり</h2>
					<p class="text-sm leading-relaxed text-gray-800 mb-4">
						厚生労働省研究班におけるステークホルダー会議の議論から、わが国の労働者のメンタルヘルス不調の新しい一次予防対策として「健康いきいき職場」づくりが提案されました。「健康いきいき職場」（仮）づくりでは、健康の保持・増進に加えて労働者のいきいき、職場の一体感の増進を目標に加え、組織資源を高める対策を実施することで、職場におけるポジティブなメンタルヘルスを実現しようとする活動です。「健康いきいき職場」づくりはこれまでの職場のメンタルヘルス対策に置き換わるものではありませんが、これを補完し拡充するものとして期待されます。「健康いきいき職場」づくりは、図のような「健康いきいき職場」モデルに従って推進されます。新職業性ストレス簡易調査票は、このモデルに記載された職場環境要因やアウトカムを測定できるように作成されています。
					</p>

					<!-- 健康いきいき職場モデル図（簡略版） -->
					<div class="bg-gray-50 border border-gray-300 p-4 mb-4">
						<div class="text-center mb-4">
							<div class="grid grid-cols-3 gap-4 text-xs">
								<div>
									<div class="font-bold mb-2">健康いきいき職場環境</div>
									<div class="bg-yellow-100 border border-yellow-400 rounded p-2 mb-2">
										<div class="font-bold">仕事の負担</div>
										<div class="text-[10px]">量的負担・質的負担<br/>身体的負担・対人関係<br/>ワーク・セルフ・バランス（ネガティブ）</div>
									</div>
									<div class="bg-blue-100 border border-blue-400 rounded p-2">
										<div class="font-bold">仕事の資源</div>
										<div class="text-[10px]">作業レベル・部署レベル・事業場レベル</div>
									</div>
								</div>
								<div>
									<div class="font-bold mb-2">健康いきいきアウトカム</div>
									<div class="bg-orange-100 border border-orange-400 rounded p-3">
										<div class="font-bold mb-1">心身の健康</div>
										<div class="bg-yellow-200 rounded p-2 mb-2 text-[10px]">
											従業員のいきいき<br/>（ワーク・エンゲイジメント）
										</div>
										<div class="bg-blue-200 rounded p-2 text-[10px]">
											職場のいきいき<br/>（職場の一体感）
										</div>
									</div>
								</div>
								<div>
									<div class="font-bold mb-2">期待される成果</div>
									<div class="text-[10px] text-left">
										<div class="mb-2">生産性・イノベーション</div>
										<div class="mb-2">従業員の満足・幸福</div>
										<div>社会への貢献</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<p class="text-xs text-gray-700">
						<strong>図</strong> 「健康いきいき職場」モデルにおける仕事の負担、仕事の資源と、３つの主要な健康いきいきアウトカム。これらの推進が、労働者の満足・幸福および企業・組織の生産性、イノベーションを通じて社会への貢献につながります。
					</p>
				</div>
			</div>
		</div>

		<!-- Page 2: フィードバックの見方 -->
		<div class="max-w-4xl mx-auto p-8 page-break">
			<div class="text-right text-sm text-gray-600 mb-4">2/10</div>

			<div class="border border-gray-300 p-4 mb-6">
				<h2 class="font-bold text-lg mb-4">このフィードバックの見方</h2>
				<p class="text-sm leading-relaxed text-gray-800 mb-4">
					この新職業性ストレス簡易調査票フィードバックでは、「健康いきいき職場」（仮）モデルにしたがって、仕事の負担、資源およびアウトカムを部署別あるいは事業場別に集計してその平均値を示しています。数字は全て高い方が好ましい状態を示すように変換されています。
				</p>
				<p class="text-sm leading-relaxed text-gray-800 mb-4">
					わが国の全国の労働者の代表1500人を対象に行われた調査から、全国の標準データと比較して、当該職場の特徴を知ることができます。
				</p>
				<p class="text-sm leading-relaxed text-gray-800 mb-6">
					フィードバックを見る際にはまず、いきいきプロフィール全体図で、個人と職場のいきいきの状態を確認してください。その上で、これらの背景となる仕事の負担および資源の状態を領域別のレーダーチャートで確認し、おおまなか傾向をつかんでください。特に傾向のはっきりしていた領域について、その領域のプロフィールを見てどの要因がその傾向の原因となっているか確認します。
				</p>

				<!-- ステップ図 -->
				<div class="mb-6">
					<div class="flex items-center mb-3">
						<div class="bg-blue-600 text-white px-3 py-2 text-sm font-bold">ステップ1</div>
						<div class="ml-3 bg-gray-100 border border-gray-300 rounded px-4 py-2 flex-1">
							いきいきプロフィール全体図で、個人と職場のいきいきを確認
						</div>
					</div>
					<div class="flex items-center mb-3">
						<div class="bg-blue-600 text-white px-3 py-2 text-sm font-bold">ステップ2</div>
						<div class="ml-3 bg-gray-100 border border-gray-300 rounded px-4 py-2 flex-1">
							仕事の負担と資源のレーダーチャートで注目すべき対策領域を確認
						</div>
					</div>
					<div class="flex items-center mb-3">
						<div class="bg-blue-600 text-white px-3 py-2 text-sm font-bold">ステップ3</div>
						<div class="ml-3 bg-gray-100 border border-gray-300 rounded px-4 py-2 flex-1">
							仕事の負担と資源のプロフィールで注目すべく個別の要素を確認
						</div>
					</div>
					<div class="flex items-center mb-3">
						<div class="bg-blue-600 text-white px-3 py-2 text-sm font-bold">ステップ4</div>
						<div class="ml-3 bg-gray-100 border border-gray-300 rounded px-4 py-2 flex-1">
							強みをのばすか、弱みを補強する改善方策を考える
						</div>
					</div>
				</div>

				<div class="mb-6">
					<h3 class="font-bold mb-2">結果から改善へ</h3>
					<p class="text-sm leading-relaxed text-gray-800 mb-3">
						これらのプロフィールから職場の強みや弱み（問題点）を把握したら、健康いきいき職場の推進のために、強みをのばしたり、あるいは問題点を補強する対策を考えます。
					</p>
					<p class="text-sm leading-relaxed text-gray-800 mb-3">
						管理職の立場では、マネジメントスタイルを見直したり、職場の役割分担や権限委譲などの見直しをすることも考えられます。従業員をまじえた職場環境改善検討会の開催は、アイデアを収集するのに効果的です。
					</p>
					<p class="text-sm leading-relaxed text-gray-800 mb-3">
						経営者や人事労務の立場では、全社や事業場レベルで、経営層と従業員とのコミュニケーションのあり方を見直したり、ＣＳＲ方針、行動指針、人事評価制度、人材育成方針を検討することなども考えられます。
					</p>
					<p class="text-sm leading-relaxed text-gray-800 mb-6">
						何らかの改善策が実施されたら、その後再度職場を評価し、改善が効果的になされたかどうか確認することが大事です。うまくいった場合には職場で共有し、改善が十分でない場合にはさらに工夫を考えます。こうして日々の業務の中に、健康いきいき職場づくりのためのよい計画－実行－評価－改善のサイクルがつくられると、本当に効果のある対策へとつながります。
					</p>
				</div>

				<div class="border border-gray-400 bg-gray-50 p-3">
					<p class="text-xs text-gray-800">
						新職業性ストレス簡易調査票は、平成21-23年度厚生労働科学研究費補助金（労働安全衛生総合研究事業）「労働者のメンタルヘルス不調の第一次予防の浸透手法に関する調査研究」（H21-労働-一般-001）の研究成果です。
					</p>
				</div>
			</div>
		</div>

		<!-- Page 3: いきいきプロフィール全体図 -->
		<div class="max-w-7xl mx-auto p-8 page-break">
			<div class="text-right text-sm text-gray-600 mb-4">3/10</div>
			<div class="border-b border-gray-300 pb-4 mb-6">
				<h1 class="text-2xl font-bold text-gray-900 mb-2 text-center">
					新職業性ストレス簡易調査票　部署別フィードバック（3/10）
				</h1>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-base text-gray-700">
							<span class="font-semibold">部署名</span> 全組織
						</p>
						<p class="text-base text-gray-700">
							<span class="font-semibold">回答者数</span> {$userData.length}人
						</p>
					</div>
					<a
						href="/preview"
						class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 print:hidden"
					>
						← 一覧に戻る
					</a>
				</div>
			</div>

			<!-- 1. いきいきプロフィール全体図 -->
			<div class="bg-gray-50 border border-gray-300 rounded p-6 mb-8">
				<h2 class="text-xl font-bold text-gray-900 mb-6 text-center bg-white border border-gray-400 py-2">
					1.いきいきプロフィール全体図
				</h2>

				<!-- いきいき度分布図（散布図） -->
				<div class="mb-8">
					<h3 class="text-base font-semibold text-gray-800 mb-4 text-center">
						いきいき度分布図
					</h3>
					<div class="max-w-2xl mx-auto">
						{#if ikiikiScatterData}
							<ScatterPlot
								datasets={ikiikiScatterData.datasets}
								title=""
								xLabel="低い ← 職場のいきいき（職場の一体感） → 高い"
								yLabel="個人と組織のいきいき（ワーク・エンゲイジメント）"
							/>
						{/if}
						<div class="mt-4 flex justify-center gap-6 text-xs">
							<div class="flex items-center">
								<div class="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
								<span>当該職場</span>
							</div>
							<div class="flex items-center">
								<div class="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
								<span>事業場平均</span>
							</div>
							<div class="flex items-center">
								<div class="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
								<span>全国平均</span>
							</div>
						</div>
					</div>
				</div>

				<!-- 職場のいきいき（レーダーチャート＋説明ボックス） -->
				<div class="relative">
					<h3 class="text-base font-semibold text-gray-800 mb-4 text-center">
						職場のいきいき（職場の一体感）
					</h3>

					<div class="flex items-start justify-center gap-6">
						<!-- 左側：仕事の負担合計 -->
						<div class="w-40 flex-shrink-0">
							<div class="bg-white border border-gray-300 rounded p-3 text-xs">
								<h4 class="font-bold text-gray-900 mb-2 text-center">仕事の負担合計</h4>
								<ul class="space-y-0.5 text-gray-700">
									<li>仕事の量的負担</li>
									<li>仕事の質的負担</li>
									<li>身体的負担度</li>
									<li>職場での対人関係</li>
									<li>職場環境</li>
									<li>情緒的負担</li>
									<li>役割葛藤</li>
									<li>ワーク・セルフ・バランス（ネガティブ）</li>
								</ul>
							</div>
						</div>

						<!-- 中央：レーダーチャート -->
						<div class="w-96 flex-shrink-0">
							{#if radarChartData}
								<div class="mb-2 text-center text-xs">
									<span class="inline-block mr-3"><span class="inline-block w-3 h-0.5 bg-blue-500 mr-1"></span>当該職場</span>
									<span class="inline-block mr-3"><span class="inline-block w-3 h-0.5 bg-red-500 mr-1"></span>事業場平均</span>
									<span class="inline-block"><span class="inline-block w-3 h-0.5 bg-green-500 mr-1"></span>全国平均</span>
								</div>
								<RadarChart
									labels={['作業レベル資源\n合計', '部署レベル資源\n合計', '事業場レベル\n資源合計', '仕事の負担合計']}
									datasets={[
										{
											label: '当該職場',
											data: [
												orgAvg.totalTaskLevelResources,
												orgAvg.totalDepartmentLevelResources,
												orgAvg.totalOrganizationLevelResources,
												orgAvg.totalWorkload
											],
											borderColor: 'rgb(33, 150, 243)',
											backgroundColor: 'rgba(33, 150, 243, 0.1)',
											pointBackgroundColor: 'rgb(33, 150, 243)',
											borderWidth: 2
										},
										{
											label: '全国平均',
											data: [2.89, 2.52, 2.30, 2.60],
											borderColor: 'rgb(76, 175, 80)',
											backgroundColor: 'rgba(76, 175, 80, 0.1)',
											pointBackgroundColor: 'rgb(76, 175, 80)',
											borderWidth: 2
										}
									]}
									title=""
								/>
							{/if}
						</div>

						<!-- 右側：部署レベル資源合計 -->
						<div class="w-40 flex-shrink-0">
							<div class="bg-white border border-gray-300 rounded p-3 text-xs mb-3">
								<h4 class="font-bold text-gray-900 mb-2 text-center">部署レベル資源<br>合計</h4>
								<ul class="space-y-0.5 text-gray-700">
									<li>上司のサポート</li>
									<li>同僚のサポート</li>
									<li>家族・友人のサポート</li>
									<li>経済・地位報酬</li>
									<li>尊重報酬</li>
									<li>安定報酬</li>
									<li>上司のリーダーシップ</li>
									<li>上司の公正な態度</li>
									<li>ほめてもらえる職場</li>
									<li>失敗を認める職場</li>
								</ul>
							</div>
						</div>
					</div>

					<!-- 下部の説明ボックス -->
					<div class="flex justify-center gap-6 mt-6">
						<!-- 作業レベル -->
						<div class="w-48">
							<div class="bg-white border border-gray-300 rounded p-3 text-xs">
								<h4 class="font-bold text-gray-900 mb-2 text-center">作業レベル資源<br>合計</h4>
								<ul class="space-y-0.5 text-gray-700">
									<li>仕事のコントロール</li>
									<li>仕事の適性</li>
									<li>技能の活用</li>
									<li>仕事の意義</li>
									<li>役割明確さ</li>
									<li>成長の機会</li>
								</ul>
							</div>
						</div>

						<!-- 事業場レベル -->
						<div class="w-48">
							<div class="bg-white border border-gray-300 rounded p-3 text-xs">
								<h4 class="font-bold text-gray-900 mb-2 text-center">事業場レベル<br>資源合計</h4>
								<ul class="space-y-0.5 text-gray-700">
									<li>経営層との信頼関係</li>
									<li>変化への対応</li>
									<li>個人の尊重</li>
									<li>公正な人事評価</li>
									<li>多様な労働者への対応</li>
									<li>キャリア形成</li>
									<li>ワーク・セルフ・バランス（ポジティブ）</li>
								</ul>
							</div>
						</div>
					</div>
				</div>


				<!-- 注記 -->
				<div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
					<p class="text-xs text-gray-800 mb-1">
						◆事業場平均：対象となった事業場全体の平均
					</p>
					<p class="text-xs text-gray-800">
						◆得点は最高４点、最低１点になるよう変換されており、高い方が良好な状態を示す
					</p>
				</div>
			</div>
		</div>

		<!-- Page 4: 仕事の負担プロフィール -->
		<div class="max-w-7xl mx-auto p-8 page-break">
			<div class="text-right text-sm text-gray-600 mb-4">4/10</div>
			<div class="border-b border-gray-300 pb-4 mb-6">
				<h1 class="text-2xl font-bold text-gray-900 mb-2 text-center">
					新職業性ストレス簡易調査票　部署別フィードバック（4/10）
				</h1>
			</div>

			<div class="bg-gray-50 border border-gray-300 rounded p-6 mb-8">
				<h2 class="text-xl font-bold text-gray-900 mb-6 text-center bg-white border border-gray-400 py-2">
					2. 仕事の負担プロフィール
				</h2>

				<div class="space-y-6">
					<SmallBarChart
						label="仕事の量的負担"
						description="仕事の量が多いことや時間内に仕事をしきれないことによる業務負担"
						currentValue={orgAvg.quantitativeLoad}
						nationalValue={2.14}
					/>

					<SmallBarChart
						label="仕事の質的負担"
						description="仕事で必要な注意集中の程度や知識、技術の高さなど質的な業務負担"
						currentValue={orgAvg.qualitativeLoad}
						nationalValue={2.16}
					/>

					<SmallBarChart
						label="身体的負担度"
						description="仕事でからだを動かす必要があるなど身体的な負担"
						currentValue={orgAvg.physicalLoad}
						nationalValue={2.49}
					/>

					<SmallBarChart
						label="職場での対人関係"
						description="部署内での意見の相違、あるいは部署同志の対立など対人関係に関する負担"
						currentValue={orgAvg.interpersonalRelations}
						nationalValue={2.88}
					/>

					<SmallBarChart
						label="職場環境"
						description="騒音、照明、温度、換気などの物理的な職場環境の問題による負担"
						currentValue={orgAvg.workplaceEnvironment}
						nationalValue={2.78}
					/>

					<SmallBarChart
						label="情緒的負担"
						description="仕事の上で気持ちや感情がかき乱れるなど、感情面での負担"
						currentValue={orgAvg.emotionalLoad}
						nationalValue={2.66}
					/>

					<SmallBarChart
						label="役割葛藤"
						description="方針や要求が互いに相容れないために業務が困難になること"
						currentValue={orgAvg.roleConflict}
						nationalValue={2.87}
					/>

					<SmallBarChart
						label="ワーク・セルフ・バランス（ネガティブ）"
						description="仕事が、個人生活に対して好ましくない影響を及ぼしていること"
						currentValue={orgAvg.workSelfBalanceNegative}
						nationalValue={2.83}
					/>
				</div>

				<div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
					<p class="text-xs text-gray-800 mb-1">
						◆事業場平均：対象となった事業場全体の平均
					</p>
					<p class="text-xs text-gray-800">
						◆得点は最高４点、最低１点になるよう変換されており、高い方が良好な状態を示す
					</p>
				</div>
			</div>
		</div>

		<!-- Page 5: 作業レベル資源プロフィール -->
		<div class="max-w-7xl mx-auto p-8 page-break">
			<div class="text-right text-sm text-gray-600 mb-4">5/10</div>
			<div class="border-b border-gray-300 pb-4 mb-6">
				<h1 class="text-2xl font-bold text-gray-900 mb-2 text-center">
					新職業性ストレス簡易調査票　部署別フィードバック（5/10）
				</h1>
			</div>

			<div class="bg-gray-50 border border-gray-300 rounded p-6 mb-8">
				<h2 class="text-xl font-bold text-gray-900 mb-6 text-center bg-white border border-gray-400 py-2">
					3. 仕事の資源（作業レベル）プロフィール
				</h2>

				<div class="space-y-6">
					<SmallBarChart
						label="仕事のコントロール"
						description="仕事の内容や予定や手順などを自分で決められる程度"
						currentValue={orgAvg.jobControl}
						nationalValue={2.53}
					/>

					<SmallBarChart
						label="仕事の適性"
						description="仕事の内容が自分にむいている、合っていること"
						currentValue={orgAvg.jobFitness}
						nationalValue={2.92}
					/>

					<SmallBarChart
						label="技能の活用"
						description="持っている技術、知識、技能、資格などが仕事上活用されていること"
						currentValue={orgAvg.skillUtilization}
						nationalValue={3.0}
					/>

					<SmallBarChart
						label="仕事の意義"
						description="仕事の意義が認識でき、働きがいを感じていること"
						currentValue={orgAvg.jobSignificance}
						nationalValue={2.87}
					/>

					<SmallBarChart
						label="役割明確さ"
						description="仕事の上で果たすべき役割が明確に理解されていること"
						currentValue={orgAvg.roleClarification}
						nationalValue={3.41}
					/>

					<SmallBarChart
						label="成長の機会"
						description="知識や技術を得たり、あるいはその他の自己成長の機会があること"
						currentValue={orgAvg.growthOpportunity}
						nationalValue={2.62}
					/>
				</div>

				<div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
					<p class="text-xs text-gray-800 mb-1">
						◆事業場平均：対象となった事業場全体の平均
					</p>
					<p class="text-xs text-gray-800">
						◆得点は最高４点、最低１点になるよう変換されており、高い方が良好な状態を示す
					</p>
				</div>
			</div>
		</div>

		<!-- Page 6: 部署レベル資源プロフィール -->
		<div class="max-w-7xl mx-auto p-8 page-break">
			<div class="text-right text-sm text-gray-600 mb-4">6/10</div>
			<div class="border-b border-gray-300 pb-4 mb-6">
				<h1 class="text-2xl font-bold text-gray-900 mb-2 text-center">
					新職業性ストレス簡易調査票　部署別フィードバック（6/10）
				</h1>
			</div>

			<div class="bg-gray-50 border border-gray-300 rounded p-6 mb-8">
				<h2 class="text-xl font-bold text-gray-900 mb-6 text-center bg-white border border-gray-400 py-2">
					4. 仕事の資源（部署レベル）プロフィール
				</h2>

				<div class="space-y-6">
					<SmallBarChart
						label="上司のサポート"
						description="話しかけやすく、頼りになり、相談にのってくれるなど上司から部下への支援"
						currentValue={orgAvg.supervisorSupport}
						nationalValue={2.37}
					/>

					<SmallBarChart
						label="同僚のサポート"
						description="話しかけやすく、頼りになり、相談にのってくれるなど同僚間の支援"
						currentValue={orgAvg.colleagueSupport}
						nationalValue={2.68}
					/>

					<SmallBarChart
						label="家族友人のサポート"
						description="配偶者、家族、友人等からの支援"
						currentValue={orgAvg.familySupport}
						nationalValue={3.31}
					/>

					<SmallBarChart
						label="経済・地位報酬"
						description="仕事上の努力に対し金銭的報酬や処遇を受けていること"
						currentValue={orgAvg.economicReward}
						nationalValue={2.25}
					/>

					<SmallBarChart
						label="尊重報酬"
						description="上司や同僚から、仕事の努力にふさわしい尊敬や賞賛を受けていること"
						currentValue={orgAvg.respectReward}
						nationalValue={2.59}
					/>

					<SmallBarChart
						label="安定報酬"
						description="仕事が不安定、将来の見込みがない、職を失う可能性のあること"
						currentValue={orgAvg.stabilityReward}
						nationalValue={2.84}
					/>

					<SmallBarChart
						label="上司のリーダーシップ"
						description="上司が、仕事の出来をフィードバックし、部下が問題解決できるよう指導していること"
						currentValue={orgAvg.supervisorLeadership}
						nationalValue={2.25}
					/>

					<SmallBarChart
						label="上司の公正な態度"
						description="上司が、偏見を持たずく、部下に思いやりと誠実さを持って対応してくれること"
						currentValue={orgAvg.supervisorFairness}
						nationalValue={2.65}
					/>

					<SmallBarChart
						label="ほめてもらえる職場"
						description="ねぎらいや感謝の言葉など、職場でポジティブな評価を受けられること"
						currentValue={orgAvg.praisableWorkplace}
						nationalValue={2.59}
					/>

					<SmallBarChart
						label="失敗を認める職場"
						description="失敗しても取り戻す機会があったり、失敗を転じて成功に導くことができること"
						currentValue={orgAvg.failureAcceptance}
						nationalValue={2.45}
					/>
				</div>

				<div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
					<p class="text-xs text-gray-800 mb-1">
						◆事業場平均：対象となった事業場全体の平均
					</p>
					<p class="text-xs text-gray-800">
						◆得点は最高４点、最低１点になるよう変換されており、高い方が良好な状態を示す
					</p>
				</div>
			</div>
		</div>

		<!-- Page 7: 事業場レベル資源プロフィール -->
		<div class="max-w-7xl mx-auto p-8 page-break">
			<div class="text-right text-sm text-gray-600 mb-4">7/10</div>
			<div class="border-b border-gray-300 pb-4 mb-6">
				<h1 class="text-2xl font-bold text-gray-900 mb-2 text-center">
					新職業性ストレス簡易調査票　部署別フィードバック（7/10）
				</h1>
			</div>

			<div class="bg-gray-50 border border-gray-300 rounded p-6 mb-8">
				<h2 class="text-xl font-bold text-gray-900 mb-6 text-center bg-white border border-gray-400 py-2">
					5. 仕事の資源（事業場レベル）プロフィール
				</h2>

				<div class="space-y-6">
					<SmallBarChart
						label="経営層との信頼関係"
						description="経営層と従業員の間に相互の信頼関係があること"
						currentValue={orgAvg.managementTrust}
						nationalValue={2.58}
					/>

					<SmallBarChart
						label="変化への対応"
						description="職場でどんな変化があるか説明があったり、たずねることができ、変化への準備ができていること"
						currentValue={orgAvg.changeAdaptation}
						nationalValue={2.35}
					/>

					<SmallBarChart
						label="個人の尊重"
						description="一人ひとりの長所や得意分野、価値観などを考えて仕事が与えられる風土や方針があること"
						currentValue={orgAvg.individualRespect}
						nationalValue={2.14}
					/>

					<SmallBarChart
						label="公正な人事評価"
						description="人事評価について情報が提供され、納得できる説明がなされること"
						currentValue={orgAvg.fairEvaluation}
						nationalValue={2.04}
					/>

					<SmallBarChart
						label="多様な労働者への対応"
						description="女性、高齢者、雇用形態などさまざまな背景の従業員が職場の一員として尊重されること"
						currentValue={orgAvg.diversitySupport}
						nationalValue={2.72}
					/>

					<SmallBarChart
						label="キャリア形成"
						description="従業員のキャリア形成について方針や目標が明確にされ、教育訓練が提供されていること"
						currentValue={orgAvg.careerDevelopment}
						nationalValue={2.23}
					/>

					<SmallBarChart
						label="ワーク・セルフ・バランス（ポジティブ）"
						description="仕事により、個人生活を豊かにすることができること"
						currentValue={orgAvg.workSelfBalancePositive}
						nationalValue={2.07}
					/>
				</div>

				<div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
					<p class="text-xs text-gray-800 mb-1">
						◆事業場平均：対象となった事業場全体の平均
					</p>
					<p class="text-xs text-gray-800">
						◆得点は最高４点、最低１点になるよう変換されており、高い方が良好な状態を示す
					</p>
				</div>
			</div>
		</div>

		<!-- Page 8: 健康および満足度プロフィール -->
		<div class="max-w-7xl mx-auto p-8 page-break">
			<div class="text-right text-sm text-gray-600 mb-4">8/10</div>
			<div class="border-b border-gray-300 pb-4 mb-6">
				<h1 class="text-2xl font-bold text-gray-900 mb-2 text-center">
					新職業性ストレス簡易調査票　部署別フィードバック（8/10）
				</h1>
			</div>

			<div class="bg-gray-50 border border-gray-300 rounded p-6 mb-8">
				<h2 class="text-xl font-bold text-gray-900 mb-6 text-center bg-white border border-gray-400 py-2">
					6. 健康および満足度プロフィール
				</h2>

				<div class="space-y-6">
					<SmallBarChart
						label="活気"
						description="活気、いきいきなどのポジティブな感情"
						currentValue={orgAvg.vigor}
						nationalValue={2.26}
					/>

					<SmallBarChart
						label="イライラ感"
						description="怒り、立腹、イライラなどの症状"
						currentValue={orgAvg.irritation}
						nationalValue={2.70}
					/>

					<SmallBarChart
						label="疲労感"
						description="疲れ、へとへと、だるさなどの疲労に関連した症状"
						currentValue={orgAvg.fatigue}
						nationalValue={2.70}
					/>

					<SmallBarChart
						label="不安感"
						description="気がはりつめている、不安、落ち着かないなどの不安に関する症状"
						currentValue={orgAvg.anxiety}
						nationalValue={2.87}
					/>

					<SmallBarChart
						label="抑うつ感"
						description="ゆううつ感、集中力の低下など、抑うつ気分に関する症状"
						currentValue={orgAvg.depression}
						nationalValue={3.27}
					/>

					<SmallBarChart
						label="心理的ストレス反応合計"
						description="活気（のなさ）、イライラ感、疲労感、不安感、抑うつ感の症状の合計"
						currentValue={orgAvg.psychologicalStress}
						nationalValue={2.85}
					/>

					<SmallBarChart
						label="身体愁訴"
						description="身体的な症状の合計"
						currentValue={orgAvg.physicalComplaints}
						nationalValue={3.22}
					/>

					<SmallBarChart
						label="職場のハラスメント"
						description="職場でいじめ、嫌がらせを受けていること。セクシャルハラスメント、パワーハラスメントを含む"
						currentValue={orgAvg.harassment}
						nationalValue={3.70}
					/>

					<SmallBarChart
						label="仕事満足度"
						description="仕事に関する全般的な満足度"
						currentValue={orgAvg.jobSatisfaction}
						nationalValue={2.60}
					/>

					<SmallBarChart
						label="家庭満足度"
						description="家庭生活に関する全般的な満足度"
						currentValue={orgAvg.familySatisfaction}
						nationalValue={3.06}
					/>
				</div>

				<div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
					<p class="text-xs text-gray-800 mb-1">
						◆事業場平均：対象となった事業場全体の平均
					</p>
					<p class="text-xs text-gray-800">
						◆得点は最高４点、最低１点になるよう変換されており、高い方が良好な状態を示す
					</p>
				</div>
			</div>
		</div>

		<!-- Page 9: 判定基準基礎データ（全国平均） -->
		<div class="max-w-7xl mx-auto p-8 page-break">
			<div class="text-right text-sm text-gray-600 mb-4">9/10</div>
			<div class="border-b border-gray-300 pb-4 mb-6">
				<h1 class="text-xl font-bold text-gray-900">
					新職業性ストレス簡易調査票　判定基準基礎データ
				</h1>
			</div>

			<div class="overflow-x-auto">
				<table class="min-w-full border-collapse border border-gray-400 text-sm">
					<thead>
						<tr class="bg-gray-100">
							<th class="border border-gray-400 px-3 py-2 text-left font-bold">変数グループ</th>
							<th class="border border-gray-400 px-3 py-2 text-left font-bold">変数</th>
							<th class="border border-gray-400 px-3 py-2 text-center font-bold">全国平均(N≒1620)</th>
							<th class="border border-gray-400 px-3 py-2 text-center font-bold">全国平均（標準偏差）</th>
						</tr>
					</thead>
					<tbody class="text-xs">
						<tr><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="9">仕事の負担</td><td class="border border-gray-400 px-3 py-2">仕事の量的負担</td><td class="border border-gray-400 px-3 py-2 text-center">2.14</td><td class="border border-gray-400 px-3 py-2 text-center">0.76</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">仕事の質的負担</td><td class="border border-gray-400 px-3 py-2 text-center">2.16</td><td class="border border-gray-400 px-3 py-2 text-center">0.71</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">身体的負担度</td><td class="border border-gray-400 px-3 py-2 text-center">2.49</td><td class="border border-gray-400 px-3 py-2 text-center">1.08</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">職場での対人関係</td><td class="border border-gray-400 px-3 py-2 text-center">2.88</td><td class="border border-gray-400 px-3 py-2 text-center">0.66</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">職場環境</td><td class="border border-gray-400 px-3 py-2 text-center">2.78</td><td class="border border-gray-400 px-3 py-2 text-center">0.99</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">情緒的負担</td><td class="border border-gray-400 px-3 py-2 text-center">2.66</td><td class="border border-gray-400 px-3 py-2 text-center">0.96</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">役割葛藤</td><td class="border border-gray-400 px-3 py-2 text-center">2.87</td><td class="border border-gray-400 px-3 py-2 text-center">0.93</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">ワーク・セルフ・バランス（ネガティブ）</td><td class="border border-gray-400 px-3 py-2 text-center">2.83</td><td class="border border-gray-400 px-3 py-2 text-center">0.89</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2 bg-yellow-200 font-bold">★仕事の負担合計★</td><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold">2.60</td><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold">0.52</td></tr>

						<tr><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="7">仕事の資源（作業レベル）</td><td class="border border-gray-400 px-3 py-2">仕事のコントロール</td><td class="border border-gray-400 px-3 py-2 text-center">2.53</td><td class="border border-gray-400 px-3 py-2 text-center">0.74</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">仕事の適性</td><td class="border border-gray-400 px-3 py-2 text-center">2.92</td><td class="border border-gray-400 px-3 py-2 text-center">0.80</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">技能の活用</td><td class="border border-gray-400 px-3 py-2 text-center">3.00</td><td class="border border-gray-400 px-3 py-2 text-center">0.85</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">仕事の意義</td><td class="border border-gray-400 px-3 py-2 text-center">2.87</td><td class="border border-gray-400 px-3 py-2 text-center">0.87</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">役割明確さ</td><td class="border border-gray-400 px-3 py-2 text-center">3.41</td><td class="border border-gray-400 px-3 py-2 text-center">0.63</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">成長の機会</td><td class="border border-gray-400 px-3 py-2 text-center">2.62</td><td class="border border-gray-400 px-3 py-2 text-center">0.94</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2 bg-yellow-200 font-bold">★仕事の資源（作業レベル）合計★</td><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold">2.89</td><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold">0.53</td></tr>

						<tr><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="11">仕事の資源（部署レベル）</td><td class="border border-gray-400 px-3 py-2">上司のサポート</td><td class="border border-gray-400 px-3 py-2 text-center">2.37</td><td class="border border-gray-400 px-3 py-2 text-center">0.75</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">同僚のサポート</td><td class="border border-gray-400 px-3 py-2 text-center">2.68</td><td class="border border-gray-400 px-3 py-2 text-center">0.70</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">家族友人のサポート</td><td class="border border-gray-400 px-3 py-2 text-center">3.31</td><td class="border border-gray-400 px-3 py-2 text-center">0.68</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">経済・地位報酬</td><td class="border border-gray-400 px-3 py-2 text-center">2.25</td><td class="border border-gray-400 px-3 py-2 text-center">0.92</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">尊重報酬</td><td class="border border-gray-400 px-3 py-2 text-center">2.59</td><td class="border border-gray-400 px-3 py-2 text-center">0.80</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">安定報酬</td><td class="border border-gray-400 px-3 py-2 text-center">2.84</td><td class="border border-gray-400 px-3 py-2 text-center">1.02</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">上司のリーダーシップ</td><td class="border border-gray-400 px-3 py-2 text-center">2.25</td><td class="border border-gray-400 px-3 py-2 text-center">0.92</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">上司の公正な態度</td><td class="border border-gray-400 px-3 py-2 text-center">2.65</td><td class="border border-gray-400 px-3 py-2 text-center">0.86</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">ほめてもらえる職場</td><td class="border border-gray-400 px-3 py-2 text-center">2.59</td><td class="border border-gray-400 px-3 py-2 text-center">0.91</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">失敗を認める職場</td><td class="border border-gray-400 px-3 py-2 text-center">2.45</td><td class="border border-gray-400 px-3 py-2 text-center">0.85</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2 bg-yellow-200 font-bold">★仕事の資源（部署レベル）合計</td><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold">2.52</td><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold">0.57</td></tr>

						<tr><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="8">仕事の資源（事業場レベル）</td><td class="border border-gray-400 px-3 py-2">経営層との信頼関係</td><td class="border border-gray-400 px-3 py-2 text-center">2.58</td><td class="border border-gray-400 px-3 py-2 text-center">0.81</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">変化への対応</td><td class="border border-gray-400 px-3 py-2 text-center">2.35</td><td class="border border-gray-400 px-3 py-2 text-center">0.86</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">個人の尊重</td><td class="border border-gray-400 px-3 py-2 text-center">2.14</td><td class="border border-gray-400 px-3 py-2 text-center">0.82</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">公正な人事評価</td><td class="border border-gray-400 px-3 py-2 text-center">2.04</td><td class="border border-gray-400 px-3 py-2 text-center">0.86</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">多様な労働者への対応</td><td class="border border-gray-400 px-3 py-2 text-center">2.72</td><td class="border border-gray-400 px-3 py-2 text-center">0.87</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">キャリア形成</td><td class="border border-gray-400 px-3 py-2 text-center">2.23</td><td class="border border-gray-400 px-3 py-2 text-center">0.87</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">ワーク・セルフ・バランス（ポジティブ）</td><td class="border border-gray-400 px-3 py-2 text-center">2.07</td><td class="border border-gray-400 px-3 py-2 text-center">0.87</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2 bg-yellow-200 font-bold">★仕事の資源（事業場レベル）合計★</td><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold">2.30</td><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold">0.60</td></tr>

						<tr><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="2">いきいきアウトカム</td><td class="border border-gray-400 px-3 py-2">ワーク・エンゲイジメント</td><td class="border border-gray-400 px-3 py-2 text-center">2.52</td><td class="border border-gray-400 px-3 py-2 text-center">0.77</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2 bg-green-100">職場の一体感</td><td class="border border-gray-400 px-3 py-2 text-center bg-green-100">2.66</td><td class="border border-gray-400 px-3 py-2 text-center bg-green-100">0.77</td></tr>

						<tr><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="8">心身の健康</td><td class="border border-gray-400 px-3 py-2">活気</td><td class="border border-gray-400 px-3 py-2 text-center">2.26</td><td class="border border-gray-400 px-3 py-2 text-center">0.79</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">イライラ感</td><td class="border border-gray-400 px-3 py-2 text-center">2.70</td><td class="border border-gray-400 px-3 py-2 text-center">0.85</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">疲労感</td><td class="border border-gray-400 px-3 py-2 text-center">2.70</td><td class="border border-gray-400 px-3 py-2 text-center">0.88</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">不安感</td><td class="border border-gray-400 px-3 py-2 text-center">2.87</td><td class="border border-gray-400 px-3 py-2 text-center">0.80</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">抑うつ感</td><td class="border border-gray-400 px-3 py-2 text-center">3.27</td><td class="border border-gray-400 px-3 py-2 text-center">0.67</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">心理的ストレス反応合計</td><td class="border border-gray-400 px-3 py-2 text-center">2.85</td><td class="border border-gray-400 px-3 py-2 text-center">0.61</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">身体愁訴</td><td class="border border-gray-400 px-3 py-2 text-center">3.22</td><td class="border border-gray-400 px-3 py-2 text-center">0.54</td></tr>

						<tr><td class="border border-gray-400 px-3 py-2 font-semibold">職場のハラスメント</td><td class="border border-gray-400 px-3 py-2">職場のハラスメント</td><td class="border border-gray-400 px-3 py-2 text-center">3.70</td><td class="border border-gray-400 px-3 py-2 text-center">0.63</td></tr>

						<tr><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="2">満足度</td><td class="border border-gray-400 px-3 py-2">仕事満足度</td><td class="border border-gray-400 px-3 py-2 text-center">2.60</td><td class="border border-gray-400 px-3 py-2 text-center">0.85</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">家庭満足度</td><td class="border border-gray-400 px-3 py-2 text-center">3.06</td><td class="border border-gray-400 px-3 py-2 text-center">0.81</td></tr>
					</tbody>
				</table>
			</div>

			<div class="mt-4 text-xs text-gray-700">
				<p>（注１）高得点ほど良好な状態を示すように変換している。</p>
				<p>（注２）得点を項目数で除している。</p>
			</div>
		</div>

		<!-- Page 10: 調査データ（当該職場のデータ） -->
		<div class="max-w-7xl mx-auto p-8 page-break">
			<div class="text-right text-sm text-gray-600 mb-4">10/10</div>
			<div class="border-b border-gray-300 pb-4 mb-6">
				<h1 class="text-xl font-bold text-gray-900">
					新職業性ストレス簡易調査票　調査データ
				</h1>
			</div>

			<div class="overflow-x-auto">
				<table class="min-w-full border-collapse border border-gray-400 text-sm">
					<thead>
						<tr class="bg-gray-100">
							<th class="border border-gray-400 px-3 py-2 text-left font-bold">変数グループ</th>
							<th class="border border-gray-400 px-3 py-2 text-left font-bold">変数</th>
							<th class="border border-gray-400 px-3 py-2 text-center font-bold">全組織</th>
						</tr>
						<tr class="bg-gray-50">
							<th class="border border-gray-400 px-3 py-2 text-left">回答者数</th>
							<th class="border border-gray-400 px-3 py-2"></th>
							<th class="border border-gray-400 px-3 py-2 text-center">{$userData.length}</th>
						</tr>
					</thead>
					<tbody class="text-xs">
						<tr><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="9">仕事の負担</td><td class="border border-gray-400 px-3 py-2">仕事の量的負担</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.quantitativeLoad.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">仕事の質的負担</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.qualitativeLoad.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">身体的負担度</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.physicalLoad.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">職場での対人関係</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.interpersonalRelations.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">職場環境</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.workplaceEnvironment.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">情緒的負担</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.emotionalLoad.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">役割葛藤</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.roleConflict.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">ワーク・セルフ・バランス（ネガティブ）</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.workSelfBalanceNegative.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2 bg-yellow-200 font-bold">★仕事の負担合計★</td><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold">{orgAvg.totalWorkload.toFixed(2)}</td></tr>

						<tr><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="7">仕事の資源（作業レベル）</td><td class="border border-gray-400 px-3 py-2">仕事のコントロール</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.jobControl.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">仕事の適性</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.jobFitness.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">技能の活用</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.skillUtilization.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">仕事の意義</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.jobSignificance.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">役割明確さ</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.roleClarification.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">成長の機会</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.growthOpportunity.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2 bg-yellow-200 font-bold">★仕事の資源（作業レベル）合計★</td><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold">{orgAvg.totalTaskLevelResources.toFixed(2)}</td></tr>

						<tr><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="11">仕事の資源（部署レベル）</td><td class="border border-gray-400 px-3 py-2">上司のサポート</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.supervisorSupport.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">同僚のサポート</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.colleagueSupport.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">家族友人のサポート</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.familySupport.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">経済・地位報酬</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.economicReward.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">尊重報酬</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.respectReward.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">安定報酬</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.stabilityReward.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">上司のリーダーシップ</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.supervisorLeadership.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">上司の公正な態度</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.supervisorFairness.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">ほめてもらえる職場</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.praisableWorkplace.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">失敗を認める職場</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.failureAcceptance.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2 bg-yellow-200 font-bold">★仕事の資源（部署レベル）合計★</td><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold">{orgAvg.totalDepartmentLevelResources.toFixed(2)}</td></tr>

						<tr><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="8">仕事の資源（事業場レベル）</td><td class="border border-gray-400 px-3 py-2">経営層との信頼関係</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.managementTrust.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">変化への対応</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.changeAdaptation.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">個人の尊重</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.individualRespect.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">公正な人事評価</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.fairEvaluation.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">多様な労働者への対応</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.diversitySupport.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">キャリア形成</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.careerDevelopment.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">ワーク・セルフ・バランス（ポジティブ）</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.workSelfBalancePositive.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2 bg-yellow-200 font-bold">★仕事の資源（事業場レベル）合計★</td><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold">{orgAvg.totalOrganizationLevelResources.toFixed(2)}</td></tr>

						<tr><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="2">いきいきアウトカム</td><td class="border border-gray-400 px-3 py-2">ワーク・エンゲイジメント</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.workEngagement.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2 bg-green-100">職場の一体感</td><td class="border border-gray-400 px-3 py-2 text-center bg-green-100">{orgAvg.workplaceUnity.toFixed(2)}</td></tr>

						<tr><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="7">心身の健康</td><td class="border border-gray-400 px-3 py-2">活気</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.vigor.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">イライラ感</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.irritation.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">疲労感</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.fatigue.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">不安感</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.anxiety.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">抑うつ感</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.depression.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">心理的ストレス反応合計</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.psychologicalStress.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">身体愁訴</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.physicalComplaints.toFixed(2)}</td></tr>

						<tr><td class="border border-gray-400 px-3 py-2 font-semibold">職場のハラスメント</td><td class="border border-gray-400 px-3 py-2">職場のハラスメント</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.harassment.toFixed(2)}</td></tr>

						<tr><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="2">満足度</td><td class="border border-gray-400 px-3 py-2">仕事満足度</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.jobSatisfaction.toFixed(2)}</td></tr>
						<tr><td class="border border-gray-400 px-3 py-2">家庭満足度</td><td class="border border-gray-400 px-3 py-2 text-center">{orgAvg.familySatisfaction.toFixed(2)}</td></tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}
