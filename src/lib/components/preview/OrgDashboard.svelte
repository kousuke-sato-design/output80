<script lang="ts">
	import { userData, departments, overallAverage } from '$lib/stores/dataStore';
	import { exportOrgExcel } from '$lib/utils/exportExcel';
	import { exportElementToPdf } from '$lib/utils/exportPdf';
	import OrgVsNational from './OrgVsNational.svelte';
	import GroupComparison from './GroupComparison.svelte';

	let view: 'org' | 'group' = 'org';
	let reportEl: HTMLElement;
	let pdfLoading = false;

	$: totalUsers = $userData.length;
	$: deptCount = $departments.length;

	function pad(n: number) { return String(n).padStart(2, '0'); }
	function dateStr(): string {
		const d = new Date();
		return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
	}
	async function handlePdf() {
		if (!reportEl || pdfLoading) return;
		pdfLoading = true;
		try {
			await exportElementToPdf(reportEl, `組織レポート_${dateStr()}.pdf`);
		} catch (e) {
			console.error('PDF生成エラー:', e);
			alert('PDFの生成に失敗しました。');
		} finally {
			pdfLoading = false;
		}
	}
	function handleExcel() {
		exportOrgExcel($userData, $overallAverage, dateStr());
	}
</script>

<div class="space-y-5 org-dashboard">
	<div class="flex flex-wrap items-center justify-between gap-3 print:hidden">
		<div>
			<h3 class="text-lg font-bold text-gray-900">組織レポート（1〜2ページ）</h3>
			<p class="text-sm text-gray-600">組織は全国平均と比較、職場・属性は「グループ比較」で確認できます</p>
		</div>
		<div class="flex items-center gap-2">
			<button
				on:click={handlePdf}
				disabled={pdfLoading}
				class="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-wait"
			>
				{pdfLoading ? 'PDF生成中…' : 'PDFダウンロード'}
			</button>
			<button on:click={handleExcel} class="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Excelダウンロード</button>
		</div>
	</div>

	<!-- サブタブ -->
	<div class="inline-flex rounded-lg border border-gray-300 overflow-hidden print:hidden">
		<button class="px-4 py-2 text-sm {view === 'org' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}" on:click={() => (view = 'org')}>組織全体（vs 全国）</button>
		<button class="px-4 py-2 text-sm {view === 'group' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}" on:click={() => (view = 'group')}>グループ比較（部署・男女ほか）</button>
	</div>

	<!-- PDFキャプチャ対象（操作UIは含めない） -->
	<div bind:this={reportEl} class="space-y-5">
		{#if view === 'org'}
			<OrgVsNational overallAverage={$overallAverage} {totalUsers} {deptCount} />
		{:else}
			<GroupComparison />
		{/if}
	</div>
</div>
