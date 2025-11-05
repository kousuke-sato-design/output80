<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

	export let labels: string[] = [];
	export let datasets: {
		label: string;
		data: number[];
		backgroundColor?: string;
		borderColor?: string;
	}[] = [];
	export let title: string = '';
	export let horizontal: boolean = true;

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	onMount(() => {
		Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

		chart = new Chart(canvas, {
			type: 'bar',
			data: {
				labels,
				datasets: datasets.map((ds, index) => {
					const colors = [
						'rgb(59, 130, 246)',    // 当該職場 - 青
						'rgb(156, 163, 175)',   // 事業場平均 - グレー
						'rgb(251, 146, 60)'     // 全国平均 - オレンジ
					];
					return {
						...ds,
						backgroundColor: ds.backgroundColor || colors[index % 3],
						borderColor: ds.borderColor || colors[index % 3],
						borderWidth: 1
					};
				})
			},
			options: {
				indexAxis: horizontal ? 'y' : 'x',
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						beginAtZero: true,
						max: 4,
						ticks: {
							stepSize: 1
						},
						grid: {
							color: 'rgba(0, 0, 0, 0.05)'
						}
					},
					y: {
						grid: {
							display: false
						},
						ticks: {
							font: {
								size: 11
							}
						}
					}
				},
				plugins: {
					legend: {
						position: 'bottom',
						labels: {
							padding: 10,
							usePointStyle: true
						}
					},
					tooltip: {
						callbacks: {
							label: function (context) {
								let label = context.dataset.label || '';
								if (label) {
									label += ': ';
								}
								label += context.parsed.x.toFixed(2) + '点';
								return label;
							}
						}
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

	$: if (chart && labels && datasets) {
		chart.data.labels = labels;
		chart.data.datasets = datasets.map((ds, index) => {
			const colors = [
				'rgb(59, 130, 246)',
				'rgb(156, 163, 175)',
				'rgb(251, 146, 60)'
			];
			return {
				...ds,
				backgroundColor: ds.backgroundColor || colors[index % 3],
				borderColor: ds.borderColor || colors[index % 3],
				borderWidth: 1
			};
		});
		chart.update();
	}
</script>

<div class="bg-white rounded-lg shadow-sm p-6">
	{#if title}
		<h3 class="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
	{/if}
	<div class="relative" style="height: {labels.length * 40 + 100}px; min-height: 300px;">
		<canvas bind:this={canvas}></canvas>
	</div>
</div>
