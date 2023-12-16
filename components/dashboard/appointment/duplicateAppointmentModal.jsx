import { Modal } from "react-bootstrap";
import JDate from "jalali-date";
import FeatherIcon from "feather-icons-react";
import selectfieldColourStyles from "class/selectfieldStyle";
import SelectField from "components/commonComponents/selectfield";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import { defaultAppointmentDateOptions } from "class/staticDropdownOptions";
import "public/assets/css/appointment.css";

const DuplicateAppointmentModal = ({
  show,
  onHide,
  onSubmit,
  data,
  ClinicID,
  selectedDepartment,
  FUSelectDepartment,
  setAppointmentDate,
  FUSelectStartTime,
  FUSelectEndTime,
  hoursOptions,
  appointmentIsLoading,
  appointmentDate,
  endHoursOptions,
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

  const currentDate = new JDate();
  const addDayToDate = (day) => {
    let h = day * 24;
    return new Date(new Date().getTime() + h * 60 * 60 * 1000);
  };

  const handleOptionSelect = (option) => {
    let newDate;
    switch (option) {
      case "tomorrow":
        newDate = new JDate(addDayToDate(1)).format("YYYY/MM/DD");
        break;
      case "dayAfterTomorrow":
        newDate = new JDate(addDayToDate(2)).format("YYYY/MM/DD");
        break;
      case "nextWeek":
        newDate = new JDate(addDayToDate(7)).format("YYYY/MM/DD");
        break;
      case "nextMonth":
        newDate = new JDate(addDayToDate(30)).format("YYYY/MM/DD");
        break;
      case "reset":
        newDate = currentDate.format("YYYY/MM/DD");
        console.log("reset");
        break;
      default:
        newDate = currentDate;
    }
    setAppointmentDate(newDate);
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="row text-secondary font-14 fw-bold margin-right-sm">
              ایجاد کپی از نوبت
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={onSubmit}>
            <div className="margin-right-1 font-12">
              <div className="d-flex gap-2 mb-3">
                <FeatherIcon icon="user" className="mb-0" />
                {data?.Patient?.Name}
                {data?.Patient?.Age ? (
                  <p className="m-0">, {data.Patient.Age} ساله</p>
                ) : (
                  ""
                )}
                ,{" "}
                {insuranceType ? (
                  <p>{insuranceType}</p>
                ) : (
                  "نوع بیمه مشخص نمی باشد"
                )}
              </div>
            </div>

            <div>
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
                    defaultAddModalityValue
                      ? defaultAddModalityValue
                      : selectedModalityType
                  }
                  placeholder={"انتخاب کنید"}
                  required
                  isClearable
                />
              </div>

              {/* default date options */}
              <div className="defaultDateOptions font-12 d-flex gap-3 justify-evenly mb-2">
                {defaultAppointmentDateOptions.map((dateOption, index) => (
                  <div className="checkbox" key={index}>
                    <label className="checkbox-wrapper defaultDateCheckboxWrapper">
                      <input
                        type="radio"
                        name="Dep"
                        value={dateOption.value}
                        id={dateOption.value}
                        className="checkbox-input"
                        onChange={() => handleOptionSelect(dateOption.value)}
                      />
                      <div className="checkbox-tile defaultDateCheckboxTile">
                        <span className="checkbox-icon"></span>

                        <div className="checkbox-items">
                          <span className="checkbox-label">
                            {dateOption.label === "تنظیم مجدد" ? (
                              <i className="secondaryColor">
                                <FeatherIcon
                                  icon="refresh-cw"
                                  style={{ width: "16px", height: "16px" }}
                                />
                              </i>
                            ) : (
                              dateOption.label
                            )}
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <SingleDatePicker
                  defaultDate={appointmentDate}
                  setDate={setAppointmentDate}
                  label="انتخاب تاریخ"
                />
              </div>

              <div className="row media-md-gap">
                <div className="col-6">
                  <label className="lblDrugIns font-12">
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
                    defaultValue={defaultStartTime ? defaultStartTime : ""}
                    key={data?.ST}
                    required
                    isClearable
                  />
                </div>

                <div className="col-6">
                  <label className="lblDrugIns font-12">
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
                    defaultValue={defaultEndTime ? defaultEndTime : ""}
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

export default DuplicateAppointmentModal;
