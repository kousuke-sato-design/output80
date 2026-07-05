<script lang="ts">
	import type { ScoreData } from '$lib/types';
	import VitalityScatter from './VitalityScatter.svelte';
	import VitalityRadar from './VitalityRadar.svelte';
	import { nationalOf } from '$lib/utils/orgMatrix';

	export let overallAverage: ScoreData | null;

	const v = (s: ScoreData | null, f: keyof ScoreData): number => (s ? (s[f] as number) : NaN);
	const nat = (f: keyof ScoreData): number => {
		const n = nationalOf(f);
		return n ? n.average : NaN;
	};

	// いきいき度分布図: X=職場の一体感, Y=ワーク・エンゲイジメント
	$: scatterPoints = [
		{ label: '当組織', x: v(overallAverage, 'workplaceUnity'), y: v(overallAverage, 'workEngagement'), color: '#2563eb', style: 'circle' as const },
		{ label: '全国平均', x: nat('workplaceUnity'), y: nat('workEngagement'), color: '#f59e0b', style: 'rectRot' as const }
	];

	// 4領域レーダー
	const radarLabels = ['作業レベル資源', '部署レベル資源', '事業場レベル資源', '仕事の負担'];
	const radarFields: (keyof ScoreData)[] = [
		'totalTaskLevelResources',
		'totalDepartmentLevelResources',
		'totalOrganizationLevelResources',
		'totalWorkload'
	];
	$: radarOrg = radarFields.map((f) => v(overallAverage, f));
	$: radarNat = radarFields.map((f) => nat(f));
</script>

<section data-pdf-block class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden break-inside-avoid">
	<div class="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
		<p class="text-[11px] font-semibold tracking-widest text-emerald-700/80 uppercase">Vitality Profile</p>
		<h4 class="text-lg font-bold text-gray-900">いきいきプロフィール全体図</h4>
		<p class="text-sm text-gray-500">当組織の活力と職場資源を、全国平均と並べて俯瞰します。</p>
	</div>

	<!-- 「いきいき」とは何か（公式FBサンプル「はじめに」準拠） -->
	<div class="mx-5 mt-4 rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
		<h5 class="text-sm font-bold text-emerald-900 mb-1.5">「いきいき」とは？</h5>
		<p class="text-sm text-gray-700 leading-relaxed">
			この調査では、健康の保持・増進に加えて<b>従業員のいきいき（個人の活力）</b>と<b>職場のいきいき（職場の一体感）</b>を高める
			「健康いきいき職場」づくりを目標にしています。
			<b class="text-emerald-800">個人のいきいき＝ワーク・エンゲイジメント</b>（仕事から活力を得て、仕事に誇りを感じている状態）、
			<b class="text-emerald-800">職場のいきいき＝職場の一体感</b>（お互いに理解し認め合い、助け合って業務を遂行している状態）で測ります。
		</p>
	</div>

	<div class="grid md:grid-cols-2 gap-6 p-5 print:grid-cols-1">
		<!-- 散布図 -->
		<figure class="m-0">
			<figcaption class="flex items-baseline justify-between mb-1">
				<span class="text-sm font-semibold text-gray-800">いきいき度分布図</span>
				<span class="text-xs text-gray-400">右上ほど活力が高い</span>
			</figcaption>
			<div class="rounded-lg border border-gray-100 p-2 bg-white print:max-w-md print:mx-auto">
				<VitalityScatter
					points={scatterPoints}
					xLabel="職場のいきいき（職場の一体感）"
					yLabel="個人のいきいき（ワーク・エンゲイジメント）"
				/>
			</div>
			<figcaption class="text-sm text-gray-600 leading-relaxed mt-2">
				<b>見方：</b>縦軸＝個人のいきいき、横軸＝職場のいきいき。<b class="text-primary-700">●が当組織</b>、◆が全国平均です。
				<b>右上にあるほど個人も職場もいきいきした状態</b>。全国平均より左下にある場合は、活性化の余地があります。
			</figcaption>
		</figure>

		<!-- レーダー -->
		<figure class="m-0">
			<figcaption class="flex items-baseline justify-between mb-1">
				<span class="text-sm font-semibold text-gray-800">4領域バランス</span>
				<span class="text-xs text-gray-400">外側ほど良好（負担は軽い）</span>
			</figcaption>
			<div class="rounded-lg border border-gray-100 p-2 bg-white print:max-w-md print:mx-auto">
				<VitalityRadar labels={radarLabels} orgData={radarOrg} nationalData={radarNat} />
			</div>
			<figcaption class="text-sm text-gray-600 leading-relaxed mt-2">
				<b>見方：</b>4つの頂点は対策領域別の合計点（構成尺度の平均）。<b>外側に広がっているほど良好</b>です
				（「仕事の負担」は負担の少なさを表します）。全国平均の線より内側にへこんでいる領域が、注目すべき対策領域です。
			</figcaption>
		</figure>
	</div>

	<!-- 健康いきいき職場モデル（負担・資源とアウトカムの関係） -->
	<div class="mx-5 mb-5 rounded-lg border border-gray-200 bg-gray-50/60 p-4">
		<h5 class="text-sm font-bold text-gray-800 mb-2">「健康いきいき職場」モデル — この調査が測っているもの</h5>
		<div class="flex flex-wrap items-stretch gap-2 text-sm">
			<div class="flex-1 min-w-[13rem] rounded-lg bg-yellow-50 border border-yellow-300 p-3">
				<p class="font-bold text-yellow-900 mb-1">仕事の負担</p>
				<p class="text-xs text-gray-600 leading-relaxed">量的・質的・身体的負担、対人関係、職場環境、情緒的負担、役割葛藤など</p>
			</div>
			<div class="flex-1 min-w-[13rem] rounded-lg bg-sky-50 border border-sky-300 p-3">
				<p class="font-bold text-sky-900 mb-1">仕事の資源（作業・部署・事業場）</p>
				<p class="text-xs text-gray-600 leading-relaxed">コントロール、上司・同僚の支援、報酬、経営層との信頼関係、人事評価など</p>
			</div>
			<div class="flex items-center text-2xl text-gray-400 px-1">→</div>
			<div class="flex-1 min-w-[13rem] rounded-lg bg-orange-50 border border-orange-300 p-3">
				<p class="font-bold text-orange-900 mb-1">アウトカム（成果）</p>
				<p class="text-xs text-gray-600 leading-relaxed">心身の健康／従業員のいきいき（ワーク・エンゲイジメント）／職場の一体感／ハラスメントのない職場</p>
			</div>
			<div class="flex items-center text-2xl text-gray-400 px-1">→</div>
			<div class="flex-1 min-w-[11rem] rounded-lg bg-emerald-50 border border-emerald-300 p-3">
				<p class="font-bold text-emerald-900 mb-1">期待される成果</p>
				<p class="text-xs text-gray-600 leading-relaxed">生産性・イノベーション、従業員の満足・幸福、社会への貢献</p>
			</div>
		</div>
		<p class="text-xs text-gray-500 mt-2 leading-relaxed">
			仕事の<b>負担</b>は心身の健康に（健康障害／健康増進プロセス）、仕事の<b>資源</b>は個人と組織の活性化に（活性化プロセス）つながります。
			負担を減らすだけでなく<b>資源を増やす</b>ことが、いきいきした職場づくりのポイントです。
		</p>
	</div>
</section>
