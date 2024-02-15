import { useState, useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig";
import { convertBase64 } from "utils/convertBase64";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";

const AttachImgFileModal = ({ ActivePatientID, ClinicID, AttachImgFile }) => {
  const [selectedTab, setSelectedTab] = useState("");
  const [date, setDate] = useState(null);
  const [fileLength, setFileLength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  let attachedImg = null;
  const resetFields = () => {
    $("#attachImgTitle").val(null);
    $("#attachImgDes").val(null);
    // setDate(null);
    attachedImg = null;
    $("#attachedImgPreview").attr("src", "");
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    resetFields();
  };

  const displayPreview = (e) => {
    var urlCreator = window.URL || window.webkitURL;
    setFileLength(e.target.files.length);
    if (e.target.files.length !== 0) {
      var imageUrl = urlCreator.createObjectURL(e.target.files[0]);
      $("#attachedImgPreview").attr("src", imageUrl);
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

      console.log({ data });

      axiosClient
        .post(url, data)
        .then((response) => {
          AttachImgFile(response.data);

          resetFields();
          $("attachImgFileModal").modal("hide");
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
    <div
      className="modal fade contentmodal"
      id="attachImgFileModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <p className="mb-0 text-secondary font-14 fw-bold">
              فایل تصویری جدید
            </p>
            <button
              type="button"
              className="close-btn"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i>
                <FeatherIcon icon="x-circle" />
              </i>
            </button>
          </div>

          <div className="modal-body">
            <form className="imgFilesTabBg" onSubmit={_attachImgFile}>
              <ul className="font-13 nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    href="#solid-rounded-tab1"
                    onClick={() => handleTabChange(1)}
                    data-bs-toggle="tab"
                  >
                    پاراکلینیک
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#solid-rounded-tab2"
                    onClick={() => handleTabChange(2)}
                    data-bs-toggle="tab"
                  >
                    شرح حال
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#solid-rounded-tab3"
                    onClick={() => handleTabChange(3)}
                    data-bs-toggle="tab"
                  >
                    نسخه ها
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#solid-rounded-tab4"
                    onClick={() => handleTabChange(4)}
                    data-bs-toggle="tab"
                  >
                    سایر
                  </a>
                </li>
              </ul>

              <div className="tab-content tabContentFrmHeight">
                <div className="dir-rtl flex-col justify-center align-items-center">
                  <div
                    className="tab-pane show active"
                    id="solid-rounded-tab1"
                  ></div>
                  <div className="tab-pane" id="solid-rounded-tab2"></div>
                  <div className="tab-pane" id="solid-rounded-tab3"></div>
                  <div className="tab-pane" id="solid-rounded-tab4"></div>

                  <div className="form-group w-50 p-relative">
                    <label className="lblAbs font-12">عنوان</label>
                    <input
                      className="form-control floating inputPadding rounded"
                      name="attachImgTitle"
                      id="attachImgTitle"
                    />
                  </div>

                  <div className="form-group w-50 p-relative">
                    <label className="lblAbs font-12">توضیحات</label>
                    <input
                      className="form-control floating inputPadding rounded"
                      name="attachImgDes"
                      id="attachImgDes"
                    />
                  </div>

                  <div className="form-group w-50">
                    <SingleDatePicker
                      setDate={setDate}
                      label="انتخاب تاریخ"
                      birthDateMode={true}
                    />
                  </div>

                  <div className="change-photo-btn w-50">
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

                  {/* {fileLength !== 0 && ( */}
                  <div className="previewImgContainer">
                    <img
                      src={""}
                      alt=""
                      width="250"
                      id="attachedImgPreview"
                      className="d-block m-auto previewImg"
                    ></img>
                  </div>
                  {/* )} */}
                </div>

                <div className="submit-section d-flex justify-center">
                  {!isLoading ? (
                    <button
                      type="submit"
                      className="btn btn-sm btn-primary rounded btn-save font-13"
                    >
                      ثبت
                    </button>
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
        </div>
      </div>
    </div>
  );
};

export default AttachImgFileModal;
