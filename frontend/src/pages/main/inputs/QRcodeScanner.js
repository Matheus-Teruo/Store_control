import './QRcodeScanner.css'
import React, { useState, useEffect } from 'react';

const QRcodeScanner = (props) => {
  const [result, setResult] = useState(null);

  // useEffect(() => {
  //   if (result) {
  //     const isOnlyDigits = /^\d{12}$/.test(result);
  //     if (isOnlyDigits){
  //       props.output(result);
  //     }
  //   }
  // }, [result]);

  return (
    <div className="QRcodeReader">
    </div>
  );
}

export default QRcodeScanner;