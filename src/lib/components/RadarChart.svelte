<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

	export let labels: string[] = [];
	export let datasets: {
		label: string;
		data: number[];
		backgroundColor?: string;
		borderColor?: string;
		borderWidth?: number;
	}[] = [];
	export let title: string = '';

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	onMount(() => {
		// Chart.jsのコンポーネントを登録
		Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

		// チャートを作成
		chart = new Chart(canvas, {
			type: 'radar',
			data: {
				labels,
				datasets: datasets.map((ds) => ({
					...ds,
					backgroundColor: ds.backgroundColor || 'rgba(59, 130, 246, 0.2)',
					borderColor: ds.borderColor || 'rgb(59, 130, 246)',
					borderWidth: ds.borderWidth || 2,
					pointBackgroundColor: ds.borderColor || 'rgb(59, 130, 246)',
					pointBorderColor: '#fff',
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: ds.borderColor || 'rgb(59, 130, 246)'
				}))
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				scales: {
					r: {
						min: 1,
						max: 4,
						ticks: {
							stepSize: 1,
							backdropColor: 'transparent'
						},
						grid: {
							color: 'rgba(0, 0, 0, 0.1)'
						},
						pointLabels: {
							font: {
								size: 12
							}
						}
					}
				},
				plugins: {
					legend: {
						position: 'bottom',
						labels: {
							padding: 15,
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
								label += context.parsed.r.toFixed(2) + '点';
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

	// データが変更されたらチャートを更新
	$: if (chart && labels && datasets) {
		chart.data.labels = labels;
		chart.data.datasets = datasets.map((ds) => ({
			...ds,
			backgroundColor: ds.backgroundColor || 'rgba(59, 130, 246, 0.2)',
			borderColor: ds.borderColor || 'rgb(59, 130, 246)',
			borderWidth: ds.borderWidth || 2,
			pointBackgroundColor: ds.borderColor || 'rgb(59, 130, 246)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: ds.borderColor || 'rgb(59, 130, 246)'
		}));
		chart.update();
	}
</script>

<div class="bg-white rounded-lg shadow-sm p-6">
	{#if title}
		<h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h3>
	{/if}
	<div class="relative" style="height: 400px;">
		<canvas bind:this={canvas}></canvas>
	</div>
</div>
