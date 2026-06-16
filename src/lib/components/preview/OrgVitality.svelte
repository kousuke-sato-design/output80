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
		</figure>
	</div>
</section>
