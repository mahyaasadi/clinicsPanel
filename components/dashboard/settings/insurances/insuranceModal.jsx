import { useState } from "react";
import { Modal } from "react-bootstrap";
import SelectField from "components/commonComponents/selectfield";
import selectfieldColourStyles from "class/selectfieldStyle";

const InsuranceModal = ({
  show,
  onHide,
  mode,
  data = {},
  isLoading,
  onSubmit,
  insuranceOptions,
  selectedInsurance,
  FUSelectInsurance,
}) => {
  console.log({ data });
  const [eye, setEye] = useState(true);
  const modalTitle = mode === "edit" ? "ویرایش اطلاعات" : "افزودن بیمه";
  const submitText = mode === "edit" ? "ثبت تغییرات" : "ثبت";

  const onEyeClick = () => setEye(!eye);

  const selectedInsuranceType =
    mode === "edit" ? { value: data.IID, label: data.IName } : null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="mb-0 text-secondary font-14 fw-bold">{modalTitle}</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={onSubmit}>
          <div className="col media-mt-1 marginb-1">
            <input type="hidden" name="insuranceID" value={data.IID} />
            <input type="hidden" name="insuranceName" value={data.IName} />

            <div className="col media-w-100 font-12">
              <label className="lblDrugIns font-12">
                نوع بیمه <span className="text-danger">*</span>
              </label>
              <SelectField
                styles={selectfieldColourStyles}
                options={insuranceOptions}
                name="insuranceType"
                className="text-center"
                placeholder={"نوع بیمه را انتخاب کنید "}
                onChangeValue={(value) => FUSelectInsurance(value)}
                defaultValue={selectedInsuranceType}
                key={data.IName}
                required
              />
            </div>
          </div>

          <div className="input-group mb-4">
            <label className="lblAbs font-12">نام کاربری</label>
            <input
              type="text"
              name="insuranceUserName"
              required
              className="form-control inputPadding rounded"
              defaultValue={mode === "edit" ? data.IUName : ""}
            />
          </div>

          <div className="input-group mb-3">
            <label className="lblAbs font-12">رمز عبور</label>
            <input
              dir="ltr"
              type={eye ? "password" : "text"}
              name="insurancePassword"
              required
              className="form-control rounded passInputPadding"
              defaultValue={data.IPass}
            />
            <span
              onClick={onEyeClick}
              className={`fa toggle-password" ${
                eye ? "fa-eye-slash" : "fa-eye"
              }`}
            />
          </div>

          <div className="submit-section">
            {!isLoading ? (
              <button
                type="submit"
                className="btn btn-primary rounded btn-save font-13"
              >
                {submitText}
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
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default InsuranceModal;

