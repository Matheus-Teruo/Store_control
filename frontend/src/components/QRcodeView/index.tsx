import styles from "./QRcodeView.module.scss";
import GlassBackground from "@/components/GlassBackground";

type QRcodeViewProps = {
  code: string;
  showCode: boolean;
  setShowCode: (value: boolean) => void;
};

function QRcodeView({ code, showCode, setShowCode }: QRcodeViewProps) {
  const handleShow = (value: boolean) => {
    setShowCode(value);
  };
  return (
    <>
      {showCode && (
        <>
          <div className={styles.main}>
            <h3>Compras</h3>
            <img className={styles.frame} src={code} />
            <p>
              apresente esse QRcode ao caixa para pagar e retirar seu pedido
            </p>
          </div>
          <GlassBackground
            className={styles.background}
            onClick={() => handleShow(false)}
          />
        </>
      )}
    </>
  );
}

export default QRcodeView;
