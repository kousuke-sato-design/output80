<script lang="ts">
	import { page } from '$app/stores';
	import { userData, overallAverage } from '$lib/stores/dataStore';
	import FeedbackReport from '$lib/components/FeedbackReport.svelte';

	$: userId = $page.params.id;
	$: user = $userData.find((u) => u.id === userId);
	$: hasData = user && user.scores;
</script>

<svelte:head>
	<title>個人レポート - {user?.name || 'ユーザー'}</title>
</svelte:head>

<div class="space-y-6">
	<!-- ヘッダー -->
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold text-gray-900">個人フィードバックレポート</h2>
			{#if user}
				<p class="text-gray-600 mt-1">
					{user.name} さん（{user.department}）
				</p>
			{/if}
		</div>
		<a
			href="/preview"
			class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
		>
			← 一覧に戻る
		</a>
	</div>

	{#if !hasData}
		<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
			<div class="flex items-start">
				<svg
					class="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fill-rule="evenodd"
						d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
						clip-rule="evenodd"
					/>
				</svg>
				<div>
					<h3 class="text-sm font-medium text-yellow-800">データが見つかりません</h3>
					<p class="text-sm text-yellow-700 mt-1">
						指定されたユーザーのデータが見つかりません。
					</p>
				</div>
			</div>
		</div>
	{:else}
		<FeedbackReport
			userScore={user.scores}
			organizationAvg={$overallAverage}
			userName={user.name}
			userDepartment={user.department}
		/>
	{/if}
</div>
