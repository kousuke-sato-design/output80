import Papa from 'papaparse';
import type { UserData, UploadResult } from '$lib/types';
import { calculateScores } from './scoreCalculator';

/**
 * CSVファイルを解析してUserDataの配列に変換する
 */
export async function parseCSV(file: File): Promise<UploadResult> {
	try {
		// まずUTF-8で試す
		let text = await readFileAsText(file, 'UTF-8');

		// 文字化けチェック（簡易版）
		if (text.includes('�')) {
			// Shift-JISで再試行
			text = await readFileAsText(file, 'Shift-JIS');
		}

		return new Promise((resolve) => {
			Papa.parse(text, {
				header: false, // 手動でヘッダーを処理
				skipEmptyLines: true,
				complete: (results) => {
					try {
						const userData = processCSVData(results.data as string[][]);
						resolve({
							success: true,
							data: userData
						});
					} catch (error) {
						resolve({
							success: false,
							error: error instanceof Error ? error.message : 'データ処理エラー'
						});
					}
				},
				error: (error) => {
					resolve({
						success: false,
						error: `CSV解析エラー: ${error.message}`
					});
				}
			});
		});
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'ファイル読み込みエラー'
		};
	}
}

/**
 * ファイルをテキストとして読み込む
 */
function readFileAsText(file: File, encoding: string = 'UTF-8'): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target?.result) {
				resolve(e.target.result as string);
			} else {
				reject(new Error('ファイルの読み込みに失敗しました'));
			}
		};
		reader.onerror = () => reject(new Error('ファイルの読み込みエラー'));
		reader.readAsText(file, encoding);
	});
}

/**
 * CSVデータをUserData配列に変換する
 */
function processCSVData(data: string[][]): UserData[] {
	const userData: UserData[] = [];

	// 1行目はカラム番号、2行目がヘッダー、3行目以降がデータ
	if (data.length < 3) {
		throw new Error('CSVファイルの形式が正しくありません');
	}

	const headers = data[1]; // 2行目がヘッダー

	// ヘッダーからカラムインデックスを取得
	const getColumnIndex = (keyword: string): number => {
		return headers.findIndex(h => h && h.includes(keyword));
	};

	// 各カラムのインデックスを取得
	const idIndex = getColumnIndex('ID');
	const nameIndex = getColumnIndex('氏名');
	const deptIndex = headers.findIndex(h => h && (h.includes('部署') || h.includes('所属')));

	// 質問項目のカラムを探す（No001～No080）
	const questionIndices: number[] = [];
	for (let j = 1; j <= 80; j++) {
		const questionNum = j.toString().padStart(3, '0');
		const index = headers.findIndex(h => h && h.includes(`No${questionNum}`));
		questionIndices.push(index);
	}

	// 3行目以降がデータ
	for (let i = 2; i < data.length; i++) {
		const row = data[i];

		// 空行をスキップ
		if (!row || row.length === 0 || row.every(cell => !cell)) continue;

		try {
			// 80項目の回答を抽出
			const responses: number[] = [];
			for (const qIndex of questionIndices) {
				if (qIndex === -1 || !row[qIndex]) {
					responses.push(0);
				} else {
					const value = row[qIndex].trim();
					const numValue = parseInt(value, 10);
					// 1-4の範囲チェック
					if (numValue >= 1 && numValue <= 4) {
						responses.push(numValue);
					} else {
						responses.push(0);
					}
				}
			}

			// 有効な回答があるかチェック（全て0でないか）
			const hasValidResponses = responses.some((r) => r !== 0);
			if (!hasValidResponses) {
				console.warn(`行${i + 1}: 有効な回答がありません`);
				continue;
			}

			// ユーザーデータを作成
			const user: UserData = {
				id: idIndex !== -1 ? (row[idIndex] || `user_${i - 1}`) : `user_${i - 1}`,
				name: nameIndex !== -1 ? (row[nameIndex] || `ユーザー${i - 1}`) : `ユーザー${i - 1}`,
				department: deptIndex !== -1 ? (row[deptIndex] || '未設定') : '未設定',
				responses: responses
			};

			// 尺度得点を計算
			user.scores = calculateScores(responses);

			userData.push(user);
		} catch (error) {
			console.error(`行${i + 1}の処理中にエラー:`, error);
			// エラーがあっても処理を続行
		}
	}

	if (userData.length === 0) {
		throw new Error('有効なデータが見つかりませんでした');
	}

	return userData;
}

/**
 * データの検証
 */
export function validateCSVData(data: UserData[]): {
	isValid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (data.length === 0) {
		errors.push('データが空です');
		return { isValid: false, errors };
	}

	// 各ユーザーデータの検証
	for (let i = 0; i < data.length; i++) {
		const user = data[i];

		if (!user.id) {
			errors.push(`行${i + 1}: IDが設定されていません`);
		}

		if (!user.responses || user.responses.length !== 80) {
			errors.push(`行${i + 1}: 回答が80項目ではありません（${user.responses?.length || 0}項目）`);
		}

		// 回答値の範囲チェック
		if (user.responses) {
			const invalidValues = user.responses.filter((r) => r < 0 || r > 4);
			if (invalidValues.length > 0) {
				errors.push(`行${i + 1}: 不正な回答値が含まれています`);
			}
		}
	}

	return {
		isValid: errors.length === 0,
		errors
	};
}

/**
 * 部署ごとのユーザーを抽出
 */
export function getUsersByDepartment(data: UserData[]): Map<string, UserData[]> {
	const departmentMap = new Map<string, UserData[]>();

	for (const user of data) {
		const dept = user.department || '未設定';
		if (!departmentMap.has(dept)) {
			departmentMap.set(dept, []);
		}
		departmentMap.get(dept)!.push(user);
	}

	return departmentMap;
}
