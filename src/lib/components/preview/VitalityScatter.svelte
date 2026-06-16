<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, ScatterController, PointElement, LinearScale, Tooltip, Legend } from 'chart.js';

	// {label, x, y, color, pointStyle}
	export let points: { label: string; x: number; y: number; color: string; style?: 'circle' | 'rectRot' }[] = [];
	export let xLabel = '';
	export let yLabel = '';

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	// 4象限グラデ背景＋区分線＋コーナーラベル（このチャート専用プラグイン）
	const quadrantBg = {
		id: 'quadrantBg',
		beforeDatasetsDraw(c: any) {
			const { ctx, chartArea, scales } = c;
			if (!chartArea) return;
			const { left, top, right, bottom } = chartArea;
			const g = ctx.createLinearGradient(left, bottom, right, top);
			g.addColorStop(0, 'rgba(248, 180, 180, 0.45)'); // 左下=要支援(赤系)
			g.addColorStop(0.5, 'rgba(254, 240, 199, 0.5)'); // 中央=黄
			g.addColorStop(1, 'rgba(167, 243, 208, 0.55)'); // 右上=いきいき(緑系)
			ctx.save();
			ctx.fillStyle = g;
			ctx.fillRect(left, top, right - left, bottom - top);
			// 中央(2.5)の区分線
			const xMid = scales.x.getPixelForValue(2.5);
			const yMid = scales.y.getPixelForValue(2.5);
			ctx.strokeStyle = 'rgba(107,114,128,0.4)';
			ctx.lineWidth = 1;
			ctx.setLineDash([4, 4]);
			ctx.beginPath(); ctx.moveTo(xMid, top); ctx.lineTo(xMid, bottom); ctx.stroke();
			ctx.beginPath(); ctx.moveTo(left, yMid); ctx.lineTo(right, yMid); ctx.stroke();
			ctx.setLineDash([]);
			// コーナーラベル
			ctx.font = '700 11px system-ui, sans-serif';
			ctx.textBaseline = 'top';
			ctx.fillStyle = 'rgba(21,128,61,0.85)';
			ctx.textAlign = 'right';
			ctx.fillText('いきいき', right - 8, top + 6);
			ctx.fillStyle = 'rgba(185,28,28,0.8)';
			ctx.textAlign = 'left';
			ctx.textBaseline = 'bottom';
			ctx.fillText('要支援', left + 8, bottom - 6);
			ctx.restore();
		}
	};

	function build() {
		return {
			type: 'scatter' as const,
			data: {
				datasets: points.map((p) => ({
					label: p.label,
					data: [{ x: p.x, y: p.y }],
					backgroundColor: p.color,
					borderColor: '#ffffff',
					borderWidth: 2,
					pointRadius: 10,
					pointHoverRadius: 12,
					pointStyle: p.style || 'circle'
				}))
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				layout: { padding: 4 },
				scales: {
					x: {
						type: 'linear' as const, min: 1, max: 4,
						title: { display: true, text: xLabel, font: { size: 12, weight: 'bold' as const }, color: '#4b5563' },
						ticks: { stepSize: 1, color: '#6b7280' },
						grid: { color: 'rgba(0,0,0,0.05)' }
					},
					y: {
						min: 1, max: 4,
						title: { display: true, text: yLabel, font: { size: 12, weight: 'bold' as const }, color: '#4b5563' },
						ticks: { stepSize: 1, color: '#6b7280' },
						grid: { color: 'rgba(0,0,0,0.05)' }
					}
				},
				plugins: {
					legend: { position: 'bottom' as const, labels: { usePointStyle: true, padding: 14, font: { size: 12 } } },
					tooltip: {
						callbacks: {
							label: (ctx: any) => `${ctx.dataset.label}: 職場 ${ctx.parsed.x.toFixed(2)} / 個人 ${ctx.parsed.y.toFixed(2)}`
						}
					}
				}
			},
			plugins: [quadrantBg]
		};
	}

	let mounted = false;
	function render() {
		if (!mounted || !canvas) return;
		if (chart) chart.destroy();
		chart = new Chart(canvas, build() as any);
	}
	onMount(() => {
		Chart.register(ScatterController, PointElement, LinearScale, Tooltip, Legend);
		mounted = true;
		render();
		return () => chart?.destroy();
	});
	$: { points; if (mounted) render(); }
</script>

<div class="relative w-full aspect-square mx-auto" style="max-width: 360px;">
	<canvas bind:this={canvas}></canvas>
</div>
