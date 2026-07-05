import Papa from 'papaparse';
import type { UserData, UploadResult } from '$lib/types';
import { calculateScores } from './scoreCalculator';
import { ORIGINAL_QUESTION_MAP } from '$lib/data/originalQuestionMap';

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
						const rows = results.data as string[][];
						const userData = processCSVData(rows);
						resolve({
							success: true,
							data: userData,
							companyName: extractCompanyName(rows)
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
 * 「企業名」列の最初の非空値を返す（レポート表紙の企業名初期値に使う）。
 * 列が無い・全て空なら undefined。
 */
function extractCompanyName(data: string[][]): string | undefined {
	if (data.length < 3) return undefined;
	const headers = data[1];
	const idx = headers.findIndex((h) => h && h.trim() === '企業名');
	if (idx === -1) return undefined;
	for (let i = 2; i < data.length; i++) {
		const v = (data[i]?.[idx] || '').trim();
		if (v) return v;
	}
	return undefined;
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
	const exact = (name: string) => headers.findIndex((h) => h && h.trim() === name);
	const idIndex = getColumnIndex('ID');
	const nameIndex = getColumnIndex('氏名');
	// 部署は「読める名称」を優先（所属名/部署名）。コード列(所属コード等)は避ける
	const deptIndex = (() => {
		for (const name of ['所属名', '部署名', '部署']) {
			const i = exact(name);
			if (i !== -1) return i;
		}
		const named = headers.findIndex(
			(h) => h && (h.includes('部署') || h.includes('所属')) && !h.includes('コード')
		);
		return named !== -1 ? named : headers.findIndex((h) => h && (h.includes('部署') || h.includes('所属')));
	})();

	// 属性別集計用カラム（コード列ではなくラベル列を厳密一致で取得。データがある列のみ後段で採用）
	// ※「所属」は department（=所属名）と重複するため属性軸には含めない
	const attrCols: { key: string; idx: number }[] = [
		{ key: '性別', idx: exact('性別') },
		{ key: '年代', idx: exact('年代') },
		{ key: '役職', idx: exact('役職') },
		{ key: '職種', idx: exact('職種') },
		{ key: '事業所', idx: exact('事業所') },
		{ key: '職場診断用1', idx: exact('職場診断用表記1') }
	].filter((a) => a.idx !== -1);

	// 質問項目のカラムを特定して questionIndices[0..79]（item1〜80）を作る。
	// - test/旧: 「問診(80)項目No001〜No080」の80連番（No0XXで一致）
	// - 本番: 「問診(57)項目No001〜No057」(=item1〜57) ＋ 「オリジナル質問:…」23列(=item58〜80)
	const questionIndices: number[] = [];
	for (let j = 1; j <= 80; j++) {
		const questionNum = j.toString().padStart(3, '0');
		// 3桁のNoで一致（問診(87)の2桁Noには当たらない）
		questionIndices.push(headers.findIndex((h) => h && h.includes(`No${questionNum}`)));
	}
	// 本番CSV: No058〜080 が無い場合、オリジナル質問を設問文キーワードで item58〜80 に割り当てる
	if (headers.some((h) => h && h.includes('オリジナル質問'))) {
		for (const def of ORIGINAL_QUESTION_MAP) {
			if (questionIndices[def.item - 1] === -1) {
				questionIndices[def.item - 1] = headers.findIndex(
					(h) => h && h.includes('オリジナル') && h.includes(def.keyword)
				);
			}
		}
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

			// 属性を抽出（空値は入れない）
			const attributes: Record<string, string> = {};
			for (const a of attrCols) {
				const v = (row[a.idx] || '').trim();
				if (v) attributes[a.key] = v;
			}

			// ユーザーデータを作成
			const user: UserData = {
				id: idIndex !== -1 ? (row[idIndex] || `user_${i - 1}`) : `user_${i - 1}`,
				name: nameIndex !== -1 ? (row[nameIndex] || `ユーザー${i - 1}`) : `ユーザー${i - 1}`,
				department: deptIndex !== -1 ? ((row[deptIndex] || '').trim() || '未設定') : '未設定',
				gender: attributes['性別'],
				attributes,
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
