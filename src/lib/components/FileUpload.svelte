<script lang="ts">
	import { parseCSV, validateCSVData } from '$lib/utils/csvParser';
	import { userData } from '$lib/stores/dataStore';
	import { goto } from '$app/navigation';

	let isDragging = false;
	let isLoading = false;
	let error: string | null = null;
	let successMessage: string | null = null;

	async function handleFile(file: File) {
		if (!file.name.endsWith('.csv')) {
			error = 'CSVファイルを選択してください';
			return;
		}

		isLoading = true;
		error = null;
		successMessage = null;

		try {
			const result = await parseCSV(file);

			if (!result.success || !result.data) {
				error = result.error || 'データの解析に失敗しました';
				isLoading = false;
				return;
			}

			// データの検証
			const validation = validateCSVData(result.data);
			if (!validation.isValid) {
				error = `データ検証エラー:\n${validation.errors.join('\n')}`;
				isLoading = false;
				return;
			}

			// ストアにデータを保存
			userData.set(result.data);
			successMessage = `${result.data.length}件のデータを読み込みました`;

			// 少し待ってからプレビューページへ遷移
			setTimeout(() => {
				goto('/preview');
			}, 1000);
		} catch (err) {
			error = err instanceof Error ? err.message : '予期しないエラーが発生しました';
		} finally {
			isLoading = false;
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;

		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			handleFile(files[0]);
		}
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const files = input.files;
		if (files && files.length > 0) {
			handleFile(files[0]);
		}
	}
</script>

<div class="w-full max-w-2xl mx-auto">
	<div
		class="border-2 border-dashed rounded-lg p-8 text-center transition-colors
			{isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-white'}
			{isLoading ? 'opacity-50 pointer-events-none' : ''}"
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:drop={handleDrop}
		role="button"
		tabindex="0"
	>
		{#if isLoading}
			<div class="flex flex-col items-center space-y-4">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
				<p class="text-gray-600">データを処理中...</p>
			</div>
		{:else}
			<div class="space-y-4">
				<div class="flex justify-center">
					<svg
						class="w-16 h-16 text-gray-400"
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
				</div>

				<div>
					<p class="text-lg font-medium text-gray-700">
						CSVファイルをドラッグ&ドロップ
					</p>
					<p class="text-sm text-gray-500 mt-1">または</p>
				</div>

				<label
					class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg
						hover:bg-primary-700 cursor-pointer transition-colors"
				>
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					ファイルを選択
					<input
						type="file"
						accept=".csv"
						class="hidden"
						on:change={handleFileSelect}
					/>
				</label>

				<p class="text-xs text-gray-500">
					対応形式: .csv（最大10MB）
				</p>
			</div>
		{/if}
	</div>

	<!-- エラーメッセージ -->
	{#if error}
		<div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
			<div class="flex items-start">
				<svg class="w-5 h-5 text-red-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
						clip-rule="evenodd"
					/>
				</svg>
				<div class="flex-1">
					<h3 class="text-sm font-medium text-red-800">エラー</h3>
					<p class="text-sm text-red-700 mt-1 whitespace-pre-line">{error}</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- 成功メッセージ -->
	{#if successMessage}
		<div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
			<div class="flex items-start">
				<svg class="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
				<div class="flex-1">
					<h3 class="text-sm font-medium text-green-800">成功</h3>
					<p class="text-sm text-green-700 mt-1">{successMessage}</p>
				</div>
			</div>
		</div>
	{/if}
</div>
