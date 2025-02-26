import styles from "./QRcodeReader.module.scss";
import { CameraDevice, Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";

type QRcodeReaderProps = {
  onChange: (code: string) => void;
  setClose: () => void;
};

function QRcodeReader({ onChange, setClose }: QRcodeReaderProps) {
  const [_cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);

  useEffect(() => {
    Html5Qrcode.getCameras().then((devices) => {
      if (devices.length > 0) {
        setCameras(devices);
        setSelectedCamera(devices[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedCamera || scanner?.isScanning) return;
    const qrScanner = new Html5Qrcode("reader");

    if (scanner) {
      scanner
        .stop()
        .then(() => {
          console.log("Scanner antigo parado.");
        })
        .catch((err) => console.error("Erro ao parar scanner anterior:", err));
    }

    setScanner(qrScanner);
    qrScanner
      .start(
        selectedCamera,
        { fps: 10, qrbox: 500 },
        (decodedText) => {
          onChange(decodedText);
          setClose();
        },
        (error) => console.log(error),
      )
      .catch((err) => console.error("Erro ao iniciar scanner:", err));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCamera]);

  useEffect(() => {
    return () => {
      if (scanner?.isScanning) {
        scanner
          .stop()
          .then(() => {
            setScanner(null);
          })
          .catch((err) =>
            console.error("Erro ao parar scanner ao desmontar:", err),
          );
      }
    };
  }, [scanner]);

  return (
    <>
      <div className={styles.main}>
        <h2>Leitor de Cartão</h2>
        <div id="reader" className={styles.frame}></div>
        <p>Aponte a camera para o QRcode do cartão</p>
      </div>
      <div className={styles.background} onClick={setClose} />
    </>
  );
}

export default QRcodeReader;
