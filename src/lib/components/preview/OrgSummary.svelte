<script lang="ts">
	import type { ScoreData } from '$lib/types';
	import { SCALES, TOTAL_FIELDS, type ScaleField } from '$lib/data/scaleMeta';
	import { orgVsNational } from '$lib/utils/orgMatrix';
	import { rateByZ, gradeByZ } from '$lib/utils/rating';
	import { SURVEY_ABOUT } from '$lib/data/scaleDescriptions';

	export let overallAverage: ScoreData | null;
	export let totalUsers = 0;
	export let deptCount = 0;

	// 表紙情報（画面で入力→そのまま印刷される。データには保存しない）
	let companyName = '';
	let periodText = '';

	const scaleFields = SCALES.filter((s) => s.group !== '合計').map((s) => s.field) as ScaleField[];
	$: rows = orgVsNational(overallAverage, scaleFields).filter((r) => r.z !== null);
	$: strengths = [...rows].filter((r) => (r.z as number) > 0).sort((a, b) => (b.z as number) - (a.z as number)).slice(0, 3);
	$: issues = [...rows].filter((r) => (r.z as number) < 0).sort((a, b) => (a.z as number) - (b.z as number)).slice(0, 3);

	$: totals = orgVsNational(overallAverage, TOTAL_FIELDS);
	$: zList = totals.map((t) => t.z).filter((z): z is number => z !== null);
	$: zMean = zList.length ? zList.reduce((a, b) => a + b, 0) / zList.length : null;
	$: grade = gradeByZ(zMean);

	const today = (() => {
		const d = new Date();
		return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
	})();

	function fmtDiff(v: number | null): string {
		if (v === null) return '—';
		return v >= 0 ? `▲+${v.toFixed(2)}` : `▼${v.toFixed(2)}`;
	}
</script>

