import { Modal } from "react-bootstrap";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";

const DelayAppointmentModal = ({
  show,
  onHide,
  onSubmit,
  setAppointmentDate,
  isLoading,
}) => {
  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-0 text-secondary font-14 fw-bold">
              ثبت تاخیر در نوبت ها
            </p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <SingleDatePicker
                setDate={setAppointmentDate}
                label="انتخاب تاریخ"
              />
            </div>

            <div className="form-group col">
              <label className="lblAbs font-12">میزان ساعت تاخیر</label>
              <input
                type="number"
                name="delayHour"
                className="form-control floating inputPadding rounded text-secondary"
              />
            </div>
            <div className="form-group col">
              <label className="lblAbs font-12">میزان دقیقه تاخیر</label>
              <input
                type="number"
                name="delayMinute"
                className="form-control floating inputPadding rounded text-secondary"
              />
            </div>

            <div className="submit-section mt-1">
              {!isLoading ? (
                <button
                  type="submit"
                  className="btn btn-primary rounded btn-save font-13"
                >
                  ثبت
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary rounded font-13"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  در حال ثبت
                </button>
              )}
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DelayAppointmentModal;
