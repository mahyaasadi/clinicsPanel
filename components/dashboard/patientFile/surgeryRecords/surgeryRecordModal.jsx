import { useState, useEffect } from "react";
import { axiosClient } from "class/axiosConfig";
import { Modal } from "react-bootstrap";
import selectfieldColourStyles from "class/selectfieldStyle";
import SelectField from "components/commonComponents/selectfield";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";

let surgeryOptions = [];
const SurgeryRecordModal = ({ show, onHide, mode }) => {
  const [surgeryDate, setSurgeryDate] = useState(null);
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let selectedSurgery = "";
  let selectedSurgeryLbl = "";
  const FUSelectSurgery = (value) => {
    selectedSurgery = value;
    selectedSurgeryLbl = surgeryOptions.find((x) => x.value === value);
    console.log({ selectedSurgeryLbl });
  };

  const _attachSurgeryRecordToPatient = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    console.log(formProps.surgeryName.toString());
    let findSurgeryName = surgeryOptions.find(
      (x) => x.value === formProps.surgeryName.toString()
    );
    console.log({ findSurgeryName });
    let url = "Patient/addSurgery";
    let data = {
      Name: selectedSurgeryLbl
        ? selectedSurgeryLbl.label
        : formProps.surgeryName,
      Date: surgeryDate,
    };

    console.log({ data });

    // axiosConfig
    //   .post(url, data)
    //   .then((response) => {
    //     console.log(response.data);
    // setIsLoading(false)
    //   })
    //   .catch((err) => {
    //     console.log(err);
    // setIsLoading(false)
    //   });
  };

  const _editAttachedSurgeryRecord = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "Patient/editSurgery";
    let data = {
      // Name,
      // Date,
      // SurgeryID:
    };

    console.log({ data });

    axiosClient
      .put((url, data))
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const updateItem = (newArr, id) => {

  // }

  // const _deleteAttachedSurgery = (id) => {
  //   let url = "Patient/deleteSurgery"
  //   let data = {
  //     // SurgeryID:
  //   }
  // };

  useEffect(() => _getAllSurguryRecords(), []);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
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
              // defaultValue={mode === "edit" ? defDepValue : ""}
              onChange={(value) => FUSelectSurgery(value?.value)}
              isClearable
              required
            />
          </div>

          <div className="form-group col-12 margint-frmGrp">
            <SingleDatePicker
              // defaultDate={data.BD}
              setDate={setSurgeryDate}
              label="تاریخ جراحی"
            />
          </div>

          <div className="submit-section">
            {/* {!appointmentIsLoading ? ( */}
            <button
              type="submit"
              className="btn btn-primary rounded btn-save font-13"
            >
              ثبت
            </button>
            {/* ) : ( */}
            {/* <button
                  type="submit"
                  className="btn btn-primary rounded font-13"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  در حال ثبت
                </button> */}
            {/* )} */}
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default SurgeryRecordModal;
