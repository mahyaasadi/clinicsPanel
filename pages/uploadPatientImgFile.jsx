import { useState } from "react";
import { useRouter } from "next/router";
import { axiosClient } from "class/axiosConfig";
import FeatherIcon from "feather-icons-react";
import { getPatientAvatarUrl } from "lib/session";
import { convertBase64 } from "utils/convertBase64";
import { SuccessAlert, ErrorAlert } from "class/AlertManage";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";
import "public/assets/css/uploadPatientImgFile.css";

let ActivePatientID,
  ClinicID,
  TypeID = null;
let ResizeImg = null;
const UploadPatientImgFile = () => {
  const router = useRouter();

  const [avatarIsLoading, setAvatarIsLoading] = useState(false);
  const [imgTitle, setImgTitle] = useState("");
  const [imgDes, setImgDes] = useState("");
  const [date, setDate] = useState(null);

  const [fileLength, setFileLength] = useState(0);
  const [avatarSrc, setAvatarSrc] = useState(null);

  let IDs = getPatientAvatarUrl(router.query.token);
  if (IDs) {
    IDs = IDs.split(";");
    ActivePatientID = IDs[0];
    ClinicID = IDs[1];
    TypeID = IDs[2];
  }

  const displayNewAvatar = (e) => {
    let settings = {
      max_width: 1000,
      max_height: 1000,
      quality: 1,
      do_not_resize: [],
    };
    const originalFile = e.target.files[0];

    var reader = new FileReader();

    reader.onload = function (e) {
      var img = document.createElement("img");
      var canvas = document.createElement("canvas");

      img.src = e.target.result;
      img.onload = function () {
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        if (
          img.width < settings.max_width &&
          img.height < settings.max_height
        ) {
          // Resize not required
          return;
        }

        const ratio = Math.min(
          settings.max_width / img.width,
          settings.max_height / img.height
        );
        const width = Math.round(img.width * ratio);
        const height = Math.round(img.height * ratio);

        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        ResizeImg = canvas.toDataURL("image/jpeg");
        setAvatarSrc(ResizeImg);
      };
    };

    reader.readAsDataURL(originalFile);
    return this;
  };

  // var urlCreator = window.URL || window.webkitURL;
  // setFileLength(e.target.files.length);

  // if (e.target.files.length !== 0) {
  //   var imageUrl = urlCreator.createObjectURL(e.target.files[0]);
  //   setAvatarSrc(imageUrl);
  // }

  let attachedImg = null;
  const attachImgFile = async (e) => {
    e.preventDefault();
    setAvatarIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    // if (
    //   formProps.uploadPatientImgFile &&
    //   formProps.uploadPatientImgFile !== 0
    // ) {
    //   attachedImg = await convertBase64(formProps.uploadPatientImgFile);

    let url = "Patient/addAttachment";
    let data = {
      PatientID: ActivePatientID,
      ClinicID,
      ClinicPatientReception: null,
      Image: ResizeImg,
      TypeID: TypeID,
      Title: imgTitle,
      Description: imgDes,
      Date: date,
    };
    console.log(data);

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
    // }
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

            {/* <div className="p-2"> */}
            <div className="form-group">
              <div className="change-photo-btn mt-4">
                <div>
                  <i>
                    <FeatherIcon icon="upload" />
                  </i>
                  <p>آپلود آواتار جدید</p>
                </div>
                <input
                  type="file"
                  className="upload"
                  name="uploadPatientImgFile"
                  onChange={displayNewAvatar}
                  required
                />
              </div>
            </div>

            {fileLength !== 0 && (
              <div className="previewImgContainer">
                <img
                  src={avatarSrc}
                  width="200"
                  alt="patientImgFile"
                  id="patientImgFile"
                  className="d-block m-auto previewImg"
                ></img>
              </div>
            )}

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
                    className="btn btn-primary rounded btn-save font-13"
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
          </div>
          {/* </div> */}
        </div>
      </form>
    </div>
  );
};

export default UploadPatientImgFile;

//http://localhost:3000/uploadPatientImgFile?token=eyJhbGciOiJIUzI1NiJ9.NjRiN2M3ZmM3NzQ1NDgyYjYwNDAyMDljOzY1MzYyZjFmZTQ0YjZmMTU2YjA4NGNmOA.8yVtke-jjnlIogizU5xnO956hJEzn9VFLS73W8XXI7M?typeId=1
