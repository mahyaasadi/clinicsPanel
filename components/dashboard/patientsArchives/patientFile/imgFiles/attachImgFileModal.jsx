import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig";
import { setPatientAvatarUrl } from "lib/session";
import { convertBase64 } from "utils/convertBase64";
import { resizeImgFile } from "utils/resizeImgFile";
import { ErrorAlert } from "class/AlertManage";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";
import QRCodeGeneratorModal from "components/commonComponents/qrcode";

const AttachImgFileModal = ({
  show,
  setShowModal,
  ActivePatientID,
  ClinicID,
  AttachImgFile,
}) => {
  const [selectedTab, setSelectedTab] = useState("");
  const [date, setDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);

  let attachedImg = null;
  const resetFields = () => {
    $("#attachImgTitle").val(null);
    $("#attachImgDes").val(null);
    attachedImg = null;
    setImgSrc(null);
    $("#attachedImgPreview").attr("src", "");
  };

  const onHide = () => {
    setShowModal(false);
    resetFields();
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    resetFields();
  };

  const _attachImgFile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let url = "Patient/addAttachment";
    let data = {
      PatientID: ActivePatientID,
      ClinicID,
      ClinicPatientReception: null,
      Image: imgSrc,
      TypeID: selectedTab,
      Title: $("#attachImgTitle").val(),
      Description: $("#attachImgDes").val(),
      Date: date,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        AttachImgFile(response.data);
        onHide();
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "آپلود تصویر با خطا مواجه گردید!");
        setIsLoading(false);
      });
  };

  // QRCode Modal
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const openQRCodeModal = () => setShowQRCodeModal(true);
  const closeQRCodeModal = () => setShowQRCodeModal(false);

  let PatientImgFileURL = setPatientAvatarUrl(
    ActivePatientID + ";" + ClinicID + ";" + selectedTab
  );

  useEffect(() => handleTabChange(1), []);

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header className="modal-header imgFilesTabBg">
        <ul className="font-13 nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified w-100">
          <li className="nav-item">
            <a
              className="nav-link h-100 active"
              href="#solid-rounded-tab1"
              onClick={() => handleTabChange(1)}
              data-bs-toggle="tab"
            >
              پاراکلینیک
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link h-100"
              href="#solid-rounded-tab2"
              onClick={() => handleTabChange(2)}
              data-bs-toggle="tab"
            >
              شرح حال
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link h-100"
              href="#solid-rounded-tab3"
              onClick={() => handleTabChange(3)}
              data-bs-toggle="tab"
            >
              نسخه ها
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link h-100"
              href="#solid-rounded-tab4"
              onClick={() => handleTabChange(4)}
              data-bs-toggle="tab"
            >
              سایر
            </a>
          </li>
        </ul>
      </Modal.Header>

      <Modal.Body>
        <form
          className="imgFilesTabBg tabContentFrmHeight"
          onSubmit={_attachImgFile}
        >
          <div className="tab-content p-1 mt-4">
            <div className="row m-0 dir-rtl flex-col justify-center align-items-center">
              <div
                className="tab-pane show active"
                id="solid-rounded-tab1"
              ></div>
              <div className="tab-pane" id="solid-rounded-tab2"></div>
              <div className="tab-pane" id="solid-rounded-tab3"></div>
              <div className="tab-pane" id="solid-rounded-tab4"></div>

              <div className="form-group col-md-11 col-12 p-relative p-0">
                <label className="lblAbs font-12">عنوان</label>
                <input
                  className="form-control floating inputPadding rounded"
                  name="attachImgTitle"
                  id="attachImgTitle"
                />
              </div>

              <div className="form-group col-md-11 col-12 p-relative p-0">
                <label className="lblAbs font-12">توضیحات</label>
                <input
                  className="form-control floating inputPadding rounded"
                  name="attachImgDes"
                  id="attachImgDes"
                />
              </div>

              <div className="form-group col-md-11 col-12 p-0">
                <SingleDatePicker
                  setDate={setDate}
                  label="انتخاب تاریخ"
                  birthDateMode={true}
                />
              </div>

              <div className="change-photo-btn col-md-11 col-12 p-0 mb-3">
                <div>
                  <i>
                    <FeatherIcon icon="upload" />
                  </i>
                  <p>آپلود تصویر جدید</p>
                </div>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  className="upload"
                  id="attachImgFile"
                  name="attachImgFile"
                  onChange={(e) => resizeImgFile(e, setImgSrc)}
                />
              </div>

              <div className="previewImgContainer m-0">
                <img
                  src={imgSrc}
                  alt=""
                  width="250"
                  id="attachedImgPreview"
                  className="d-block m-auto previewImg"
                ></img>
              </div>
            </div>

            <div className="submit-section d-flex gap-1 justify-center">
              {!isLoading ? (
                <>
                  <button
                    onClick={openQRCodeModal}
                    type="button"
                    className="btn btn-sm btn-outline-primary rounded btn-save font-13"
                  >
                    استفاده از گوشی همراه
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary rounded btn-save font-13"
                  >
                    ثبت
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary rounded font-13 d-flex align-items-center gap-2 justify-center"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  در حال ثبت
                </button>
              )}
            </div>
          </div>
        </form>
      </Modal.Body>

      <QRCodeGeneratorModal
        show={showQRCodeModal}
        onHide={closeQRCodeModal}
        url={"uploadPatientImgFile"}
        token={PatientImgFileURL}
      />
    </Modal>
  );
};

export default AttachImgFileModal;
