import { useEffect, useState } from "react";
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";

const ImageViewer = ({ images, removeFunc }) => {
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    if (viewer) {
      viewer.update();
    } else {
      const viewerInstance = new Viewer(
        document.getElementById("image-gallery"),
        {
          navbar: false,
          toolbar: {
            oneToOne: 4,
            reset: 4,
            prev: 2,
            play: {
              show: 2,
              size: "medium",
            },
            next: 4,
            zoomOut: 3,
            zoomIn: 3,
          },
        }
      );
      setViewer(viewerInstance);
    }
  }, [viewer]);

  return (
    <div id="image-gallery" className="d-flex gap-2 notesContainer flex-wrap">
      {images.map((item, index) => (
        <div
          key={index}
          className="border-gray articleCurrentImg card mb-1 mt-3 d-flex alifn-items-center justify-center"
        >
          <img
            src={`https://irannobat.ir/images/PatientNote/${item.Note}`}
            alt={`image-${index}`}
            style={{ width: "130px", height: "130px" }}
          />
          <button
            className="btn removeNoteBtn tooltip-button"
            type="button"
            data-pr-position="top"
            onClick={(e) => {
              e.stopPropagation();
              removeFunc(item._id);
            }}
          >
            <FeatherIcon className="removeLogoBtnIcon" icon="x-circle" />
            <Tooltip target=".removeNoteBtn">حذف</Tooltip>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImageViewer;
