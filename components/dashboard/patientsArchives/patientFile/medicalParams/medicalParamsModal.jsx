import { useState } from "react";
import { Modal } from "react-bootstrap";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert } from "class/AlertManage";
// import selectfieldColourStyles from "class/selectfieldStyle";
// import SelectField from "components/commonComponents/selectfield";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";

const MedicalParamsModal = ({
  show,
  onHide,
  mode,
  ClinicID,
  selectedParamId,
  ActivePatientID,
  measurementData,
  attachMedicalParam,
  editAttachedMedParam,
}) => {

  const [date, setDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let medParamsOptions = [];
  for (let i = 0; i < measurementData.length; i++) {
    const item = measurementData[i];
    let obj = {
      value: item._id,
      label: item.Name,
    };
    medParamsOptions.push(obj);
  }

  // let selectedMedParam = null;
  // const FUSelectMedParam = (medParam) => (selectedMedParam = medParam);

  const submitMedParam = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "MedicalDetails/addEdit";
    let data = {
      PatientID: ActivePatientID,
      ParamID: selectedParamId,
      Value: formProps.paramValue,
      Date: date,
    };

    if (mode === "edit") data.MedicalDetailID = formProps.MedParamID;

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        if (mode == "add") {
          attachMedicalParam(response.data);
        } else editAttachedMedParam();

        // console.log(response.data);

        onHide();
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        // customise ErrorAlert()
        // ErrorAlert("خطا", "ویرایش اطلاعات با خطا مواجه گردید!");
      });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="mb-0 text-secondary font-14 fw-bold">
            {mode === "add" ? "سابقه جدید" : "ویرایش اطلاعات"}
          </p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={submitMedParam}>
          <div className="row">
            {/* <div className="form-group">
              <label className="lblDrugIns font-12">
                انتخاب پارامتر <span className="text-danger">*</span>
              </label>

              <SelectField
                styles={selectfieldColourStyles}
                options={medParamsOptions}
                label={true}
                className="text-center font-12"
                placeholder={"انتخاب کنید"}
                onChange={(value) => FUSelectMedParam(value?.value)}
                // defaultValue={defDepValue}
                isClearable
                required
              />
            </div> */}

            <div className="form-group">
              <input type="hidden" className="form-control" name="MedParamID" />

              <label className="lblAbs font-12">
                مقدار اندازه گیری شده <span className="text-danger">*</span>
              </label>
              <input
                dir="ltr"
                type="text"
                className="form-control"
                name="paramValue"
                // defaultValue={mode === "edit" ? editFormData.Name : ""}
                required
              />
            </div>

            <div className="form-group">
              <SingleDatePicker
                setDate={setDate}
                label="انتخاب تاریخ"
                birthDateMode={true}
              // defValue={}
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
  );
};

export default MedicalParamsModal;