<!-- 経営層向け総合サマリー（レポート1ページ目） -->
<div data-pdf-block class="bg-white rounded-xl shadow-sm border-2 border-primary-100 p-5 break-inside-avoid">
	<!-- ベータ版バナー（画面・印刷共通で目立たせる） -->
	<div class="flex flex-wrap items-center gap-x-3 gap-y-1 bg-amber-50 border border-amber-300 rounded-lg px-3 py-1.5 mb-3">
		<span class="text-[11px] font-bold tracking-wider bg-amber-400 text-amber-950 rounded px-2 py-0.5">BETA版</span>
		<span class="text-xs text-amber-800 font-medium">本レポートはベータ版システムによる出力です。数値・表示内容は検証中のため、今後変更される場合があります。</span>
	</div>
	<!-- 表紙ヘッダー -->
	<div class="flex flex-wrap items-start justify-between gap-3 pb-3 border-b-2 border-primary-600">
		<div class="min-w-0">
			<p class="text-xs font-semibold tracking-widest text-primary-700 mb-0.5">組織ストレスチェック報告書（新職業性ストレス簡易調査票 80項目版）</p>
			<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
				<input
					bind:value={companyName}
					placeholder="企業・組織名を入力（印刷に反映）"
					class="text-2xl font-bold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-primary-500 min-w-[16rem] print:border-none"
				/>
				<input
					bind:value={periodText}
					placeholder="実施時期（例: 2026年7月）"
					class="text-sm text-gray-600 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-primary-500 w-44 print:border-none"
				/>
			</div>
		</div>
		<div class="text-right text-xs text-gray-500 leading-relaxed flex-shrink-0">
			<p>回答者 <b class="text-gray-800 text-sm">{totalUsers}</b> 名 / {deptCount} 部署</p>
			<p>作成日 {today}</p>
			<p class="font-medium text-gray-600">作成・提供：株式会社総合心理教育研究所</p>
			<p class="font-semibold text-gray-400 tracking-widest">CONFIDENTIAL</p>
		</div>
	</div>

	<!-- 判定・強み・課題 -->
	<div class="grid md:grid-cols-3 gap-4 mt-4">
		<!-- 総合判定 -->
		<div class="rounded-lg border border-gray-200 bg-gray-50/60 p-4 break-inside-avoid">
			<h5 class="text-sm font-bold text-gray-700 mb-2">総合判定（4領域の全国比）</h5>
			{#if grade}
				<div class="flex items-center gap-3 mb-3">
					<span class="w-16 h-16 rounded-full {grade.badge} text-white text-4xl font-bold flex items-center justify-center flex-shrink-0">{grade.grade}</span>
					<p class="text-sm font-medium {grade.text} leading-snug">{grade.label}</p>
				</div>
			{:else}
				<p class="text-sm text-gray-400 mb-3">データがありません</p>
			{/if}
			<div class="space-y-1.5">
				{#each totals as t}
					{@const r = rateByZ(t.z)}
					<div class="flex items-center justify-between gap-2 text-xs">
						<span class="text-gray-600 truncate">{t.label.replace('(合計)', '')}</span>
						<span class="flex items-center gap-1.5 flex-shrink-0 tabular-nums">
							<span class="text-gray-400">{fmtDiff(t.diff)}</span>
							{#if r}<span class="px-1.5 py-0.5 rounded {r.badge} font-semibold whitespace-nowrap">{r.symbol} {r.label}</span>{/if}
						</span>
					</div>
				{/each}
			</div>
			<p class="text-[10px] text-gray-400 mt-2 leading-tight">判定A〜D＝4領域合計の全国比（SD換算）の平均。◎良好/○やや良好/−平均的/△やや注意/⚠要対策（±0.15SD・±0.5SDで区分）</p>
		</div>

		<!-- 強みTOP3 -->
		<div class="rounded-lg border-2 border-green-200 bg-green-50/50 p-4 break-inside-avoid">
			<h5 class="text-sm font-bold text-green-800 mb-2">✅ 貴組織の強み TOP3</h5>
			{#if strengths.length === 0}
				<p class="text-sm text-gray-400">全国平均を上回る尺度がありません</p>
			{:else}
				<ol class="space-y-2">
					{#each strengths as s, i}
						<li class="flex items-center gap-2 bg-white rounded-lg border border-green-100 px-3 py-2">
							<span class="w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
							<span class="text-sm font-medium text-gray-800 flex-1 leading-tight">{s.label}</span>
							<span class="text-sm font-bold text-green-700 tabular-nums flex-shrink-0">{fmtDiff(s.diff)}</span>
						</li>
					{/each}
				</ol>
			{/if}
			<p class="text-[10px] text-gray-400 mt-2">全国平均との差（＋が大きい順）。この強みを維持・活用します</p>
		</div>

		<!-- 優先課題TOP3 -->
		<div class="rounded-lg border-2 border-red-200 bg-red-50/50 p-4 break-inside-avoid">
			<h5 class="text-sm font-bold text-red-800 mb-2">⚠️ 優先課題 TOP3</h5>
			{#if issues.length === 0}
				<p class="text-sm text-gray-400">全国平均を下回る尺度がありません</p>
			{:else}
				<ol class="space-y-2">
					{#each issues as s, i}
						<li class="flex items-center gap-2 bg-white rounded-lg border border-red-100 px-3 py-2">
							<span class="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
							<span class="text-sm font-medium text-gray-800 flex-1 leading-tight">{s.label}</span>
							<span class="text-sm font-bold text-red-700 tabular-nums flex-shrink-0">{fmtDiff(s.diff)}</span>
						</li>
					{/each}
				</ol>
			{/if}
			<p class="text-[10px] text-gray-400 mt-2">全国平均との差（−が大きい順）。優先的な対策を検討します</p>
		</div>
	</div>

	<!-- 調査票について -->
	<p class="text-[11px] text-gray-500 leading-relaxed mt-4 pt-3 border-t border-gray-100">
		<b class="text-gray-700">この調査について：</b>{SURVEY_ABOUT}
		各尺度のくわしい意味は巻末の「用語解説」をご覧ください。
	</p>
</div>
