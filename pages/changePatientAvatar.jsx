import { useState } from "react";
import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig";
import { convertBase64 } from "utils/convertBase64";
import { getPatientAvatarUrl } from "lib/session";
import { SuccessAlert, ErrorAlert } from "class/AlertManage";
import useImageCropper from "components/commonComponents/cropper/useImageCropper";
import "public/assets/css/changePatientAvatar.css";

let ActivePatientID,
  UserID = null;
const ChangePatientAvatar = () => {
  let router = useRouter();

  const [avatarIsLoading, setAvatarIsLoading] = useState(false);
  const [fileLength, setFileLength] = useState(0);
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [imageElement, handleSubmit] = useImageCropper(avatarSrc, 1);

  let IDs = getPatientAvatarUrl(router.query.token);
  if (IDs) {
    IDs = IDs.split(";");
    ActivePatientID = IDs[0];
    UserID = IDs[1];
  }

  const handleCroppedImage = async (blob) => {
    await submitUpload(blob);
  };

  const displayNewAvatar = (e) => {
    var urlCreator = window.URL || window.webkitURL;
    setFileLength(e.target.files.length);

    if (e.target.files.length !== 0) {
      var imageUrl = urlCreator.createObjectURL(e.target.files[0]);
      setAvatarSrc(imageUrl);
    }
  };

  let avatarBlob = null;
  const submitUpload = async (blob) => {
    setAvatarIsLoading(true);

    if (blob) {
      let avatarBlob = await convertBase64(blob);
      let url = "";
      let editData = {
        Avatar: avatarBlob,
      };

      if (ActivePatientID === 0) {
        url = "ClinicUser/ChangeAvatar";
        // editData.UserID = UserID,
      } else {
        url = "Patient/ChangeAvatar";
        editData.PatientID = ActivePatientID;
      }

      axiosClient
        .put(url, editData)
        .then((response) => {
          SuccessAlert("موفق", "آپلود تصویر با موفقیت انجام گردید!");
          setAvatarIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          ErrorAlert("خطا", "آپلود تصویر با خطا مواجه گردید!");
          setAvatarIsLoading(false);
        });
    }
  };

  return (
    <>
      <div className="changeAvatarContainer">
        <form
          onSubmit={(e) => handleSubmit(e, handleCroppedImage)}
          className="p-4 dir-rtl changeAvatarFrm"
        >
          <p className="mb-1 text-secondary fw-bold font-14">
            عکس مورد نظر خود را انتخاب نمایید
          </p>
          <hr />

          <div className="changeAvatarScrollBox p-2">
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
                  name="editPatientAvatar"
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
                  alt="patientAvatar"
                  id="patientAvatar"
                  className="d-block m-auto previewImg"
                  ref={imageElement}
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
        </form>
      </div>
    </>
  );
};

export default ChangePatientAvatar;
