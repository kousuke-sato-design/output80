<script lang="ts">
	import { userData } from '$lib/stores/dataStore';
	import OrgDashboard from './OrgDashboard.svelte';
	$: hasData = $userData.length > 0;
</script>

{#if !hasData}
	<div class="space-y-6">
		<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
			<div class="flex items-start">
				<svg class="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
				</svg>
				<div>
					<h3 class="text-sm font-medium text-yellow-800">データがありません</h3>
					<p class="text-sm text-yellow-700 mt-1">CSVファイルをアップロードしてください。</p>
					<a href="/" class="text-sm text-yellow-800 underline mt-2 inline-block">ファイルをアップロード</a>
				</div>
			</div>
		</div>
	</div>
{:else}
	<OrgDashboard />
{/if}
