import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, SuccessAlert } from "class/AlertManage";
import { convertDateFormat } from "utils/convertDateFormat";
import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";
import EditPatientInfoModal from "components/dashboard/patientInfo/editPatientInfo";
import EditInsuranceTypeModal from "components/dashboard/patientInfo/editInsuranceTypeModal";

const PatientVerticalCard = ({
  data,
  ClinicID,
  ActivePatientNID,
  setPatientInfo,
}) => {
  const router = useRouter();
  const [taminPrescMode, setTaminPrescMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  let GenderType = "";
  switch (data?.gender ? data?.gender : data?.Gender) {
    case "M":
      GenderType = "مرد";
      break;
    case "F":
      GenderType = "زن";
      break;
    case "O":
      GenderType = "دیگر";
      break;
    default:
      break;
  }

  let RelationType = "";
  switch (data?.relationType) {
    case "R":
      RelationType = "سرپرست";
      break;
    case "C":
      RelationType = "فرزند";
      break;
    case "S":
      RelationType = "همسر";
      break;
    case "T":
      RelationType = "خواهر";
      break;
    case "B":
      RelationType = "برادر";
      break;
    case "F":
      RelationType = "پدر";
      break;
    case "M":
      RelationType = "مادر";
      break;
    case "O":
      RelationType = "متفرقه";
      break;
    default:
      break;
  }

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
          data?.Age ? (data.Age = value) : (data.age = value);
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
        } else {
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

  useEffect(() => {
    if (
      router.pathname === "/taminPrescription" ||
      router.pathname === "/reception"
    ) {
      setTaminPrescMode(true);
    }
  }, [router.isReady]);

  return (
    <>
      <div className="card shadow" id="patientInfoCard2">
        <div className="card-body">
          <div className="PVCardprofile">
            <i className="eventBtns pointer-cursor" onClick={handleShowModal}>
              <FeatherIcon
                icon="edit-3"
                className="editPatientBtn"
                data-pr-position="left"
              />
              <Tooltip target=".editPatientBtn">ویرایش</Tooltip>
            </i>

            <div className="PVCardpro-im-na">
              <div className="PVCardimg">
                {data?.memberImage ? (
                  <img
                    src={data?.memberImage}
                    alt="patientAvatar"
                    style={{
                      width: "75px",
                      height: "75px",
                      borderRadius: "100%",
                    }}
                  />
                ) : data.Avatar ? (
                  <img
                    src={"https://irannobat.ir/images/Avatar/" + data?.Avatar}
                    alt="patientAvatar"
                    style={{
                      width: "75px",
                      height: "75px",
                      borderRadius: "100%",
                    }}
                  />
                ) : (
                  <svg className="PVCardsvg-icon" viewBox="0 0 20 20">
                    <path
                      fill="#E1CFC2"
                      d="M12.443,9.672c0.203-0.496,0.329-1.052,0.329-1.652c0-1.969-1.241-3.565-2.772-3.565S7.228,6.051,7.228,8.02c0,0.599,0.126,1.156,0.33,1.652c-1.379,0.555-2.31,1.553-2.31,2.704c0,1.75,2.128,3.169,4.753,3.169c2.624,0,4.753-1.419,4.753-3.169C14.753,11.225,13.821,10.227,12.443,9.672z M10,5.247c1.094,0,1.98,1.242,1.98,2.773c0,1.531-0.887,2.772-1.98,2.772S8.02,9.551,8.02,8.02C8.02,6.489,8.906,5.247,10,5.247z M10,14.753c-2.187,0-3.96-1.063-3.96-2.377c0-0.854,0.757-1.596,1.885-2.015c0.508,0.745,1.245,1.224,2.076,1.224s1.567-0.479,2.076-1.224c1.127,0.418,1.885,1.162,1.885,2.015C13.961,13.689,12.188,14.753,10,14.753z M10,0.891c-5.031,0-9.109,4.079-9.109,9.109c0,5.031,4.079,9.109,9.109,9.109c5.031,0,9.109-4.078,9.109-9.109C19.109,4.969,15.031,0.891,10,0.891z M10,18.317c-4.593,0-8.317-3.725-8.317-8.317c0-4.593,3.724-8.317,8.317-8.317c4.593,0,8.317,3.724,8.317,8.317C18.317,14.593,14.593,18.317,10,18.317z"
                    ></path>
                  </svg>
                )}
              </div>
              <div className="PVCardname">
                {taminPrescMode && (data?.Name ? data.Name : "")}
                {!taminPrescMode && data?.name + " " + data?.lastName}
                {taminPrescMode
                  ? data.Age
                    ? ", " + data.Age + " ساله"
                    : ""
                  : data?.age
                    ? ", " + data?.age + " ساله"
                    : ""}
              </div>
              <div className="PVCardjob">
                {taminPrescMode
                  ? data.NationalID
                    ? data.NationalID
                    : "-"
                  : data?.nationalNumber
                    ? data?.nationalNumber
                    : "-"}
              </div>
            </div>
          </div>

          <div className="PVCardviwer">
            <div className="PVCardboxall">
              <span className="PVCardvalue">
                {taminPrescMode
                  ? data.InsuranceType && data.InsuranceType === "2"
                    ? "تحت قرارداد بیمه می باشد"
                    : "تحت قرارداد بیمه نمی باشد"
                  : data?.isCovered
                    ? "تحت قرارداد بیمه می باشد"
                    : "تحت قرارداد بیمه نمی باشد"}
              </span>
              <span className="PVCardparameter">
                {taminPrescMode
                  ? ""
                  : data?.isReferenceable
                    ? "امکان پذيرش بيمار از مسير ارجاع وجود دارد"
                    : "امکان پذيرش بيمار از مسير ارجاع وجود ندارد"}
              </span>
            </div>

            <div className="PVCardboxall">
              <div className="PVCardvalue mb-2 d-flex align-items-center">
                <div className="">
                  نوع بیمه :{" "}
                  {taminPrescMode
                    ? data?.InsuranceName
                      ? data.InsuranceName
                      : "مشخص نمی باشد"
                    : data?.productName
                      ? data.productName
                      : "مشخص نمی باشد"}
                </div>

                {taminPrescMode && (
                  <div className="">
                    <Link
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#changeInsuranceTypeModal"
                      className="changeInsuranceBtn"
                      data-pr-position="top"
                    >
                      <Tooltip target=".changeInsuranceBtn">
                        تغییر نوع بیمه
                      </Tooltip>
                      <i className="margin-right-2 themecolor d-flex align-items-center">
                        <FeatherIcon
                          icon="refresh-cw"
                          style={{ width: "16px", height: "16px" }}
                        />
                      </i>
                    </Link>
                  </div>
                )}
              </div>
              <span className="PVCardparameter">
                تاریخ اعتبار تا {""}
                {data?.accountValidto
                  ? convertDateFormat(data?.accountValidto)
                  : "-"}
              </span>
              <span className="PVCardparameter">
                جنسیت : {GenderType ? GenderType : "-"}
              </span>
            </div>

            <div className="PVCardboxall">
              <span className="PVCardvalue">
                {taminPrescMode
                  ? "شماره همراه : " + (data?.Tel ? data.Tel : "-")
                  : "نسبت با سرپرست : " + (RelationType ? RelationType : "-")}
              </span>
              <span className="PVCardparameter">
                {taminPrescMode
                  ? ""
                  : " پزشک خانواده : " +
                  (data?.familyPhysician ? data?.familyPhysician : "-")}
              </span>
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
        isLoading={isLoading}
      />
    </>
  );
};

export default PatientVerticalCard;
