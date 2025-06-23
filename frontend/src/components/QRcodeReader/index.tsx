import styles from "./QRcodeReader.module.scss";
import {
  CameraDevice,
  Html5Qrcode,
  Html5QrcodeScannerState,
} from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
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
  const readerRef = useRef<HTMLDivElement | null>(null);

  const getQrboxSize = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const minEdge = Math.min(vw, vh);
    const size = Math.floor(minEdge * 0.6);
    return { width: size, height: size };
  };

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices.length > 0) {
          const savedIndex = parseInt(
            localStorage.getItem("selectedCameraIndex") || "0",
          );
          const index = savedIndex < devices.length ? savedIndex : 0;
          setCameras(devices);
          setSelectedIndex(index);
          setSelectedCamera(devices[index].id);
        }
      })
      .catch((err) => console.error("Erro ao buscar câmeras:", err));
  }, []);

  useEffect(() => {
    if (!selectedCamera || !readerRef.current) return;
    const qrScanner = new Html5Qrcode("reader");
    const config = {
      fps: 10,
      qrbox: getQrboxSize() || 250,
    };

    setScanner(qrScanner);
    qrScanner
      .start(
        selectedCamera,
        config,
        (decodedText) => {
          onChange(decodedText);
          setClose();
        },
        (_error) => {
          // console.log(error);
        },
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
      localStorage.setItem("selectedCameraIndex", nextIndex.toString());
    }
  };

  const handleClose = () => {
    if (scanner) {
      scanner
        .stop()
        .then(() => setScanner(null))
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
        <div className={styles.frame}>
          <div ref={readerRef} id="reader" className={styles.camera}></div>
        </div>
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
