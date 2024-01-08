import { useState, useEffect } from "react";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert } from "class/AlertManage";
import { Modal } from "react-bootstrap";
import selectfieldColourStyles from "class/selectfieldStyle";
import SelectField from "components/commonComponents/selectfield";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";

let surgeryOptions = [];
const SurgeryRecordModal = ({
  data,
  show,
  onHide,
  mode,
  attachSurgeryRecordToPatient,
  ActivePatientID,
  editAttachedSurgeryRecord,
  showOtherSurgeryType,
  setShowOtherSurgeryType,
}) => {
  const [surgeryDate, setSurgeryDate] = useState(null);
  const [selectedSurgeryLbl, setSelectedSurgeryLbl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const _getAllSurguryRecords = () => {
    let url = "Patient/getSurgeryList";

    axiosClient
      .get(url)
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          const item = response.data[i];
          let obj = {
            value: item.id,
            label: item.Name,
          };
          surgeryOptions.push(obj);
        }
        const otherOption = { value: 11, label: "سایر" };
        surgeryOptions.push(otherOption);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const defaultSurgeryType = surgeryOptions.find((x) => x.label === data.Name);

  const FUSelectSurgery = (value) => {
    const findSelected = surgeryOptions.find(
      (x) => parseInt(x.value) === value
    );
    setSelectedSurgeryLbl(findSelected);

    if (value === 11) {
      setShowOtherSurgeryType(true);
      setSelectedSurgeryLbl(findSelected);
    } else {
      setShowOtherSurgeryType(false);
    }
  };

  // attach surgeryRecord to patient
  const _attachSurgeryRecordToPatient = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let url = "Patient/addSurgery";
    let data = {
      PatientID: ActivePatientID,
      Name:
        selectedSurgeryLbl.value === 11
          ? $("#otherSurgeryName").val()
          : selectedSurgeryLbl.label,
      Date: surgeryDate,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        attachSurgeryRecordToPatient(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ثبت اطلاعات با خطا مواجه گردید!");
        setIsLoading(false);
      });
  };

  // edit patient's surgeryRecord
  const _editAttachedSurgeryRecord = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "Patient/editSurgery";
    let data = {
      PatientID: ActivePatientID,
      Name: selectedSurgeryLbl
        ? selectedSurgeryLbl.label
        : defaultSurgeryType.label,
      Date: surgeryDate,
      SurgeryID: formProps.surgeryID,
    };

    axiosClient
      .put(url, data)
      .then((response) => {
        editAttachedSurgeryRecord(response.data, formProps.surgeryID);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => _getAllSurguryRecords(), []);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="mb-0 text-secondary font-14 fw-bold">
            {mode === "edit" ? "ویرایش اطلاعات" : "سابقه جدید"}
          </p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form
          onSubmit={
            mode === "add"
              ? _attachSurgeryRecordToPatient
              : _editAttachedSurgeryRecord
          }
        >
          <div>
            <input type="hidden" name="surgeryID" value={data._id} />

            <label className="lblDrugIns font-12">
              نوع جراحی <span className="text-danger">*</span>
            </label>

            <SelectField
              styles={selectfieldColourStyles}
              options={surgeryOptions}
              label={true}
              className="text-center font-12"
              placeholder={"انتخاب کنید"}
              name="surgeryName"
              defaultValue={mode === "edit" ? defaultSurgeryType : ""}
              onChange={(value) => FUSelectSurgery(value?.value)}
              isClearable
              required
            />
          </div>

          {showOtherSurgeryType && (
            <div className="input-group mb-2">
              <input
                type="text"
                id="otherSurgeryName"
                placeholder="نوع جراحی را وارد نمایید"
                required
                className="form-control rounded-right font-12"
              />
            </div>
          )}

          <div className="form-group col-12 margint-frmGrp">
            <SingleDatePicker
              defaultDate={data.Date}
              birthDateMode={true}
              setDate={setSurgeryDate}
              label="تاریخ جراحی"
            />
          </div>

          <div className="submit-section">
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

export default SurgeryRecordModal;
