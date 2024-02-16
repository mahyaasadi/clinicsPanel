import { useEffect, useRef } from "react";
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";

const ImageViewer = ({ images, removeFunc, patientImgFiles, TypeID }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    const viewerInstance = new Viewer(viewerRef.current, {
      navbar: false,
      toolbar: {
        oneToOne: 4,
        reset: 3,
        prev: 2,
        play: {
          show: 2,
          size: "medium",
        },
        next: 2,
        zoomOut: 3,
        zoomIn: 3,
      },
    });

    return () => {
      viewerInstance.destroy();
    };
  }, [images]);

  return (
    <div ref={viewerRef} className="d-flex gap-2 notesContainer flex-wrap receptionSmsHeader">
      {patientImgFiles
        ? images.map((item, index) => (
          <div
            key={index}
            className="border-gray articleCurrentImg mb-1 mt-3 d-flex alifn-items-center justify-center ServiceNav"
          >
            <img
              src={`https://irannobat.ir/images/PatientAttachment/${item.Name}`}
              alt={`image-${index}`}
              style={{ width: "145px", height: "100%" }}
            />
            <div className="card-bio fw-bold d-flex flex-col align-items-center justify-center">
              <p className="mb-0">
                {item.Title}
              </p>
              <p className="mb-1">
                {item.Date}
              </p>
              <p className="mb-1">
                {item.Description.substr(0, 15) + " ..."}
              </p>
            </div>

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
        ))
        : images.map((item, index) => (
          <div
            key={index}
            className="border-gray articleCurrentImg card mb-1 mt-3 d-flex alifn-items-center justify-center ServiceNav"
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
