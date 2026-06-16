<script lang="ts">
	import { userData, overallAverage } from '$lib/stores/dataStore';
	import { availableAxes, groupAverages } from '$lib/utils/groupBy';
	import { ALL_SCALES, MAIN_SCALES, SCALE_BY_FIELD, type ScaleField } from '$lib/data/scaleMeta';
	import { comparisonSeries, buildMatrix, type SortMode } from '$lib/utils/orgMatrix';
	import OrgComparisonChart from './OrgComparisonChart.svelte';
	import OrgMatrixTable from './OrgMatrixTable.svelte';

	let axis = '部署';
	let selectedField: ScaleField = 'totalWorkload';
	let sortMode: SortMode = 'code';
	let horizontal = false;

	$: axes = availableAxes($userData);
	// 選択中の軸が使えなくなったら先頭に戻す
	$: if (axes.length && !axes.includes(axis)) axis = axes[0];

	$: groups = groupAverages($userData, axis);
	$: groupNames = Array.from(groups.keys());
	$: series = comparisonSeries(groups, $overallAverage, groupNames, selectedField, sortMode);
	$: rows = buildMatrix(groups, $overallAverage, groupNames, MAIN_SCALES.map((s) => s.field), sortMode, selectedField);
	$: selectedLabel = SCALE_BY_FIELD.get(selectedField)?.label ?? '';

	$: grouped = (() => {
		const g: { group: string; scales: typeof ALL_SCALES }[] = [];
		for (const s of ALL_SCALES) {
			let x = g.find((y) => y.group === s.group);
			if (!x) { x = { group: s.group, scales: [] }; g.push(x); }
			x.scales.push(s);
		}
		return g;
	})();

	const axisLabel: Record<string, string> = {
		部署: '部署', 性別: '男女', 年代: '年代', 役職: '役職', 職種: '職種',
		事業所: '事業所', 所属: '所属', 職場診断用1: '職場診断用'
	};
</script>

<div class="space-y-5">
	<div data-pdf-block class="bg-white rounded-lg shadow-sm p-4 break-inside-avoid">
		<div class="flex flex-wrap items-center justify-between gap-2 mb-3">
			<div>
				<h4 class="text-base font-semibold text-gray-900">グループ比較：{selectedLabel}</h4>
				<p class="text-xs text-gray-500">グループ軸で各グループ＋組織全体＋全国平均を比較します</p>
			</div>
			<div class="flex flex-wrap items-center gap-2 text-sm print:hidden">
				<label class="flex items-center gap-1">
					<span class="text-gray-500">軸</span>
					<select bind:value={axis} class="border border-gray-300 rounded px-2 py-1 text-sm">
						{#each axes as a}
							<option value={a}>{axisLabel[a] ?? a}</option>
						{/each}
					</select>
				</label>
				<select bind:value={selectedField} class="border border-gray-300 rounded px-2 py-1 text-sm">
					{#each grouped as g}
						<optgroup label={g.group}>
							{#each g.scales as s}
								<option value={s.field}>{s.label}</option>
							{/each}
						</optgroup>
					{/each}
				</select>
				<div class="inline-flex rounded border border-gray-300 overflow-hidden">
					<button class="px-2 py-1 {sortMode === 'code' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}" on:click={() => (sortMode = 'code')}>コード順</button>
					<button class="px-2 py-1 {sortMode === 'good' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}" on:click={() => (sortMode = 'good')}>良い順</button>
					<button class="px-2 py-1 {sortMode === 'bad' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}" on:click={() => (sortMode = 'bad')}>悪い順</button>
				</div>
				<button class="px-2 py-1 border border-gray-300 rounded bg-white text-gray-600" on:click={() => (horizontal = !horizontal)}>
					{horizontal ? '縦棒' : '横棒'}
				</button>
			</div>
		</div>
		{#if groupNames.length === 0}
			<p class="text-sm text-gray-500 py-8 text-center">この軸の有効なグループデータがありません。</p>
		{:else}
			<OrgComparisonChart {series} {horizontal} />
		{/if}
	</div>

	<div data-pdf-block class="bg-white rounded-lg shadow-sm p-4 break-inside-avoid">
		<h4 class="text-base font-semibold text-gray-900 mb-3">主要指標 一覧（{axisLabel[axis] ?? axis} × 指標）</h4>
		<OrgMatrixTable {rows} columns={MAIN_SCALES} />
	</div>
</div>
