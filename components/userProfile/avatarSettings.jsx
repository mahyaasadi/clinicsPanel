import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const AvatarSettings = ({
  userInfo,
  changeUserAvatar,
  avatarIsLoading,
  ClinicUser,
}) => {
  const router = useRouter();

  const [avatarSrc, setAvatarSrc] = useState(ClinicUser.Avatar);
  const [cropper, setCropper] = useState(null);
  const imageElement = useRef(null);

  const displayNewAvatar = (e) => {
    if (e.target.files.length !== 0) {
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(e.target.files[0]);
      setAvatarSrc(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();

      if (!croppedCanvas) {
        return;
      }
      croppedCanvas.toBlob(async (blob) => {
        let formData = new FormData();
        formData.append("editUserAvatar", blob);
        formData.append("userId", userInfo._id);

        await changeUserAvatar(formData);
      });
    }
  };

  const handleCancelBtn = (e) => {
    e.preventDefault();
    router.push("/profile");
  };

  useEffect(() => {
    if (avatarSrc !== ClinicUser.Avatar && imageElement.current) {
      if (cropper) cropper.destroy();
      const newCropper = new Cropper(imageElement.current, {
        aspectRatio: 1,
      });
      setCropper(newCropper);
    }

    return () => {
      if (cropper) {
        cropper.destroy();
        setCropper(null);
      }
    };
  }, [avatarSrc]);

  return (
    <>
      <div className="col-xl-6 col-12">
        <div className="card">
          <div className="card-body p-4">
            <div className="card-header">
              <p className="font-16 fw-bold text-secondary">تغییر آواتار</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="settings-form">
                <p className="font-12 lblAbs">آواتار فعلی</p>
                <div className="upload-images">
                  <input
                    type="hidden"
                    className="form-control floating"
                    name="userId"
                    value={ClinicUser._id}
                  />

                  <img
                    src={avatarSrc}
                    ref={imageElement}
                    alt="Image"
                    id="currentAvatar"
                    className="profileSettingsImg"
                  />
                  <Link href="#" className="btn-icon logo-hide-btn">
                    <i>
                      <FeatherIcon icon="x-circle" />
                    </i>
                  </Link>
                </div>

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
                      name="editUserAvatar"
                      onChange={displayNewAvatar}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex gap-1 justify-center margin-top-3 media-flex-column">
                  {!avatarIsLoading ? (
                    <button
                      type="submit"
                      id="submitUserBtn"
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

                  <button
                    type="button"
                    href="/profileSettings"
                    className="btn btn-outline-primary rounded profileSettingsBtn font-13"
                    id="cancelAvatarEdit"
                    onClick={handleCancelBtn}
                  >
                    انصراف
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AvatarSettings;
