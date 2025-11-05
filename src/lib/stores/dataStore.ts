import { writable, derived } from 'svelte/store';
import type { UserData, DepartmentData } from '$lib/types';
import { calculateAverageScores } from '$lib/utils/scoreCalculator';
import { getUsersByDepartment } from '$lib/utils/csvParser';

// アップロードされたユーザーデータ
export const userData = writable<UserData[]>([]);

// 選択中の部署
export const selectedDepartment = writable<string>('all');

// 部署ごとのデータ（派生ストア）
export const departmentData = derived(userData, ($userData) => {
	if ($userData.length === 0) return new Map<string, UserData[]>();
	return getUsersByDepartment($userData);
});

// 部署一覧（派生ストア）
export const departments = derived(departmentData, ($departmentData) => {
	return Array.from($departmentData.keys()).sort();
});

// 部署別の平均得点（派生ストア）
export const departmentAverages = derived(departmentData, ($departmentData) => {
	const averages = new Map<string, DepartmentData>();

	for (const [deptName, users] of $departmentData.entries()) {
		const scores = users.map((u) => u.scores).filter((s) => s !== undefined);

		if (scores.length > 0) {
			averages.set(deptName, {
				name: deptName,
				userCount: users.length,
				averageScores: calculateAverageScores(scores as any[])
			});
		}
	}

	return averages;
});

// 選択中の部署のユーザー（派生ストア）
export const selectedDepartmentUsers = derived(
	[userData, selectedDepartment, departmentData],
	([$userData, $selectedDepartment, $departmentData]) => {
		if ($selectedDepartment === 'all') {
			return $userData;
		}
		return $departmentData.get($selectedDepartment) || [];
	}
);

// 全体の平均得点（派生ストア）
export const overallAverage = derived(userData, ($userData) => {
	if ($userData.length === 0) return null;

	const scores = $userData.map((u) => u.scores).filter((s) => s !== undefined);

	if (scores.length === 0) return null;

	return calculateAverageScores(scores as any[]);
});

// データをリセット
export function resetData() {
	userData.set([]);
	selectedDepartment.set('all');
}
