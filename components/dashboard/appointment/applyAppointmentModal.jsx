import { Modal } from "react-bootstrap";
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
  setAppointmentDate,
  FUSelectStartTime,
  FUSelectEndTime,
  selectedDepartment,
  FUSelectDepartment,
  appointmentIsLoading,
  hoursOptions,
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
                  // defaultValue={mode === "edit" ? defaultStartTime : ""}
                  // key={data?.ST}
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
                  // defaultValue={mode === "edit" ? defaultEndTime : ""}
                  // key={data?.ET}
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
