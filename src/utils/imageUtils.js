/**
 * Compress and convert an uploaded File to a base64 data URL (max 300×300).
 */
export function compressImage(file, maxDim = 300) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Capture a DOM element with html2canvas and return a Blob.
 */
export async function captureElement(element) {
  const html2canvas = (await import('html2canvas')).default;
  const canvas = await html2canvas(element, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    scale: 2,
  });
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

/**
 * Trigger a PNG download from a DOM element.
 */
export async function downloadCard(element, filename = 'wishify-card.png') {
  const blob = await captureElement(element);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Share card using Web Share API (mobile) or fall back to download.
 */
export async function shareCard(element, title = 'My Greeting Card') {
  const blob = await captureElement(element);
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'card.png', { type: 'image/png' })] })) {
    const file = new File([blob], 'wishify-card.png', { type: 'image/png' });
    await navigator.share({ title, files: [file] });
    return 'shared';
  }
  // Fallback: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wishify-card.png';
  a.click();
  URL.revokeObjectURL(url);
  return 'downloaded';
}

/**
 * Copy blob as image to clipboard (Chrome).
 */
export async function copyCardToClipboard(element) {
  const blob = await captureElement(element);
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}
