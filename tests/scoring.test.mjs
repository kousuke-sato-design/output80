/**
 * scoreCalculator.ts の採点検証テスト。
 *
 * 照合先＝公式一次資料「現行および新職業性ストレス簡易調査票の得点計算」
 * （2012/4/1公開・2017/5/8修正、東京大学 川上研究室配布 WORD。以下「公式得点計算法」）。
 * 公式得点計算法に記載された全80項目の配点方向・尺度構成・対策領域別合計式を
 * ここに独立に書き起こし、アプリ実装と突き合わせる。
 *
 * 実行: node tests/scoring.test.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// --- scoreCalculator.ts を esbuild で ESM に変換して読み込む（import type のみなので単体変換可） ---
const tmp = mkdtempSync(join(tmpdir(), 'scoring-test-'));
execFileSync(
	join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'esbuild.cmd' : 'esbuild'),
	[join(root, 'src/lib/utils/scoreCalculator.ts'), '--format=esm', `--outfile=${join(tmp, 'scoreCalculator.mjs')}`],
	{ shell: process.platform === 'win32' }
);
const { calculateScores } = await import(pathToFileURL(join(tmp, 'scoreCalculator.mjs')).href);

// ============ 公式得点計算法の書き起こし（アプリ実装とは独立） ============

// 素点そのまま（そうだ=1点…ちがう=4点／ほとんどなかった=1点…）の項目。
// それ以外の項目はすべて逆転（4点3点2点1点 ＝ 5-素点）。
const FORWARD_ITEMS = new Set([
	1, 2, 3, // 仕事の量的負担
	4, 5, 6, // 仕事の質的負担
	7, // 身体的負担度
	11, // 技能の活用「自分の技能や知識を仕事で使うことが少ない」→ 逆転なし
	12, 13, // 対人関係「意見のくい違い」「うまが合わない」→ 逆転なし（14「友好的」は逆転）
	15, // 職場環境「作業環境はよくない」
	18, 19, 20, // 活気
	58, // 情緒的負担（短縮版=標準版項目59）
	59, // 役割葛藤（短縮版=標準版項目62）
	64, // 安定報酬「職を失う恐れがある」（短縮版=標準版項目83）
	75, // WSBネガティブ（短縮版=標準版項目122）
	77 // 職場のハラスメント「いじめにあっている」（短縮版=標準版項目126）
]);

const OFFICIAL_SCALES = {
	quantitativeLoad: [1, 2, 3],
	qualitativeLoad: [4, 5, 6],
	physicalLoad: [7],
	jobControl: [8, 9, 10],
	skillUtilization: [11],
	interpersonalRelations: [12, 13, 14],
	workplaceEnvironment: [15],
	jobFitness: [16],
	jobSignificance: [17],
	vigor: [18, 19, 20],
	irritation: [21, 22, 23],
	fatigue: [24, 25, 26],
	anxiety: [27, 28, 29],
	depression: [30, 31, 32, 33, 34, 35],
	physicalComplaints: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
	psychologicalStress: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
	supervisorSupport: [47, 50, 53],
	colleagueSupport: [48, 51, 54],
	familySupport: [49, 52, 55],
	jobSatisfaction: [56],
	familySatisfaction: [57],
	emotionalLoad: [58],
	roleConflict: [59],
	roleClarification: [60],
	growthOpportunity: [61],
	economicReward: [62],
	respectReward: [63],
	stabilityReward: [64],
	supervisorLeadership: [65],
	supervisorFairness: [66],
	praisableWorkplace: [67],
	failureAcceptance: [68],
	managementTrust: [69],
	changeAdaptation: [70],
	individualRespect: [71],
	fairEvaluation: [72],
	diversitySupport: [73],
	careerDevelopment: [74],
	workSelfBalanceNegative: [75],
	workSelfBalancePositive: [76],
	harassment: [77],
	workplaceUnity: [78],
	workEngagement: [79, 80]
};

// 対策領域別合計点（公式得点計算法 末尾「短縮版、標準版共通」）
const OFFICIAL_TOTALS = {
	totalWorkload: [
		'quantitativeLoad', 'qualitativeLoad', 'physicalLoad', 'interpersonalRelations',
		'workplaceEnvironment', 'emotionalLoad', 'roleConflict', 'workSelfBalanceNegative'
	],
	totalTaskLevelResources: [
		'jobControl', 'jobFitness', 'skillUtilization', 'jobSignificance',
		'roleClarification', 'growthOpportunity'
	],
	totalDepartmentLevelResources: [
		'supervisorSupport', 'colleagueSupport', 'economicReward', 'respectReward',
		'stabilityReward', 'supervisorLeadership', 'supervisorFairness',
		'praisableWorkplace', 'failureAcceptance'
	],
	totalOrganizationLevelResources: [
		'managementTrust', 'changeAdaptation', 'individualRespect', 'fairEvaluation',
		'diversitySupport', 'careerDevelopment', 'workSelfBalancePositive'
	]
};

/** 公式得点計算法どおりの参照実装（未回答=1〜4以外は尺度平均から除外） */
function officialScores(responses) {
	const item = (n) => {
		const v = responses[n - 1];
		if (typeof v !== 'number' || v < 1 || v > 4) return null;
		return FORWARD_ITEMS.has(n) ? v : 5 - v;
	};
	const out = {};
	for (const [key, nums] of Object.entries(OFFICIAL_SCALES)) {
		const vals = nums.map(item).filter((v) => v !== null);
		out[key] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : NaN;
	}
	for (const [key, fields] of Object.entries(OFFICIAL_TOTALS)) {
		const vals = fields.map((f) => out[f]).filter((v) => !Number.isNaN(v));
		out[key] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : NaN;
	}
	return out;
}

