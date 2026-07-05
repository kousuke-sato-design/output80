<script lang="ts">
	import type { ScoreData } from '$lib/types';
	import { TOTAL_FIELDS, type ScaleField } from '$lib/data/scaleMeta';
	import { orgVsNational, type CellColor } from '$lib/utils/orgMatrix';
	import { SCALE_DESCRIPTIONS } from '$lib/data/scaleDescriptions';
	import OrgVitality from './OrgVitality.svelte';

	export let overallAverage: ScoreData | null;
	export let totalUsers = 0;
	export let deptCount = 0;

	// 公式フィードバック書式（80sample.xls FB書式）の章立て。2〜6章＝5つのプロフィール。
	const SECTIONS: { no: number; title: string; fields: ScaleField[] }[] = [
		{
			no: 2,
			title: '仕事の負担プロフィール',
			fields: [
				'quantitativeLoad', 'qualitativeLoad', 'physicalLoad', 'interpersonalRelations',
				'workplaceEnvironment', 'emotionalLoad', 'roleConflict', 'workSelfBalanceNegative'
			]
		},
		{
			no: 3,
			title: '仕事の資源（作業レベル）プロフィール',
			fields: ['jobControl', 'jobFitness', 'skillUtilization', 'jobSignificance', 'roleClarification', 'growthOpportunity']
		},
		{
			no: 4,
			title: '仕事の資源（部署レベル）プロフィール',
			fields: [
				'supervisorSupport', 'colleagueSupport', 'familySupport', 'economicReward', 'respectReward',
				'stabilityReward', 'supervisorLeadership', 'supervisorFairness', 'praisableWorkplace', 'failureAcceptance'
			]
		},
		{
			no: 5,
			title: '仕事の資源（事業場レベル）プロフィール',
			fields: [
				'managementTrust', 'changeAdaptation', 'individualRespect', 'fairEvaluation',
				'diversitySupport', 'careerDevelopment', 'workSelfBalancePositive'
			]
		},
		{
			no: 6,
			title: '健康および満足度プロフィール',
			fields: [
				'vigor', 'irritation', 'fatigue', 'anxiety', 'depression', 'psychologicalStress',
				'physicalComplaints', 'harassment', 'jobSatisfaction', 'familySatisfaction'
			]
		}
	];

	$: sections = SECTIONS.map((s) => ({ ...s, rows: orgVsNational(overallAverage, s.fields) }));
	$: totals = orgVsNational(overallAverage, TOTAL_FIELDS);

	const colorText: Record<CellColor, string> = {
		good: 'text-green-700',
		bad: 'text-red-700',
		mid: 'text-gray-600',
		na: 'text-gray-400'
	};
	const colorBar: Record<CellColor, string> = {
		good: 'bg-green-500',
		bad: 'bg-red-500',
		mid: 'bg-gray-400',
		na: 'bg-gray-300'
	};

	function fmt(v: number | null): string {
		return v === null ? '—' : v.toFixed(2);
	}
	// ▲▼付きの全国比（白黒印刷でも向きが分かるようにする）
	function fmtDiff(v: number | null): string {
		return v === null ? '—' : v >= 0 ? `▲+${v.toFixed(2)}` : `▼${v.toFixed(2)}`;
	}
	// 1〜4スケールを0-100%に（バーの位置計算用）
	function scalePct(v: number | null): number {
		if (v === null) return 0;
		return Math.max(0, Math.min(100, ((v - 1) / 3) * 100));
	}
</script>

