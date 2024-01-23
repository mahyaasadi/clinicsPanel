import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { axiosClient } from "class/axiosConfig";
import { Tooltip } from "primereact/tooltip";
import FeatherIcon from "feather-icons-react";
import { ErrorAlert, SuccessAlert } from "class/AlertManage";
import { gender, insurance } from "components/commonComponents/imagepath";
import EditPatientInfoModal from "./editPatientInfo";
import EditInsuranceTypeModal from "./editInsuranceTypeModal";
import { convertDateFormat } from "utils/convertDateFormat";

const PatientInfoCard = ({
  data,
  getPatientInfo,
  ActivePatientNID,
  ClinicID,
  setPatientInfo,
  patientStatIsLoading,
  getPatientActiveSearch,
  handlePendingPatientClick,
  handleShowPendingPatients,
}) => {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleChangePatientInfo = (type, value) => {
    setIsLoading(true);

    let url = "reception/ChangeProfileData";
    let updatedInfo = {
      CenterID: ClinicID,
      NID: ActivePatientNID,
      col: type,
      val: value,
    };

    axiosClient
      .post(url, updatedInfo)
      .then((response) => {
        if (type === "Age") {
          data.Age = value;
        } else if (type === "Name") {
          data.Name = value;
        } else if (type === "Gender") {
          data.Gender = value;
        } else if (type === "Tel") {
          data.Tel = value;
        } else if (type === "NationalID") {
          data.NationalID = value;
        }

        setPatientInfo([]);
        setTimeout(() => setPatientInfo(data), 100);
        handleCloseModal();
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const changeInsuranceType = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "Patient/ChangeInsurance";
    let editData = {
      CenterID: ClinicID,
      Clinic: true,
      IID: parseInt(formProps.insuranceTypeOptions),
      NID: formProps.patientNID,
    };

    axiosClient
      .post(url, editData)
      .then((response) => {
        console.log(response.data);
        if (response.data.isCovered) {
          // if (editData.IID === 1) {
          //   patientsInfo.InsuranceName = "سلامت ایرانیان";
          //   patientsInfo.Insurance = 1;
          // } else if (editData.IID === 2) {
          //   patientsInfo.InsuranceName = "تامین اجتماعی";
          //   patientsInfo.Insurance = 2;
          // } else if (editData.IID === 3) {
          //   patientsInfo.InsuranceName = "ارتش";
          //   patientsInfo.Insurance = 3;
          // } else {
          //   patientsInfo.InsuranceName = "آزاد";
          //   patientsInfo.Insurance = 4;
          // }

          SuccessAlert("موفق", "!تغییر نوع بیمه با موفقیت انجام شد");
        } else if (response.data.isCovered !== true) {
          ErrorAlert(
            "خطا",
            "تغییر بیمه بیمار ، به دلیل عدم پوشش بیمه امکان پذیر نیست"
          );
          return false;
        }
        setIsLoading(false);
        $("#changeInsuranceTypeModal").hide("");
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        ErrorAlert("خطا", "تغییر نوع بیمه با خطا مواجه گردید!");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const input = value.replace(/\D/g, "").slice(0, 4);
    setBirthYear(input);
    validateInput(input);

    if (name === "PatientBD") {
      let calculatedAge = currentYear - input;
      if (input === "") calculatedAge = "";
      $("#Age").val(calculatedAge);
    }

    if (name === "Age") {
      let calculatedYear = currentYear - e.target.value;
      if (e.target.value === "") calculatedYear = "";
      setBirthYear(calculatedYear);
      $("#PatientBD").val(calculatedYear);

      if (calculatedYear > 1000) setShowBirthDigitsAlert(false);
    }
  };

  const validateInput = (input) => {
    if (input.length < 4) {
      setShowBirthDigitsAlert(true);
      $("#submitNewPatient").attr("disabled", true);
    } else {
      setShowBirthDigitsAlert(false);
      $("#submitNewPatient").attr("disabled", false);
    }
  };

  // Pending Patients
  const [pendingPatients, setPendingPatients] = useState([]);

  const getPendingPatients = () => {
    let url = "Patient/getPenndingPatient";
    let data = {
      CenterID: ClinicID,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        setPendingPatients(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const _handlePendingPatientClick = (pendingPatient) => {
    handlePendingPatientClick(pendingPatient);
  };

  useEffect(() => {
    getPendingPatients();
    $(".pendingPaitentContainer").hide();
  }, []);

  return (
    <>
      <div className="card presCard mb-3 shadow-sm">
        <div className="card-body">
          <form className="w-100" onSubmit={getPatientInfo}>
            <div className="input-group">
              <label className="lblAbs font-12">کد ملی / کد اتباع بیمار</label>
              <input
                type="text"
                name="nationalCode"
                id="patientNID"
                required
                // autoComplete="off"
                className="form-control rounded-right GetPatientInput w-50"
                defaultValue={ActivePatientNID}
                onClick={handleShowPendingPatients}
              />

              <button
                label="Multiple"
                severity="warning"
                className="btn btn-primary rounded-left w-10 disNone"
                id="getPatientCloseBtn"
                onClick={getPatientActiveSearch}
                type="button"
              >
                <i className="fe fe-close"></i>
              </button>

              {!patientStatIsLoading ? (
                <button
                  className="btn btn-primary w-10 rounded-left font-12"
                  id="frmPatientInfoBtnSubmit"
                >
                  استعلام
                </button>
              ) : (
                <button
                  type="submit"
                  id="frmPatientInfoBtnSubmit"
                  className="btn-primary btn rounded-left"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                </button>
              )}
            </div>

            <div className="pendingPaitentContainer">
              {pendingPatients.length !== 0
                ? pendingPatients.map((item, index) => (
                    <div
                      className="card shadow-none w-100 mb-2 pendPatientCard"
                      key={index}
                      onClick={() => _handlePendingPatientClick(item)}
                    >
                      <div className="d-flex justify-between font-13 text-secondary fw-bold p-2">
                        <div className="d-flex align-items-center gap-3">
                          <div>
                            <p className="mb-1">{item?.Name}</p>
                            <div className="d-flex gap-2 align-items-center">
                              <div className="w-16 m-0 d-flex">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-100 m-0"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                                  />
                                </svg>
                              </div>

                              {item?.NationalID}
                            </div>

                            <div className="d-flex gap-2 align-items-center">
                              <FeatherIcon
                                icon="smartphone"
                                style={{ width: "16px" }}
                              />
                              <p id="PatientTel">{item?.Tel}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : ""}
            </div>
          </form>

          <div className="font-13 mt-3" id="patientInfoCard">
            <div className="smartphone-container font-13 phone-input">
              <div className="d-flex smartphone-padding">
                <i className="smartphone-icon">
                  <FeatherIcon icon="smartphone" />
                </i>
                <p id="PatientTel">{data?.Tel}</p>
                <Link
                  href="#"
                  onClick={handleShowModal}
                  className="editPhone-icon"
                  data-pr-position="top"
                >
                  <Tooltip target=".editPhone-icon">
                    ویرایش اطلاعات بیمار
                  </Tooltip>
                  <FeatherIcon icon="edit-2" className="themeColor" />
                </Link>
              </div>
            </div>

            <div className="margin-right-1 font-12 mt-3">
              <div className="d-flex gap-2 mb-3">
                <FeatherIcon icon="user" className="mb-0" />
                {data?.Name
                  ? data?.Name
                  : data?.name
                  ? data?.name + " " + data?.lastName
                  : "-"}{" "}
                ,
                {data?.Age ? (
                  <p className="m-0">- {data?.Age} ساله</p>
                ) : data?.age ? (
                  <p className="m-0">{data?.age} ساله</p>
                ) : (
                  ""
                )}
              </div>

              <div className="d-flex gap-1 align-items-center">
                <Image src={gender} alt="genderIcon" width="20" />
                {data?.Gender
                  ? data?.Gender === "M"
                    ? "مرد"
                    : data?.Gender === "F"
                    ? "زن"
                    : "دیگر"
                  : "-"}
              </div>

              <div className="d-flex gap-2 mt-3">
                <div className="d-flex gap-1 align-items-center">
                  <Image src={insurance} alt="insuranceIcon" width="20" />
                  {data?.InsuranceName
                    ? data?.InsuranceName
                    : "نوع بیمه مشخص نمی باشد"}
                </div>

                <Link
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#changeInsuranceTypeModal"
                  className="changeInsuranceBtn"
                  data-pr-position="top"
                >
                  <Tooltip target=".changeInsuranceBtn">تغییر نوع بیمه</Tooltip>
                  <i className="margin-right-2 themecolor">
                    <FeatherIcon icon="refresh-cw" />
                  </i>
                </Link>
              </div>

              <p className="mt-3 margin-right-sm">
                تاریخ اعتبار تا {""}
                {data?.accountValidto &&
                  convertDateFormat(data?.accountValidto)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <EditPatientInfoModal
        data={data}
        showModal={showModal}
        handleClose={handleCloseModal}
        isLoading={isLoading}
        handleChangePatientInfo={handleChangePatientInfo}
      />

      <EditInsuranceTypeModal
        ClinicID={ClinicID}
        data={data}
        changeInsuranceType={changeInsuranceType}
      />
    </>
  );
};

export default PatientInfoCard;
