import { Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import selectfieldColourStyles from "class/selectfieldStyle";
import SelectField from "components/commonComponents/selectfield";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";
import "public/assets/css/appointment.css";

const AppointmentModal = ({
  show,
  onHide,
  mode,
  ClinicID,
  onSubmit,
  setAppointmentDate,
  FUSelectDepartment,
  getPatientInfo,
  patientStatIsLoading,
  appointmentIsLoading,
  patientInfo,
  data,
  FUSelectStartTime,
  FUSelectEndTime,
  hoursOptions,
  selectedDepartment,
}) => {
  console.log("data in appointmentModal", data);

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

  const insuranceType =
    data?.Patient?.Insurance === "1"
      ? "سلامت ایرانیان"
      : data?.Patient?.Insurance === "2"
        ? "تامین اجتماعی"
        : data?.Patient?.Insurance === "3"
          ? "نیروهای مسلح"
          : "آزاد";

  const selectedModalityValue = data?.Modality;
  const selectedModalityType = modalityOptions.find(
    (x) => x.value == selectedModalityValue
  );

  const defaultAddModalityValue = modalityOptions.find(
    (x) => x.value === selectedDepartment
  );

  const defaultStartTime = { value: data.ST, label: data.ST };
  const defaultEndTime = { value: data.ET, label: data.ET };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="row text-secondary font-14 fw-bold margin-right-sm">
              {mode === "add" ? "ثبت نوبت جدید" : "ویرایش اطلاعات"}
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form className="w-100" onSubmit={getPatientInfo}>
            {mode === "add" ? (
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
                    id="getPatientInfoBtn"
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
            ) : (
              ""
            )}
          </form>

          <form onSubmit={onSubmit}>
            <div className="font-13 mt-3" id="appointmentPatientInfoCard">
              <div className="margin-right-1 font-12 mt-3">
                <div className="d-flex gap-2 mb-3">
                  <FeatherIcon icon="user" className="mb-0" />
                  {mode === "edit" ? data?.Patient?.Name : patientInfo?.Name}
                  {data?.Patient?.Age || patientInfo.Age ? (
                    <p className="m-0">
                      , {mode === "edit" ? data.Patient.Age : patientInfo.Age}{" "}
                      ساله
                    </p>
                  ) : (
                    ""
                  )}
                  ,{" "}
                  {insuranceType || patientInfo.InsuranceName ? (
                    <p>
                      {mode === "edit"
                        ? insuranceType
                        : patientInfo.InsuranceName}
                    </p>
                  ) : (
                    "نوع بیمه مشخص نمی باشد"
                  )}
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
                  name="selectedDepartment"
                  className="text-center font-12"
                  onChangeValue={(value) => FUSelectDepartment(value?.value)}
                  defaultValue={
                    mode === "edit"
                      ? selectedModalityType
                      : defaultAddModalityValue
                  }
                  placeholder={"انتخاب کنید"}
                  required
                  isClearable
                />
              </div>
              <input type="hidden" name="OldDate" value={data.Date} />
              <div className="form-group">
                <SingleDatePicker
                  defaultDate={data.Date}
                  setDate={setAppointmentDate}
                  label="انتخاب تاریخ"
                />
              </div>

              <div className="row media-md-gap">
                {/* <div className="col-md-6 col-12">
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
                    defaultValue={mode === "edit" ? defaultStartTime : ""}
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
                </div> */}

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
                    name="pureStartTime"
                    onChangeValue={(value) => FUSelectStartTime(value?.value)}
                    defaultValue={mode === "edit" ? defaultStartTime : ""}
                    key={data?.ST}
                    required
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
                    name="pureEndTime"
                    onChangeValue={(value) => FUSelectEndTime(value?.value)}
                    defaultValue={mode === "edit" ? defaultEndTime : ""}
                    key={data?.ET}
                    required
                    isClearable
                  />
                </div>
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

export default AppointmentModal;