import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * ブロックを画像化する。
 * html-to-image は SVG foreignObject 経由で「ブラウザ自身の描画」をそのまま画像化するため、
 * 画面とPDFがずれない（html2canvas は独自再描画のため丸・入力欄がずれる問題があり廃止）。
 * 描画時にフォントの行送りがわずかに太って最下行が見切れることがあるため、
 * キャプチャの間だけ下端に余白を足して逃がす。
 */
async function capture(el: HTMLElement): Promise<HTMLCanvasElement> {
	const prevPaddingBottom = el.style.paddingBottom;
	el.style.paddingBottom = 'calc(24px + 1.5rem)';
	try {
		return await toCanvas(el, {
			pixelRatio: 2,
			backgroundColor: '#ffffff',
			// 操作UI（print:hidden 指定）はPDFに含めない
			filter: (node) => {
				if (node instanceof HTMLElement && node.classList && node.classList.contains('print:hidden')) {
					return false;
				}
				return true;
			}
		});
	} finally {
		el.style.paddingBottom = prevPaddingBottom;
	}
}

/**
 * 要素を「ブロック単位」でキャプチャしてA4縦PDFを生成・ダウンロードする。
 * data-pdf-block を持つ要素を1つの塊として扱い、塊の途中でページが切れないように改ページする。
 * （無ければ要素全体を1枚として扱う）
 */
export async function exportElementToPdf(root: HTMLElement, filename: string): Promise<void> {
	const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
	const pageW = pdf.internal.pageSize.getWidth();
	const pageH = pdf.internal.pageSize.getHeight();
	const margin = 8;
	const gap = 5;
	const contentW = pageW - margin * 2;
	const contentH = pageH - margin * 2;

	const found = Array.from(root.querySelectorAll<HTMLElement>('[data-pdf-block]'));
	const blocks = found.length > 0 ? found : [root];

	let cursorY = margin;
	let pageStarted = false; // 現在ページに何か描いたか

	for (const block of blocks) {
		const canvas = await capture(block);
		if (!canvas.width || !canvas.height) continue;
		const imgW = contentW;
		const imgH = (canvas.height * imgW) / canvas.width;
		const img = canvas.toDataURL('image/jpeg', 0.92);

		if (imgH <= contentH) {
			// 1ページに収まる塊：現在ページに入らなければ改ページ（0.5mmの安全マージン）
			if (pageStarted && cursorY + imgH > margin + contentH - 0.5) {
				pdf.addPage();
				cursorY = margin;
			}
			pdf.addImage(img, 'JPEG', margin, cursorY, imgW, imgH);
			cursorY += imgH + gap;
			pageStarted = true;
		} else {
			// 1ページに収まらない塊：新ページから画像スライスで複数ページに分割
			if (pageStarted) {
				pdf.addPage();
			}
			let heightLeft = imgH;
			let pos = margin;
			pdf.addImage(img, 'JPEG', margin, pos, imgW, imgH);
			heightLeft -= contentH;
			while (heightLeft > 0) {
				pos -= contentH;
				pdf.addPage();
				pdf.addImage(img, 'JPEG', margin, pos, imgW, imgH);
				heightLeft -= contentH;
			}
			// 次の塊は新ページから
			pdf.addPage();
			cursorY = margin;
			pageStarted = false;
		}
	}

	pdf.save(filename);
}
