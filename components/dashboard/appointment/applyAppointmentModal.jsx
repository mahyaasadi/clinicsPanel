import { useState } from "react";
import { Modal } from "react-bootstrap";
import { faIR } from "date-fns/locale";
import DatePicker from "react-datepicker";
import { Dropdown } from "primereact/dropdown";
import { registerLocale } from "react-datepicker";
import selectfieldColourStyles from "class/selectfieldStyle";
import SelectField from "components/commonComponents/selectfield";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import "public/assets/css/appointment.css";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("fa", faIR);

const ApplyAppointmentModal = ({
  ClinicID,
  show,
  onHide,
  addAppointment,
  setAppointmentDate,
  selectedStartTime,
  selectedEndTime,
  handleStartTimeChange,
  handleEndTimeChange,
  selectedDepartment,
  FUSelectDepartment,
  appointmentIsLoading,
}) => {
  const { data: clinicDepartments, isLoading } =
    useGetAllClinicDepartmentsQuery(ClinicID);

  let modalityOptions = [];
  for (let i = 0; i < clinicDepartments?.length; i++) {
    const item = clinicDepartments[i];
    let obj = {
      value: item._id,
      label: item.Name,
    };
    modalityOptions.push(obj);
  }

  const defaultDepValue = selectedDepartment
    ? { value: selectedDepartment._id, label: selectedDepartment.Name }
    : "";

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-0 text-secondary font-14 fw-bold">ثبت نوبت</p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={addAppointment}>
            <div className="">
              <label className="lblDrugIns font-12">
                انتخاب بخش <span className="text-danger">*</span>
              </label>

              <SelectField
                styles={selectfieldColourStyles}
                options={modalityOptions}
                label={true}
                className="text-center"
                placeholder={"انتخاب کنید"}
                defaultValue={defaultDepValue}
                onChangeValue={(value) => FUSelectDepartment(value?.value)}
                isClearable
                required
              />
            </div>

            <div className="form-group">
              <SingleDatePicker setDate={setAppointmentDate} label="تاریخ" />
            </div>
            <div className="row media-md-gap">
              <div className="col-md-6 col-12">
                {/* <label htmlFor="timeInput">Select Time:</label>
              <input
                type="time"
                id="timeInput"
                name="timeInput"
                value={selectedTime}
                onChange={handleTimeChange}
                step="900" // 900 seconds = 15 minutes
              /> */}
                <label className="lblAbs font-12">ساعت شروع</label>
                <DatePicker
                  selected={selectedStartTime}
                  onChange={handleStartTimeChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat="HH:mm"
                  timeCaption="انتخاب کنید"
                  locale="fa"
                />
              </div>

              <div className="col-md-6 col-12">
                <label className="lblAbs font-12">ساعت پایان</label>
                <DatePicker
                  selected={selectedEndTime}
                  onChange={handleEndTimeChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat="HH:mm"
                  timeCaption="انتخاب کنید"
                  locale="fa"
                />
              </div>
            </div>

            <div className="submit-section">
              {!appointmentIsLoading ? (
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

export default ApplyAppointmentModal;