// ============ テストランナー ============
let failed = 0;
let passed = 0;
function check(name, cond, detail = '') {
	if (cond) {
		passed++;
	} else {
		failed++;
		console.log(`  FAIL: ${name}${detail ? ' — ' + detail : ''}`);
	}
}
function approx(a, b) {
	return (Number.isNaN(a) && Number.isNaN(b)) || Math.abs(a - b) < 1e-9;
}

// --- T1: 項目11「技能や知識を使うことが少ない」は逆転しない（公式: 1点2点3点4点） ---
{
	const r = Array(80).fill(2);
	r[11 - 1] = 4; // 「ちがう」＝技能を使えている＝良好 → 尺度得点は 4 のはず
	const s = calculateScores(r);
	check('T1 技能の活用: 項目11=4(ちがう) → 得点4', approx(s.skillUtilization, 4), `got ${s.skillUtilization}`);
}

// --- T2: 項目14「職場の雰囲気は友好的」は逆転する（公式: 4点3点2点1点） ---
{
	const r = Array(80).fill(2);
	r[12 - 1] = 4; // くい違い「ちがう」→ 4点
	r[13 - 1] = 4; // うまが合わない「ちがう」→ 4点
	r[14 - 1] = 1; // 友好的「そうだ」→ 逆転で 4点
	const s = calculateScores(r);
	check('T2 対人関係: (12,13,14)=(4,4,1) → 得点4.0', approx(s.interpersonalRelations, 4), `got ${s.interpersonalRelations}`);
}

// --- T3: 全80項目・全42尺度・4合計を公式参照実装と突き合わせ（決定的乱数200ケース） ---
{
	let seed = 20260705;
	const rand = () => {
		// mulberry32
		seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
	let mismatch = 0;
	for (let c = 0; c < 200; c++) {
		const r = Array.from({ length: 80 }, () => 1 + Math.floor(rand() * 4));
		const app = calculateScores(r);
		const ref = officialScores(r);
		for (const key of Object.keys(ref)) {
			if (!approx(app[key], ref[key])) {
				if (mismatch < 5) console.log(`  T3 mismatch [case${c}] ${key}: app=${app[key]} official=${ref[key]}`);
				mismatch++;
			}
		}
	}
	check('T3 乱数200ケース×46指標が公式計算と全一致', mismatch === 0, `${mismatch}件の不一致`);
}

// --- T4: 未回答(空白)は尺度平均から除外、全欠損は NaN ---
{
	const r = Array(80).fill(2);
	r[1 - 1] = 4;
	r[2 - 1] = NaN; // 未回答
	r[3 - 1] = 2;
	const s = calculateScores(r);
	check('T4a 量的負担: (4,欠,2) → (4+2)/2=3', approx(s.quantitativeLoad, 3), `got ${s.quantitativeLoad}`);

	const r2 = Array(80).fill(2);
	r2[7 - 1] = 0; // 範囲外
	const s2 = calculateScores(r2);
	check('T4b 身体的負担: 全構成項目欠損 → NaN', Number.isNaN(s2.physicalLoad), `got ${s2.physicalLoad}`);
}

rmSync(tmp, { recursive: true, force: true });
console.log(`\n${failed === 0 ? 'ALL PASS' : 'FAILED'}: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
