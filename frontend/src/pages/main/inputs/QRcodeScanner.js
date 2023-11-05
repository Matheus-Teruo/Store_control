import './QRcodeScanner.css'
import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';

const QRcodeScanner = (props) => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (result) {
      const isOnlyDigits = /^\d{12}$/.test(result);
      if (isOnlyDigits){
        props.output(result);
      }
    }
  }, [result]);

  return (
    <div className="QRcodeReader">
      <QrReader
        delay={300}
        onResult={(result, error) => {
          if (!!result) {
            setResult(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        style={{ margin: '0', padding: '0' ,width: 'auto', height: '100%' }}
      />
    </div>
  );
}

export default QRcodeScanner;