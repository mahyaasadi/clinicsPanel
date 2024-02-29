import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";
import JDate from "jalali-date";
import { axiosClient } from "class/axiosConfig";
import { getPatientAvatarUrl } from "lib/session";
import { ErrorAlert, WarningAlert, SuccessAlert } from "class/AlertManage";
import { genderDataClass } from "class/staticDropdownOptions";
import RadioButton from "components/commonComponents/radioButton";
import InfoCard from "components/dashboard/settings/patientInquiry/infoCard";
import "public/assets/css/patientInquiry.css";

const jdate = new JDate();
let currentYear = jdate.getFullYear();

const PatientInquiry = () => {
  const router = useRouter();
  let ClinicID = getPatientAvatarUrl(router.query.token);

  const [patientNID, setPatientNID] = useState("");
  const [patientData, setPatientData] = useState([]);
  const [clinicData, setClinicData] = useState([]);
  const [insuranceOptionsList, setInsuranceOptionsList] = useState([]);
  const [selectedInsuranceOption, setSelectedInsuranceOption] = useState(null);
  const [selectedGenderOption, setSelectedGenderOption] = useState(null);
  const [birthYear, setBirthYear] = useState("");
  const [age, setAge] = useState("");
  const [PatientTel, setPatientTel] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [patientIsLoading, setPatientIsLoading] = useState(false);
  const [showSearchBtn, setShowSearchBtn] = useState(true);
  const [showResetBtn, setShowResetBtn] = useState(false);
  const [showBirthDigitsAlert, setShowBirthDigitsAlert] = useState(false);
  const [newPatientMode, setNewPatientMode] = useState(false);

  const getOneClinic = () => {
    let url = `Clinic/getOne/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setClinicData(response.data);
      })
      .catch((err) => console.log(err));
  };

  const getPatientActiveSearch = (e) => {
    setPatientNID("");
    setPatientData([]);
    setShowSearchBtn(true);
    setShowResetBtn(false);
    setNewPatientMode(false);
  };

  const _getPatientInfo = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!patientNID) {
      WarningAlert("", "کد ملی خود را وارد نمایید!");
      setIsLoading(false);
    } else if (patientNID.length < 10) {
      WarningAlert("خطا", "کد ملی بیمار نمی تواند کمتر از 10 رقم باشد");
      setIsLoading(false);
    } else {
      let url = "Patient/checkByNid";
      let data = {
        ClinicID,
        CenterID: ClinicID,
        NID: patientNID,
      };

      axiosClient
        .post(url, data)
        .then((response) => {
          if (response.data.error == "1") {
            setNewPatientMode(true);
          } else {
            setPatientData(response.data.user);
          }

          setShowSearchBtn(false);
          setShowResetBtn(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          ErrorAlert("خطا", "دریافت اطلاعات بیمار با خطا مواجه گردید!");
        });
    }
  };

  const confirmPatientInfo = () => {
    SuccessAlert("", "درخواست پذیرش با موفقیت ثبت گردید!");
  };

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

  const onChangeInsuranceRadioBtn = (e) => {
    setSelectedInsuranceOption(e.target.value);
    if (e.target.value === 3 || e.target.value === 4)
      setInsuranceInfoMode(true);
  };

  const onChangeGenderRadioBtn = (e) => setSelectedGenderOption(e.target.value);

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
      setAge(calculatedAge);
    }

    if (name === "Age") {
      let calculatedYear = currentYear - e.target.value;
      if (e.target.value === "") calculatedYear = "";
      setAge(value);
      setBirthYear(calculatedYear);
      if (calculatedYear > 1000) setShowBirthDigitsAlert(false);
    }
  };

  const validateInput = (input) => {
    if (input.length < 4) {
      setShowBirthDigitsAlert(true);
    } else {
      setShowBirthDigitsAlert(false);
    }
  };

  const resetInputFields = () => {
    setSelectedGenderOption(null);
    setSelectedInsuranceOption(null);
    setPatientTel("");
    setBirthYear("");
    setAge("");
  };

  const addNewPatient = (props) => {
    setPatientIsLoading(true);

    let url = "Patient/addPatient";
    let data = props;
    data.CenterID = ClinicID;
    data.Clinic = true;

    axiosClient
      .post(url, data)
      .then((response) => {
        if (response.data === false) {
          ErrorAlert(
            "خطا",
            "بیمار با اطلاعات وارد شده, تحت پوشش این بیمه نمی باشد!"
          );
          setPatientIsLoading(false);
          return false;
        } else if (response.data.errors) {
          console.log(response.data.errors);
          ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
          setPatientIsLoading(false);
          return false;
        } else {
          SuccessAlert("موفق", "اطلاعات بیمار با موفقیت ثبت گردید!");
          setPatientData(response.data);

          setTimeout(() => {
            resetInputFields();
          }, 200);
        }
        setPatientIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
        setPatientIsLoading(false);
      });
  };

  const AddPatientCheck = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    if (patientNID.length < 10) {
      ErrorAlert("خطا", "کد ملی بیمار نمی تواند کمتر از 10 رقم باشد");
    } else if (formProps.PatientTel.length != 11) {
      ErrorAlert("خطا", "شماره همراه باید حداقل 11 رقم باشد");
    } else {
      if (patientNID.length == 10) {
        formProps.Foreigners = false;
      } else {
        formProps.Foreigners = true;
      }

      formProps.PatientID = patientNID;
      formProps.insuranceTypeOptions = selectedInsuranceOption;
      if (selectedGenderOption) formProps.genderOption = selectedGenderOption;
      addNewPatient(formProps);
    }
  };

  useEffect(() => {
    if (router.query.token) {
      getOneClinic();
    }
  }, [router.isReady]);

  useEffect(() => getInsuranceList(), []);

  return (
    <>
      <Head>
        <title>استعلام اطلاعات بیمار</title>
      </Head>

      <div className="patientInquiryContainer d-flex flex-col">
        {clinicData.Name && (
          <div className="d-flex justify-center align-items-center gap-2 text-secondary font-14 fw-bold">
            <p className="mb-0">{clinicData.Name}</p>
            <img
              src={clinicData.Logo}
              alt="clinicLogo"
              style={{ width: "30px", height: "30px", borderRadius: "4px" }}
            />
          </div>
        )}
        <hr />

        <div className="patientInquiryForm p-4 d-flex flex-col justify-center">
          <form onSubmit={_getPatientInfo}>
            <label className="font-13 text-secondary fw-bold">
              کد ملی / کد اتباع بیمار <span className="text-danger">*</span>{" "}
            </label>
            <div className="input-group mb-3">
              <input
                type="tel"
                id="patientInquiryCode"
                name="patientInquiryCode"
                value={patientNID}
                onChange={(e) => setPatientNID(e.target.value)}
                className="form-control rounded-right text-center w-50"
                required
              />

              {!isLoading ? (
                showSearchBtn ? (
                  <button
                    id="getPatientInfoBtn"
                    type="button"
                    onClick={_getPatientInfo}
                    className="btn-primary btn w-10 rounded-left font-12"
                  >
                    ثبت کد ملی
                  </button>
                ) : (
                  <button
                    className="btn btn-primary rounded-left w-10 font-12"
                    id="BtnActiveSearch"
                    onClick={(e) => getPatientActiveSearch(e)}
                    type="button"
                  >
                    تنظیم مجدد
                  </button>
                )
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

            {patientData.length !== 0 && (
              <>
                <div>
                  <InfoCard data={patientData} />
                </div>

                <div className="submit-section d-flex justify-center">
                  <button
                    onClick={confirmPatientInfo}
                    className="btn btn-primary px-5 font-13 d-flex align-items-center justify-center gap-2 w-100"
                  >
                    تایید اطلاعات
                    <FeatherIcon icon="check" />
                  </button>
                </div>
              </>
            )}
          </form>

          {newPatientMode && patientData.length == 0 && (
            <form
              onSubmit={AddPatientCheck}
              className="mt-5 text-secondary fw-bold"
            >
              <p className="font-14">اطلاعات خود را به دقت وارد نمایید</p>
              <hr />

              <div className="col-md-12 media-w-100 my-4">
                <label className="font-13">
                  شماره موبایل <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  className="form-control rounded padding-right-2"
                  id="addPatientTel"
                  value={PatientTel}
                  onChange={(e) => setPatientTel(e.target.value)}
                  name="PatientTel"
                  required
                />
              </div>

              <div>
                <p className="font-14">نوع بیمه خود را انتخاب نمایید</p>
                <hr />
                {insuranceOptionsList.map((option, index) => (
                  <RadioButton
                    key={index}
                    id={option.value}
                    value={option.value}
                    onChange={onChangeInsuranceRadioBtn}
                    checked={parseInt(selectedInsuranceOption) === option.value}
                    text={option.label}
                    required
                    patientInquiryStyle={true}
                  />
                ))}
              </div>

              {(selectedInsuranceOption == 3 ||
                selectedInsuranceOption == 4) && (
                <div className="mt-4">
                  <div className="col-md-12 mt-3">
                    <label className="font-13">
                      نام و نام خانوادگی <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded padding-right-2"
                      id="addPatientName"
                      name="PatientName"
                      required
                    />
                  </div>

                  <div className="col-md-12 mt-4">
                    <label className="font-13">
                      جنسیت <span className="text-danger">*</span>
                    </label>

                    <div className="">
                      {genderDataClass.map((gender, index) => (
                        <RadioButton
                          key={index}
                          id={gender.value}
                          value={gender.value}
                          onChange={onChangeGenderRadioBtn}
                          checked={selectedGenderOption === gender.value}
                          text={gender.label}
                          required
                          patientInquiryStyle={true}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col">
                      <div>
                        <label className="font-13">
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
                      <label className="font-13">سن</label>
                      <input
                        type="text"
                        className="form-control rounded padding-right-2"
                        id="Age"
                        name="Age"
                        value={age}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="submit-section">
                {!patientIsLoading ? (
                  <button
                    type="submit"
                    className="btn btn-primary px-5 font-13 w-100"
                  >
                    ثبت اطلاعات
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-primary btn rounded-left w-100"
                    disabled
                  >
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    ></span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default PatientInquiry;
