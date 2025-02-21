import styles from "./ImageUpload.module.scss";
import { useRef, useState } from "react";
import ImageCropper from "./ImageCropper";
import useProductService from "@service/stand/useProductService";
import Button from "@/components/utils/Button";
import { CropSVG, ImageSVG, UploadSVG } from "@/assets/svg";

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
    <div className={styles.main}>
      <Button onClick={handleClick}>
        <ImageSVG size={16} />
        <p>Carregar</p>
      </Button>
      <input
        type="file"
        name="image"
        onChange={handleImage}
        ref={hiddenFileInput}
        style={{ display: "none" }}
      />
      <Button
        onClick={() => {
          setShowCrop(true);
        }}
        disabled={imageSrc ? false : true}
      >
        <CropSVG size={16} />
        <p>Cortar</p>
      </Button>
      <Button onClick={uploadCroppedImage} disabled={imageSrc ? false : true}>
        <UploadSVG size={16} />
        <p>Upload</p>
      </Button>
      {showCrop && (
        <>
          <div id="portal-root" className={styles.background} />
          <div id="portal-root" className={styles.imageCropper}>
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
