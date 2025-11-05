<script lang="ts">
	import FileUpload from '$lib/components/FileUpload.svelte';
</script>

<svelte:head>
	<title>新職業性ストレス簡易調査票フィードバックシステム</title>
</svelte:head>

<div class="space-y-8">
	<!-- ヘッダーセクション -->
	<div class="text-center space-y-4">
		<h2 class="text-3xl font-bold text-gray-900">
			ストレス調査データの分析
		</h2>
		<p class="text-lg text-gray-600 max-w-2xl mx-auto">
			CSVファイルをアップロードすると、自動的に尺度得点を計算し、<br />
			全国平均との比較を含む詳細なフィードバックレポートを生成します。
		</p>
	</div>

	<!-- ファイルアップロード -->
	<FileUpload />

	<!-- サンプルCSVテストボタン -->
	<div class="text-center mt-4">
		<button
			on:click={async () => {
				try {
					const response = await fetch('/test.csv');
					const blob = await response.blob();
					const file = new File([blob], 'test.csv', { type: 'text/csv' });

					// FileUploadコンポーネントのロジックを呼び出す
					const event = new CustomEvent('sample-upload', { detail: file });
					window.dispatchEvent(event);
				} catch (error) {
					console.error('サンプルCSVの読み込みに失敗しました:', error);
				}
			}}
			class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
		>
			サンプルCSVで試す（test.csv）
		</button>
	</div>

	<!-- 説明セクション -->
	<div class="grid md:grid-cols-3 gap-6 mt-12">
		<div class="bg-white p-6 rounded-lg shadow-sm">
			<div class="flex items-center space-x-3 mb-4">
				<div class="flex-shrink-0">
					<div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
						<svg
							class="w-6 h-6 text-primary-600"
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
				</div>
				<h3 class="text-lg font-semibold text-gray-900">1. データアップロード</h3>
			</div>
			<p class="text-gray-600 text-sm">
				80項目の調査結果が含まれたCSVファイルをアップロードします。Shift-JISエンコーディングに対応しています。
			</p>
		</div>

		<div class="bg-white p-6 rounded-lg shadow-sm">
			<div class="flex items-center space-x-3 mb-4">
				<div class="flex-shrink-0">
					<div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
						<svg
							class="w-6 h-6 text-primary-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
					</div>
				</div>
				<h3 class="text-lg font-semibold text-gray-900">2. 自動分析</h3>
			</div>
			<p class="text-gray-600 text-sm">
				仕事の負担、資源、心身の健康など、各尺度の得点を自動的に計算します。全国平均との比較も行います。
			</p>
		</div>

		<div class="bg-white p-6 rounded-lg shadow-sm">
			<div class="flex items-center space-x-3 mb-4">
				<div class="flex-shrink-0">
					<div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
						<svg
							class="w-6 h-6 text-primary-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
							/>
						</svg>
					</div>
				</div>
				<h3 class="text-lg font-semibold text-gray-900">3. 可視化レポート</h3>
			</div>
			<p class="text-gray-600 text-sm">
				レーダーチャート、棒グラフ、散布図などを使って、分析結果をわかりやすく可視化します。
			</p>
		</div>
	</div>

	<!-- 機能説明 -->
	<div class="bg-white rounded-lg shadow-sm p-6 mt-8">
		<h3 class="text-xl font-semibold text-gray-900 mb-4">主な機能</h3>
		<ul class="space-y-3">
			<li class="flex items-start">
				<svg
					class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="text-gray-700">
					<strong>個人フィードバック：</strong>
					各個人のストレス状態を詳細に分析し、レーダーチャートと棒グラフで可視化
				</span>
			</li>
			<li class="flex items-start">
				<svg
					class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="text-gray-700">
					<strong>部署別分析：</strong>
					部署ごとの平均値を算出し、組織全体の傾向を把握
				</span>
			</li>
			<li class="flex items-start">
				<svg
					class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="text-gray-700">
					<strong>全国平均との比較：</strong>
					厚生労働省の調査データに基づく全国平均と比較可能
				</span>
			</li>
			<li class="flex items-start">
				<svg
					class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="text-gray-700">
					<strong>セキュリティ：</strong>
					全ての処理はブラウザ内で完結し、データは外部に送信されません
				</span>
			</li>
		</ul>
	</div>
</div>
