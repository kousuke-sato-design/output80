<script lang="ts">
	import type { MatrixRow, CellColor } from '$lib/utils/orgMatrix';
	import type { ScaleDef } from '$lib/data/scaleMeta';

	export let rows: MatrixRow[] = [];
	export let columns: ScaleDef[] = [];

	const colorClass: Record<CellColor, string> = {
		good: 'bg-green-100 text-green-900',
		mid: 'bg-yellow-50 text-gray-700',
		bad: 'bg-red-100 text-red-900',
		na: 'text-gray-400'
	};

	function fmt(v: number | null): string {
		return v === null ? '—' : v.toFixed(2);
	}
</script>

<div class="overflow-x-auto matrix-print">
	<table class="min-w-full border-collapse text-sm">
		<thead>
			<tr class="bg-gray-50">
				<th class="sticky left-0 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-700 border-b">部署</th>
				<th class="px-2 py-2 text-right font-semibold text-gray-700 border-b">人数</th>
				{#each columns as col}
					<th class="px-2 py-2 text-center font-medium text-gray-600 border-b whitespace-nowrap" title={col.label}>
						{col.label}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each rows as row}
				<tr
					class:font-semibold={row.kind === 'org'}
					class:bg-primary-50={row.kind === 'org'}
					class:bg-gray-50={row.kind === 'national'}
					class:italic={row.kind === 'national'}
				>
					<td class="sticky left-0 px-3 py-1.5 text-left text-gray-900 border-b whitespace-nowrap"
						class:bg-primary-50={row.kind === 'org'}
						class:bg-gray-50={row.kind === 'national'}
						class:bg-white={row.kind === 'dept'}>
						{row.label}
					</td>
					<td class="px-2 py-1.5 text-right text-gray-600 border-b">{row.count ?? '—'}</td>
					{#each row.cells as c}
						<td class="px-2 py-1.5 text-center border-b tabular-nums {colorClass[c.color]}">
							{fmt(c.value)}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
		<span class="inline-flex items-center gap-1"><span class="w-3 h-3 rounded bg-green-100 border border-green-300"></span>全国平均より良好(+0.5SD↑)</span>
		<span class="inline-flex items-center gap-1"><span class="w-3 h-3 rounded bg-yellow-50 border border-yellow-200"></span>平均並み</span>
		<span class="inline-flex items-center gap-1"><span class="w-3 h-3 rounded bg-red-100 border border-red-300"></span>要改善(-0.5SD↓)</span>
		<span>全尺度 高得点ほど良好。全国平均は参考値(N≒1620)。</span>
	</div>
</div>
