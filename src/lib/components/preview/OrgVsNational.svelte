<script lang="ts">
	import type { ScoreData } from '$lib/types';
	import { HEADLINE_FIELDS, SCALES, PROFILE_GROUP_ORDER, type ScaleField } from '$lib/data/scaleMeta';
	import { orgVsNational, type ScaleVsNational, type CellColor } from '$lib/utils/orgMatrix';
	import OrgVitality from './OrgVitality.svelte';

	export let overallAverage: ScoreData | null;
	export let totalUsers = 0;
	export let deptCount = 0;

	$: headline = orgVsNational(overallAverage, HEADLINE_FIELDS);

	// 全尺度プロフィール（合計を除く42尺度）をグループ順に
	const profileFields = SCALES.filter((s) => s.group !== '合計').map((s) => s.field) as ScaleField[];
	$: profile = orgVsNational(overallAverage, profileFields);
	$: profileByGroup = PROFILE_GROUP_ORDER.map((g) => ({
		group: g,
		rows: profile.filter((r) => r.group === g)
	})).filter((x) => x.rows.length > 0);

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

	// 全国比バー幅（zを±2SDで0-100%に。中央=全国平均）
	function barPct(z: number | null): number {
		if (z === null) return 0;
		return Math.min(100, (Math.abs(z) / 2) * 100);
	}
	function fmt(v: number | null): string {
		return v === null ? '—' : v.toFixed(2);
	}
	function fmtDiff(v: number | null): string {
		return v === null ? '—' : `${v >= 0 ? '+' : ''}${v.toFixed(2)}`;
	}
	// 1〜4スケールを0-100%に（棒グラフ用）
	function scalePct(v: number | null): number {
		if (v === null) return 0;
		return Math.max(0, Math.min(100, ((v - 1) / 3) * 100));
	}
</script>

