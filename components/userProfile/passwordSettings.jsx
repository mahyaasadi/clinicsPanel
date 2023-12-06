import { useState } from "react";
import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";

const PasswordSettings = ({
  userInfo,
  passIsLoading,
  newPassword,
  handleNewPassword,
  editUserPassword,
  showPasswordAlertText,
  setShowPasswordAlertText,
  showConfPassAlertText,
  setShowConfPassAlertText,
}) => {
  const router = useRouter();
  const [eye, setEye] = useState(true);
  const onEyeClick = () => setEye(!eye);

  const validatePassword = () => {
    if (newPassword.length < 7) {
      setShowPasswordAlertText(true);
      $("#submitNewPasswordBtn").attr("disabled", true);
    } else {
      setShowPasswordAlertText(false);
      $("#submitNewPasswordBtn").attr("disabled", false);
    }
  };

  // confirm password validation
  const validateConfirmPassword = () => {
    let passValue = $("#newPassword").val();
    let confpassValue = $("#confirmNewPassword").val();

    if (passValue !== confpassValue) {
      setShowConfPassAlertText(true);
      $("#submitNewPasswordBtn").attr("disabled", true);
    } else {
      setShowConfPassAlertText(false);
      $("#submitNewPasswordBtn").attr("disabled", false);
    }
  };

  const handleCancelBtn = (e) => {
    e.preventDefault();
    router.push("/profile");
  };

  return (
    <>
      <div className="d-flex justify-center">
        <div className="col-lg-8 col-12 p-4">
          <div className="card-body">
            <div className="card-header">
              <p className="font-16 fw-bold text-secondary">تغییر رمز عبور</p>
            </div>
            <form id="passwordSettingsFrm" onSubmit={editUserPassword}>
              <div className="form-group mt-4">
                <input
                  type="hidden"
                  className="form-control floating"
                  name="userId"
                  value={userInfo._id}
                />

                <label className="lblAbs font-12">
                  رمز عبور فعلی <span className="text-danger">*</span>
                </label>
                <div className="col p-0">
                  <input
                    type={eye ? "password" : "text"}
                    name="currentPassword"
                    id="currentPassword"
                    className="form-control floating inputPadding rounded"
                    required
                  />
                  <span
                    onClick={onEyeClick}
                    className={`fa toggle-password-current" ${
                      eye ? "fa-eye-slash" : "fa-eye"
                    }`}
                  />
                </div>

                <div className="input-group mb-3 mt-4">
                  <label className="lblAbs font-12">
                    رمز عبور جدید <span className="text-danger">*</span>
                  </label>
                  <div className="col p-0">
                    <input
                      type={eye ? "password" : "text"}
                      name="newPassword"
                      id="newPassword"
                      className="form-control floating inputPadding rounded"
                      value={newPassword}
                      onChange={handleNewPassword}
                      autoComplete="false"
                      onBlur={validatePassword}
                      required
                    />
                    <span
                      onClick={onEyeClick}
                      className={`fa toggle-password-newPass" ${
                        eye ? "fa-eye-slash" : "fa-eye"
                      }`}
                    />
                  </div>
                </div>

                {/* password validation */}
                {showPasswordAlertText && (
                  <div className="marginb-med mt-4">
                    <div className="text-secondary font-13 frmValidation form-control inputPadding rounded mb-1">
                      <FeatherIcon
                        icon="alert-triangle"
                        className="frmValidationTxt"
                      />
                      <div className="frmValidationTxt">
                        رمز عبور باید حداقل 7 رقم باشد!
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="lblAbs font-12">
                    تکرار رمز عبور <span className="text-danger">*</span>
                  </label>
                  <div className="col p-0">
                    <input
                      type={eye ? "password" : "text"}
                      name="confirmNewPassword"
                      id="confirmNewPassword"
                      className="form-control floating inputPadding rounded"
                      autoComplete="false"
                      onBlur={validateConfirmPassword}
                      required
                    />
                    <span
                      onClick={onEyeClick}
                      className={`fa toggle-password-confPass" ${
                        eye ? "fa-eye-slash" : "fa-eye"
                      }`}
                    />
                  </div>
                </div>

                {showConfPassAlertText && (
                  <div className="marginb-med mt-4">
                    <div className="text-secondary font-13 frmValidation form-control inputPadding rounded mb-1">
                      <FeatherIcon
                        icon="alert-triangle"
                        className="frmValidationTxt"
                      />
                      <div className="frmValidationTxt">
                        رمز عبور باید تطابق داشته باشد!
                      </div>
                    </div>
                  </div>
                )}

                <div className="settings-btns d-flex gap-1 justify-center media-flex-column margin-top-3">
                  {!passIsLoading ? (
                    <button
                      type="submit"
                      id="submitNewPasswordBtn"
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
                    type="submit"
                    className="btn btn-outline-secondary rounded profileSettingsBtn font-13"
                    id="cancelNewPasswordBtn"
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

export default PasswordSettings;
