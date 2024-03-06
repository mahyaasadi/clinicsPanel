import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";
import useImageCropper from "components/commonComponents/cropper/useImageCropper";

const AvatarSettings = ({
  userInfo,
  changeUserAvatar,
  avatarIsLoading,
  ClinicUser,
  openQRCodeModal,
}) => {
  const router = useRouter();

  const [avatarSrc, setAvatarSrc] = useState(ClinicUser.Avatar);
  const [imageElement, handleSubmit] = useImageCropper(avatarSrc, 1);

  const displayNewAvatar = (e) => {
    if (e.target.files.length !== 0) {
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(e.target.files[0]);
      setAvatarSrc(imageUrl);
    }
  };

  const handleCroppedImage = async (blob) => {
    await changeUserAvatar(blob, userInfo._id);
  };

  const handleCancelBtn = (e) => {
    e.preventDefault();
    router.push("/profile");
  };

  return (
    <>
      <div className="col-xl-6 col-12">
        <div className="card">
          <div className="card-body p-4">
            <div className="card-header">
              <p className="font-16 fw-bold text-secondary">تغییر آواتار</p>
            </div>
            <form onSubmit={(e) => handleSubmit(e, handleCroppedImage)}>
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

                <div className="row justify-center margin-top-3 media-gap-sm">
                  <div className="col-lg-4 col-12">
                    {!avatarIsLoading ? (
                      <button
                        type="submit"
                        id="submitUserBtn"
                        className="btn btn-primary rounded font-13 w-100"
                      >
                        ثبت
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-primary rounded font-13"
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

                  <div className="col-lg-4 col-12">
                    <button
                      onClick={openQRCodeModal}
                      type="button"
                      className="btn btn-outline-primary rounded w-100 font-13"
                    >
                      استفاده از گوشی همراه
                    </button>
                  </div>

                  <div className="col-lg-4 col-12">
                    <button
                      type="button"
                      href="/profileSettings"
                      className="btn btn-outline-primary rounded profileSettingsBtn w-100 font-13"
                      id="cancelAvatarEdit"
                      onClick={handleCancelBtn}
                    >
                      انصراف
                    </button>
                  </div>
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
