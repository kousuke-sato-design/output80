/**
 * rating.ts（5段階判定・総合判定）の検証テスト。
 * 判定は全国比 zスコア（(組織値−全国平均)/SD、全尺度 高=良好）に基づく。
 * 実行: node tests/rating.test.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = mkdtempSync(join(tmpdir(), 'rating-test-'));
execFileSync(
	join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'esbuild.cmd' : 'esbuild'),
	[join(root, 'src/lib/utils/rating.ts'), '--format=esm', `--outfile=${join(tmp, 'rating.mjs')}`],
	{ shell: process.platform === 'win32' }
);
const { rateByZ, gradeByZ } = await import(pathToFileURL(join(tmp, 'rating.mjs')).href);

let failed = 0;
let passed = 0;
function check(name, cond, detail = '') {
	if (cond) passed++;
	else {
		failed++;
		console.log(`  FAIL: ${name}${detail ? ' — ' + detail : ''}`);
	}
}

// 5段階: z>=+0.5 ◎良好 / +0.15<=z<+0.5 ○やや良好 / -0.15<z<+0.15 −平均的 / -0.5<z<=-0.15 △やや注意 / z<=-0.5 ⚠要対策
check('z=+0.8 → ◎良好', rateByZ(0.8)?.label === '良好' && rateByZ(0.8)?.symbol === '◎');
check('z=+0.5 境界 → ◎良好', rateByZ(0.5)?.label === '良好');
check('z=+0.3 → ○やや良好', rateByZ(0.3)?.label === 'やや良好');
check('z=+0.15 境界 → ○やや良好', rateByZ(0.15)?.label === 'やや良好');
check('z=0 → −平均的', rateByZ(0)?.label === '平均的');
check('z=-0.15 境界 → △やや注意', rateByZ(-0.15)?.label === 'やや注意');
check('z=-0.3 → △やや注意', rateByZ(-0.3)?.label === 'やや注意');
check('z=-0.5 境界 → ⚠要対策', rateByZ(-0.5)?.label === '要対策');
check('z=-1.2 → ⚠要対策', rateByZ(-1.2)?.label === '要対策');
check('z=null → null', rateByZ(null) === null);

// 総合判定: zMean>=+0.5 A / 0<=zMean<+0.5 B / -0.5<zMean<0 C / zMean<=-0.5 D
check('zMean=+0.6 → A', gradeByZ(0.6)?.grade === 'A');
check('zMean=+0.5 境界 → A', gradeByZ(0.5)?.grade === 'A');
check('zMean=+0.2 → B', gradeByZ(0.2)?.grade === 'B');
check('zMean=0 境界 → B', gradeByZ(0)?.grade === 'B');
check('zMean=-0.2 → C', gradeByZ(-0.2)?.grade === 'C');
check('zMean=-0.5 境界 → D', gradeByZ(-0.5)?.grade === 'D');
check('zMean=-1.0 → D', gradeByZ(-1.0)?.grade === 'D');
check('zMean=null → null', gradeByZ(null) === null);

rmSync(tmp, { recursive: true, force: true });
console.log(`\n${failed === 0 ? 'ALL PASS' : 'FAILED'}: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
