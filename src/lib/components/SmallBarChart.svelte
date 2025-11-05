<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';

	export let label: string = '';
	export let currentValue: number = 0;
	export let orgValue: number | undefined = undefined;
	export let nationalValue: number = 0;
	export let description: string = '';

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	onMount(() => {
		Chart.register(BarController, BarElement, CategoryScale, LinearScale);

		// 各バーに別々のラベルを付けて隙間を作る
		const labels = ['全国平均', '事業場平均', '当該職場'];
		const data = [nationalValue, orgValue !== undefined ? orgValue : null, currentValue];
		const colors = ['rgb(76, 175, 80)', 'rgb(244, 67, 54)', 'rgb(33, 150, 243)'];

		chart = new Chart(canvas, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [
					{
						data: data,
						backgroundColor: colors,
						barThickness: 14
					}
				]
			},
			options: {
				indexAxis: 'y',
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						beginAtZero: false,
						min: 1,
						max: 4,
						ticks: {
							stepSize: 0.5,
							font: {
								size: 11
							},
							color: '#000000'
						},
						grid: {
							color: 'rgba(0, 0, 0, 0.2)',
							lineWidth: 1
						}
					},
					y: {
						display: false,
						grid: {
							display: false
						}
					}
				},
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						enabled: false
					}
				}
			}
		});

		return () => {
			if (chart) {
				chart.destroy();
			}
		};
	});
</script>

<div class="mb-8">
	<div class="flex items-start gap-4">
		<!-- 説明テキスト（左側） - 吹き出し風 -->
		<div class="w-48 flex-shrink-0">
			<h4 class="text-sm font-bold text-gray-900 mb-2">{label}</h4>
			{#if description}
				<div class="bg-white border-2 border-gray-400 rounded-lg p-3 relative">
					<p class="text-xs text-gray-800 leading-relaxed">{description}</p>
				</div>
			{/if}
		</div>

		<!-- チャート（右側） -->
		<div class="flex-1">
			<div class="relative" style="height: 90px;">
				<canvas bind:this={canvas}></canvas>
			</div>
		</div>
	</div>
</div>
