import { useState } from "react";
import { Modal } from "react-bootstrap";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert } from "class/AlertManage";
import selectfieldColourStyles from "class/selectfieldStyle";
import SelectField from "components/commonComponents/selectfield";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import "public/assets/css/appointment.css";

const ApplyAppointmentModal = ({
  ClinicID,
  show,
  onHide,
  addAppointment,
  ActivePatientID,
  defaultDepValue,
  ActiveModalityData,
}) => {
  const [appointmentIsLoading, setAppointmentIsLoading] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [pureStartTime, setPureStartTime] = useState(null);
  const [pureEndTime, setPureEndTime] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const depOpeningHour = parseInt(ActiveModalityData.OpeningHours);
  const depClosingHour = parseInt(ActiveModalityData.ClosingHours);

  const hoursOptions = [];
  for (let i = depOpeningHour; i < depClosingHour; i++) {
    for (let j = 0; j < 60; j = j + 15) {
      const hours = i < 10 ? "0" + i : i;
      const minutes = j < 10 ? "0" + j : j;
      const str = hours + ":" + minutes;
      let obj = {
        value: str,
        label: str,
      };
      hoursOptions.push(obj);
    }
  }

  const endHoursOptions = pureStartTime
    ? hoursOptions.filter((option) => option.value > pureStartTime)
    : hoursOptions;

  const FUSelectStartTime = (startTime) => setPureStartTime(startTime);
  const FUSelectEndTime = (endTime) => setPureEndTime(endTime);

  const FUSelectDepartment = (departmentValue) =>
    setSelectedDepartment(departmentValue);

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

  const defDepValue = defaultDepValue
    ? { value: defaultDepValue._id, label: defaultDepValue.Name }
    : "";

  const _addAppointment = (e) => {
    e.preventDefault();
    setAppointmentIsLoading(true);

    let url = "Appointment/addClinic";
    let data = {
      ClinicID,
      PatientID: ActivePatientID,
      ModalityID: selectedDepartment
        ? selectedDepartment._id
        : ActiveModalityData._id,
      Date: appointmentDate,
      ST: pureStartTime,
      ET: pureEndTime,
    };

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        setAppointmentIsLoading(false);
        addAppointment(response.data);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ثبت نوبت با خطا مواجه گردید!");
        setAppointmentIsLoading(false);
      });
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-0 text-secondary font-14 fw-bold">ثبت نوبت</p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={_addAppointment}>
            <div>
              <label className="lblDrugIns font-12">
                انتخاب بخش <span className="text-danger">*</span>
              </label>

              <SelectField
                styles={selectfieldColourStyles}
                options={modalityOptions}
                label={true}
                className="text-center"
                placeholder={"انتخاب کنید"}
                defaultValue={defDepValue}
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
                <label className="lblDrugIns font-11">
                  ساعت شروع <span className="text-danger">*</span>
                </label>
                <SelectField
                  styles={selectfieldColourStyles}
                  options={hoursOptions}
                  label={true}
                  className="text-center font-12"
                  placeholder={"انتخاب کنید"}
                  name="pureStartTime"
                  onChangeValue={(value) => FUSelectStartTime(value?.value)}
                  required
                  isClearable
                />
              </div>

              <div className="col-md-6 col-12">
                <label className="lblDrugIns font-11">
                  ساعت پایان <span className="text-danger">*</span>
                </label>
                <SelectField
                  styles={selectfieldColourStyles}
                  options={endHoursOptions}
                  label={true}
                  className="text-center font-12"
                  placeholder={"انتخاب کنید"}
                  name="pureEndTime"
                  onChangeValue={(value) => FUSelectEndTime(value?.value)}
                  required
                  isClearable
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
