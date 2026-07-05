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
	// head/dot は章のテーマカラー（Tailwind静的クラス）。
	const SECTIONS: { no: number; title: string; head: string; dot: string; fields: ScaleField[] }[] = [
		{
			no: 2,
			title: '仕事の負担プロフィール',
			head: 'bg-amber-100 text-amber-900 border-amber-500',
			dot: 'bg-amber-500',
			fields: [
				'quantitativeLoad', 'qualitativeLoad', 'physicalLoad', 'interpersonalRelations',
				'workplaceEnvironment', 'emotionalLoad', 'roleConflict', 'workSelfBalanceNegative'
			]
		},
		{
			no: 3,
			title: '仕事の資源（作業レベル）プロフィール',
			head: 'bg-sky-100 text-sky-900 border-sky-500',
			dot: 'bg-sky-500',
			fields: ['jobControl', 'jobFitness', 'skillUtilization', 'jobSignificance', 'roleClarification', 'growthOpportunity']
		},
		{
			no: 4,
			title: '仕事の資源（部署レベル）プロフィール',
			head: 'bg-indigo-100 text-indigo-900 border-indigo-500',
			dot: 'bg-indigo-500',
			fields: [
				'supervisorSupport', 'colleagueSupport', 'familySupport', 'economicReward', 'respectReward',
				'stabilityReward', 'supervisorLeadership', 'supervisorFairness', 'praisableWorkplace', 'failureAcceptance'
			]
		},
		{
			no: 5,
			title: '仕事の資源（事業場レベル）プロフィール',
			head: 'bg-teal-100 text-teal-900 border-teal-500',
			dot: 'bg-teal-500',
			fields: [
				'managementTrust', 'changeAdaptation', 'individualRespect', 'fairEvaluation',
				'diversitySupport', 'careerDevelopment', 'workSelfBalancePositive'
			]
		},
		{
			no: 6,
			title: '健康および満足度プロフィール',
			head: 'bg-rose-100 text-rose-900 border-rose-500',
			dot: 'bg-rose-500',
			fields: [
				'vigor', 'irritation', 'fatigue', 'anxiety', 'depression', 'psychologicalStress',
				'physicalComplaints', 'harassment', 'jobSatisfaction', 'familySatisfaction'
			]
		}
	];

	$: sections = SECTIONS.map((s) => ({ ...s, rows: orgVsNational(overallAverage, s.fields) }));
	$: totals = orgVsNational(overallAverage, TOTAL_FIELDS);
	// 対策領域別合計の行頭チップ（章カラーと対応：負担/作業/部署/事業場）
	const totalDots = ['bg-amber-500', 'bg-sky-500', 'bg-indigo-500', 'bg-teal-500'];

	// 全国との差チップの色（良好=緑/要改善=赤/平均的=グレー）
	const diffChip: Record<CellColor, { box: string; label: string; val: string }> = {
		good: { box: 'border-green-200 bg-green-50', label: 'text-green-600', val: 'text-green-700' },
		bad: { box: 'border-red-200 bg-red-50', label: 'text-red-600', val: 'text-red-700' },
		mid: { box: 'border-gray-200 bg-gray-50', label: 'text-gray-500', val: 'text-gray-600' },
		na: { box: 'border-gray-200 bg-gray-50', label: 'text-gray-500', val: 'text-gray-600' }
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
			<h4 class="text-base font-bold text-gray-900">対策領域別合計（組織全体 vs 全国平均）</h4>
			<span class="text-xs text-gray-500">回答者 {totalUsers}名 / {deptCount}部署</span>
		</div>
		<p class="text-sm text-gray-600 mb-3 leading-relaxed">
			上の4領域バランス（レーダー）を数値で示したものです。│＝全国平均。
			バーが<b class="bg-green-100 text-green-800 px-1 rounded">右（緑）＝全国より良好</b>、
			<b class="bg-red-100 text-red-800 px-1 rounded">左（赤）＝要改善</b>です。
		</p>
		<div class="space-y-2">
			{#each totals as t, i}
				<div class="flex flex-wrap md:flex-nowrap items-center gap-x-4 gap-y-2 py-1.5">
					<span class="flex items-center gap-1.5 text-sm font-semibold text-gray-800 w-56 flex-shrink-0 leading-tight">
						<span class="inline-block w-2.5 h-2.5 rounded-sm {totalDots[i]} flex-shrink-0"></span>{t.label}
					</span>
					<div class="relative h-3.5 bg-gray-100 rounded flex-1 min-w-[100px]">
						{#if t.org !== null && t.national !== null}
							{#if t.org >= t.national}
								<div class="absolute top-0 bottom-0 bg-green-500 rounded-sm" style="left:{scalePct(t.national)}%; width:{Math.max(1.5, scalePct(t.org) - scalePct(t.national))}%"></div>
							{:else}
								<div class="absolute top-0 bottom-0 bg-red-500 rounded-sm" style="left:{scalePct(t.org)}%; width:{Math.max(1.5, scalePct(t.national) - scalePct(t.org))}%"></div>
							{/if}
							<div class="absolute top-0 bottom-0 w-0.5 bg-gray-800" style="left:{scalePct(t.national)}%" title="全国平均"></div>
						{/if}
					</div>
					<div class="flex items-center gap-1.5 flex-shrink-0">
						<span class="flex flex-col items-center rounded-lg border border-blue-200 bg-blue-50 px-2 py-0.5 w-[4.5rem]">
							<span class="text-[11px] leading-tight text-blue-600 font-medium">当組織</span>
							<span class="text-base leading-tight font-bold text-blue-900 tabular-nums">{fmt(t.org)}</span>
						</span>
						<span class="flex flex-col items-center rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 w-[4.5rem]">
							<span class="text-[11px] leading-tight text-amber-600 font-medium">全国平均</span>
							<span class="text-base leading-tight font-bold text-amber-800 tabular-nums">{fmt(t.national)}</span>
						</span>
						<span class="flex flex-col items-center rounded-lg border px-2 py-0.5 w-[5rem] {diffChip[t.color].box}">
							<span class="text-[11px] leading-tight font-medium {diffChip[t.color].label}">全国との差</span>
							<span class="text-base leading-tight font-bold tabular-nums {diffChip[t.color].val}">{fmtDiff(t.diff)}</span>
						</span>
					</div>
				</div>
			{/each}
		</div>
		<p class="text-xs text-gray-400 mt-2">得点は最高4点・最低1点で、<b class="bg-yellow-100 text-gray-700 px-1 rounded">高い方が良好</b>な状態を示します。行頭の色は各プロフィール章（2〜5章）と対応しています。</p>
	</div>

	<!-- 2〜6. 公式の5プロフィール章：左＝尺度名と説明、右＝バーと色付き数値チップ -->
	{#each sections as sec}
		<div data-pdf-block class="bg-white rounded-lg shadow-sm p-4 break-inside-avoid print:break-before-page">
			<h4 class="text-base font-bold border-l-4 rounded-r-lg px-3 py-2 {sec.head}">{sec.no}. {sec.title}</h4>
			<p class="text-sm text-gray-600 mt-2 mb-2 leading-relaxed">
				│＝全国平均。バーが<b class="bg-green-100 text-green-800 px-1 rounded">右（緑）＝全国より良好</b>、
				<b class="bg-red-100 text-red-800 px-1 rounded">左（赤）＝要改善</b>。
				得点は1〜4点で<b class="bg-yellow-100 text-gray-800 px-1 rounded">高いほど良好</b>です。
			</p>
			<div>
				{#each sec.rows as r}
					<div class="flex flex-wrap md:flex-nowrap items-center gap-x-4 gap-y-2 py-2.5 border-b border-gray-100 last:border-b-0">
						<div class="leading-snug min-w-[15rem] flex-1">
							<p class="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
								<span class="inline-block w-2.5 h-2.5 rounded-sm {sec.dot} flex-shrink-0"></span>{r.label}
							</p>
							{#if SCALE_DESCRIPTIONS[r.field]}
								<p class="text-xs text-gray-500 mt-0.5">{SCALE_DESCRIPTIONS[r.field]?.desc}</p>
							{/if}
						</div>
						<div class="relative h-3.5 bg-gray-100 rounded flex-1 min-w-[100px]">
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
						<div class="flex items-center gap-1.5 flex-shrink-0">
							<span class="flex flex-col items-center rounded-lg border border-blue-200 bg-blue-50 px-2 py-0.5 w-[4.5rem]">
								<span class="text-[11px] leading-tight text-blue-600 font-medium">当組織</span>
								<span class="text-base leading-tight font-bold text-blue-900 tabular-nums">{fmt(r.org)}</span>
							</span>
							<span class="flex flex-col items-center rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 w-[4.5rem]">
								<span class="text-[11px] leading-tight text-amber-600 font-medium">全国平均</span>
								<span class="text-base leading-tight font-bold text-amber-800 tabular-nums">{fmt(r.national)}</span>
							</span>
							<span class="flex flex-col items-center rounded-lg border px-2 py-0.5 w-[5rem] {diffChip[r.color].box}">
								<span class="text-[11px] leading-tight font-medium {diffChip[r.color].label}">全国との差</span>
								<span class="text-base leading-tight font-bold tabular-nums {diffChip[r.color].val}">{fmtDiff(r.diff)}</span>
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
		<h4 class="text-base font-bold border-l-4 rounded-r-lg px-3 py-2 bg-emerald-100 text-emerald-900 border-emerald-500">結果から改善へ</h4>
		<p class="text-sm text-gray-700 leading-relaxed mt-2 mb-3">
			これらのプロフィールから職場の強みや弱み（問題点）を把握したら、健康いきいき職場の推進のために、
			<b class="bg-green-100 text-green-800 px-1 rounded">強みをのばす</b>、あるいは
			<b class="bg-red-100 text-red-800 px-1 rounded">問題点を補強する</b>対策を考えます。
		</p>
		<div class="grid md:grid-cols-2 gap-3 mb-3">
			<div class="rounded-lg border-2 border-sky-200 bg-sky-50/60 p-4">
				<p class="text-sm font-bold text-sky-800 mb-1.5">管理職の立場では</p>
				<p class="text-sm text-gray-700 leading-relaxed">
					マネジメントスタイルの見直し、職場の役割分担や権限委譲の見直しなどが考えられます。
					<b class="bg-sky-100 text-sky-900 px-1 rounded">従業員をまじえた職場環境改善検討会</b>の開催は、アイデアを収集するのに効果的です。
				</p>
			</div>
			<div class="rounded-lg border-2 border-indigo-200 bg-indigo-50/60 p-4">
				<p class="text-sm font-bold text-indigo-800 mb-1.5">経営者や人事労務の立場では</p>
				<p class="text-sm text-gray-700 leading-relaxed">
					全社や事業場レベルで、経営層と従業員とのコミュニケーションのあり方を見直したり、
					<b class="bg-indigo-100 text-indigo-900 px-1 rounded">CSR方針、行動指針、人事評価制度、人材育成方針</b>を検討することなども考えられます。
				</p>
			</div>
		</div>
		<p class="text-sm text-gray-700 leading-relaxed rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
			何らかの改善策が実施されたら、その後再度職場を評価し、改善が効果的になされたかどうか確認することが大事です。
			うまくいった場合には職場で共有し、改善が十分でない場合にはさらに工夫を考えます。
			日々の業務の中に<b class="bg-emerald-100 text-emerald-900 px-1 rounded">「計画－実行－評価－改善」のサイクル</b>がつくられると、本当に効果のある対策へとつながります。
		</p>
	</div>
</div>
