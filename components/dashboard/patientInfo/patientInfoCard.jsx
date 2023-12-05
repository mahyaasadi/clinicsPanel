import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { axiosClient } from "class/axiosConfig";
import { Tooltip } from "primereact/tooltip";
import FeatherIcon from "feather-icons-react";
import { ErrorAlert, SuccessAlert } from "class/AlertManage";
import { gender, insurance } from "components/commonComponents/imagepath";
import EditPatientInfoModal from "./editPatientInfo";
import EditInsuranceTypeModal from "@/components/dashboard/patientInfo/editInsuranceTypeModal";

const PatientInfoCard = ({
  data,
  getPatientInfo,
  ActivePatientNID,
  ClinicID,
  setPatientInfo,
  patientStatIsLoading,
}) => {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const dateFormat = (str) => {
    if (str !== " " || str !== null) {
      let date =
        str.substr(0, 4) + "/" + str.substr(4, 2) + "/" + str.substr(6, 7);
      return date;
    } else {
      return 0;
    }
  };

  const handleChangePatientInfo = (type, value) => {
    console.log(`Changing ${type} to ${value}`);
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
        console.log(response.data);
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
      IID: parseInt(formProps.insuranceTypeOptions),
      NID: formProps.patientNID,
    };

    console.log({ editData });

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

  return (
    <>
      <div className="card presCard">
        <div className="card-body">
          <form className="w-100" onSubmit={getPatientInfo}>
            <div className="input-group mb-3">
              <label className="lblAbs font-12">کد ملی / کد اتباع بیمار</label>
              <input
                type="text"
                name="nationalCode"
                required
                className="form-control rounded-right GetPatientInput w-50"
                defaultValue={ActivePatientNID}
              />
              {!patientStatIsLoading ? (
                <button
                  className={`${router.pathname === "/salamatPrescription"
                    ? "btn-secondary"
                    : "btn-primary"
                    } btn w-10 rounded-left font-12`}
                  id="frmPatientInfoBtnSubmit"
                >
                  استعلام
                </button>
              ) : (
                <button
                  type="submit"
                  className={`${router.pathname === "/salamatPrescription"
                    ? "btn-secondary"
                    : "btn-primary"
                    } btn rounded-left`}
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                </button>
              )}
            </div>
          </form>

          <div className="font-13 mt-3" id="patientInfoCard">
            <div className="smartphone-container border-radius font-13 phone-input">
              <div className="d-flex smartphone-padding">
                <i className="smartphone-icon">
                  <FeatherIcon icon="smartphone" />
                </i>
                <p id="PatientTel">{data.Tel}</p>
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
                {data.Name}
                {data.Age ? <p className="m-0">- {data.Age} ساله</p> : ""}
              </div>

              <div className="d-flex gap-1 align-items-center">
                <Image src={gender} alt="genderIcon" width="20" />
                {data.Gender ? data.Gender : "-"}
              </div>

              <div className="d-flex gap-2 mt-3">
                <div className="d-flex gap-1 align-items-center">
                  <Image src={insurance} alt="insuranceIcon" width="20" />
                  {data.InsuranceName
                    ? data.InsuranceName
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
                {data.accountValidto && dateFormat(`${data.accountValidto}`)}
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
