import { Modal } from "react-bootstrap";
import selectfieldColourStyles from "class/selectfieldStyle";
import SelectField from "components/commonComponents/selectfield";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";

const DelayAppointmentModal = ({
  show,
  onHide,
  onSubmit,
  setAppointmentDate,
  isLoading,
  delayHoursOptions,
  delayMinutesOptions,
  FUSelectDelayHour,
  FUSelectDelayMinute,
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

            <div className="row">
              <div className="col-md-6 col-12">
                <label className="lblDrugIns font-12">میزان ساعت تاخیر</label>
                <SelectField
                  styles={selectfieldColourStyles}
                  options={delayHoursOptions}
                  label={true}
                  name="delayHour"
                  className="text-center font-11"
                  onChangeValue={(value) => FUSelectDelayHour(value?.value)}
                  placeholder={"انتخاب کنید"}
                  isClearable
                />
              </div>

              <div className="col-md-6 col-12">
                <label className="lblDrugIns font-12">میزان دقیقه تاخیر</label>
                <SelectField
                  styles={selectfieldColourStyles}
                  options={delayMinutesOptions}
                  label={true}
                  name="delayMinute"
                  className="text-center font-11"
                  onChangeValue={(value) => FUSelectDelayMinute(value?.value)}
                  placeholder={"انتخاب کنید"}
                  isClearable
                />
              </div>

            </div>

            <div className="submit-section mt-4">
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
