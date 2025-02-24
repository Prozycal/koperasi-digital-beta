import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropper = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 100,
    aspect: 1,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imgRef, setImgRef] = useState(null);

  const onImageLoad = (img) => {
    setImgRef(img);
  };

  const createCroppedImage = () => {
    if (!imgRef || !completedCrop) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.naturalWidth / imgRef.width;
    const scaleY = imgRef.naturalHeight / imgRef.height;
    const ctx = canvas.getContext('2d');

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      imgRef,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      onCropComplete(blob);
    }, 'image/jpeg');
  };

  return (
    <div className="p-4">
      <ReactCrop
        crop={crop}
        onChange={(c) => setCrop(c)}
        onComplete={(c) => setCompletedCrop(c)}
        aspect={1}
        circularCrop
      >
        <img
          src={URL.createObjectURL(image)}
          onLoad={(e) => onImageLoad(e.target)}
          alt="Crop"
        />
      </ReactCrop>
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={createCroppedImage}
          className="px-4 py-2 bg-snavy text-white rounded-lg hover:bg-navyDark"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;