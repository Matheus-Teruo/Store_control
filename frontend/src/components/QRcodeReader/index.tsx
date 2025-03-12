import styles from "./QRcodeReader.module.scss";
import {
  CameraDevice,
  Html5Qrcode,
  Html5QrcodeScannerState,
} from "html5-qrcode";
import { useEffect, useState } from "react";
import Button from "../utils/Button";
import { CameraSVG } from "@/assets/svg";

type QRcodeReaderProps = {
  onChange: (code: string) => void;
  setClose: () => void;
};

function QRcodeReader({ onChange, setClose }: QRcodeReaderProps) {
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices.length > 0) {
          setCameras(devices);
          setSelectedCamera(devices[0].id);
        }
      })
      .catch((err) => console.error("Erro ao buscar câmeras:", err));
  }, []);

  useEffect(() => {
    if (!selectedCamera) return;
    const qrScanner = new Html5Qrcode("reader");

    setScanner(qrScanner);
    qrScanner
      .start(
        selectedCamera,
        { fps: 10 },
        (decodedText) => {
          onChange(decodedText);
          setClose();
        },
        (error) => console.log(error),
      )
      .catch((err) => console.error("Erro ao iniciar scanner:", err));

    return () => {
      if (
        qrScanner?.isScanning &&
        qrScanner.getState() === Html5QrcodeScannerState.SCANNING
      ) {
        qrScanner
          .stop()
          .then(() => {
            setScanner(null);
          })
          .catch((err) =>
            console.error("Erro ao parar scanner ao desmontar 1:", err),
          );
      }
    };
  }, [selectedCamera, onChange, setClose]);

  const handleChange = async () => {
    if (cameras.length < 2) return;

    if (scanner && scanner.getState() === Html5QrcodeScannerState.SCANNING) {
      const nextIndex = (selectedIndex + 1) % cameras.length;
      setSelectedIndex(nextIndex);
      setSelectedCamera(cameras[nextIndex].id);
    }
  };

  const handleClose = () => {
    if (scanner) {
      scanner
        .stop()
        .then(() => {
          setScanner(null);
        })
        .catch((err) =>
          console.error("Erro ao parar scanner ao desmontar:", err),
        );
    }

    setClose();
  };

  return (
    <>
      <div className={styles.main}>
        <h3>Leitor de Cartão</h3>
        <div id="reader" className={styles.frame}></div>
        <div className={styles.footer}>
          <div className={styles.spaceHolder} />
          <p>Aponte a camera para o QRcode do cartão</p>
          <Button
            className={styles.swapCamera}
            onClick={handleChange}
            disabled={cameras.length < 2}
          >
            <CameraSVG />
          </Button>
        </div>
      </div>
      <div className={styles.background} onClick={handleClose} />
    </>
  );
}

export default QRcodeReader;