<div class="space-y-5">
	<!-- 1. いきいきプロフィール全体図 -->
	<OrgVitality {overallAverage} />

	<!-- 対策領域別合計（公式FB書式の合計表に対応） -->
	<div data-pdf-block class="bg-white rounded-lg shadow-sm p-4 break-inside-avoid">
		<div class="flex items-baseline justify-between mb-1">
			<h4 class="text-base font-semibold text-gray-900">対策領域別合計（組織全体 vs 全国平均）</h4>
			<span class="text-xs text-gray-500">回答者 {totalUsers}名 / {deptCount}部署</span>
		</div>
		<p class="text-sm text-gray-500 mb-3">上の4領域バランス（レーダー）を数値で示したものです。│＝全国平均。バーが右（緑）に伸びるほど全国より良好、左（赤）に伸びるほど要改善です。</p>
		<div class="space-y-2.5">
			{#each totals as t}
				<div class="flex items-center gap-3 text-sm">
					<span class="text-gray-700 w-44 flex-shrink-0 leading-tight">{t.label}</span>
					<span class="w-14 text-right flex-shrink-0 leading-tight">
						<span class="block text-xs text-gray-400">当組織</span>
						<span class="tabular-nums font-semibold text-gray-900">{fmt(t.org)}</span>
					</span>
					<div class="relative h-3.5 bg-gray-100 rounded flex-1">
						{#if t.org !== null && t.national !== null}
							{#if t.org >= t.national}
								<div class="absolute top-0 bottom-0 bg-green-500 rounded-sm" style="left:{scalePct(t.national)}%; width:{Math.max(1.5, scalePct(t.org) - scalePct(t.national))}%"></div>
							{:else}
								<div class="absolute top-0 bottom-0 bg-red-500 rounded-sm" style="left:{scalePct(t.org)}%; width:{Math.max(1.5, scalePct(t.national) - scalePct(t.org))}%"></div>
							{/if}
							<div class="absolute top-0 bottom-0 w-0.5 bg-gray-800" style="left:{scalePct(t.national)}%" title="全国平均"></div>
						{/if}
					</div>
					<span class="w-14 text-right flex-shrink-0 leading-tight">
						<span class="block text-xs text-gray-400">全国平均</span>
						<span class="tabular-nums text-gray-600">{fmt(t.national)}</span>
					</span>
					<span class="w-20 text-right flex-shrink-0 leading-tight">
						<span class="block text-xs text-gray-400">全国との差</span>
						<span class="tabular-nums font-medium {colorText[t.color]}">{fmtDiff(t.diff)}</span>
					</span>
				</div>
			{/each}
		</div>
		<p class="text-xs text-gray-400 mt-2">得点は最高4点・最低1点で、高い方が良好な状態を示します。</p>
	</div>

	<!-- 2〜6. 公式の5プロフィール章：左＝尺度名と説明、右＝全国平均と比較するバー -->
	{#each sections as sec}
		<div data-pdf-block class="bg-white rounded-lg shadow-sm p-4 break-inside-avoid print:break-before-page">
			<h4 class="text-base font-semibold text-gray-900">{sec.no}. {sec.title}</h4>
			<p class="text-sm text-gray-500 mt-0.5 mb-3">│＝全国平均。バーが右（緑）＝全国より良好、左（赤）＝要改善。得点は1〜4点で高いほど良好です。</p>
			<div>
				{#each sec.rows as r}
					<div class="grid md:grid-cols-[minmax(15rem,2fr),3fr] gap-x-6 gap-y-1 items-center py-2.5 border-b border-gray-100 last:border-b-0">
						<div class="leading-snug">
							<p class="text-sm font-semibold text-gray-900">{r.label}</p>
							{#if SCALE_DESCRIPTIONS[r.field]}
								<p class="text-xs text-gray-500 mt-0.5">{SCALE_DESCRIPTIONS[r.field]?.desc}</p>
							{/if}
						</div>
						<div class="flex items-center gap-3 text-sm">
							<span class="w-14 text-right flex-shrink-0 leading-tight">
								<span class="block text-xs text-gray-400">当組織</span>
								<span class="tabular-nums font-semibold text-gray-900">{fmt(r.org)}</span>
							</span>
							<div class="relative h-3.5 bg-gray-100 rounded flex-1 min-w-[80px]">
								{#if r.org !== null && r.national !== null}
									{#if r.org >= r.national}
										<div class="absolute top-0 bottom-0 bg-green-500 rounded-sm" style="left:{scalePct(r.national)}%; width:{Math.max(1.5, scalePct(r.org) - scalePct(r.national))}%"></div>
									{:else}
										<div class="absolute top-0 bottom-0 bg-red-500 rounded-sm" style="left:{scalePct(r.org)}%; width:{Math.max(1.5, scalePct(r.national) - scalePct(r.org))}%"></div>
									{/if}
									<div class="absolute top-0 bottom-0 w-0.5 bg-gray-800" style="left:{scalePct(r.national)}%" title="全国平均"></div>
								{:else if r.org !== null}
									<div class="absolute top-0 bottom-0 left-0 bg-gray-400 rounded-sm" style="width:{scalePct(r.org)}%"></div>
								{/if}
							</div>
							<span class="w-14 text-right flex-shrink-0 leading-tight">
								<span class="block text-xs text-gray-400">全国平均</span>
								<span class="tabular-nums text-gray-600">{fmt(r.national)}</span>
							</span>
							<span class="w-20 text-right flex-shrink-0 leading-tight">
								<span class="block text-xs text-gray-400">全国との差</span>
								<span class="tabular-nums font-medium {colorText[r.color]}">{fmtDiff(r.diff)}</span>
							</span>
						</div>
					</div>
				{/each}
			</div>
			<p class="text-xs text-gray-400 mt-2">全国平均は参考値（基準データ N≒1620）です。</p>
		</div>
	{/each}

	<!-- 結果から改善へ（公式FBサンプル準拠の活用ガイド） -->
	<div data-pdf-block class="bg-white rounded-lg shadow-sm p-4 break-inside-avoid">
		<h4 class="text-base font-semibold text-gray-900 mb-1">結果から改善へ</h4>
		<p class="text-sm text-gray-700 leading-relaxed mb-3">
			これらのプロフィールから職場の強みや弱み（問題点）を把握したら、健康いきいき職場の推進のために、強みをのばしたり、あるいは問題点を補強する対策を考えます。
		</p>
		<div class="grid md:grid-cols-2 gap-3 mb-3">
			<div class="rounded-lg border border-gray-100 bg-gray-50/70 p-4">
				<p class="text-sm font-bold text-gray-800 mb-1.5">管理職の立場では</p>
				<p class="text-sm text-gray-700 leading-relaxed">
					マネジメントスタイルの見直し、職場の役割分担や権限委譲の見直しなどが考えられます。
					従業員をまじえた職場環境改善検討会の開催は、アイデアを収集するのに効果的です。
				</p>
			</div>
			<div class="rounded-lg border border-gray-100 bg-gray-50/70 p-4">
				<p class="text-sm font-bold text-gray-800 mb-1.5">経営者や人事労務の立場では</p>
				<p class="text-sm text-gray-700 leading-relaxed">
					全社や事業場レベルで、経営層と従業員とのコミュニケーションのあり方を見直したり、
					CSR方針、行動指針、人事評価制度、人材育成方針を検討することなども考えられます。
				</p>
			</div>
		</div>
		<p class="text-sm text-gray-700 leading-relaxed">
			何らかの改善策が実施されたら、その後再度職場を評価し、改善が効果的になされたかどうか確認することが大事です。
			うまくいった場合には職場で共有し、改善が十分でない場合にはさらに工夫を考えます。
			日々の業務の中に「計画－実行－評価－改善」のサイクルがつくられると、本当に効果のある対策へとつながります。
		</p>
	</div>
</div>
