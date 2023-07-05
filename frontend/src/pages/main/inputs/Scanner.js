import './Scanner.css'
import React, { useState, useEffect } from 'react';
import Quagga from 'quagga';

function Scanner(props) {
  const [scanned, setScanned] = useState(false)
  const [results, setResults] = useState([]);
  const [listResults, setListResults] = useState([])

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
      console.log("debug2")
    }
    Quagga.onDetected(handleScan);

    return () => {
      console.log("debug3")
      Quagga.offDetected(handleScan);
      Quagga.stop();
    };
  }, [props]);

  useEffect(() => {  // Set scan list
    if (results[0]) {
      handleListScan(results[0].codeResult.code)
    }
  }, [results])

  useEffect(() => {  // Set card by scan list 
    if (listResults.length === 3) {
      if (listResults.every(item => item === listResults[0])) {
        setListResults([])
        setScanned(true)
        props.output(listResults[0])
      }
    }
  }, [listResults])

  const handleScan = (result) => {  // Take result of scanner
    setResults([]);
    setResults(prevResults => prevResults.concat([result]));
  };

  const handleListScan = (item) => {  // Set result in list
    if (listResults.length === 3) {
      setListResults(listResults => [...listResults.slice(1), item]);
    } else {
      setListResults(listResults => [...listResults, item]);
    }
  };

  return (
    <div id="interactive" className="viewport"/>
  )
}

export default Scanner