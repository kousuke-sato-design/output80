import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

async function capture(el: HTMLElement): Promise<HTMLCanvasElement> {
	return html2canvas(el, {
		scale: 2,
		backgroundColor: '#ffffff',
		useCORS: true,
		logging: false,
		windowWidth: el.scrollWidth,
		// 操作UI（print:hidden 指定）はPDFに含めない
		onclone: (doc: Document) => {
			doc.querySelectorAll('[class*="print:hidden"]').forEach((e) => {
				(e as HTMLElement).style.display = 'none';
			});
		}
	});
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
		const imgW = contentW;
		const imgH = (canvas.height * imgW) / canvas.width;
		const img = canvas.toDataURL('image/jpeg', 0.92);

		if (imgH <= contentH) {
			// 1ページに収まる塊：現在ページに入らなければ改ページ
			if (pageStarted && cursorY + imgH > margin + contentH) {
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
