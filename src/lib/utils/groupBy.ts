import type { UserData, DepartmentData } from '$lib/types';
import { calculateAverageScores } from './scoreCalculator';

/** グループ軸（'部署' は department、それ以外は attributes のキー） */
export const ATTRIBUTE_AXES = ['性別', '年代', '役職', '職種', '事業所', '所属', '職場診断用1'];

export function groupValueOf(u: UserData, axis: string): string | undefined {
	if (axis === '部署') return u.department;
	return u.attributes?.[axis];
}

/** データが存在する軸だけを返す（'部署' は常に先頭。属性は非空値が1件でもあれば採用） */
export function availableAxes(users: UserData[]): string[] {
	const axes = ['部署'];
	for (const k of ATTRIBUTE_AXES) {
		if (users.some((u) => u.attributes?.[k])) axes.push(k);
	}
	return axes;
}

/** 指定軸でユーザーをグループ化し、各グループの平均スコアを返す（DepartmentDataと同形）。 */
export function groupAverages(users: UserData[], axis: string): Map<string, DepartmentData> {
	const buckets = new Map<string, UserData[]>();
	for (const u of users) {
		const v = groupValueOf(u, axis);
		if (!v) continue;
		if (!buckets.has(v)) buckets.set(v, []);
		buckets.get(v)!.push(u);
	}
	const result = new Map<string, DepartmentData>();
	const keys = Array.from(buckets.keys()).sort((a, b) => a.localeCompare(b, 'ja'));
	for (const k of keys) {
		const list = buckets.get(k)!;
		const scores = list.map((u) => u.scores).filter((s): s is NonNullable<typeof s> => s !== undefined);
		if (scores.length > 0) {
			result.set(k, { name: k, userCount: list.length, averageScores: calculateAverageScores(scores) });
		}
	}
	return result;
}
