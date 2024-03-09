import { useState } from "react";
import { useRouter } from "next/router";
import { axiosClient } from "class/axiosConfig";
import FeatherIcon from "feather-icons-react";
import { getPatientAvatarUrl } from "lib/session";
import { convertBase64 } from "utils/convertBase64";
import { SuccessAlert, ErrorAlert } from "class/AlertManage";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";
import { resizeImgFile } from "utils/resizeImgFile";
import "public/assets/css/uploadPatientImgFile.css";

let ActivePatientID,
  ClinicID,
  TypeID = null;
const UploadPatientImgFile = () => {
  const router = useRouter();

  const [avatarIsLoading, setAvatarIsLoading] = useState(false);
  const [imgTitle, setImgTitle] = useState("");
  const [imgDes, setImgDes] = useState("");
  const [date, setDate] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);

  let IDs = getPatientAvatarUrl(router.query.token);
  if (IDs) {
    IDs = IDs.split(";");
    ActivePatientID = IDs[0];
    ClinicID = IDs[1];
    TypeID = IDs[2];
  }

  let attachedImg = null;
  const attachImgFile = async (e) => {
    e.preventDefault();
    setAvatarIsLoading(true);

    let url = "Patient/addAttachment";
    let data = {
      PatientID: ActivePatientID,
      ClinicID,
      ClinicPatientReception: null,
      Image: imgSrc,
      TypeID: TypeID,
      Title: imgTitle,
      Description: imgDes,
      Date: date,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        SuccessAlert("", "آپلود تصویر با موفقیت انجام گردید!");
        setAvatarIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setAvatarIsLoading(false);
        ErrorAlert("خطا", "آپلود فایل با خطا مواجه گردید!");
      });
  };

  return (
    <div className="changeAvatarContainer">
      <form onSubmit={attachImgFile} className="p-4 mt-4">
        <div className="changeAvatarScrollBox">
          <div className="dir-rtl p-2">
            <div className="form-group col-12 p-relative p-0">
              <label className="lblAbs font-12">عنوان</label>
              <input
                className="form-control floating inputPadding rounded"
                name="attachImgTitle"
                id="attachImgTitle"
                value={imgTitle}
                onChange={(e) => setImgTitle(e.target.value)}
              />
            </div>

            <div className="form-group col-12 p-relative p-0">
              <label className="lblAbs font-12">توضیحات</label>
              <input
                className="form-control floating inputPadding rounded"
                name="attachImgDes"
                id="attachImgDes"
                value={imgDes}
                onChange={(e) => setImgDes(e.target.value)}
              />
            </div>

            <div className="form-group col-12 p-0">
              <SingleDatePicker
                setDate={setDate}
                label="انتخاب تاریخ"
                birthDateMode={true}
              />
            </div>

            <p className=" text-secondary fw-bold font-13">
              عکس مورد نظر خود را انتخاب نمایید
            </p>
            <hr />

            <div className="form-group">
              <div className="change-photo-btn mt-4">
                <div>
                  <i>
                    <FeatherIcon icon="upload" />
                  </i>
                  <p>آپلود تصویر جدید</p>
                </div>
                <input
                  type="file"
                  // accept=".jpg,.jpeg,.png,.gif,.webp"
                  accept="image/*"
                  capture="environment"
                  className="upload"
                  name="uploadPatientImgFile"
                  onChange={(e) => resizeImgFile(e, setImgSrc)}
                  required
                />
              </div>
            </div>

            <div className="previewImgContainer">
              <img
                src={imgSrc}
                width="200"
                alt=""
                id="patientImgFile"
                className="d-block m-auto previewImg"
              ></img>
            </div>

            <div className="margint-3 marginb-1">
              <div className="d-flex flex-col gap-2 justify-center">
                {!avatarIsLoading ? (
                  <button
                    type="submit"
                    className="btn btn-primary rounded btn-save font-13"
                  >
                    ثبت
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary rounded font-13 d-flex align-items-center justify-center gap-2"
                    disabled
                  >
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    ></span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadPatientImgFile;

//http://localhost:3000/uploadPatientImgFile?token=eyJhbGciOiJIUzI1NiJ9.NjRiN2M3ZmM3NzQ1NDgyYjYwNDAyMDljOzY1MzYyZjFmZTQ0YjZmMTU2YjA4NGNmOA.8yVtke-jjnlIogizU5xnO956hJEzn9VFLS73W8XXI7M?typeId=1
