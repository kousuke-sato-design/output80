/**
 * 本番CSV（ユーザー一覧 全部）の「オリジナル質問」列 → 80項目版での項目番号(58〜80) 対応表。
 *
 * 列の順番に依存せず、設問文に含まれる一意なキーワードで対応付ける（誤マッピング防止）。
 * ここに無い「オリジナル質問」列（プレゼンティーズム%、要因、満足度など）は読み込まない。
 * 並び順・尺度は scoreCalculator.ts の No58〜80 と一致させてある。
 */
export interface OriginalQuestionDef {
	item: number; // 80項目版での項目番号（1始まり, 58〜80）
	keyword: string; // 設問文に含まれる一意なキーワード
	scale: string; // 対応する尺度（参考）
}

export const ORIGINAL_QUESTION_MAP: OriginalQuestionDef[] = [
	{ item: 58, keyword: '感情面で負担', scale: '情緒的負担' },
	{ item: 59, keyword: '矛盾した', scale: '役割葛藤' },
	{ item: 60, keyword: '職務や責任が何であるか', scale: '役割明確さ' },
	{ item: 61, keyword: '長所をのばす', scale: '成長の機会' },
	{ item: 62, keyword: '見合う給料', scale: '経済・地位報酬' },
	{ item: 63, keyword: 'ふさわしい評価', scale: '尊重報酬' },
	{ item: 64, keyword: '職を失う恐れ', scale: '安定報酬' },
	{ item: 65, keyword: '能力を伸ばす機会', scale: '上司のリーダーシップ' },
	{ item: 66, keyword: '誠実な態度', scale: '上司の公正な態度' },
	{ item: 67, keyword: 'ほめてもらえる', scale: 'ほめてもらえる職場' },
	{ item: 68, keyword: '挽回', scale: '失敗を認める職場' },
	{ item: 69, keyword: '経営層からの情報', scale: '経営層との信頼関係' },
	{ item: 70, keyword: '従業員の意見が聞かれている', scale: '変化への対応' },
	{ item: 71, keyword: '価値観を大事に', scale: '個人の尊重' },
	{ item: 72, keyword: '人事評価の結果について', scale: '公正な人事評価' },
	{ item: 73, keyword: 'いろいろな立場の人', scale: '多様な労働者への対応' },
	{ item: 74, keyword: 'キャリアに役立つ教育', scale: 'キャリア形成' },
	{ item: 75, keyword: '生活を充実させられない', scale: 'ワーク・セルフ・バランス（ネガティブ）' },
	{ item: 76, keyword: '生活がさらに充実', scale: 'ワーク・セルフ・バランス（ポジティブ）' },
	{ item: 77, keyword: 'いじめ', scale: '職場のハラスメント' },
	{ item: 78, keyword: '理解し認め合', scale: '職場の一体感' },
	{ item: 79, keyword: '活気がみなぎる', scale: 'ワーク・エンゲイジメント(1)' },
	{ item: 80, keyword: '誇り', scale: 'ワーク・エンゲイジメント(2)' }
];
