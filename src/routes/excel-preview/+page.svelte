<script lang="ts">
	import * as XLSX from 'xlsx';
	import { onMount } from 'svelte';

	let excelData: any[][] = [];
	let sheetNames: string[] = [];
	let currentSheet = 0;
	let isDragging = false;
	let fileName = '';

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	async function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;

		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			await readExcelFile(files[0]);
		}
	}

	async function handleFileInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const files = target.files;
		if (files && files.length > 0) {
			await readExcelFile(files[0]);
		}
	}

	async function readExcelFile(file: File) {
		fileName = file.name;
		const data = await file.arrayBuffer();
		const workbook = XLSX.read(data);

		sheetNames = workbook.SheetNames;
		currentSheet = 0;

		// 全シートのデータを読み込む
		const allSheets: any[][] = [];
		for (const sheetName of sheetNames) {
			const worksheet = workbook.Sheets[sheetName];
			const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
			allSheets.push(jsonData as any[][]);
		}

		excelData = allSheets;
	}

	function changeSheet(index: number) {
		currentSheet = index;
	}

	$: currentData = excelData[currentSheet] || [];
</script>

<svelte:head>
	<title>Excelプレビュー</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-8">
	<div class="max-w-7xl mx-auto">
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-900">Excelファイルプレビュー</h1>
			<p class="text-gray-600 mt-2">
				エクセルファイル（.xls, .xlsx）をドラッグ&ドロップまたは選択してください
			</p>
			<a href="/" class="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
				← ホームに戻る
			</a>
		</div>

		{#if !fileName}
			<!-- ドロップゾーン -->
			<div
				class="border-4 border-dashed rounded-lg p-12 text-center transition-colors {isDragging
					? 'border-blue-500 bg-blue-50'
					: 'border-gray-300 bg-white'}"
				on:dragover={handleDragOver}
				on:dragleave={handleDragLeave}
				on:drop={handleDrop}
			>
				<svg
					class="mx-auto h-16 w-16 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
					/>
				</svg>
				<p class="mt-4 text-lg text-gray-600">エクセルファイルをドラッグ&ドロップ</p>
				<p class="mt-2 text-sm text-gray-500">または</p>
				<label
					class="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
				>
					ファイルを選択
					<input
						type="file"
						class="hidden"
						accept=".xls,.xlsx"
						on:change={handleFileInput}
					/>
				</label>
			</div>
		{:else}
			<!-- ファイル情報 -->
			<div class="bg-white rounded-lg shadow-sm p-6 mb-6">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-xl font-semibold text-gray-900">{fileName}</h2>
						<p class="text-sm text-gray-600 mt-1">
							{sheetNames.length} シート
						</p>
					</div>
					<button
						on:click={() => {
							fileName = '';
							excelData = [];
							sheetNames = [];
							currentSheet = 0;
						}}
						class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
					>
						別のファイルを選択
					</button>
				</div>
			</div>

			<!-- シートタブ -->
			{#if sheetNames.length > 1}
				<div class="bg-white rounded-lg shadow-sm p-4 mb-6">
					<div class="flex gap-2 overflow-x-auto">
						{#each sheetNames as sheetName, i}
							<button
								on:click={() => changeSheet(i)}
								class="px-4 py-2 rounded-lg transition-colors whitespace-nowrap {i === currentSheet
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
							>
								{sheetName}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- データテーブル -->
			<div class="bg-white rounded-lg shadow-sm overflow-hidden">
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<tbody class="bg-white divide-y divide-gray-200">
							{#each currentData as row, i}
								<tr class={i === 0 ? 'bg-gray-50 font-semibold' : 'hover:bg-gray-50'}>
									{#each row as cell, j}
										<td class="px-4 py-2 text-sm text-gray-900 whitespace-nowrap border-r border-gray-200">
											{cell || ''}
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				{#if currentData.length === 0}
					<div class="p-8 text-center text-gray-500">
						このシートにはデータがありません
					</div>
				{/if}
			</div>

			<!-- データ情報 -->
			<div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-blue-900 mb-3">📊 このデータについて</h3>
				<div class="space-y-2 text-sm text-blue-800">
					<p><strong>総行数:</strong> {currentData.length}</p>
					{#if currentData.length > 0}
						<p><strong>総列数:</strong> {currentData[0]?.length || 0}</p>
					{/if}
					<p class="mt-4 text-blue-700">
						このプレビューを使って、エクセルファイルの内容を確認できます。<br />
						フィードバックレポートの形式を理解するために、このデータを参照してください。
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>
