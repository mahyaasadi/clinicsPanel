import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Tooltip } from "primereact/tooltip";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig";
import { setPatientAvatarUrl } from "lib/session";
import { convertBase64 } from "utils/convertBase64";
import { ErrorAlert, SuccessAlert } from "class/AlertManage";
import selectfieldColourStyles from "class/selectfieldStyle";
import SelectField from "components/commonComponents/selectfield";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";
import UploadAvatarModal from "components/dashboard/patientInfo/uploadAvatarModal";
import useImageCropper from "components/commonComponents/cropper/useImageCropper";
import QRCodeGeneratorModal from "components/commonComponents/qrcode";
import {
  genderDataClass,
  maritalStatus,
  educationStatus,
} from "class/staticDropdownOptions";

const EditPatientInfoFrm = ({
  ClinicUserID,
  data,
  EditPatient,
  ActivePatientID,
  patientAvatar,
  setPatientAvatar,
  getOnePatient,
}) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [avatarIsLoading, setAvatarIsLoading] = useState(false);
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
          router.back();
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

  // upload avatar modal
  const [showUploadAvatarModal, setShowUploadAvatarModal] = useState(false);
  const openUploadAvatarModal = () => setShowUploadAvatarModal(true);
  const closeUploadAvatarModal = () => setShowUploadAvatarModal(false);

  const handleCroppedImage = async (blob) => {
    // await changeUserAvatar(blob, userInfo._id);
    console.log({ blob });
  };

  const [avatarSrc, setAvatarSrc] = useState(data.Avatar);
  const [imageElement, handleSubmit] = useImageCropper(avatarSrc, 1);

  const changePatientAvatar = async (e) => {
    e.preventDefault();
    setAvatarIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    if (formProps.editPatientAvatar) {
      let avatarBlob = await convertBase64(formProps.editPatientAvatar);

      let url = "Patient/ChangeAvatar";
      let editData = {
        PatientID: ActivePatientID,
        Avatar: avatarBlob,
      };

      axiosClient
        .put(url, editData)
        .then((response) => {
          setPatientAvatar(response.data.Avatar);
          getOnePatient();
          setAvatarIsLoading(false);
          setShowUploadAvatarModal(false);
        })
        .catch((err) => {
          console.log(err);
          setAvatarIsLoading(false);
        });
    }
  };

  // QRCode modal
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const openQRCodeModal = () => setShowQRCodeModal(true);
  const closeQRCodeModal = () => setShowQRCodeModal(false);

  let PatientAvatarUrl = setPatientAvatarUrl(
    ActivePatientID + ";" + ClinicUserID
  );

  useEffect(() => {
    setShowEmailAlertTxt(false);
  }, []);

  return (
    <>
      <form onSubmit={_editPatientInfo}>
        <div className="card shadow-none col-6">
          <div className="card-body">
            <div className="patientAvatarImg">
              {data.Avatar ? (
                <img
                  src={"https://irannobat.ir/images/Avatar/" + patientAvatar}
                  alt="patientAvatar"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "100%",
                  }}
                />
              ) : (
                <svg className="svg-icon" viewBox="0 0 20 20">
                  <path
                    fill="#F5E8DF"
                    d="M12.443,9.672c0.203-0.496,0.329-1.052,0.329-1.652c0-1.969-1.241-3.565-2.772-3.565S7.228,6.051,7.228,8.02c0,0.599,0.126,1.156,0.33,1.652c-1.379,0.555-2.31,1.553-2.31,2.704c0,1.75,2.128,3.169,4.753,3.169c2.624,0,4.753-1.419,4.753-3.169C14.753,11.225,13.821,10.227,12.443,9.672z M10,5.247c1.094,0,1.98,1.242,1.98,2.773c0,1.531-0.887,2.772-1.98,2.772S8.02,9.551,8.02,8.02C8.02,6.489,8.906,5.247,10,5.247z M10,14.753c-2.187,0-3.96-1.063-3.96-2.377c0-0.854,0.757-1.596,1.885-2.015c0.508,0.745,1.245,1.224,2.076,1.224s1.567-0.479,2.076-1.224c1.127,0.418,1.885,1.162,1.885,2.015C13.961,13.689,12.188,14.753,10,14.753z M10,0.891c-5.031,0-9.109,4.079-9.109,9.109c0,5.031,4.079,9.109,9.109,9.109c5.031,0,9.109-4.078,9.109-9.109C19.109,4.969,15.031,0.891,10,0.891z M10,18.317c-4.593,0-8.317-3.725-8.317-8.317c0-4.593,3.724-8.317,8.317-8.317c4.593,0,8.317,3.724,8.317,8.317C18.317,14.593,14.593,18.317,10,18.317z"
                  ></path>
                </svg>
              )}
            </div>
            <button
              type="button"
              onClick={openUploadAvatarModal}
              className="btn btn-outline-primary changeAvatarIcon"
              data-pr-position="left"
            >
              <FeatherIcon icon="edit-2" />
              <Tooltip target=".changeAvatarIcon">ویرایش آواتار</Tooltip>
            </button>
          </div>
        </div>

        <div className="mt-4 row align-items-center">
          <p className="text-secondary fw-bold font-14 basicInfoLine">
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

      <UploadAvatarModal
        data={data}
        show={showUploadAvatarModal}
        onHide={closeUploadAvatarModal}
        changePatientAvatar={changePatientAvatar}
        avatarIsLoading={avatarIsLoading}
        openQRCodeModal={openQRCodeModal}
        handleSubmit={handleSubmit}
        handleCroppedImage={handleCroppedImage}
      />

      <QRCodeGeneratorModal
        show={showQRCodeModal}
        onHide={closeQRCodeModal}
        url={"changePatientAvatar"}
        token={PatientAvatarUrl}
      />
    </>
  );
};

export default EditPatientInfoFrm;
