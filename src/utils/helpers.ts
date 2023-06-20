import Compressor from "compressorjs";

export const compress = (
  file: File | Blob,
  options: {
    maxWidth: number;
  }
) => {
  return new Promise<File | Blob>((resolve, reject) => {
    new Compressor(file, {
      ...options,
      success(result) {
        resolve(result);
      },
      error(err) {
        reject(err);
      },
    });
  });
};
