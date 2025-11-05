<script lang="ts">
	import { page } from '$app/stores';
	import { departmentData, departmentAverages, overallAverage } from '$lib/stores/dataStore';
	import RadarChart from '$lib/components/RadarChart.svelte';
	import ScatterPlot from '$lib/components/ScatterPlot.svelte';
	import SmallBarChart from '$lib/components/SmallBarChart.svelte';
	import { nationalAveragesMap } from '$lib/data/nationalAverages';

	$: deptName = decodeURIComponent($page.params.dept);
	$: deptAvg = $departmentAverages.get(deptName);
	$: hasData = deptAvg && deptAvg.averageScores;
	$: orgAvg = $overallAverage;

	function handlePrintPDF() {
		window.print();
	}

	// いきいき度分布図データ（散布図）
	$: ikiikiScatterData = (() => {
		if (!hasData || !deptAvg) return null;

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

		// 事業場平均（組織全体）
		if (orgAvg) {
			datasets.push({
				label: '事業場平均',
				data: [{ x: orgAvg.workplaceUnity, y: orgAvg.workEngagement }],
				backgroundColor: 'rgb(244, 67, 54)',
				pointRadius: 8,
				pointHoverRadius: 10
			});
		}

		// 当該職場（この部署）
		datasets.push({
			label: '当該職場',
			data: [{ x: deptAvg.averageScores.workplaceUnity, y: deptAvg.averageScores.workEngagement }],
			backgroundColor: 'rgb(33, 150, 243)',
			pointRadius: 8,
			pointHoverRadius: 10
		});

		return { datasets };
	})();

	// 4つのレーダーチャートデータ
	$: radarChartData = (() => {
		if (!hasData || !deptAvg) return null;

		const scores = deptAvg.averageScores;

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
			scores.quantitativeLoad,
			scores.qualitativeLoad,
			scores.physicalLoad,
			scores.interpersonalRelations,
			scores.workplaceEnvironment,
			scores.emotionalLoad,
			scores.roleConflict,
			scores.workSelfBalanceNegative
		];
		const workloadNational = [2.14, 2.16, 2.49, 2.88, 2.78, 2.66, 2.87, 2.83];
		const workloadOrg = orgAvg ? [
			orgAvg.quantitativeLoad,
			orgAvg.qualitativeLoad,
			orgAvg.physicalLoad,
			orgAvg.interpersonalRelations,
			orgAvg.workplaceEnvironment,
			orgAvg.emotionalLoad,
			orgAvg.roleConflict,
			orgAvg.workSelfBalanceNegative
		] : null;

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
			scores.jobControl,
			scores.jobFitness,
			scores.skillUtilization,
			scores.jobSignificance,
			scores.roleClarification,
			scores.growthOpportunity
		];
		const taskNational = [2.53, 2.92, 3.0, 2.87, 3.41, 2.62];
		const taskOrg = orgAvg ? [
			orgAvg.jobControl,
			orgAvg.jobFitness,
			orgAvg.skillUtilization,
			orgAvg.jobSignificance,
			orgAvg.roleClarification,
			orgAvg.growthOpportunity
		] : null;

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
			scores.supervisorSupport,
			scores.colleagueSupport,
			scores.familySupport,
			scores.economicReward,
			scores.respectReward,
			scores.stabilityReward,
			scores.supervisorLeadership,
			scores.supervisorFairness,
			scores.praisableWorkplace,
			scores.failureAcceptance
		];
		const deptNational = [2.87, 2.96, 3.19, 2.28, 2.64, 2.73, 2.73, 2.68, 2.57, 2.64];
		const deptOrgData = orgAvg ? [
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
		] : null;

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
			scores.managementTrust,
			scores.changeAdaptation,
			scores.individualRespect,
			scores.fairEvaluation,
			scores.diversitySupport,
			scores.careerDevelopment,
			scores.workSelfBalancePositive
		];
		const orgNational = [2.53, 2.68, 2.79, 2.48, 2.79, 2.42, 2.41];
		const orgOrgData = orgAvg ? [
			orgAvg.managementTrust,
			orgAvg.changeAdaptation,
			orgAvg.individualRespect,
			orgAvg.fairEvaluation,
			orgAvg.diversitySupport,
			orgAvg.careerDevelopment,
			orgAvg.workSelfBalancePositive
		] : null;

		return {
			workload: { labels: workloadLabels, current: workloadCurrent, national: workloadNational, org: workloadOrg },
			task: { labels: taskLabels, current: taskCurrent, national: taskNational, org: taskOrg },
			dept: { labels: deptLabels, current: deptCurrent, national: deptNational, org: deptOrgData },
			organization: { labels: orgLabels, current: orgCurrent, national: orgNational, org: orgOrgData }
		};
	})();
</script>

<svelte:head>
	<title>部署別フィードバック - {deptName}</title>
</svelte:head>

