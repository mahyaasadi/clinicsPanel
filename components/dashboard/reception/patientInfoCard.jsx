import Link from "next/link";
import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";

const PatientInfoCard = ({ getPatientInfo, ActivePatientNID, data }) => {
  const dateFormat = (str) => {
    if (str !== " " || str !== null) {
      let date =
        str.substr(0, 4) + "/" + str.substr(4, 2) + "/" + str.substr(6, 7);
      return date;
    } else {
      return 0;
    }
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
              <button
                className="btn btn-primary rounded-left w-10 font-12"
                id="frmPatientInfoBtnSubmit"
              >
                استعلام
              </button>
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
                  data-bs-toggle="modal"
                  data-bs-target="#editPhoneNumberModal"
                  className="editPhone-icon"
                  data-pr-position="top"
                >
                  <Tooltip target=".editPhone-icon">تغییر شماره همراه</Tooltip>
                  <FeatherIcon icon="edit-2" className="themeColor" />
                </Link>
              </div>
            </div>

            <div className="margin-right-1">
              <p className="mt-3">{data.Name}</p>
              <div className="d-flex gap-2 align-items-center">
                <div className="">
                  جنسیت : {data.Gender ? data.Gender : "-"}
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
              <p className="mt-3">سن بیمار : {data.Age}</p>
              <p className="mt-3">
                تاریخ اعتبار تا {""}
                {data.accountValidto && dateFormat(`${data.accountValidto}`)}
              </p>

              <div className="d-flex gap-2">
                <p>بیمه : {data.InsuranceName}</p>
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
              <p>نوع بیمه : {data.InsuranceTypeName}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientInfoCard;
