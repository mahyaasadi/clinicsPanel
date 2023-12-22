import Link from "next/link";
import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";

const GenralUserInfoSettings = ({
  userInfo,
  editGeneralUserInfo,
  infoIsLoading,
  showTelAlertText,
  setShowTelAlertText,
}) => {
  const router = useRouter();

  const handleCancelBtn = (e) => {
    e.preventDefault();
    router.push("/profile");
  };

  const validateTel = () => {
    const userTel = $("#editUserTel").val();

    if (userTel.length < 11) {
      setShowTelAlertText(true);
      $("#submitUserBtn").attr("disabled", true);
    } else {
      setShowTelAlertText(false);
      $("#submitUserBtn").attr("disabled", false);
    }
  };

  return (
    <>
      <div className="col-xl-6 col-12">
        <div className="card">
          <div className="card-body p-4">
            <div className="card-header">
              <p className="font-16 fw-bold text-secondary">اطلاعات شخصی</p>
            </div>
            <form onSubmit={editGeneralUserInfo}>
              <div className="form-group mt-4">
                <input
                  type="hidden"
                  className="form-control floating"
                  name="userId"
                  value={userInfo._id}
                />

                <label className="lblAbs font-12">
                  نام و نام خانوادگی <span className="text-danger">*</span>
                </label>
                <div className="col p-0">
                  <input
                    className="form-control floating inputPadding rounded"
                    type="text"
                    name="editUserFullName"
                    defaultValue={userInfo.FullName}
                    key={userInfo.FullName}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="lblAbs font-12">
                  نام کاربری <span className="text-danger">*</span>
                </label>
                <div className="col p-0">
                  <input
                    className="form-control floating inputPadding rounded"
                    type="text"
                    name="editUserName"
                    defaultValue={userInfo.User}
                    key={userInfo.User}
                    readOnly
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="lblAbs font-12">
                  شماره همراه <span className="text-danger">*</span>
                </label>
                <div className="col p-0">
                  <input
                    className="form-control floating inputPadding rounded"
                    type="tel"
                    id="editUserTel"
                    name="editUserTel"
                    defaultValue={userInfo.Tel}
                    key={userInfo.Tel}
                    onBlur={validateTel}
                    required
                  />
                </div>
              </div>

              {/* userTel validation */}
              {showTelAlertText && (
                <div className="marginb-med">
                  <div
                    className="text-secondary font-13 frmValidation form-control inputPadding rounded mb-1"
                    id="formValidationText3"
                  >
                    <FeatherIcon
                      icon="alert-triangle"
                      className="frmValidationTxt"
                    />
                    <div className="frmValidationTxt">
                      شماره همراه باید دارای 11 رقم باشد!
                    </div>
                  </div>
                </div>
              )}

              <div className="settings-btns d-flex gap-1 justify-center media-flex-col margin-top-3">
                {!infoIsLoading ? (
                  <button
                    type="submit"
                    id="submitUserBtn"
                    className="btn btn-primary rounded col-lg-5 col-12 font-13"
                  >
                    ثبت
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary rounded col-lg-5 col-12 font-13"
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
                  type="submit"
                  className="btn btn-outline-primary rounded profileSettingsBtn col-lg-5 col-12 font-13"
                  id="cancelGeneralInfoBtn"
                  onClick={handleCancelBtn}
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenralUserInfoSettings;
