import { useState, useEffect, useRef } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const useImageCropper = (imgSrc, aspectRatio = 1) => {
  const [cropper, setCropper] = useState(null);
  const imageElement = useRef(null);

  useEffect(() => {
    if (imgSrc && imageElement.current) {
      const newImage = new Image();
      newImage.src = imgSrc;

      newImage.onload = () => {
        if (cropper) {
          cropper.replace(imgSrc);
        } else {
          const newCropper = new Cropper(imageElement.current, {
            aspectRatio: aspectRatio,
          });
          setCropper(newCropper);
        }
      };
    }

    return () => {
      if (cropper) cropper.destroy();
    };
  }, [imgSrc, aspectRatio]);

  const handleSubmit = (e, onSubmit) => {
    e.preventDefault();

    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();

      if (!croppedCanvas) {
        return;
      }
      croppedCanvas.toBlob(async (blob) => {
        onSubmit(blob);
      });
    }
  };

  return [imageElement, handleSubmit];
};

export default useImageCropper;