<div class="space-y-5">
	<!-- いきいきプロフィール全体図（散布図＋レーダー） -->
	<OrgVitality {overallAverage} />

	<!-- 見出し：領域サマリー（全国比） -->
	<div data-pdf-block class="bg-white rounded-lg shadow-sm p-4 break-inside-avoid">
		<div class="flex items-baseline justify-between mb-3">
			<h4 class="text-base font-semibold text-gray-900">領域サマリー（組織全体 vs 全国平均）</h4>
			<span class="text-xs text-gray-500">回答者 {totalUsers}名 / {deptCount}部署</span>
		</div>
		<!-- 列見出し（凡例） -->
		<div class="grid grid-cols-12 items-center gap-2 text-[11px] text-gray-400 mb-1 pb-1 border-b border-gray-100">
			<div class="col-span-3">指標</div>
			<div class="col-span-1 text-right">組織値</div>
			<div class="col-span-6 flex justify-between px-1">
				<span>◀ 要改善</span><span class="font-medium text-gray-500">｜全国平均</span><span>良好 ▶</span>
			</div>
			<div class="col-span-2 text-right">全国比</div>
		</div>
		<div class="space-y-2">
			{#each headline as h}
				<div class="grid grid-cols-12 items-center gap-2 text-sm">
					<div class="col-span-3 text-gray-700 truncate" title={h.label}>{h.label}</div>
					<div class="col-span-1 text-right font-semibold text-gray-900 tabular-nums">{fmt(h.org)}</div>
					<!-- 全国比 ダイバージングバー -->
					<div class="col-span-6">
						<div class="relative h-3 bg-gray-100 rounded">
							<div class="absolute top-0 bottom-0 left-1/2 w-px bg-gray-400"></div>
							{#if h.z !== null}
								{#if h.z >= 0}
									<div class="absolute top-0 bottom-0 left-1/2 {colorBar[h.color]} rounded-r" style="width: {barPct(h.z) / 2}%"></div>
								{:else}
									<div class="absolute top-0 bottom-0 {colorBar[h.color]} rounded-l" style="right: 50%; width: {barPct(h.z) / 2}%"></div>
								{/if}
							{/if}
						</div>
					</div>
					<div class="col-span-2 text-xs {colorText[h.color]} tabular-nums">
						全国比 {fmtDiff(h.diff)}
					</div>
				</div>
			{/each}
		</div>
		<p class="text-xs text-gray-400 mt-2">バーは「全国平均（中央線）からの差」。右(緑)＝全国より良好／左(赤)＝要改善。全尺度 高得点ほど良好。</p>
	</div>

	<!-- このレポートの見方（活用ステップ） -->
	<div data-pdf-block class="bg-white rounded-lg shadow-sm p-4 break-inside-avoid">
		<h4 class="text-base font-semibold text-gray-900 mb-1">このレポートの見方</h4>
		<p class="text-sm text-gray-600 mb-3">
			「健康いきいき職場」モデルに基づき、組織全体の平均値を全国平均（参考値）と比較しています。得点は1〜4点で、<b class="text-gray-800">すべて高いほど良好</b>な状態を示すよう変換しています。
		</p>
		<ol class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-1 list-none p-0 m-0">
			{#each [
				{ n: 'STEP 1', t: 'いきいきプロフィール全体図で、組織のいきいきの位置を確認' },
				{ n: 'STEP 2', t: '4領域バランス（レーダー）で、注目すべき対策領域を確認' },
				{ n: 'STEP 3', t: '領域サマリー・尺度プロフィールで、個別の強み・弱みを確認' },
				{ n: 'STEP 4', t: '強みをのばし、弱みを補強する改善方策を考える' }
			] as step}
				<li class="rounded-lg border border-gray-100 bg-gray-50/70 p-3">
					<span class="inline-block text-[10px] font-bold tracking-wider text-primary-700 bg-primary-50 rounded px-1.5 py-0.5 mb-1">{step.n}</span>
					<p class="text-xs text-gray-700 leading-relaxed">{step.t}</p>
				</li>
			{/each}
		</ol>
		<p class="text-xs text-gray-400 mt-2">全国平均は参考値（新職業性ストレス簡易調査票 基準データ N≒1620）であり、全国標準値ではありません。</p>
	</div>

	<!-- 全尺度プロフィール -->
	<div data-pdf-block class="bg-white rounded-lg shadow-sm p-4 break-inside-avoid">
		<h4 class="text-base font-semibold text-gray-900 mb-2">尺度プロフィール（全42尺度・全国平均との比較）</h4>
		<!-- 凡例：棒・縦線・数値が何を表すか -->
		<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 mb-3 border border-gray-100 rounded-lg p-2 bg-gray-50">
			<span class="flex items-center gap-1"><span class="inline-block w-4 h-2.5 bg-green-500 rounded-sm"></span><b class="text-green-700">緑＝全国より良好</b>（縦線から右）</span>
			<span class="flex items-center gap-1"><span class="inline-block w-4 h-2.5 bg-red-500 rounded-sm"></span><b class="text-red-700">赤＝要改善</b>（縦線から左）</span>
			<span class="flex items-center gap-1"><span class="inline-block w-[2px] h-3.5 bg-gray-800"></span>縦線＝<b class="text-gray-800">全国平均</b></span>
			<span>数値＝ <b class="text-gray-900">組織</b> / <span class="text-gray-400">全国</span> / <span class="font-medium">差</span></span>
		</div>
		<div class="grid md:grid-cols-2 gap-x-8 gap-y-1">
			{#each profileByGroup as grp}
				<div class="break-inside-avoid">
					<div class="text-xs font-bold text-primary-700 border-b border-gray-200 pb-1 mb-1 mt-2">{grp.group}</div>
					{#each grp.rows as r}
						<div class="flex items-center gap-2 text-sm py-0.5">
							<span class="text-gray-700 truncate w-24 flex-shrink-0" title={r.label}>{r.label}</span>
							<!-- 全国平均(縦線)からの差を 緑(右=良好)/赤(左=要改善) で表示 -->
							<div class="relative h-3.5 bg-gray-100 rounded flex-1 min-w-[60px]">
								{#if r.org !== null && r.national !== null}
									{#if r.org >= r.national}
										<div class="absolute top-0 bottom-0 bg-green-500 rounded-sm" style="left:{scalePct(r.national)}%; width:{Math.max(1.5, scalePct(r.org) - scalePct(r.national))}%"></div>
									{:else}
										<div class="absolute top-0 bottom-0 bg-red-500 rounded-sm" style="left:{scalePct(r.org)}%; width:{Math.max(1.5, scalePct(r.national) - scalePct(r.org))}%"></div>
									{/if}
								{:else if r.org !== null}
									<div class="absolute top-0 bottom-0 left-0 bg-gray-400 rounded-sm" style="width:{scalePct(r.org)}%"></div>
								{/if}
								{#if r.national !== null}
									<div class="absolute top-0 bottom-0 w-0.5 bg-gray-800" style="left:{scalePct(r.national)}%" title="全国平均"></div>
								{/if}
							</div>
							<span class="tabular-nums text-gray-900 w-9 text-right flex-shrink-0">{fmt(r.org)}</span>
							<span class="tabular-nums text-gray-400 w-9 text-right flex-shrink-0" title="全国平均">{fmt(r.national)}</span>
							<span class="tabular-nums {colorText[r.color]} w-12 text-right flex-shrink-0 font-medium">{fmtDiff(r.diff)}</span>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>
