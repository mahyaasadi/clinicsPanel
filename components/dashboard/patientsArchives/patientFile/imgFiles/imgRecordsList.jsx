import { useState, useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import ImageViewer from "components/commonComponents/imageViewer";

const ImgRecordsList = ({
  data,
  openAttachImgFilesModal,
  removePatientImgFile,
}) => {
  //   console.log({ data });

  const [selectedTab, setSelectedTab] = useState("");

  const handleTabChange = (tab) => setSelectedTab(tab);

  const filteredData = () => {
    if (selectedTab === 1) {
      return data.filter((item) => item.Type === 1);
    } else if (selectedTab === 2) {
      return data.filter((item) => item.Type === 2);
    } else if (selectedTab === 3) {
      return data.filter((item) => item.Type === 3);
    } else if (selectedTab === 4) {
      return data.filter((item) => item.Type === 4);
    } else {
      return data;
    }
  };

  useEffect(() => handleTabChange(1), []);

  return (
    <div className="card border-gray mb-2">
      <div className="card-body">
        <div className="row align-items-center p-2 pt-0 mb-2">
          <div className="col">
            <p className="card-title font-14 text-secondary">تصاویر مربوطه</p>
          </div>

          <div className="col d-flex justify-content-end">
            <div className="col d-flex justify-content-end">
              <button
                onClick={openAttachImgFilesModal}
                className="btn text-secondary font-12 d-flex align-items-center gap-1 fw-bold p-0 formBtns"
              >
                <FeatherIcon icon="plus" />
                فایل جدید
              </button>
            </div>
          </div>
        </div>

        <hr className="mt-0 mb-1" />

        <div className="modal-body imgFilesTabBg pt-0">
          <ul className="font-13 nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
            <li className="nav-item">
              <a
                className="nav-link active"
                href="#solid-rounded-tab1"
                data-bs-toggle="tab"
                onClick={() => handleTabChange(1)}
              >
                پاراکلینیک
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#solid-rounded-tab2"
                data-bs-toggle="tab"
                onClick={() => handleTabChange(2)}
              >
                شرح حال
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#solid-rounded-tab3"
                data-bs-toggle="tab"
                onClick={() => handleTabChange(3)}
              >
                نسخه ها
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#solid-rounded-tab4"
                data-bs-toggle="tab"
                onClick={() => handleTabChange(4)}
              >
                سایر
              </a>
            </li>
          </ul>

          <div className="tab-content tabContentHeight p-0">
            <div className="dir-rtl ">
              <div className="tab-pane show active" >
                <ImageViewer
                  images={filteredData()}
                  removeFunc={removePatientImgFile}
                  patientImgFiles={true}
                  TypeID={selectedTab}
                />
              </div>
            </div>
            {/* <div className="tab-pane" id="solid-rounded-tab2">
              <ImageViewer
                images={filteredData()}
                removeFunc={removePatientImgFile}
                patientImgFiles={true}
                TypeID={selectedTab}
              />
            </div>
            <div className="tab-pane" id="solid-rounded-tab3">
              <ImageViewer
                images={filteredData()}
                removeFunc={removePatientImgFile}
                patientImgFiles={true}
                TypeID={selectedTab}
              />
            </div>
            <div className="tab-pane" id="solid-rounded-tab4">
              <ImageViewer
                images={filteredData()}
                removeFunc={removePatientImgFile}
                patientImgFiles={true}
                TypeID={selectedTab}
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImgRecordsList;
