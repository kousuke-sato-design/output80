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
	const fmtV = (x: number): string => (Number.isNaN(x) ? '—' : x.toFixed(2));

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
	<div class="mx-5 mt-4 rounded-lg border border-gray-100 bg-gray-50/70 p-4">
		<h5 class="text-sm font-bold text-gray-800 mb-1.5">「いきいき」とは</h5>
		<p class="text-sm text-gray-700 leading-relaxed">
			この調査では、健康の保持・増進に加えて<b>従業員のいきいき（個人の活力）</b>と<b>職場のいきいき（職場の一体感）</b>を高める「健康いきいき職場」づくりを目標にしています。
			<b>個人のいきいき＝ワーク・エンゲイジメント</b>（仕事から活力を得て、仕事に誇りを感じている状態）、
			<b>職場のいきいき＝職場の一体感</b>（お互いに理解し認め合い、助け合って業務を遂行している状態）で測ります。
			仕事の<b>負担</b>は心身の健康に、仕事の<b>資源</b>は個人と組織の活性化につながります。
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
				<b>見方：</b>縦軸＝個人のいきいき、横軸＝職場のいきいき。青が当組織、オレンジが全国平均です。
				<b>右上にあるほど個人も職場もいきいきした状態</b>。全国平均より左下にある場合は、活性化の余地があります。<br />
				当組織：ワーク・エンゲイジメント {fmtV(v(overallAverage, 'workEngagement'))}（全国 {fmtV(nat('workEngagement'))}）／
				職場の一体感 {fmtV(v(overallAverage, 'workplaceUnity'))}（全国 {fmtV(nat('workplaceUnity'))}）
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

</section>
