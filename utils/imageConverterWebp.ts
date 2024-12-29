import imageCompression from "browser-image-compression";

// Compress the image and return the compressed file
export const compressImage = async (
  file: File,
  maxSizeMB = 1,
  maxWidthOrHeight = 1024
): Promise<File> => {
  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker: true,
    });
    return compressedFile;
  } catch (error) {
    throw new Error("Error compressing image: " + error);
  }
};

// Convert the compressed image to WebP format
export const convertToWebP = (imageFile: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(imageFile);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Canvas context is null");
        return;
      }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject("WebP conversion failed");
        }
      }, "image/webp");
    };

    img.onerror = () => reject("Image load failed");
  });
};