{#if !hasData}
	<div class="max-w-4xl mx-auto p-8">
		<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
			<p class="text-yellow-800">データが見つかりません。CSVファイルをアップロードしてください。</p>
		</div>
	</div>
{:else}
	<!-- PDF出力ボタン（印刷時は非表示） -->
	<div class="print:hidden fixed top-4 right-4 z-50">
		<button
			on:click={handlePrintPDF}
			class="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
				/>
			</svg>
			<span>PDFで出力</span>
		</button>
	</div>

	<!-- ページ1: はじめに -->
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
				<h2 class="text-lg font-bold mb-2 border-b-2 border-gray-300 pb-1">はじめに</h2>
				<div class="space-y-3 text-xs leading-relaxed">
					<p>
						新職業性ストレス簡易調査票は、平成21-23年度厚生労働科学研究補助金(労働安全衛生総合研究事業)「労働者のメンタルヘルス不調の第一次予防の浸透手法に関する調査研究」(H21-労働-一般-003)(以下「本研究班」)の研究成果で、労働者や職場のストレス要因とストレス反応の関係を評価するために開発されました。職場環境改善等に活かされています。しかし今日は、労働者のストレスやメンタルヘルスはより広い職場要因によって影響されるものであり、かつ職場のストレス要因が労働者のメンタルヘルスにもつながることが明らかになっています。新職業性ストレス簡易調査票(New BJSQ)では、現行職業ストレス簡易調査票に加えて新たに職場環境の仕事に関連するポジティブな要因、個人と職場の活性化プロセス、職場の一体感等を測定することにより、よりよい職場づくりのための調査票として活用されることを想定して作成されました。
					</p>
					<p>
						新職業性ストレス簡易調査票と「健康いきいき職場」づくり<br />
						厚生労働省研究班におけるステークホルダー会議の議論から、わが国の労働者のメンタルヘルス対策としては、ストレスや不調を対象とした「健康いきいき職場」(仮)づくりが提案されました。「健康いきいき職場」(仮)づくりでは、健康の保持・増進に加えて労働者の幸せ(職場の一体感・ポジティブメンタルヘルス)を実現しようとする活動です。「健康いきいき職場」づくりはこれまでの職場のメンタルヘルス対策に新たな資源を加えるものではありません。これを補助し、展開可能なものとするためには科学的根拠と理論に基づく推進方法と、活動を評価できる手法が欠かせません。「健康いきいき職場」づくりは、図のような「健康いきいき職場」モデルに従って推進されます。新職業性ストレス簡易調査票は、このモデルに記載された職場環境要因やアウトカムを測定できるように作成されています。
					</p>
				</div>
			</div>

			<div class="mb-6">
				<h2 class="text-lg font-bold mb-3 text-center">「健康いきいき職場」モデル</h2>
				<div class="border border-gray-400 p-4 bg-gray-50">
					<div class="grid grid-cols-3 gap-4 mb-4">
						<div class="border-2 border-blue-500 bg-blue-50 p-3 rounded">
							<h3 class="font-bold text-center mb-2 text-sm">仕事の資源</h3>
							<ul class="text-xs space-y-1">
								<li>• 作業レベル</li>
								<li>• 部署レベル</li>
								<li>• 事業場レベル</li>
							</ul>
						</div>
						<div class="border-2 border-red-500 bg-red-50 p-3 rounded">
							<h3 class="font-bold text-center mb-2 text-sm">仕事の負担</h3>
							<ul class="text-xs space-y-1">
								<li>• 量的負担</li>
								<li>• 質的負担</li>
								<li>• 身体的負担</li>
								<li>• 対人関係等</li>
							</ul>
						</div>
						<div class="border-2 border-green-500 bg-green-50 p-3 rounded">
							<h3 class="font-bold text-center mb-2 text-sm">いきいきアウトカム</h3>
							<ul class="text-xs space-y-1">
								<li>• ワーク・エンゲイジメント</li>
								<li>• 職場の一体感</li>
							</ul>
						</div>
					</div>
					<div class="text-center">
						<div class="inline-block border-2 border-purple-500 bg-purple-50 p-3 rounded">
							<h3 class="font-bold mb-2 text-sm">心身の健康・満足度</h3>
							<p class="text-xs">活気、ストレス反応、仕事満足度など</p>
						</div>
					</div>
				</div>
			</div>

			<div class="text-xs text-gray-600 space-y-2">
				<p>
					図「健康いきいき職場」モデルにおける仕事の負担、仕事の資源と、３つの主要な健康いきいきアウトカム、それらの推進が、労働者の幸福・事業場およびその事業全体に及ぼす効果が示されています。
				</p>
			</div>
		</div>
	</div>

	<!-- ページ2: フィードバックの見方 -->
	<div class="max-w-4xl mx-auto p-8 page-break">
		<div class="text-right text-sm text-gray-600 mb-4">2/10</div>
		<div class="border border-gray-300 p-4">
			<h2 class="text-lg font-bold mb-4">このフィードバックの見方</h2>

			<div class="space-y-4 text-xs leading-relaxed">
				<p>
					この新職業性ストレス簡易調査票フィードバックでは、「健康いきいき職場」(仮)モデルに従いながら、仕事の負担、資源およびアウトカムを部署別あるいは事業場別に集計してその平均値を示しています。個々の労働者に向けた個人のフィードバックを示すことにします。
				</p>
				<p>
					わが国の全国の労働者の代表1500名を対象に行われた調査から、全国の標準データと比較してこの事業場の状態を確認することができます。
				</p>
				<p>
					フィードバックを見る際にはまず、いきいきプロフィールを検証し、個人と職場の「いきいき」の状態を確認してください。そして、これらの背景となる仕事の負担と仕事の資源の状態を部署別のレーダーチャートで確認し、おおまかな傾向をつかんでください。特に傾向のはっきりしている項目について、その項目のプロフィールを見てどの要因がその傾向の原因となっているか確認します。
				</p>

				<!-- ステップ図 -->
				<div class="my-6">
					<div class="flex items-start mb-3">
						<div class="bg-blue-600 text-white px-3 py-1 text-xs font-bold mr-3 flex-shrink-0">
							ステップ1
						</div>
						<div class="bg-gray-100 border border-gray-300 rounded p-3 flex-1">
							<p class="text-xs">• いきいきプロフィール全体図で、個人と職場のいきいきさを確認</p>
						</div>
					</div>
					<div class="flex items-start mb-3">
						<div class="bg-blue-600 text-white px-3 py-1 text-xs font-bold mr-3 flex-shrink-0">
							ステップ2
						</div>
						<div class="bg-gray-100 border border-gray-300 rounded p-3 flex-1">
							<p class="text-xs">• 仕事の負担と資源のレーダーチャートで注目すべき対策領域を確認</p>
						</div>
					</div>
					<div class="flex items-start mb-3">
						<div class="bg-blue-600 text-white px-3 py-1 text-xs font-bold mr-3 flex-shrink-0">
							ステップ3
						</div>
						<div class="bg-gray-100 border border-gray-300 rounded p-3 flex-1">
							<p class="text-xs">• 仕事の負担と資源のプロフィールで注目すべく個別の要素を確認</p>
						</div>
					</div>
					<div class="flex items-start">
						<div class="bg-blue-600 text-white px-3 py-1 text-xs font-bold mr-3 flex-shrink-0">
							ステップ4
						</div>
						<div class="bg-gray-100 border border-gray-300 rounded p-3 flex-1">
							<p class="text-xs">• 強みをのばすか、弱みを補強する改善方策を考える</p>
						</div>
					</div>
				</div>

				<h3 class="text-sm font-bold mt-6 mb-2">結果から改善へ</h3>
				<p>
					職場環境改善へのヒントを職場の現状の強みや弱み(問題点)を把握したら、健康いきいき職場の推進のために、強みをのばしたり、あるいは問題点を補強する対策を考えます。
				</p>
				<p>
					対策を考える上では、職場環境要因へのアプローチとスタイルを意識した工夫が必要です。職場の役割分担や検討過程を通して指定する手順を考えることができます。従業員や管理者対象職場環境改善検討会の開催は、アイデア出しやスケジュール等の実施に関する検討に有効です。
				</p>
				<p>
					経営者や人事労務部の立場では、全社や事業場レベルで、経営層と従業員とのコミュニケーション、人事管理方針、行動指針、人事評価制度、人材育成方針を検討することなども考えられます。
				</p>
				<p>
					職場環境改善を進める上では、この職場環境調査を踏まえ、改善が何かをつきとめた上で、うまくいった場合には職場で共有し、改善がトークな場合には原因を探って工夫を重ねて改善活動を続けることが重要です。つまり日々の実務のなかで、健康いきいき職場づくりのためのよい計画→実行→評価→改善のサイクルがうまくまわると、本当に効果のある対策へとつながり上す。
				</p>

				<div class="border border-gray-400 bg-gray-50 p-3 mt-4 text-xs">
					<p>
						新職業性ストレス簡易調査票は、平成21-23年度厚生労働科学研究補助金(労働安全衛生総合研究事業)「労働者のメンタルヘルス不調の第一次予防の浸透手法に関する調査研究」(H21-労働-一般-003)の研究成果です。
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- ページ3: いきいきプロフィール全体図 -->
	<div class="max-w-4xl mx-auto p-8 page-break">
		<h3 class="text-center text-sm mb-2">新職業性ストレス簡易調査票　部署別フィードバック(3/10)</h3>

		<div class="border border-gray-400 inline-block px-4 py-2 mb-4">
			<h2 class="text-lg font-bold">1. いきいきプロフィール全体図</h2>
		</div>

		<div class="mb-4 text-sm">
			<p>部署名　{deptName}</p>
			<p>回答者数　{deptAvg.userCount}人</p>
		</div>

		<!-- 散布図 -->
		<div class="mb-8">
			<h3 class="text-md font-bold mb-4 text-center">いきいき度分布図</h3>
			{#if ikiikiScatterData}
				<ScatterPlot
					datasets={ikiikiScatterData.datasets}
					title=""
					xLabel="職場のいきいき（職場の一体感）"
					yLabel="個人と仕事のいきいき（ワーク・エンゲイジメント）"
				/>
			{/if}
		</div>

		<!-- 4つの資源レベルと負担を項目リスト付きで表示 -->
		<div class="relative">
			<div class="grid grid-cols-3 gap-4">
				<!-- 左側：仕事の負担合計 -->
				<div class="border-2 border-gray-300 rounded-lg p-3 bg-gray-50">
					<h4 class="text-xs font-bold mb-2">仕事の負担合計</h4>
					<ul class="text-[10px] space-y-1">
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

				<!-- 中央：レーダーチャート -->
				<div class="row-span-2">
					{#if radarChartData}
						<RadarChart
							labels={['作業レベル資源\n合計', '部署レベル資源\n合計', '事業場レベル\n資源合計', '仕事の負担合計']}
							datasets={[
								{
									label: '全国平均',
									data: [2.89, 2.73, 2.59, 2.60],
									borderColor: 'rgb(76, 175, 80)',
									backgroundColor: 'rgba(76, 175, 80, 0.2)'
								},
								...(radarChartData.workload.org
									? [
											{
												label: '事業場平均',
												data: [
													orgAvg?.totalTaskLevelResources || 0,
													orgAvg?.totalDepartmentLevelResources || 0,
													orgAvg?.totalOrganizationLevelResources || 0,
													orgAvg?.totalWorkload || 0
												],
												borderColor: 'rgb(244, 67, 54)',
												backgroundColor: 'rgba(244, 67, 54, 0.2)'
											}
										]
									: []),
								{
									label: '当該職場',
									data: [
										deptAvg.averageScores.totalTaskLevelResources,
										deptAvg.averageScores.totalDepartmentLevelResources,
										deptAvg.averageScores.totalOrganizationLevelResources,
										deptAvg.averageScores.totalWorkload
									],
									borderColor: 'rgb(33, 150, 243)',
									backgroundColor: 'rgba(33, 150, 243, 0.2)'
								}
							]}
							title=""
						/>
					{/if}
				</div>

				<!-- 右側：作業レベル資源 -->
				<div class="border-2 border-gray-300 rounded-lg p-3 bg-gray-50">
					<h4 class="text-xs font-bold mb-2">作業レベル資源</h4>
					<ul class="text-[10px] space-y-1">
						<li>仕事のコントロール</li>
						<li>仕事の適性</li>
						<li>技能の活用</li>
						<li>仕事の意義</li>
						<li>役割明確さ</li>
						<li>成長の機会</li>
					</ul>
				</div>

				<!-- 左下：事業場レベル資源 -->
				<div class="border-2 border-gray-300 rounded-lg p-3 bg-gray-50">
					<h4 class="text-xs font-bold mb-2">事業場レベル資源合計</h4>
					<ul class="text-[10px] space-y-1">
						<li>経営層との信頼関係</li>
						<li>変化への対応</li>
						<li>個人の尊重</li>
						<li>公正な人事評価</li>
						<li>多様な労働者への対応</li>
						<li>キャリア形成</li>
						<li>ワーク・セルフ・バランス（ポジティブ）</li>
					</ul>
				</div>

				<!-- 右下：部署レベル資源 -->
				<div class="border-2 border-gray-300 rounded-lg p-3 bg-gray-50">
					<h4 class="text-xs font-bold mb-2">部署レベル資源合計</h4>
					<ul class="text-[10px] space-y-1">
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

		<div class="mt-4 text-xs text-gray-600">
			<p>◆事業場平均：対象となった事業場全体の平均</p>
			<p>◆得点は最高4点、最低1点になるよう変換されており、高い方が良好な状態を示す</p>
		</div>
	</div>

	<!-- ページ4: 仕事の負担プロフィール -->
	<div class="max-w-4xl mx-auto p-8 page-break">
		<h3 class="text-center text-sm mb-4">新職業性ストレス簡易調査票　部署別フィードバック(4/10)</h3>

		<div class="border border-gray-400 inline-block px-4 py-2 mb-6">
			<h2 class="text-lg font-bold">2. 仕事の負担プロフィール</h2>
		</div>

		<div class="space-y-6">
			<SmallBarChart
				label="仕事の量的負担"
				description="仕事の量が多いことや時間内に仕事をしきれないことによる業務負担"
				currentValue={deptAvg.averageScores.quantitativeLoad}
				orgValue={orgAvg?.quantitativeLoad}
				nationalValue={2.14}
			/>

			<SmallBarChart
				label="仕事の質的負担"
				description="仕事で必要な注意集中の負担や緊張、技術的な負担度負の高さなど質的な負担"
				currentValue={deptAvg.averageScores.qualitativeLoad}
				orgValue={orgAvg?.qualitativeLoad}
				nationalValue={2.16}
			/>

			<SmallBarChart
				label="身体的負担度"
				description="仕事でからだを動かす必要がある身体的な負担"
				currentValue={deptAvg.averageScores.physicalLoad}
				orgValue={orgAvg?.physicalLoad}
				nationalValue={2.49}
			/>

			<SmallBarChart
				label="職場での対人関係"
				description="部署内での意見の相違、あるいは部署間の意見の対立などの対人関係に関する負担"
				currentValue={deptAvg.averageScores.interpersonalRelations}
				orgValue={orgAvg?.interpersonalRelations}
				nationalValue={2.88}
			/>

			<SmallBarChart
				label="職場環境"
				description="騒音、照明、湿度、換気などの物理的な職場環境の問題による負担"
				currentValue={deptAvg.averageScores.workplaceEnvironment}
				orgValue={orgAvg?.workplaceEnvironment}
				nationalValue={2.78}
			/>

			<SmallBarChart
				label="情緒的負担"
				description="仕事の上で気持ちや感情かき乱されるなど、感情面での負担"
				currentValue={deptAvg.averageScores.emotionalLoad}
				orgValue={orgAvg?.emotionalLoad}
				nationalValue={2.66}
			/>

			<SmallBarChart
				label="役割葛藤"
				description="方針や要求が互いに相反されないために生じる困難などが原因による負担"
				currentValue={deptAvg.averageScores.roleConflict}
				orgValue={orgAvg?.roleConflict}
				nationalValue={2.87}
			/>

			<SmallBarChart
				label="ワーク・セルフ・バランス（ネガティブ）"
				description="仕事が、個人生活に対して好ましくない影響を及ぼしていること"
				currentValue={deptAvg.averageScores.workSelfBalanceNegative}
				orgValue={orgAvg?.workSelfBalanceNegative}
				nationalValue={2.83}
			/>
		</div>

		<div class="mt-6 text-xs text-gray-600 border-t pt-4">
			<p>◆事業場平均：対象となった事業場全体の平均</p>
			<p>
				◆得点は最高4点、最低1点になるよう変換されており、高い方が良好な状態を示す（仕事の負担は高いほど負担大）
			</p>
		</div>
	</div>

	<!-- ページ5: 作業レベル資源プロフィール -->
	<div class="max-w-4xl mx-auto p-8 page-break">
		<div class="text-right text-sm text-gray-600 mb-4">5/10</div>
		<div class="border border-gray-400 p-1 mb-6 inline-block">
			<h2 class="text-lg font-bold px-4 py-2">3. 仕事の資源（作業レベル）プロフィール</h2>
		</div>

		<div class="space-y-6">
			<SmallBarChart
				label="仕事のコントロール"
				description="自分で仕事の順番・やり方を決めることができる程度"
				currentValue={deptAvg.averageScores.jobControl}
				orgValue={orgAvg?.jobControl}
				nationalValue={2.53}
			/>

			<SmallBarChart
				label="仕事の適性"
				description="自分の技能や知識を仕事で使うことができる程度"
				currentValue={deptAvg.averageScores.jobFitness}
				orgValue={orgAvg?.jobFitness}
				nationalValue={2.92}
			/>

			<SmallBarChart
				label="技能の活用"
				description="自分の技能を活用し、様々なことができる程度"
				currentValue={deptAvg.averageScores.skillUtilization}
				orgValue={orgAvg?.skillUtilization}
				nationalValue={3.0}
			/>

			<SmallBarChart
				label="仕事の意義"
				description="仕事に意義や重要性を感じる程度"
				currentValue={deptAvg.averageScores.jobSignificance}
				orgValue={orgAvg?.jobSignificance}
				nationalValue={2.87}
			/>

			<SmallBarChart
				label="役割明確さ"
				description="職場で自分が何を期待されているかわかる程度"
				currentValue={deptAvg.averageScores.roleClarification}
				orgValue={orgAvg?.roleClarification}
				nationalValue={3.41}
			/>

			<SmallBarChart
				label="成長の機会"
				description="仕事を通して成長できる機会がある程度"
				currentValue={deptAvg.averageScores.growthOpportunity}
				orgValue={orgAvg?.growthOpportunity}
				nationalValue={2.62}
			/>
		</div>

		<div class="mt-6 text-xs text-gray-600 border-t pt-4">
			<p>◆事業場平均：対象となった事業場全体の平均</p>
			<p>◆得点は最高4点、最低1点になるよう変換されており、高い方が良好な状態を示す</p>
		</div>
	</div>

	<!-- ページ6: 部署レベル資源プロフィール -->
	<div class="max-w-4xl mx-auto p-8 page-break">
		<div class="text-right text-sm text-gray-600 mb-4">6/10</div>
		<div class="border border-gray-400 p-1 mb-6 inline-block">
			<h2 class="text-lg font-bold px-4 py-2">4. 仕事の資源（部署レベル）プロフィール</h2>
		</div>

		<div class="space-y-6">
			<SmallBarChart
				label="上司のサポート"
				description="上司はどのくらい気軽に話ができ、頼りになるか"
				currentValue={deptAvg.averageScores.supervisorSupport}
				orgValue={orgAvg?.supervisorSupport}
				nationalValue={2.87}
			/>

			<SmallBarChart
				label="同僚のサポート"
				description="職場の同僚はどのくらい気軽に話ができ、頼りになるか"
				currentValue={deptAvg.averageScores.colleagueSupport}
				orgValue={orgAvg?.colleagueSupport}
				nationalValue={2.96}
			/>

			<SmallBarChart
				label="家族友人のサポート"
				description="家族や友人はどのくらい気軽に話ができ、頼りになるか"
				currentValue={deptAvg.averageScores.familySupport}
				orgValue={orgAvg?.familySupport}
				nationalValue={3.19}
			/>

			<SmallBarChart
				label="経済・地位報酬"
				description="仕事の内容や責任に見合った給料や昇進の機会"
				currentValue={deptAvg.averageScores.economicReward}
				orgValue={orgAvg?.economicReward}
				nationalValue={2.28}
			/>

			<SmallBarChart
				label="尊重報酬"
				description="職場の同僚や上司から適切に評価される程度"
				currentValue={deptAvg.averageScores.respectReward}
				orgValue={orgAvg?.respectReward}
				nationalValue={2.64}
			/>

			<SmallBarChart
				label="安定報酬"
				description="今の仕事を続けられるか、あるいは職を失う心配の程度"
				currentValue={deptAvg.averageScores.stabilityReward}
				orgValue={orgAvg?.stabilityReward}
				nationalValue={2.73}
			/>

			<SmallBarChart
				label="上司のリーダーシップ"
				description="上司が部下をうまくまとめているか"
				currentValue={deptAvg.averageScores.supervisorLeadership}
				orgValue={orgAvg?.supervisorLeadership}
				nationalValue={2.73}
			/>

			<SmallBarChart
				label="上司の公正な態度"
				description="上司が一貫した態度をとっているか"
				currentValue={deptAvg.averageScores.supervisorFairness}
				orgValue={orgAvg?.supervisorFairness}
				nationalValue={2.68}
			/>

			<SmallBarChart
				label="ほめてもらえる職場"
				description="職場でよい点を認められたり、感謝されたりする程度"
				currentValue={deptAvg.averageScores.praisableWorkplace}
				orgValue={orgAvg?.praisableWorkplace}
				nationalValue={2.57}
			/>

			<SmallBarChart
				label="失敗を認める職場"
				description="職場で失敗しても挽回するチャンスがある程度"
				currentValue={deptAvg.averageScores.failureAcceptance}
				orgValue={orgAvg?.failureAcceptance}
				nationalValue={2.64}
			/>
		</div>

		<div class="mt-6 text-xs text-gray-600 border-t pt-4">
			<p>◆事業場平均：対象となった事業場全体の平均</p>
			<p>◆得点は最高4点、最低1点になるよう変換されており、高い方が良好な状態を示す</p>
		</div>
	</div>

	<!-- ページ7: 事業場レベル資源プロフィール -->
	<div class="max-w-4xl mx-auto p-8 page-break">
		<div class="text-right text-sm text-gray-600 mb-4">7/10</div>
		<div class="border border-gray-400 p-1 mb-6 inline-block">
			<h2 class="text-lg font-bold px-4 py-2">5. 仕事の資源（事業場レベル）プロフィール</h2>
		</div>

		<div class="space-y-6">
			<SmallBarChart
				label="経営層との信頼関係"
				description="経営層と従業員との間に信頼関係がある程度"
				currentValue={deptAvg.averageScores.managementTrust}
				orgValue={orgAvg?.managementTrust}
				nationalValue={2.53}
			/>

			<SmallBarChart
				label="変化への対応"
				description="職場で変化があっても対応できるよう情報を受け取れる程度"
				currentValue={deptAvg.averageScores.changeAdaptation}
				orgValue={orgAvg?.changeAdaptation}
				nationalValue={2.68}
			/>

			<SmallBarChart
				label="個人の尊重"
				description="一人ひとりの価値観を大事にしてくれる程度"
				currentValue={deptAvg.averageScores.individualRespect}
				orgValue={orgAvg?.individualRespect}
				nationalValue={2.79}
			/>

			<SmallBarChart
				label="公正な人事評価"
				description="公正に人事評価が行われている程度"
				currentValue={deptAvg.averageScores.fairEvaluation}
				orgValue={orgAvg?.fairEvaluation}
				nationalValue={2.48}
			/>

			<SmallBarChart
				label="多様な労働者への対応"
				description="様々な労働者が安心して働ける職場環境が整っている程度"
				currentValue={deptAvg.averageScores.diversitySupport}
				orgValue={orgAvg?.diversitySupport}
				nationalValue={2.79}
			/>

			<SmallBarChart
				label="キャリア形成"
				description="自分のキャリアプランに合った能力開発ができる程度"
				currentValue={deptAvg.averageScores.careerDevelopment}
				orgValue={orgAvg?.careerDevelopment}
				nationalValue={2.42}
			/>

			<SmallBarChart
				label="ワーク・セルフ・バランス（ポジティブ）"
				description="仕事が個人生活を豊かにする程度"
				currentValue={deptAvg.averageScores.workSelfBalancePositive}
				orgValue={orgAvg?.workSelfBalancePositive}
				nationalValue={2.41}
			/>
		</div>

		<div class="mt-6 text-xs text-gray-600 border-t pt-4">
			<p>◆事業場平均：対象となった事業場全体の平均</p>
			<p>◆得点は最高4点、最低1点になるよう変換されており、高い方が良好な状態を示す</p>
		</div>
	</div>

	<!-- ページ8: 健康および満足度プロフィール -->
	<div class="max-w-4xl mx-auto p-8 page-break">
		<div class="text-right text-sm text-gray-600 mb-4">8/10</div>
		<div class="border border-gray-400 p-1 mb-6 inline-block">
			<h2 class="text-lg font-bold px-4 py-2">6. 健康および満足度プロフィール</h2>
		</div>

		<div class="space-y-6">
			<SmallBarChart
				label="ワーク・エンゲイジメント"
				description="仕事に誇りとやりがいを感じ、熱心に取り組み、仕事から活力を得て活き活きしている度合い"
				currentValue={deptAvg.averageScores.workEngagement}
				orgValue={orgAvg?.workEngagement}
				nationalValue={2.52}
			/>

			<SmallBarChart
				label="職場の一体感"
				description="職場の人々が互いに理解・信頼し合い、一体感を感じられる度合い"
				currentValue={deptAvg.averageScores.workplaceUnity}
				orgValue={orgAvg?.workplaceUnity}
				nationalValue={2.66}
			/>

			<SmallBarChart
				label="活気"
				description="活力に満ち、元気な度合い"
				currentValue={deptAvg.averageScores.vigor}
				orgValue={orgAvg?.vigor}
				nationalValue={2.45}
			/>

			<SmallBarChart
				label="イライラ感"
				description="怒りっぽく、イライラしている度合い（低い方が良好）"
				currentValue={deptAvg.averageScores.irritation}
				orgValue={orgAvg?.irritation}
				nationalValue={2.03}
			/>

			<SmallBarChart
				label="疲労感"
				description="疲れている度合い（低い方が良好）"
				currentValue={deptAvg.averageScores.fatigue}
				orgValue={orgAvg?.fatigue}
				nationalValue={2.31}
			/>

			<SmallBarChart
				label="不安感"
				description="不安な度合い（低い方が良好）"
				currentValue={deptAvg.averageScores.anxiety}
				orgValue={orgAvg?.anxiety}
				nationalValue={2.07}
			/>

			<SmallBarChart
				label="抑うつ感"
				description="憂鬱で気が重い度合い（低い方が良好）"
				currentValue={deptAvg.averageScores.depression}
				orgValue={orgAvg?.depression}
				nationalValue={2.08}
			/>

			<SmallBarChart
				label="心理的ストレス反応"
				description="心理的なストレスの度合い（低い方が良好）"
				currentValue={deptAvg.averageScores.psychologicalStress}
				orgValue={orgAvg?.psychologicalStress}
				nationalValue={2.12}
			/>

			<SmallBarChart
				label="身体愁訴"
				description="身体の不調の度合い（低い方が良好）"
				currentValue={deptAvg.averageScores.physicalComplaints}
				orgValue={orgAvg?.physicalComplaints}
				nationalValue={1.91}
			/>

			<SmallBarChart
				label="仕事満足度"
				description="仕事に対する満足度"
				currentValue={deptAvg.averageScores.jobSatisfaction}
				orgValue={orgAvg?.jobSatisfaction}
				nationalValue={2.68}
			/>
		</div>

		<div class="mt-6 text-xs text-gray-600 border-t pt-4">
			<p>◆事業場平均：対象となった事業場全体の平均</p>
			<p>◆得点は最高4点、最低1点になるよう変換されており、高い方が良好な状態を示す</p>
		</div>
	</div>

	<!-- ページ9: 判定基準基礎データ（全国平均） -->
	<div class="max-w-4xl mx-auto p-8 page-break">
		<div class="text-right text-sm text-gray-600 mb-4">9/10</div>
		<h2 class="text-xl font-bold text-center mb-6">判定基準基礎データ（全国平均）</h2>

		<div class="overflow-x-auto">
			<table class="min-w-full border-collapse border border-gray-400 text-sm">
				<thead>
					<tr class="bg-gray-100">
						<th class="border border-gray-400 px-3 py-2 text-left">変数グループ</th>
						<th class="border border-gray-400 px-3 py-2 text-left">変数</th>
						<th class="border border-gray-400 px-3 py-2 text-center">全国平均<br />(N≒1620)</th>
						<th class="border border-gray-400 px-3 py-2 text-center"
							>全国平均<br />（標準偏差）</th
						>
					</tr>
				</thead>
				<tbody class="text-xs">
					<tr
						><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="9">仕事の負担</td
						><td class="border border-gray-400 px-3 py-2">仕事の量的負担</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.14</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.70</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">仕事の質的負担</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.16</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.63</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">身体的負担度</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.49</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.83</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">職場での対人関係</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.88</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.67</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">職場環境</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.78</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.72</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">情緒的負担</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.66</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.82</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">役割葛藤</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.87</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.73</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">ワーク・セルフ・バランス（ネガティブ）</td
						><td class="border border-gray-400 px-3 py-2 text-center">2.83</td><td
							class="border border-gray-400 px-3 py-2 text-center">0.79</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2 bg-yellow-200 font-bold"
							>★仕事の負担合計★</td
						><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold"
							>2.60</td
						><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold"
							>0.52</td
						></tr
					>

					<tr
						><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="7"
							>仕事の資源（作業レベル）</td
						><td class="border border-gray-400 px-3 py-2">仕事のコントロール</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.53</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.64</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">仕事の適性</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.92</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.61</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">技能の活用</td><td
							class="border border-gray-400 px-3 py-2 text-center">3.00</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.59</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">仕事の意義</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.87</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.67</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">役割明確さ</td><td
							class="border border-gray-400 px-3 py-2 text-center">3.41</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.54</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">成長の機会</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.62</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.67</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2 bg-yellow-200 font-bold"
							>★仕事の資源（作業レベル）合計★</td
						><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold"
							>2.89</td
						><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold"
							>0.48</td
						></tr
					>

					<tr
						><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="11"
							>仕事の資源（部署レベル）</td
						><td class="border border-gray-400 px-3 py-2">上司のサポート</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.87</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.77</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">同僚のサポート</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.96</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.66</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">家族友人のサポート</td><td
							class="border border-gray-400 px-3 py-2 text-center">3.19</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.68</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">経済・地位報酬</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.28</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.70</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">尊重報酬</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.64</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.72</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">安定報酬</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.73</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.78</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">上司のリーダーシップ</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.73</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.82</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">上司の公正な態度</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.68</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.82</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">ほめてもらえる職場</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.57</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.74</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">失敗を認める職場</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.64</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.72</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2 bg-yellow-200 font-bold"
							>★仕事の資源（部署レベル）合計★</td
						><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold"
							>2.73</td
						><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold"
							>0.56</td
						></tr
					>

					<tr
						><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="8"
							>仕事の資源（事業場レベル）</td
						><td class="border border-gray-400 px-3 py-2">経営層との信頼関係</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.53</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.77</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">変化への対応</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.68</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.71</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">個人の尊重</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.79</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.72</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">公正な人事評価</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.48</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.76</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">多様な労働者への対応</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.79</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.72</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">キャリア形成</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.42</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.73</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">ワーク・セルフ・バランス（ポジティブ）</td
						><td class="border border-gray-400 px-3 py-2 text-center">2.41</td><td
							class="border border-gray-400 px-3 py-2 text-center">0.73</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2 bg-yellow-200 font-bold"
							>★仕事の資源（事業場レベル）合計★</td
						><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold"
							>2.59</td
						><td class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold"
							>0.59</td
						></tr
					>

					<tr
						><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="2"
							>いきいきアウトカム</td
						><td class="border border-gray-400 px-3 py-2">ワーク・エンゲイジメント</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.52</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.71</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2 bg-green-100">職場の一体感</td><td
							class="border border-gray-400 px-3 py-2 text-center bg-green-100">2.66</td
						><td class="border border-gray-400 px-3 py-2 text-center bg-green-100">0.76</td></tr
					>

					<tr
						><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="7"
							>心身の健康</td
						><td class="border border-gray-400 px-3 py-2">活気</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.45</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.69</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">イライラ感</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.03</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.71</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">疲労感</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.31</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.78</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">不安感</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.07</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.76</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">抑うつ感</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.08</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.77</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">心理的ストレス反応合計</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.12</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.65</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">身体愁訴</td><td
							class="border border-gray-400 px-3 py-2 text-center">1.91</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.66</td></tr
					>

					<tr
						><td class="border border-gray-400 px-3 py-2 font-semibold">職場のハラスメント</td
						><td class="border border-gray-400 px-3 py-2">職場のハラスメント</td><td
							class="border border-gray-400 px-3 py-2 text-center">1.43</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.62</td></tr
					>

					<tr
						><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="2">満足度</td
						><td class="border border-gray-400 px-3 py-2">仕事満足度</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.68</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.79</td></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">家庭満足度</td><td
							class="border border-gray-400 px-3 py-2 text-center">2.94</td
						><td class="border border-gray-400 px-3 py-2 text-center">0.82</td></tr
					>
				</tbody>
			</table>
		</div>
	</div>

	<!-- ページ10: 調査データ（この部署のデータ） -->
	<div class="max-w-4xl mx-auto p-8">
		<div class="text-right text-sm text-gray-600 mb-4">10/10</div>
		<h2 class="text-xl font-bold text-center mb-6">調査データ（{deptName}）</h2>

		<div class="overflow-x-auto">
			<table class="min-w-full border-collapse border border-gray-400 text-sm">
				<thead>
					<tr class="bg-gray-100">
						<th class="border border-gray-400 px-3 py-2 text-left">変数グループ</th>
						<th class="border border-gray-400 px-3 py-2 text-left">変数</th>
						<th class="border border-gray-400 px-3 py-2 text-left">部署名</th>
						<th class="border border-gray-400 px-3 py-2"></th>
						<th class="border border-gray-400 px-3 py-2 text-center">{deptName}</th>
					</tr>
					<tr class="bg-gray-100">
						<th class="border border-gray-400 px-3 py-2 text-left"></th>
						<th class="border border-gray-400 px-3 py-2 text-left"></th>
						<th class="border border-gray-400 px-3 py-2 text-left">回答者数</th>
						<th class="border border-gray-400 px-3 py-2"></th>
						<th class="border border-gray-400 px-3 py-2 text-center">{deptAvg.userCount}</th>
					</tr>
				</thead>
				<tbody class="text-xs">
					<tr
						><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="9"
							>仕事の負担</td
						><td class="border border-gray-400 px-3 py-2">仕事の量的負担</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.quantitativeLoad.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">仕事の質的負担</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.qualitativeLoad.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">身体的負担度</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.physicalLoad.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">職場での対人関係</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.interpersonalRelations.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">職場環境</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.workplaceEnvironment.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">情緒的負担</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.emotionalLoad.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">役割葛藤</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.roleConflict.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">ワーク・セルフ・バランス（ネガティブ）</td
						><td class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.workSelfBalanceNegative.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2 bg-yellow-200 font-bold"
							>★仕事の負担合計★</td
						><td
							class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold"
							>{deptAvg.averageScores.totalWorkload.toFixed(2)}</td
						></tr
					>

					<tr
						><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="7"
							>仕事の資源（作業レベル）</td
						><td class="border border-gray-400 px-3 py-2">仕事のコントロール</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.jobControl.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">仕事の適性</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.jobFitness.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">技能の活用</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.skillUtilization.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">仕事の意義</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.jobSignificance.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">役割明確さ</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.roleClarification.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">成長の機会</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.growthOpportunity.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2 bg-yellow-200 font-bold"
							>★仕事の資源（作業レベル）合計★</td
						><td
							class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold"
							>{deptAvg.averageScores.totalTaskLevelResources.toFixed(2)}</td
						></tr
					>

					<tr
						><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="11"
							>仕事の資源（部署レベル）</td
						><td class="border border-gray-400 px-3 py-2">上司のサポート</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.supervisorSupport.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">同僚のサポート</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.colleagueSupport.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">家族友人のサポート</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.familySupport.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">経済・地位報酬</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.economicReward.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">尊重報酬</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.respectReward.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">安定報酬</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.stabilityReward.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">上司のリーダーシップ</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.supervisorLeadership.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">上司の公正な態度</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.supervisorFairness.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">ほめてもらえる職場</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.praisableWorkplace.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">失敗を認める職場</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.failureAcceptance.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2 bg-yellow-200 font-bold"
							>★仕事の資源（部署レベル）合計★</td
						><td
							class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold"
							>{deptAvg.averageScores.totalDepartmentLevelResources.toFixed(2)}</td
						></tr
					>

					<tr
						><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="8"
							>仕事の資源（事業場レベル）</td
						><td class="border border-gray-400 px-3 py-2">経営層との信頼関係</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.managementTrust.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">変化への対応</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.changeAdaptation.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">個人の尊重</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.individualRespect.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">公正な人事評価</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.fairEvaluation.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">多様な労働者への対応</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.diversitySupport.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">キャリア形成</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.careerDevelopment.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">ワーク・セルフ・バランス（ポジティブ）</td
						><td class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.workSelfBalancePositive.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2 bg-yellow-200 font-bold"
							>★仕事の資源（事業場レベル）合計★</td
						><td
							class="border border-gray-400 px-3 py-2 text-center bg-yellow-200 font-bold"
							>{deptAvg.averageScores.totalOrganizationLevelResources.toFixed(2)}</td
						></tr
					>

					<tr
						><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="2"
							>いきいきアウトカム</td
						><td class="border border-gray-400 px-3 py-2">ワーク・エンゲイジメント</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.workEngagement.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2 bg-green-100">職場の一体感</td><td
							class="border border-gray-400 px-3 py-2 text-center bg-green-100"
							>{deptAvg.averageScores.workplaceUnity.toFixed(2)}</td
						></tr
					>

					<tr
						><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="7"
							>心身の健康</td
						><td class="border border-gray-400 px-3 py-2">活気</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.vigor.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">イライラ感</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.irritation.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">疲労感</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.fatigue.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">不安感</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.anxiety.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">抑うつ感</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.depression.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">心理的ストレス反応合計</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.psychologicalStress.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">身体愁訴</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.physicalComplaints.toFixed(2)}</td
						></tr
					>

					<tr
						><td class="border border-gray-400 px-3 py-2 font-semibold">職場のハラスメント</td
						><td class="border border-gray-400 px-3 py-2">職場のハラスメント</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.harassment.toFixed(2)}</td
						></tr
					>

					<tr
						><td class="border border-gray-400 px-3 py-2 font-semibold" rowspan="2">満足度</td
						><td class="border border-gray-400 px-3 py-2">仕事満足度</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.jobSatisfaction.toFixed(2)}</td
						></tr
					>
					<tr
						><td class="border border-gray-400 px-3 py-2">家庭満足度</td><td
							class="border border-gray-400 px-3 py-2 text-center"
							>{deptAvg.averageScores.familySatisfaction.toFixed(2)}</td
						></tr
					>
				</tbody>
			</table>
		</div>
	</div>
{/if}
