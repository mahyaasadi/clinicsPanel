import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { setSession } from "lib/SessionMange";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig";
import { convertBase64 } from "utils/convertBase64";
import { getPatientAvatarUrl } from "lib/session";
import { resizeImgFile } from "utils/resizeImgFile";
import { SuccessAlert, ErrorAlert } from "class/AlertManage";
import useImageCropper from "components/commonComponents/cropper/useImageCropper";
import "public/assets/css/changePatientAvatar.css";

let ActivePatientID,
  UserID = null;
const ChangePatientAvatar = () => {
  let router = useRouter();

  const [avatarIsLoading, setAvatarIsLoading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [imageElement, handleSubmit] = useImageCropper(avatarSrc, 1);
  const [userInfo, setUserInfo] = useState([]);

  let IDs = getPatientAvatarUrl(router.query.token);
  console.log(IDs);
  if (IDs) {
    IDs = IDs.split(";");
    ActivePatientID = IDs[0];
    UserID = IDs[1];
  }

  const handleCroppedImage = async (blob) => {
    await submitUpload(blob);
  };

  const getClinicUserById = () => {
    // setIsLoading(true);

    let url = "ClinicUser/getUserById";
    let data = {
      UserID: getPatientAvatarUrl(router.query.token),
    };

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        setUserInfo(response.data);
        // setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // setIsLoading(false);
      });
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

      if (!UserID) {
        url = "ClinicUser/ChangeAvatar";
        editData.UserID = ActivePatientID;
      } else {
        url = "Patient/ChangeAvatar";
        editData.PatientID = ActivePatientID;
      }

      console.log({ url, editData });

      axiosClient
        .put(url, editData)
        .then(async (response) => {
          console.log(response.data);
          setUserInfo({ ...userInfo, Avatar: response.data.Avatar });

          SuccessAlert("موفق", "آپلود تصویر با موفقیت انجام گردید!");

          if (!UserID) {
            userInfo.Avatar = "https://irannobat.ir" + response.data.Avatar;

            let clinicSession = await setSession(userInfo);
            Cookies.set("clinicSession", clinicSession, { expires: 1 });
          }
          setAvatarIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          ErrorAlert("خطا", "آپلود تصویر با خطا مواجه گردید!");
          setAvatarIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (router.query.token) {
      getClinicUserById();
    }
  }, [router.isReady]);

  return (
    <>
      <div className="changeAvatarContainer">
        <form
          onSubmit={(e) => handleSubmit(e, handleCroppedImage)}
          className="p-4 dir-rtl"
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
                  onChange={(e) => resizeImgFile(e, setAvatarSrc)}
                  required
                />
              </div>
            </div>

            {avatarSrc && (
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
