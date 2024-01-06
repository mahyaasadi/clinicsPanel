import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, SuccessAlert } from "class/AlertManage";
import FeatherIcon from "feather-icons-react";
import selectfieldColourStyles from "class/selectfieldStyle";
import SelectField from "components/commonComponents/selectfield";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";
import {
  genderDataClass,
  maritalStatus,
  educationStatus,
} from "class/staticDropdownOptions";

const EditPatientInfoFrm = ({ data, EditPatient }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showEmailAlertTxt, setShowEmailAlertTxt] = useState(false);
  const [birthDate, setBirthDate] = useState(null);
  const [email, setEmail] = useState(data.Email);

  const handleEmailChange = (e) => setEmail(e.target.value);

  // Validate email format
  const isValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailBlur = (e) => {
    const inputValue = e.target.value;
    setEmail(inputValue);

    if (!isValidEmail(inputValue)) {
      setShowEmailAlertTxt(true);
      $("#submitEditPatient").attr("disabled", true);
    } else {
      setShowEmailAlertTxt(false);
      $("#submitEditPatient").attr("disabled", false);
    }
  };

  let patientGender = "";
  const FUSelectGender = (gender) => (patientGender = gender);

  let MaritalStatus = "";
  const FUSelectMaritalStatus = (maritalStatus) =>
    (MaritalStatus = maritalStatus);

  let education = "";
  const FUSelectEducationStatus = (education) => (education = education);

  const defaultGenderValue = data.Gender;
  const defaultGenderValueLabel =
    data.Gender === "M" ? "مرد" : data.Gender === "F" ? "زن" : "دیگر";

  const selectedGender = {
    value: defaultGenderValue,
    label: defaultGenderValueLabel,
  };

  const selectedMaritalStatus = {
    value: data.MaritalStatus,
    label: data.MaritalStatus,
  };

  const selectedEducationStatus = {
    value: data.Education,
    label: data.Education,
  };

  const _editPatientInfo = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "Patient/editPatient";
    let data = {
      PatientID: formProps.patientID,
      NationalID: formProps.patientNID,
      Name: formProps.patientName,
      FatherName: formProps.fathersName,
      Representative: formProps.representative,
      ShenasnamehNo: formProps.ShenasnamehNo,
      MaritalStatus: formProps.MaritalStatus,
      Education: formProps.Education,
      Job: formProps.Job,
      PatientHeight: formProps.PatientHeight,
      PatientWeight: formProps.PatientWeight,
      PostalCode: formProps.PostalCode,
      Gender: formProps.patientGender,
      Age: formProps.patientAge,
      BD: birthDate ? birthDate : formProps.patientAge,
      Tel: formProps.patientTel,
      Landline: formProps.patientLandlinePhone,
      Email: email ? email : formProps.Email,
      Address: formProps.Address,
    };

    axiosClient
      .put(url, data)
      .then((response) => {
        EditPatient(response.data);

        setTimeout(() => {
          SuccessAlert("موفق", "ویرایش اطلاعات با موفقیت انجام گردید!");
        }, 200);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ویرایش اطلاعات با خطا مواجه گردید!");
        setIsLoading(false);
      });
  };

  const handleCancelBtn = () => router.push("/patientsArchives");

  useEffect(() => {
    setShowEmailAlertTxt(false);
  }, []);

  return (
    <>
      <form onSubmit={_editPatientInfo}>
        <div className="mt-4 row align-items-center">
          <p
            className="text-secondary fw-bold font-14"
            style={{
              position: "absolute",
              top: "1.75rem",
              backgroundColor: "white",
              width: "115px",
              zIndex: "400",
            }}
          >
            اطلاعات پایه
          </p>

          <hr style={{ position: "relative" }} />
          <div className="form-group col-md-4 col-sm-6 col-12 margint-frmGrp">
            <input type="hidden" value={data._id} name="patientID" />

            <label className="lblAbs font-12">
              نام کامل <span className="text-danger">*</span>
            </label>
            <input
              className="form-control floating inputPadding rounded"
              name="patientName"
              defaultValue={data.Name ? data.Name : ""}
              key={data.Name}
              required
            />
          </div>

          <div className="form-group col-md-4 col-sm-6 col-12 margint-frmGrp">
            <label className="lblAbs font-12">
              کد ملی <span className="text-danger">*</span>
            </label>
            <input
              dir="ltr"
              className="form-control floating inputPadding rounded"
              name="patientNID"
              defaultValue={data.NationalID ? data.NationalID : ""}
              key={data.NationalID}
              required
            />
          </div>

          <div className="col-md-4 col-12">
            <label className="lblDrugIns font-12">جنسیت</label>
            <SelectField
              styles={selectfieldColourStyles}
              options={genderDataClass}
              label={true}
              name="patientGender"
              className="text-center font-12"
              placeholder={"انتخاب کنید"}
              defaultValue={selectedGender}
              onChangeValue={(value) => FUSelectGender(value?.value)}
              key={data.Gender}
              isClearable
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-6 col-12 margint-frmGrp">
            <label className="lblAbs font-12">
              تلفن همراه <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              className="form-control floating inputPadding rounded"
              name="patientTel"
              defaultValue={data.Tel ? data.Tel : ""}
              key={data.Tel}
              required
            />
          </div>

          <div className="form-group col-md-6 col-12  margint-frmGrp">
            <label className="lblAbs font-12">تلفن ثابت</label>
            <input
              type="tel"
              className="form-control floating inputPadding rounded"
              name="patientLandlinePhone"
              defaultValue={data.Landline ? data.Landline : ""}
              key={data.Landline}
            />
          </div>
        </div>

        <p className="text-secondary fw-bold font-14 margint-3 additionalInfoLine">
          اطلاعات تکمیلی
        </p>

        <hr style={{ position: "relative" }} />

        <div className="row mt-3">
          <div className="form-group col-md-3 col-sm-6 col-12 margint-frmGrp">
            <label className="lblAbs font-12">نام پدر</label>
            <input
              type="text"
              className="form-control floating inputPadding rounded"
              name="fathersName"
              defaultValue={data.FatherName ? data.FatherName : ""}
              key={data.FatherName}
            />
          </div>

          <div className="form-group col-md-3 col-sm-6 col-12 margint-frmGrp">
            <label className="lblAbs font-12">سن</label>
            <input
              dir="ltr"
              type="text"
              className="form-control floating inputPadding rounded"
              name="patientAge"
              defaultValue={data.Age ? data.Age : ""}
              key={data.Age}
            />
          </div>

          <div className="form-group col-md-3 col-sm-6 col-12 margint-frmGrp">
            <SingleDatePicker
              defaultDate={data.BD}
              birthDateMode={true}
              setDate={setBirthDate}
              label="تاریخ تولد"
            />
          </div>

          <div className="form-group col-md-3 col-sm-6 col-12 margint-frmGrp">
            <label className="lblAbs font-12">معرف</label>
            <input
              type="text"
              className="form-control floating inputPadding rounded"
              name="representative"
              defaultValue={data.Representative ? data.Representative : ""}
              key={data.Representative}
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-3 col-sm-6 col-12 margint-frmGrp">
            <label className="lblAbs font-12">شماره شناسنامه</label>
            <input
              dir="ltr"
              type="text"
              className="form-control floating inputPadding rounded"
              name="ShenasnamehNo"
              defaultValue={data.ShenasnamehNo ? data.ShenasnamehNo : ""}
              key={data.ShenasnamehNo}
            />
          </div>

          <div className="col-md-3 col-sm-6 col-12">
            <label className="lblDrugIns font-12">وضعیت تاهل</label>
            <SelectField
              styles={selectfieldColourStyles}
              options={maritalStatus}
              label={true}
              name="MaritalStatus"
              className="text-center font-12"
              placeholder={"انتخاب کنید"}
              defaultValue={selectedMaritalStatus}
              onChangeValue={(value) => FUSelectMaritalStatus(value?.value)}
              key={data.MaritalStatus}
              isClearable
            />
          </div>

          <div className="col-md-3 col-sm-6 col-12">
            <label className="lblDrugIns font-12">تحصیلات</label>
            <SelectField
              styles={selectfieldColourStyles}
              options={educationStatus}
              label={true}
              name="Education"
              className="text-center font-12"
              placeholder={"انتخاب کنید"}
              onChangeValue={(value) => FUSelectEducationStatus(value?.value)}
              defaultValue={selectedEducationStatus}
              key={data.Education}
              isClearable
            />
          </div>

          <div className="form-group col-md-3 col-sm-6 col-12 margint-frmGrp">
            <label className="lblAbs font-12">شغل</label>
            <input
              type="text"
              className="form-control floating inputPadding rounded"
              name="Job"
              defaultValue={data.Job ? data.Job : ""}
              key={data.Job}
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-3 col-sm-6 col-12 margint-frmGrp">
            <label className="lblAbs font-12">قد</label>
            <input
              dir="ltr"
              type="text"
              className="form-control floating inputPadding rounded"
              name="PatientHeight"
              defaultValue={data.PatientHeight ? data.PatientHeight : ""}
              key={data.PatientHeight}
            />
          </div>

          <div className="form-group col-md-3 col-sm-6 col-12 margint-frmGrp">
            <label className="lblAbs font-12">وزن</label>
            <input
              dir="ltr"
              type="text"
              className="form-control floating inputPadding rounded"
              name="PatientWeight"
              defaultValue={data.PatientWeight ? data.PatientWeight : ""}
              key={data.PatientWeight}
            />
          </div>

          <div className="form-group col-md-3 col-sm-6 col-12 margint-frmGrp">
            <label className="lblAbs font-12">کد پستی</label>
            <input
              dir="ltr"
              type="text"
              className="form-control floating inputPadding rounded"
              name="PostalCode"
              defaultValue={data.PostalCode ? data.PostalCode : ""}
              key={data.PostalCode}
            />
          </div>

          <div className="form-group col-md-3 col-sm-6 col-12 margint-frmGrp">
            <label className="lblAbs font-12">ایمیل</label>
            <input
              dir="ltr"
              type="text"
              className="form-control floating inputPadding rounded"
              name="Email"
              placeholder="example@example.com"
              value={email}
              onBlur={handleEmailBlur}
              onChange={handleEmailChange}
              key={data.Email}
            />

            {showEmailAlertTxt && (
              <div className="mb-3 mt-4 col">
                <div className="text-secondary font-13 frmValidation form-control inputPadding rounded mb-1">
                  <FeatherIcon
                    icon="alert-triangle"
                    className="frmValidationTxt"
                  />
                  <div className="frmValidationTxt">
                    فرمت ایمیل نادرست می باشد!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-group mt-2">
          <label className="lblAbs font-12">آدرس</label>
          <textarea
            type="text"
            className="form-control floating inputPadding rounded"
            name="Address"
            defaultValue={data.Address}
            key={data.Address}
          ></textarea>
        </div>

        <div className="submit-section d-flex gap-1 justify-center flex-col-md margin-top-3">
          {!isLoading ? (
            <button
              type="submit"
              id="submitEditPatient"
              className="btn btn-primary rounded col-md-2 col-12 font-13"
            >
              ثبت
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary rounded col-md-2 col-12 font-13"
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
            className="btn btn-outline-primary rounded profileSettingsBtn col-md-2 col-12 font-13"
            id="cancelEditPatientInfoBtn"
            onClick={handleCancelBtn}
          >
            انصراف
          </button>
        </div>
      </form>
    </>
  );
};

export default EditPatientInfoFrm;
