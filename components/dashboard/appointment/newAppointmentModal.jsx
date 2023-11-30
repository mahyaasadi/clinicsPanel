import { Modal } from "react-bootstrap";
import selectfieldColourStyles from "class/selectfieldStyle";
import SelectField from "components/commonComponents/selectfield";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";
import { faIR } from "date-fns/locale";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import FeatherIcon from "feather-icons-react";
import "public/assets/css/appointment.css";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("fa", faIR);

const AddNewAppointmentModal = ({
  show,
  onHide,
  ClinicID,
  addAppointment,
  setAppointmentDate,
  selectedStartTime,
  selectedEndTime,
  handleStartTimeChange,
  handleEndTimeChange,
  FUSelectDepartment,
  getPatientInfo,
  patientStatIsLoading,
  appointmentIsLoading,
  data,
  // hoursOptions,
  // getSubmittedAppointments,
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

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="row text-secondary font-14 fw-bold margin-right-sm">
              ثبت نوبت جدید
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={addAppointment}>
            <form className="w-100">
              <div className="input-group mb-3">
                <label className="lblAbs font-12">
                  کد ملی / کد اتباع بیمار
                </label>
                <input
                  type="text"
                  id="appointmentNationalCode"
                  name="appointmentNationalCode"
                  required
                  className="form-control rounded-right GetPatientInput w-50"
                />

                {!patientStatIsLoading ? (
                  <button
                    type="button"
                    onClick={getPatientInfo}
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

            <div className="font-13 mt-3" id="appointmentPatientInfoCard">
              <div className="margin-right-1 font-12 mt-3">
                <div className="d-flex gap-2 mb-3">
                  <FeatherIcon icon="user" className="mb-0" />
                  {data.Name}
                  {data.Age ? (
                    <p className="m-0">, {data.Age} ساله</p>
                  ) : (
                    ""
                  )},{" "}
                  {data.InsuranceName
                    ? data.InsuranceName
                    : "نوع بیمه مشخص نمی باشد"}
                </div>
              </div>
            </div>

            <div id="additionalAppointmentInfo">
              <div>
                <label className="lblDrugIns font-12">
                  انتخاب بخش <span className="text-danger">*</span>
                </label>

                <SelectField
                  styles={selectfieldColourStyles}
                  options={modalityOptions}
                  label={true}
                  className="text-center font-12"
                  placeholder={"انتخاب کنید"}
                  required
                  name="addNewAppointment"
                  onChangeValue={(value) => FUSelectDepartment(value?.value)}
                  isClearable
                />
              </div>

              <div className="form-group">
                <SingleDatePicker
                  setDate={setAppointmentDate}
                  label="انتخاب تاریخ"
                />
              </div>

              <div className="row media-md-gap">
                <div className="col-md-6 col-12">
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

              {/* <div className="d-flex justify-center mb-4">
                <button
                  type="button"
                  onClick={getSubmittedAppointments}
                  className="btn-outline-primary btn w-10 rounded font-12"
                >
                  نمایش ساعت های خالی
                </button>
              </div> */}
            </div>

            {/* <div id="additionalAppointmentInfo"> */}
            {/* <div className="d-flex gap-1">
                <div className="col-6">
                  <label className="lblDrugIns font-11">
                    ساعت شروع <span className="text-danger">*</span>
                  </label>
                  <SelectField
                    styles={selectfieldColourStyles}
                    options={hoursOptions}
                    label={true}
                    className="text-center font-12"
                    placeholder={"انتخاب کنید"}
                    required
                    name="addNewAppointment"
                    //   onChangeValue={(value) => FUSelectDepartment(value?.value)}
                    // key={data.Percent}
                    isClearable
                  />
                </div>

                <div className="col-6">
                  <label className="lblDrugIns font-11">
                    ساعت پایان <span className="text-danger">*</span>
                  </label>
                  <SelectField
                    styles={selectfieldColourStyles}
                    options={hoursOptions}
                    label={true}
                    className="text-center font-12"
                    placeholder={"انتخاب کنید"}
                    required
                    name="addNewAppointment"
                    //   onChangeValue={(value) => FUSelectDepartment(value?.value)}
                    // key={data.Percent}
                    isClearable
                  />
                </div>
              </div> */}

            {/* </div> */}

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

export default AddNewAppointmentModal;
