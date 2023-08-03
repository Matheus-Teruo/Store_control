export const getCroppedImg = (file, croppedAreaPixels) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const { width, height } = croppedAreaPixels;
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        width,
        height
      );

      canvas.toBlob((blob) => {
        const croppedFile = new File([blob], file.name, { type: file.type });
        resolve({file: croppedFile, URL: URL.createObjectURL(blob)});
      }, file.type, 1.0);
    };

    image.onerror = (error) => {
      reject(error);
    };
  });
};

export const ResizeImg = (file, size) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(
        image,
        0,
        0,
        size,
        size,
        );

      canvas.toBlob((blob) => {
        const croppedFile = new File([blob], file.name, { type: file.type });
        resolve(croppedFile);
      }, file.type, 1.0);
    };

    image.onerror = (error) => {
      reject(error);
    };
  });
}