import { Area } from "react-easy-crop";

export const getCroppedImg = async (
  imageSrc: string,
  croppedAreaPixels: Area,
): Promise<File | undefined> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject("Erro ao criar Blob");

        const file = new File([blob], "cropped-image.png", {
          type: "image/png",
        });
        resolve(file);
      }, "image/png");
    };

    image.onerror = () => reject("Erro ao carregar imagem");
  });
};

export const resizeImage = (file: File, maxSize: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      const image = new Image();
      image.src = reader.result as string;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Erro ao obter contexto do Canvas");

        let { width, height } = image;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(image, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject("Erro ao criar Blob");

            const resizedFile = new File([blob], file.name, {
              type: "image/jpeg",
            });
            resolve(resizedFile);
          },
          "image/jpeg",
          0.8,
        );
      };

      image.onerror = () => reject("Erro ao carregar imagem");
    };

    reader.onerror = () => reject("Erro ao ler arquivo");
  });
};
