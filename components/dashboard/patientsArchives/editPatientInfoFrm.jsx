import { useState } from "react";
import selectfieldColourStyles from "class/selectfieldStyle";
import SelectField from "components/commonComponents/selectfield";
import {
  genderDataClass,
  maritalStatus,
  educationStatus,
} from "class/staticDropdownOptions";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";

const EditPatientInfoFrm = ({ data }) => {
  console.log({ data });

  const [isLoading, setIsLoading] = useState(false);
  const [birthDate, setBirthDate] = useState(null);

  let patientGender = "";
  const FUSelectGender = (gender) => (patientGender = gender);

  let MaritalStatus = "";
  const FUSelectMaritalStatus = (maritalStatus) =>
    (MaritalStatus = maritalStatus);

  const defaultGenderValue = data.Gender;
  const defaultGenderValueLabel =
    data.Gender === "M" ? "مرد" : data.Gender === "F" ? "زن" : "دیگر";

  const selectedGender = {
    value: defaultGenderValue,
    label: defaultGenderValueLabel,
  };

  const defaultMaritalValue = data.MaritalStatus;
  const defaultMaritalValueLabel =
    data.MaritalStatus === "مجرد" ? "مجرد" : "متاهل";

  const selectedMaritalStatus = {
    value: defaultMaritalValue,
    label: defaultMaritalValueLabel,
  };

  const selectedEducationStatus = {
    value: data.Education,
    label: data.Education,
  };

  const submitEditPatientInfo = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "";
    let data = {
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
      // Address,
      // Email
    };

    console.log({ data });

    axiosClient
      .put(url, data)
      .then((response) => {
        console.log(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <>
      <form onSubmit={submitEditPatientInfo}>
        <div className="mt-4 row align-items-center marginb-1">
          <p
            className="text-secondary fw-bold font-14"
            style={{
              position: "absolute",
              top: "1.5rem",
              backgroundColor: "white",
              width: "100px",
            }}
          >
            اطلاعات پایه
          </p>

          <hr />
          <div className="form-group col-md-3 col-6 margint-frmGrp">
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

          <div className="form-group col-md-3 col-6 margint-frmGrp">
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

          <div className="form-group col-md-3 col-6 margint-frmGrp">
            <label className="lblAbs font-12">تلفن ثابت</label>
            <input
              type="tel"
              className="form-control floating inputPadding rounded"
              name="patientLandlinePhone"
              //   defaultValue={mode == "edit" ? data.Des : ""}
              //   key={data.Des}
            />
          </div>

          <div className="col-md-3 col-6">
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

        <p
          className="text-secondary fw-bold font-14 margint-3"
          style={{
            position: "absolute",
            top: "6rem",
            backgroundColor: "white",
            width: "115px",
          }}
        >
          اطلاعات تکمیلی
        </p>

        <hr />

        <div className="row mt-3">
          <div className="form-group col-md-3 col-6 margint-frmGrp">
            <label className="lblAbs font-12">نام پدر</label>
            <input
              type="text"
              className="form-control floating inputPadding rounded"
              name="fathersName"
              defaultValue={data.FatherName ? data.FatherName : ""}
              key={data.FatherName}
            />
          </div>

          <div className="form-group col-md-3 col-6 margint-frmGrp">
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

          <div className="form-group col-md-3 col-6 margint-frmGrp">
            <SingleDatePicker
              birthDateMode={true}
              setDate={setBirthDate}
              label="تاریخ تولد"
            />
          </div>

          <div className="form-group col-md-3 col-6 margint-frmGrp">
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
          <div className="form-group col-md-3 col-6 margint-frmGrp">
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

          <div className="col-md-3 col-6">
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

          <div className="col-md-3 col-6">
            <label className="lblDrugIns font-12">تحصیلات</label>
            <SelectField
              styles={selectfieldColourStyles}
              options={educationStatus}
              label={true}
              name="Education"
              className="text-center font-12"
              placeholder={"انتخاب کنید"}
              defaultValue={selectedEducationStatus}
              onChangeValue={(value) => FUSelectEducationStatus(value?.value)}
              key={data.Education}
              isClearable
            />
          </div>

          <div className="form-group col-md-3 col-6 margint-frmGrp">
            <label className="lblAbs font-12">شغل</label>
            <input
              dir="ltr"
              type="text"
              className="form-control floating inputPadding rounded"
              name="Job"
              defaultValue={data.Job ? data.Job : ""}
              key={data.Job}
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-3 col-6 margint-frmGrp">
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

          <div className="form-group col-md-3 col-6 margint-frmGrp">
            <label className="lblAbs font-12">وزن</label>
            <input
              dir="ltr"
              type="text"
              className="form-control floating inputPadding rounded"
              name="PatientHeight"
              defaultValue={data.PatientWeight ? data.PatientWeight : ""}
              key={data.PatientWeight}
            />
          </div>

          <div className="form-group col-md-3 col-6 margint-frmGrp">
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
        </div>
      </form>
    </>
  );
};

export default EditPatientInfoFrm;
