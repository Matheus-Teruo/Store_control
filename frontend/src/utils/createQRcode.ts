import QRCode from "qrcode-generator";

export const createQRcodeImage = (objectAsString: string): string => {
  try {
    const qr = QRCode(0, "L");
    qr.addData(objectAsString);
    qr.make();

    return qr.createDataURL(6, 2);
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);
    return "fail";
  }
};
