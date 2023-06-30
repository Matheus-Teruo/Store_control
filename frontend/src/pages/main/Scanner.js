import './Scanner.css'
import React, { useState, useEffect } from 'react';
import Quagga from 'quagga';

function Scanner(props) {
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    const initQuagga = async () => {
      try {
        await Quagga.init({
          inputStream : {
            name : "Live",
            type : "LiveStream",
            constraints: {
              width: 1280,
              height: 720,
              facingMode: "environment",
              deviceId: "7832475934759384534"
              }, 
          },
          area: { // defines rectangle of the detection/localization area
            top: "0%",    // top offset
            right: "0%",  // right offset
            left: "0%",   // left offset
            bottom: "0%"  // bottom offset
          },
          decoder : {
            readers : ["upc_reader"]
          },
          locate: true,
          locator: {
            halfSample: true,
            patchSize: "large", // x-small, small, medium, large, x-large
            }
        }, function(err) {
            if (err) {
                console.log(err);
                return
            }
            Quagga.start();
        })
      } catch (err) {
        console.log(err);
      }
    };

    if (scanned === false){
      initQuagga();
      setScanned(true)
      console.log("debug2")
    }
    const handleDetected = result => {
      props.DetectedCode(result);
    };

    Quagga.onDetected(handleDetected);

    return () => {
      console.log("debug3")
      Quagga.offDetected(handleDetected);
      Quagga.stop();
    };
  }, [props, scanned]);

  return (
    <div id="interactive" className="viewport"/>
  )
}

export default Scanner