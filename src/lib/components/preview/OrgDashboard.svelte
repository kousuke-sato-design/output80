<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { userData, departments, overallAverage } from '$lib/stores/dataStore';
	import { exportOrgExcel } from '$lib/utils/exportExcel';
	import { exportElementToPdf } from '$lib/utils/exportPdf';
	import { SOURCE_NOTE } from '$lib/data/scaleDescriptions';
	import OrgSummary from './OrgSummary.svelte';
	import OrgVsNational from './OrgVsNational.svelte';
	import GroupComparison from './GroupComparison.svelte';

	let view: 'org' | 'group' = 'org';
	// 印刷・PDF時は表示中のタブに関係なく全セクション（組織全体＋グループ比較）を連結して出力する
	let printing = false;
	let reportEl: HTMLElement;
	let pdfLoading = false;

	$: totalUsers = $userData.length;
	$: deptCount = $departments.length;

	function pad(n: number) { return String(n).padStart(2, '0'); }
	function dateStr(): string {
		const d = new Date();
		return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
	}
	/** 印刷：ブラウザの印刷機能（UIをそのまま出力するため画面とずれない） */
	async function handlePrint() {
		printing = true;
		await tick();
		await new Promise((r) => setTimeout(r, 500));
		window.print();
		// afterprint でも戻すが、印刷ダイアログをキャンセルした場合に備えて少し後にも戻す
		setTimeout(() => (printing = false), 1000);
	}
	/**
	 * PDF保存：ワンクリックでPDFファイルをダウンロードする。
	 * html-to-image（ブラウザ自身の描画をそのまま画像化）を使うため画面とずれない。
	 */
	async function handlePdfSave() {
		if (!reportEl || pdfLoading) return;
		pdfLoading = true;
		printing = true; // 全セクションをレンダリング
		try {
			await tick();
			await new Promise((r) => setTimeout(r, 600));
			await exportElementToPdf(reportEl, `組織レポート_${dateStr()}.pdf`);
		} catch (e) {
			console.error('PDF生成エラー:', e);
			alert('PDFの生成に失敗しました。「印刷」から「PDFに保存」もご利用いただけます。');
		} finally {
			printing = false;
			pdfLoading = false;
		}
	}
	function handleExcel() {
		exportOrgExcel($userData, $overallAverage, dateStr());
	}

	onMount(() => {
		// Ctrl+P にもできる範囲で追従（チャートの描画が間に合わない場合があるため「印刷」ボタン推奨）
		const before = () => (printing = true);
		const after = () => (printing = false);
		window.addEventListener('beforeprint', before);
		window.addEventListener('afterprint', after);
		return () => {
			window.removeEventListener('beforeprint', before);
			window.removeEventListener('afterprint', after);
		};
	});
</script>

<div class="space-y-5 org-dashboard">
	<div class="flex flex-wrap items-center justify-between gap-3 print:hidden">
		<div>
			<h3 class="text-lg font-bold text-gray-900">組織レポート</h3>
			<p class="text-sm text-gray-600">印刷・PDFには表紙／全体図／各プロフィール／グループ比較がすべて含まれます（画面と同じ内容がそのまま出力されます）</p>
		</div>
		<div class="flex items-center gap-2">
			<button
				on:click={handlePrint}
				class="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
				title="ブラウザの印刷機能で紙に印刷します"
			>
				印刷
			</button>
			<button
				on:click={handlePdfSave}
				disabled={pdfLoading}
				class="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-wait"
				title="画面と同じ内容のPDFファイルをダウンロードします"
			>
				{pdfLoading ? 'PDF生成中…' : 'PDF保存'}
			</button>
			<button on:click={handleExcel} class="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Excelダウンロード</button>
		</div>
	</div>

	<!-- PDFキャプチャ対象（レポート本体全部。操作UIは print:hidden で除外） -->
	<div bind:this={reportEl} class="space-y-5">
		<!-- 1ページ目：表紙（BETA・作成提供・レポートの見方） -->
		<OrgSummary {totalUsers} {deptCount} exporting={pdfLoading} />

		<!-- サブタブ（画面のみ） -->
		<div class="print:hidden">
			<div class="inline-flex rounded-lg border border-gray-300 overflow-hidden">
				<button class="px-4 py-2 text-sm {view === 'org' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}" on:click={() => (view = 'org')}>組織全体（vs 全国）</button>
				<button class="px-4 py-2 text-sm {view === 'group' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}" on:click={() => (view = 'group')}>グループ比較（部署・男女ほか）</button>
			</div>
		</div>

		{#if view === 'org' || printing}
			<div class="space-y-5 print:break-before-page">
				<OrgVsNational overallAverage={$overallAverage} {totalUsers} {deptCount} />
			</div>
		{/if}
		{#if view === 'group' || printing}
			<div class="space-y-5 print:break-before-page">
				<GroupComparison />
			</div>
		{/if}

		<!-- レポート奥付（出典・ベータ版表記・作成提供元） -->
		<div data-pdf-block class="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 break-inside-avoid">
			<p class="text-xs text-gray-500 leading-relaxed mb-2">{SOURCE_NOTE}</p>
			<div class="flex flex-wrap items-center justify-between gap-2">
				<p class="text-sm text-amber-800">
					<span class="font-bold tracking-wider bg-amber-400 text-amber-950 rounded px-1.5 py-0.5 mr-2">BETA版</span>
					本レポートはベータ版システムによる出力です。数値・表示内容は検証中のため、今後変更される場合があります。
				</p>
				<p class="text-sm font-semibold text-gray-700">作成・提供：株式会社総合心理教育研究所</p>
			</div>
		</div>
	</div>
</div>
