<script lang="ts">
	import '../app.css';
</script>

<div class="min-h-screen bg-gray-50">
	<!-- ヘッダー -->
	<header class="bg-white shadow-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex items-center justify-between">
				<a href="/" class="flex items-center space-x-2">
					<svg
						class="w-8 h-8 text-primary-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<div>
						<h1 class="text-xl font-bold text-gray-900">
							新職業性ストレス簡易調査票
						</h1>
						<p class="text-xs text-gray-500">フィードバックシステム</p>
					</div>
				</a>

				<nav class="flex items-center space-x-4">
					<a
						href="/"
						class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
					>
						ホーム
					</a>
					<a
						href="/preview"
						class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
					>
						データ確認
					</a>
				</nav>
			</div>
		</div>
	</header>

	<!-- メインコンテンツ -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<slot />
	</main>

	<!-- フッター -->
	<footer class="bg-white border-t mt-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<p class="text-center text-sm text-gray-500">
				新職業性ストレス簡易調査票フィードバックシステム
			</p>
		</div>
	</footer>
</div>
