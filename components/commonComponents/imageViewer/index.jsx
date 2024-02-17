import { useEffect, useRef } from "react";
import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";

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
    <div
      ref={viewerRef}
      className={`d-flex gap-2 ${
        patientImgFiles ? "" : "notesContainer"
      } flex-wrap receptionSmsHeader`}
    >
      {patientImgFiles ? (
        <div className="row m-0 pt-4 px-2 w-100">
          {images.map((item, index) => (
            <div className="col-12 col-sm-6 col-xl-3" key={index}>
              <div className="card articleCard">
                <div className="card-body">
                  <div className="articleImgContainer">
                    <img
                      src={`https://irannobat.ir/images/PatientAttachment/${item.Name}`}
                      alt={`image-${index}`}
                      className="imgFileStyle"
                    />

                    <div className="articleLink">
                      <FeatherIcon
                        icon="eye"
                        style={{ width: "20px", height: "20px" }}
                      />
                    </div>
                  </div>

                  {/* cardDetails */}
                  <div className="imgInfos px-2">
                    {item.Title && <p className="font-16 mb-1">{item.Title}</p>}
                    {item.Date && <p className="mb-2">{item.Date}</p>}
                    {item.Description && (
                      <p className="">
                        توضیحات : {item.Description.substr(0, 20) + " ..."}
                      </p>
                    )}

                    <hr className="my-1" />

                    <div className="d-flex justify-end">
                      <button
                        className="btn btn-outline-primary p-1 d-flex align-items-center justify-center removeImg"
                        type="button"
                        data-pr-position="bottom"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFunc(item._id);
                        }}
                      >
                        <FeatherIcon
                          style={{ width: "14px", height: "14px" }}
                          icon="trash"
                        />
                        <Tooltip target=".removeImg">حذف</Tooltip>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        images.map((item, index) => (
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
        ))
      )}
    </div>
  );
};

export default ImageViewer;
