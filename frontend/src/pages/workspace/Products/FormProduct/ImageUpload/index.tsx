import styles from "./ImageUpload.module.scss";
import { useRef, useState } from "react";
import ImageCropper from "./ImageCropper";
import useProductService from "@service/stand/useProductService";

interface StandSelectProps {
  onChangeImage: (url: string) => void;
  onChange: (event: string) => void;
}

function ImageUpload({ onChangeImage, onChange }: StandSelectProps) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageData, setImageData] = useState<File | null>(null);
  const [showCrop, setShowCrop] = useState<boolean>(false);
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
  const { uploadImage } = useProductService();

  const uploadCroppedImage = async () => {
    if (!imageData) return;
    const response = await uploadImage(imageData);
    if (response) {
      onChange(response?.url);
    }
  };

  function handleClick() {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  }

  function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file: File | null = event.target.files![0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setImageSrc(reader.result as string);
      setShowCrop(true);
    }
  }

  return (
    <div>
      <button onClick={handleClick} type="button">
        svg imagem
      </button>
      <input
        type="file"
        name="image"
        onChange={handleImage}
        ref={hiddenFileInput}
        style={{ display: "none" }}
      />
      <button
        onClick={() => {
          setShowCrop(true);
        }}
        disabled={imageSrc ? false : true}
        type="button"
      >
        svg crop
      </button>
      <button onClick={uploadCroppedImage} type="button">
        Upload
      </button>
      {showCrop && (
        <>
          <div className={styles.background} />
          <div className={styles.imageCropper}>
            <ImageCropper
              imageSrc={imageSrc}
              setImageSrc={onChangeImage}
              setImageFile={setImageData}
              setShow={setShowCrop}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ImageUpload;
