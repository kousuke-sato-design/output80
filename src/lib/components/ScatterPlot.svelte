<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, ScatterController, PointElement, LinearScale, Tooltip, Legend } from 'chart.js';

	export let datasets: {
		label: string;
		data: { x: number; y: number }[];
		backgroundColor?: string;
		borderColor?: string;
		pointRadius?: number;
	}[] = [];
	export let title: string = '';
	export let xLabel: string = '';
	export let yLabel: string = '';

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	onMount(() => {
		Chart.register(ScatterController, PointElement, LinearScale, Tooltip, Legend);

		chart = new Chart(canvas, {
			type: 'scatter',
			data: {
				datasets: datasets.map((ds, index) => {
					const colors = [
						{ bg: 'rgba(59, 130, 246, 0.6)', border: 'rgb(59, 130, 246)' },
						{ bg: 'rgba(156, 163, 175, 0.6)', border: 'rgb(156, 163, 175)' },
						{ bg: 'rgba(251, 146, 60, 0.6)', border: 'rgb(251, 146, 60)' }
					];
					const color = colors[index % 3];
					return {
						...ds,
						backgroundColor: ds.backgroundColor || color.bg,
						borderColor: ds.borderColor || color.border,
						pointRadius: ds.pointRadius || 8,
						pointHoverRadius: 10
					};
				})
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				scales: {
					x: {
						type: 'linear',
						position: 'bottom',
						min: 1,
						max: 4,
						title: {
							display: true,
							text: xLabel,
							font: {
								size: 14,
								weight: 'bold'
							}
						},
						grid: {
							color: 'rgba(0, 0, 0, 0.1)'
						}
					},
					y: {
						min: 1,
						max: 4,
						title: {
							display: true,
							text: yLabel,
							font: {
								size: 14,
								weight: 'bold'
							}
						},
						grid: {
							color: 'rgba(0, 0, 0, 0.1)'
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
								const label = context.dataset.label || '';
								const x = context.parsed.x.toFixed(2);
								const y = context.parsed.y.toFixed(2);
								return `${label}: (${x}, ${y})`;
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

	$: if (chart && datasets) {
		chart.data.datasets = datasets.map((ds, index) => {
			const colors = [
				{ bg: 'rgba(59, 130, 246, 0.6)', border: 'rgb(59, 130, 246)' },
				{ bg: 'rgba(156, 163, 175, 0.6)', border: 'rgb(156, 163, 175)' },
				{ bg: 'rgba(251, 146, 60, 0.6)', border: 'rgb(251, 146, 60)' }
			];
			const color = colors[index % 3];
			return {
				...ds,
				backgroundColor: ds.backgroundColor || color.bg,
				borderColor: ds.borderColor || color.border,
				pointRadius: ds.pointRadius || 8,
				pointHoverRadius: 10
			};
		});
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
