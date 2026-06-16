<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend
	} from 'chart.js';

	export let labels: string[] = [];
	export let orgData: number[] = [];
	export let nationalData: number[] = [];

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	function build() {
		return {
			type: 'radar' as const,
			data: {
				labels,
				datasets: [
					{
						label: '当組織',
						data: orgData,
						backgroundColor: 'rgba(37, 99, 235, 0.16)',
						borderColor: '#2563eb',
						borderWidth: 2,
						pointBackgroundColor: '#2563eb',
						pointBorderColor: '#fff',
						pointRadius: 4
					},
					{
						label: '全国平均',
						data: nationalData,
						backgroundColor: 'rgba(245, 158, 11, 0.08)',
						borderColor: '#f59e0b',
						borderWidth: 2,
						borderDash: [5, 4],
						pointBackgroundColor: '#f59e0b',
						pointBorderColor: '#fff',
						pointRadius: 3
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					r: {
						min: 1,
						max: 4,
						ticks: { stepSize: 1, backdropColor: 'transparent', color: '#9ca3af', font: { size: 10 } },
						pointLabels: { font: { size: 12, weight: 'bold' as const }, color: '#374151' },
						grid: { color: 'rgba(0,0,0,0.08)' },
						angleLines: { color: 'rgba(0,0,0,0.08)' }
					}
				},
				plugins: {
					legend: { position: 'bottom' as const, labels: { usePointStyle: true, padding: 14, font: { size: 12 } } },
					tooltip: { callbacks: { label: (c: any) => `${c.dataset.label}: ${Number(c.parsed.r).toFixed(2)}` } }
				}
			}
		};
	}

	let mounted = false;
	function render() {
		if (!mounted || !canvas) return;
		if (chart) chart.destroy();
		chart = new Chart(canvas, build() as any);
	}
	onMount(() => {
		Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
		mounted = true;
		render();
		return () => chart?.destroy();
	});
	$: { labels; orgData; nationalData; if (mounted) render(); }
</script>

<div class="relative w-full aspect-square mx-auto" style="max-width: 360px;">
	<canvas bind:this={canvas}></canvas>
</div>
