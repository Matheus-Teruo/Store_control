import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { Crop } from 'react-feather';
import { getCroppedImg } from './utils';

const CropImage = (props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropImage = async () => {
    try {
      const {file , URL} = await getCroppedImg(props.image, croppedAreaPixels);
      props.setImageFile(file)
      props.setImageURL(URL)
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      props.setShow(false)
    }
  };

  return (
  <>
    <div className="CropCamva">
      <Cropper
        image={props.imageURL}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={(crop) => {setCrop(crop)}}
        onZoomChange={(zoom) => {setZoom(zoom)}}
        onCropComplete={onCropComplete}
      />
    </div>
    <button onClick={handleCropImage}><Crop size="18"/>Cortar</button>
  </>
  );
};

export default CropImage;