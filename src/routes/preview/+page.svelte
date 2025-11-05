<script lang="ts">
	import { userData, departments, departmentData } from '$lib/stores/dataStore';
	import { goto } from '$app/navigation';

	$: hasData = $userData.length > 0;
	$: departmentList = $departments;

	function getDepartmentUserCount(dept: string): number {
		return $departmentData.get(dept)?.length || 0;
	}

	function viewUserReport(userId: string) {
		goto(`/report/individual/${userId}`);
	}

	function viewDepartmentReport(dept: string) {
		goto(`/report/department/${encodeURIComponent(dept)}`);
	}

	function viewOrganizationReport() {
		goto('/report/organization');
	}
</script>

<svelte:head>
	<title>データ確認 - ストレス調査フィードバックシステム</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
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
					<h3 class="text-sm font-medium text-yellow-800">データがありません</h3>
					<p class="text-sm text-yellow-700 mt-1">
						CSVファイルをアップロードしてください。
					</p>
					<a href="/" class="text-sm text-yellow-800 underline mt-2 inline-block">
						ファイルをアップロード
					</a>
				</div>
			</div>
		</div>
	{:else}
		<!-- 組織全体レポートボタン -->
		<div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-lg font-semibold">組織全体のレポート</h3>
					<p class="text-sm text-blue-100 mt-1">
						全従業員の平均スコアと全国平均との比較を確認できます
					</p>
				</div>
				<button
					on:click={viewOrganizationReport}
					class="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						/>
					</svg>
					<span>組織レポートを見る</span>
				</button>
			</div>
		</div>

		<!-- データサマリー -->
		<div class="grid md:grid-cols-3 gap-6">
			<div class="bg-white rounded-lg shadow-sm p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">総ユーザー数</p>
						<p class="text-3xl font-bold text-gray-900 mt-1">{$userData.length}</p>
					</div>
					<div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
						<svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
							/>
						</svg>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-sm p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">部署数</p>
						<p class="text-3xl font-bold text-gray-900 mt-1">{departmentList.length}</p>
					</div>
					<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
						<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-sm p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">回答項目数</p>
						<p class="text-3xl font-bold text-gray-900 mt-1">80</p>
					</div>
					<div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
						<svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- 部署一覧 -->
		<div class="bg-white rounded-lg shadow-sm overflow-hidden">
			<div class="px-6 py-4 border-b border-gray-200">
				<h3 class="text-lg font-semibold text-gray-900">部署一覧</h3>
			</div>
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								部署名
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								人数
							</th>
							<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								アクション
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each departmentList as dept}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{dept}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">{getDepartmentUserCount(dept)}名</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right">
									<button
										on:click={() => viewDepartmentReport(dept)}
										class="text-sm text-primary-600 hover:text-primary-800 font-medium"
									>
										レポートを見る →
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- ユーザー一覧 -->
		<div class="bg-white rounded-lg shadow-sm overflow-hidden">
			<div class="px-6 py-4 border-b border-gray-200">
				<h3 class="text-lg font-semibold text-gray-900">ユーザー一覧（最初の10件）</h3>
			</div>
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								ID
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								氏名
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								部署
							</th>
							<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								アクション
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each $userData.slice(0, 10) as user}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">{user.id}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{user.name}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">{user.department}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right">
									<button
										on:click={() => viewUserReport(user.id)}
										class="text-sm text-primary-600 hover:text-primary-800 font-medium"
									>
										詳細を見る →
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			{#if $userData.length > 10}
				<div class="px-6 py-4 bg-gray-50 text-sm text-gray-600 text-center">
					...他 {$userData.length - 10} 件
				</div>
			{/if}
		</div>
	{/if}
</div>
