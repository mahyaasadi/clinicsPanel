import { useState } from "react";
import { axiosClient } from "class/axiosConfig";
import { Modal } from "react-bootstrap";
import { WarningAlert, ErrorAlert } from "class/AlertManage";

const CheckPatientNID = ({ show, onHide, ClinicID, GetPatientInfo }) => {
  const [patientStatIsLoading, setPatientStatIsLoading] = useState(false);

  const _getPatientInfo = (e) => {
    e.preventDefault();
    setPatientStatIsLoading(true);

    let url = "Patient/checkByNid";
    let data = {
      ClinicID,
      NID: $("#patientNationalCode").val(),
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        if (response.data.error == "1") {
          $("#newPatientModal").modal("show");
          onHide();
        } else {
          WarningAlert(
            "هشدار",
            `اطلاعات بیمار با کد ملی ${response.data.user.NationalID} قبلا ثبت شده است!`
          );
        }
        GetPatientInfo();
        setPatientStatIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setPatientStatIsLoading(false);
        ErrorAlert("خطا", "دریافت اطلاعات بیمار با خطا مواجه گردید!");
      });
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-0 text-secondary font-14 fw-bold">
              افزودن بیمار جدید
            </p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form className="w-100" onSubmit={_getPatientInfo}>
            <div className="input-group mb-3">
              <label className="lblAbs font-12">کد ملی / کد اتباع بیمار</label>
              <input
                type="text"
                id="patientNationalCode"
                name="patientNationalCode"
                required
                className="form-control rounded-right GetPatientInput w-50"
              />

              {!patientStatIsLoading ? (
                <button
                  id="getPatientInfoBtn"
                  type="button"
                  onClick={_getPatientInfo}
                  className="btn-primary btn w-10 rounded-left font-12"
                >
                  استعلام
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary btn rounded-left"
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CheckPatientNID;
