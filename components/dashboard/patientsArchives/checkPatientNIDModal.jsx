import { useState } from "react";
import { axiosClient } from "class/axiosConfig";
import { Modal } from "react-bootstrap";
import { ErrorAlert } from "class/AlertManage";
import NewPatientOptionModal from "components/dashboard/patientInfo/newPatientOptionsModal";

const CheckPatientNID = ({
  show,
  onHide,
  ClinicID,
  getAllClinicsPatients,
  getActiveNID,
  openAppointmentModal,
}) => {
  const [patientStatIsLoading, setPatientStatIsLoading] = useState(false);
  const [patientData, setPatientData] = useState(null);

  // new patient options modal
  const [showNewPatientOptionsModal, setShowNewPatientOptionsModal] =
    useState(false);
  const openNewPatientOptionsModal = () => setShowNewPatientOptionsModal(true);
  const closeNewPatientOptionsModal = () =>
    setShowNewPatientOptionsModal(false);

  const _getPatientInfo = (e) => {
    e.preventDefault();
    setPatientStatIsLoading(true);

    let url = "Patient/checkByNid";
    let data = {
      ClinicID,
      CenterID: ClinicID,
      NID: $("#patientNationalCode").val(),
    };

    let NIDVal = $("#patientNationalCode").val();
    getActiveNID(NIDVal);

    axiosClient
      .post(url, data)
      .then((response) => {
        if (response.data.error == "1") {
          $("#newPatientModal").modal("show");
        } else {
          setPatientData(response.data.user);

          setTimeout(() => {
            openNewPatientOptionsModal();
          }, 100);
          getAllClinicsPatients();
        }
        onHide();
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

      <NewPatientOptionModal
        openAppointmentModal={openAppointmentModal}
        data={patientData}
        show={showNewPatientOptionsModal}
        onHide={closeNewPatientOptionsModal}
      />
    </>
  );
};

export default CheckPatientNID;
