<script lang="ts">
	import { companyName } from '$lib/stores/dataStore';

	export let totalUsers = 0;
	export let deptCount = 0;

	// 表紙情報。企業名はCSVの「企業名」列から自動取得（画面で書き換え可）、実施時期は手入力。
	let periodText = '';

	const today = (() => {
		const d = new Date();
		return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
	})();
</script>

<!-- レポート表紙（公式フィードバック様式に準拠。独自の評価・判定は行わない） -->
<div data-pdf-block class="bg-white rounded-xl shadow-sm border-2 border-primary-100 p-5 break-inside-avoid">
	<!-- ベータ版バナー（画面・印刷共通） -->
	<div class="flex flex-wrap items-center gap-x-3 gap-y-1 bg-amber-50 border border-amber-300 rounded-lg px-3 py-1.5 mb-3">
		<span class="text-[11px] font-bold tracking-wider bg-amber-400 text-amber-950 rounded px-2 py-0.5">BETA版</span>
		<span class="text-sm text-amber-800 font-medium">本レポートはベータ版システムによる出力です。数値・表示内容は検証中のため、今後変更される場合があります。</span>
	</div>

	<!-- 表紙ヘッダー -->
	<div class="flex flex-wrap items-start justify-between gap-3 pb-3 border-b-2 border-primary-600">
		<div class="min-w-0">
			<p class="text-xs font-semibold tracking-widest text-primary-700 mb-0.5">新職業性ストレス簡易調査票（80項目版）フィードバック</p>
			<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
				<input
					bind:value={$companyName}
					placeholder="企業・組織名を入力（印刷に反映）"
					class="text-2xl font-bold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-primary-500 min-w-[16rem] print:border-none"
				/>
				<input
					bind:value={periodText}
					placeholder="実施時期（例: 2026年7月）"
					class="text-sm text-gray-600 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-primary-500 w-44 print:border-none"
				/>
			</div>
		</div>
		<div class="text-right text-xs text-gray-500 leading-relaxed flex-shrink-0">
			<p>回答者 <b class="text-gray-800 text-sm">{totalUsers}</b> 名 / {deptCount} 部署</p>
			<p>作成日 {today}</p>
			<p class="font-medium text-gray-600">作成・提供：株式会社総合心理教育研究所</p>
			<p class="font-semibold text-gray-400 tracking-widest">CONFIDENTIAL</p>
		</div>
	</div>

	<!-- 調査票の説明（公式資料準拠） -->
	<p class="text-sm text-gray-600 leading-relaxed mt-3">
		<b class="text-gray-800">この調査について：</b>新職業性ストレス簡易調査票（80項目版）は、厚生労働科学研究費補助金研究班（平成21〜23年度、主任研究者・川上憲人）が開発した調査票です。
		現行の職業性ストレス簡易調査票57項目に、仕事の資源（作業・部署・事業場レベル）や職場のいきいき（ワーク・エンゲイジメント、職場の一体感）を測る23項目を追加しています。
	</p>

	<!-- 数値の読み方（図を見る前に必要な知識。公式「このフィードバックの見方」準拠） -->
	<div class="rounded-lg border border-gray-100 bg-gray-50/70 p-4 mt-3">
		<h5 class="text-sm font-bold text-gray-800 mb-1.5">このレポートの見方</h5>
		<p class="text-sm text-gray-700 leading-relaxed mb-3">
			本レポートでは、組織全体の平均値を全国平均（参考値・基準データ N≒1620）と比較しています。
			得点は最高4点・最低1点になるよう変換されており、<b class="text-gray-900">数字はすべて高い方が好ましい状態</b>を示します
			（「仕事の負担」などの尺度も、高得点＝負担が少ない＝良好です）。
		</p>
		<ol class="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 list-none p-0 m-0">
			{#each [
				{ n: 'ステップ1', t: 'いきいきプロフィール全体図で、個人と職場のいきいきを確認' },
				{ n: 'ステップ2', t: '仕事の負担と資源のレーダーチャートで注目すべき対策領域を確認' },
				{ n: 'ステップ3', t: '仕事の負担と資源のプロフィールで注目すべき個別の要素を確認' },
				{ n: 'ステップ4', t: '強みをのばすか、弱みを補強する改善方策を考える' }
			] as step}
				<li class="rounded-lg bg-white border border-gray-100 p-3">
					<span class="inline-block text-xs font-bold tracking-wider text-primary-700 bg-primary-50 rounded px-1.5 py-0.5 mb-1">{step.n}</span>
					<p class="text-sm text-gray-700 leading-relaxed">{step.t}</p>
				</li>
			{/each}
		</ol>
	</div>
</div>
