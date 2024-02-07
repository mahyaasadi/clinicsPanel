import { useRouter } from "next/router";
import { Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import PatientHorizontalCard from "components/dashboard/patientInfo/patientHorizontalCard";

const NewPatientOptionsModal = ({
  show,
  onHide,
  data,
  openAppointmentModal,
}) => {
  //   console.log({ data });

  const router = useRouter();

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header>
        <PatientHorizontalCard data={data} patientInfoArchiveMode={true} />
      </Modal.Header>

      <Modal.Body>
        <div className="row">
          <div className="col-6 col-xl-3 mb-2">
            <button
              onClick={() =>
                router.push({
                  pathname: "/patientFile",
                  query: { id: data._id },
                })
              }
              className="card border-gray w-100 h-100 d-flex align-items-center easyAccessCard font-13 fw-bold text-secondary"
            >
              <div className="card-body d-flex justify-center align-items-center flex-column gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="accessIcon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
                  />
                </svg>
                پرونده بیمار
              </div>
            </button>
          </div>

          <div className="col-6 col-xl-3 mb-2">
            <button
              onClick={() =>
                router.push({
                  pathname: "/editPatientsInfo",
                  query: { id: data._id },
                })
              }
              className="card border-gray w-100 h-100 d-flex align-items-center easyAccessCard font-13 fw-bold text-secondary"
            >
              <div className="card-body d-flex justify-center align-items-center flex-column gap-2">
                <FeatherIcon icon="edit-3" />
                ویرایش اطلاعات
              </div>
            </button>
          </div>

          <div className="col-6 col-xl-3 mb-2">
            <button
              onClick={() =>
                router.push({
                  pathname: "/reception",
                  query: { PNID: data.NationalID },
                })
              }
              className="card easyAccessCard border-gray w-100 h-100 d-flex align-items-center font-13 fw-bold text-secondary accessCardColor"
            >
              <div className=" card-body d-flex justify-center align-items-center flex-column gap-2 easyAccessIcon">
                <FeatherIcon icon="clipboard" />
                پذیرش
              </div>
            </button>
          </div>

          <div className="col-6 col-xl-3 mb-2">
            <button
              onClick={() => openAppointmentModal(data._id)}
              className="card border-gray w-100 h-100 d-flex align-items-center easyAccessCard font-13 fw-bold text-secondary"
            >
              <div className="card-body d-flex justify-center align-items-center flex-column gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="accessIcon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                  />
                </svg>
                نوبت دهی
              </div>
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default NewPatientOptionsModal;
