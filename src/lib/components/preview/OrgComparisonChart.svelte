<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Chart,
		BarController,
		BarElement,
		LineController,
		LineElement,
		PointElement,
		CategoryScale,
		LinearScale,
		Tooltip,
		Legend
	} from 'chart.js';
	import type { ComparisonSeries } from '$lib/utils/orgMatrix';

	export let series: ComparisonSeries;
	export let horizontal: boolean = false;

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	function buildConfig() {
		const barColors = series.values.map((_, i) =>
			i === series.orgIndex ? '#2563eb' : '#93c5fd'
		);
		const datasets: any[] = [
			{
				type: 'bar',
				label: series.scaleLabel,
				data: series.values,
				backgroundColor: barColors,
				borderColor: barColors,
				borderWidth: 1,
				order: 2
			}
		];
		if (series.nationalValue !== null) {
			datasets.push({
				type: 'line',
				label: '全国平均(参考)',
				data: series.labels.map(() => series.nationalValue),
				borderColor: '#ef4444',
				borderDash: [6, 4],
				borderWidth: 2,
				pointRadius: 0,
				fill: false,
				order: 1
			});
		}
		return {
			type: 'bar' as const,
			data: { labels: series.labels, datasets },
			options: {
				indexAxis: horizontal ? ('y' as const) : ('x' as const),
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					[horizontal ? 'x' : 'y']: {
						min: 1,
						max: 4,
						ticks: { stepSize: 0.5, font: { size: 11 } }
					},
					[horizontal ? 'y' : 'x']: {
						ticks: { font: { size: 10 }, autoSkip: false, maxRotation: horizontal ? 0 : 60 }
					}
				},
				plugins: {
					legend: { display: true, position: 'top' as const },
					tooltip: {
						callbacks: {
							label: (ctx: any) => {
								const v = horizontal ? ctx.parsed.x : ctx.parsed.y;
								return `${ctx.dataset.label}: ${typeof v === 'number' ? v.toFixed(2) : v}`;
							}
						}
					}
				}
			}
		};
	}

	let mounted = false;

	function render() {
		if (!mounted || !canvas) return;
		if (chart) chart.destroy();
		chart = new Chart(canvas, buildConfig() as any);
	}

	onMount(() => {
		Chart.register(
			BarController,
			BarElement,
			LineController,
			LineElement,
			PointElement,
			CategoryScale,
			LinearScale,
			Tooltip,
			Legend
		);
		mounted = true;
		render();
		return () => chart?.destroy();
	});

	// 指標・ソート・縦横の変更に追従して再描画（destroy→再生成で確実に反映）
	$: {
		series;
		horizontal;
		if (mounted) render();
	}
</script>

<div class="relative w-full" style="height: {horizontal ? Math.max(280, series.labels.length * 26 + 80) : 360}px;">
	<canvas bind:this={canvas}></canvas>
</div>
