import styles from "./ImageCropper.module.scss";
import { getCroppedImg } from "@/utils/cropImage";
import { useCallback, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";

type SelectPaymentProps = {
  imageSrc: string;
  setImageSrc: (url: string) => void;
  setImageFile: (file: File) => void;
  setShow: (show: boolean) => void;
};

function ImageCropper({
  imageSrc,
  setImageSrc,
  setImageFile,
  setShow,
}: SelectPaymentProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleCropImage = async () => {
    try {
      if (imageSrc && croppedAreaPixels) {
        const file = await getCroppedImg(imageSrc, croppedAreaPixels);
        if (file) {
          setImageFile(file);
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => setImageSrc(reader.result as string);
        }
      }
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setShow(false);
    }
  };

  return (
    <>
      <div className={styles.cropCamva}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1} // Keep proportion of crop a square
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <button onClick={handleCropImage} type="button">
        SVG CORTAR Cortar
      </button>
    </>
  );
}

export default ImageCropper;
