import { useState, useEffect } from "react";
import JDate from "jalali-date";
import FeatherIcon from "feather-icons-react";
import { ErrorAlert } from "class/AlertManage";
import { axiosClient } from "class/axiosConfig.js";
import { genderDataClass } from "class/staticDropdownOptions";
import SelectField from "components/commonComponents/selectfield";
import selectfieldColourStyles from "class/selectfieldStyle";

const jdate = new JDate();
let currentYear = jdate.getFullYear();

const NewPatient = ({
  ClinicID,
  addNewPatient,
  ActivePatientNID,
  birthYear,
  setBirthYear,
  showBirthDigitsAlert,
  setShowBirthDigitsAlert,
  addPatientIsLoading,
}) => {
  const [insuranceOptionsList, setInsuranceOptionsList] = useState([]);

  const ChangeForeigners = (e) => {
    if (e.target.checked) {
      $("#addPatientIDLbl").html("کد اتباع");
    } else {
      $("#addPatientIDLbl").html("کد ملی بیمار");
    }
  };

  const AddPatientCheck = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    if (formProps.PatientID.length < 10 && !formProps.Foreigners) {
      ErrorAlert("خطا", "کد ملی بیمار نمی تواند کمتر از 10 رقم باشد");
    } else if (formProps.PatientID.length < 12 && formProps.Foreigners) {
      ErrorAlert("خطا", "کد اتباع نمی تواند کمتر از 12 رقم باشد");
    } else if (formProps.PatientTel.length != 11) {
      ErrorAlert("خطا", "شماره همراه باید حداقل 11 رقم باشد");
    } else {
      addNewPatient(formProps);
    }
  };

  // get insuranceType optionsList
  const getInsuranceList = () => {
    let url = `Patient/getInsuranceType/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        let selectData = [];
        for (let i = 0; i < response.data.length; i++) {
          const sel = response.data[i];
          let obj = {
            value: sel.id,
            label: sel.Name,
          };
          selectData.push(obj);
        }
        setInsuranceOptionsList(selectData);
      })
      .catch((err) => console.log(err));
  };

  const handleOnChange = (InsType) => {
    if (InsType?.value === 4 || InsType?.value === 3) {
      $("#FreePatientSection").show();
    } else {
      $("#FreePatientSection").hide();
    }
  };

  const handleBlur = (e) => {
    validateInput(birthYear);
    if (e.target.value === "") setShowBirthDigitsAlert(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const input = value.replace(/\D/g, "").slice(0, 4);

    setBirthYear(input);
    validateInput(input);

    if (name === "PatientBD") {
      let calculatedAge = currentYear - input;
      if (input === "") calculatedAge = "";
      $("#Age").val(calculatedAge);
    }

    if (name === "Age") {
      let calculatedYear = currentYear - e.target.value;
      if (e.target.value === "") calculatedYear = "";
      setBirthYear(calculatedYear);
      $("#PatientBD").val(calculatedYear);

      if (calculatedYear > 1000) setShowBirthDigitsAlert(false);
    }
  };

  const validateInput = (input) => {
    if (input.length < 4) {
      setShowBirthDigitsAlert(true);
      $("#submitNewPatient").attr("disabled", true);
    } else {
      setShowBirthDigitsAlert(false);
      $("#submitNewPatient").attr("disabled", false);
    }
  };

  useEffect(() => {
    getInsuranceList();
    $("#newPatientModal").on("hide.bs.modal", function () {
      $("#addPatientTel").val("");
      $("#addPatientName").val("");
      $("#addPatientBD").val("");
      $("#Age").val("");
      setBirthYear(null);
      $("#addInsuranceType").val("");
      $("#addGenderType").val("");
    });
  }, []);

  return (
    <>
      <div
        className="modal fade contentmodal"
        id="newPatientModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <p className="mb-0 text-secondary font-14 fw-bold">
                افزودن بیمار
              </p>
              <button
                type="button"
                className="close-btn"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i>
                  <FeatherIcon icon="x" />
                </i>
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={AddPatientCheck}>
                <div className="form-group">
                  <div className="form-check m-3">
                    <input
                      className="form-check-input"
                      onChange={ChangeForeigners}
                      type="checkbox"
                      value="1"
                      id="Foreigners"
                      name="Foreigners"
                    />
                    <label className="form-check-label text-secondary">
                      اتباع
                    </label>
                  </div>

                  <div className="col-md-12 media-w-100 mt-3">
                    <label id="addPatientIDLbl" className="lblAbs font-12">
                      کد ملی بیمار <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      className="form-control rounded padding-right-2"
                      id="addPatientID"
                      name="PatientID"
                      defaultValue={ActivePatientNID}
                      required
                    />
                  </div>

                  <div className="col-md-12 media-w-100 mt-3">
                    <label className="lblAbs  font-12">
                      شماره موبایل <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control rounded padding-right-2"
                      id="addPatientTel"
                      name="PatientTel"
                      required
                    />
                  </div>

                  <div className="col-md-12 media-w-100 mt-3">
                    <p className="lblDrugIns font-12">انتخاب نوع بیمه</p>
                    <SelectField
                      styles={selectfieldColourStyles}
                      options={insuranceOptionsList}
                      onChange={handleOnChange}
                      className="w-100 font-12 text-center prescForm"
                      placeholder="نوع بیمه مورد نظر را انتخاب نمایید"
                      name="insuranceTypeOptions"
                      id="addInsuranceType"
                      required
                      isClearable
                    />
                  </div>

                  <div id="FreePatientSection" className="disNone">
                    <div className="col-md-12 media-w-100 mt-3">
                      <label className="lblAbs  font-12">
                        نام و نام خانوادگی{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control rounded padding-right-2"
                        id="addPatientName"
                        name="PatientName"
                        // required
                      />
                    </div>

                    <div className="col-md-12 media-w-100 mt-1">
                      <label className="lblDrugIns font-12">
                        جنسیت {""}
                        <span className="text-danger">*</span>
                      </label>
                      <SelectField
                        styles={selectfieldColourStyles}
                        className="w-100 font-12 text-center prescForm"
                        options={genderDataClass}
                        name="genderOption"
                        placeholder="جنسیت بیمار را مشخص کنید"
                        id="addGenderType"
                        instanceId="addGenderType"
                        isClearable
                        // required
                      />
                    </div>

                    <div className="row mt-3">
                      <div className="col">
                        <div>
                          <label className="lblAbs font-12">
                            سال تولد <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control rounded padding-right-2"
                            id="addPatientBD"
                            name="PatientBD"
                            value={birthYear}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            maxLength={4}
                            minLength={4}
                            // required
                          />

                          {showBirthDigitsAlert && (
                            <div className="mb-3 mt-4 col">
                              <div className="text-secondary font-13 frmValidation form-control inputPadding rounded mb-1">
                                <FeatherIcon
                                  icon="alert-triangle"
                                  className="frmValidationTxt"
                                />
                                <div className="frmValidationTxt">
                                  سال تولد باید دارای 4 رقم باشد!
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col">
                        <label className="lblAbs  font-12">
                          سن <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control rounded padding-right-2"
                          id="Age"
                          name="Age"
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          // required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="submit-section">
                  {!addPatientIsLoading ? (
                    <button
                      id="submitNewPatient"
                      type="submit"
                      className="btn btn-primary btn-save rounded font-14"
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPatient;
