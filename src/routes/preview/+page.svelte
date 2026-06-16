<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import PreviewLegacy from '$lib/components/preview/PreviewLegacy.svelte';
	import PreviewNew from '$lib/components/preview/PreviewNew.svelte';

	$: design = $page.url.searchParams.get('design') === 'new' ? 'new' : 'old';

	function selectDesign(d: 'old' | 'new') {
		goto(`/preview?design=${d}`, { keepFocus: true, noScroll: true });
	}
</script>

<svelte:head>
	<title>データ確認 - ストレス調査フィードバックシステム</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between print:hidden">
		<div>
			<h2 class="text-2xl font-bold text-gray-900">データ確認</h2>
			<p class="text-gray-600 mt-1">
				アップロードされたデータの概要を確認できます
			</p>
		</div>
		<a
			href="/"
			class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
		>
			← 戻る
		</a>
	</div>

	<div class="border-b border-gray-200 print:hidden">
		<nav class="-mb-px flex space-x-6">
			<button
				on:click={() => selectDesign('old')}
				class="py-3 px-1 border-b-2 text-sm font-medium transition-colors {design === 'old'
					? 'border-primary-600 text-primary-600'
					: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
			>
				旧デザイン
			</button>
			<button
				on:click={() => selectDesign('new')}
				class="py-3 px-1 border-b-2 text-sm font-medium transition-colors {design === 'new'
					? 'border-primary-600 text-primary-600'
					: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
			>
				新デザイン
			</button>
		</nav>
	</div>

	{#if design === 'new'}
		<PreviewNew />
	{:else}
		<PreviewLegacy />
	{/if}
</div>
