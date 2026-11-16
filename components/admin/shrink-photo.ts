/** Shrinks a photo in the browser to at most 1600 px and re-saves it as WebP, so uploads stay small. */
export async function shrinkPhoto(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.85));
    return blob ? new File([blob], file.name.replace(/\.\w+$/, ".webp"), { type: "image/webp" }) : file;
  } catch {
    return file; // the server still checks type and size
  }
}
