import { Modal } from "react-bootstrap";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";

const ApplyAppointmentModal = ({
  show,
  onHide,
  addAppointment,
  setStartDate,
  setEndDate,
}) => {
  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-0 text-secondary font-14 fw-bold">ثبت نوبت</p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={addAppointment}>
            <div className="form-group">
              <SingleDatePicker setDate={setStartDate} label="تاریخ شروع" />
            </div>

            <div className="form-group">
              <SingleDatePicker setDate={setEndDate} label="تاریخ پایان" />
            </div>

            <div className="submit-section">
              {/* {!isLoading ? ( */}
              <button
                type="submit"
                className="btn btn-primary rounded btn-save font-13"
              >
                ثبت
              </button>
              {/* // ) : ( */}
              {/* <button
                  type="submit"
                  className="btn btn-primary rounded font-13"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  در حال ثبت
                </button> */}
              {/* // )} */}
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ApplyAppointmentModal;
