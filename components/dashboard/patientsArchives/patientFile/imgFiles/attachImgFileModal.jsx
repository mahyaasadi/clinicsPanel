import { useState, useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig";
import { convertBase64 } from "utils/convertBase64";
import useImageCropper from "components/commonComponents/cropper/useImageCropper";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";
import { Modal } from "react-bootstrap"

const AttachImgFileModal = ({ show, setShowModal, ActivePatientID, ClinicID, AttachImgFile }) => {
  const [selectedTab, setSelectedTab] = useState("");
  const [date, setDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [imageElement, handleSubmit] = useImageCropper(avatarSrc, 1);

  let attachedImg = null;
  const resetFields = () => {
    $("#attachImgTitle").val(null);
    $("#attachImgDes").val(null);
    attachedImg = null;

    $("#attachedImgPreview").attr("src", "");
    if (imageElement.current && imageElement.current.cropper) {
      // Check if cropper exists before destroying
      imageElement.current.cropper.destroy();
    }
  };

  const onHide = () => {
    setShowModal(false);
    resetFields()
  }

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    resetFields();
  };

  // Cropper hook
  const handleCroppedImage = async (blob) => {
    // await changePatientAvatar(blob);
    console.log({ blob });
  };


  const displayPreview = (e) => {
    var urlCreator = window.URL || window.webkitURL;

    if (e.target.files.length !== 0) {
      var imageUrl = urlCreator.createObjectURL(e.target.files[0]);
      $("#attachedImgPreview").attr("src", imageUrl);
      setAvatarSrc(imageUrl)
    }
  };

  const _attachImgFile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    if (formProps.attachImgFile && formProps.attachImgFile.size != 0) {
      attachedImg = await convertBase64(formProps.attachImgFile);

      let url = "Patient/addAttachment";
      let data = {
        PatientID: ActivePatientID,
        ClinicID,
        ClinicPatientReception: null,
        Image: attachedImg,
        TypeID: selectedTab,
        Title: formProps.attachImgTitle,
        Description: formProps.attachImgDes,
        Date: date,
      };

      axiosClient
        .post(url, data)
        .then((response) => {
          AttachImgFile(response.data);
          resetFields();
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  };

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
        <div className="modal-body">
          <form className="imgFilesTabBg tabContentFrmHeight" onSubmit={(e) => handleSubmit(e, handleCroppedImage)}>
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
                    <p>آپلود تصویر</p>
                  </div>
                  <input
                    type="file"
                    className="upload"
                    id="attachImgFile"
                    name="attachImgFile"
                    onChange={displayPreview}
                  />
                </div>

                <div className="previewImgContainer m-0">
                  <img
                    src={avatarSrc}
                    ref={imageElement}
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
                      type="submit"
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
        </div>

      </Modal.Body>
    </Modal>
  );
};

export default AttachImgFileModal;
