import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import SelectField from "components/commonComponents/selectfield";
import { genderDataClass } from "class/staticDropdownOptions";
import selectfieldColourStyles from "class/selectfieldStyle";

const EditPatientInfoModal = ({
  data,
  showModal,
  handleClose,
  handleChangePatientInfo,
  isLoading,
}) => {
  const [selectedTab, setSelectedTab] = useState("");
  const [value, setValue] = useState("");

  const handleTabChange = (tab) => setSelectedTab(tab);
  const handleInputChange = (e) =>
    setValue(e?.target ? e?.target?.value : e?.value);

  const handleSubmit = () => {
    handleChangePatientInfo(selectedTab, value);
    handleClose();
  };

  const defaultGanderValue = data?.Gender ? data.Gender : data.gender;
  let defaultGenderValueLbl = "";
  if (data.Gender) {
    switch (data.Gender) {
      case "M":
        defaultGenderValueLbl = "مرد";
        break;
      case "F":
        defaultGenderValueLbl = "زن";
        break;
      case "O":
        defaultGenderValueLbl = "دیگر";
        break;
      default:
        "دیگر";
        break;
    }
  }

  if (data.gender) {
    switch (data.gender) {
      case "M":
        defaultGenderValueLbl = "مرد";
        break;
      case "F":
        defaultGenderValueLbl = "زن";
        break;
      case "O":
        defaultGenderValueLbl = "دیگر";
        break;
      default:
        "دیگر";
        break;
    }
  }

  const selectedGender = {
    value: defaultGanderValue,
    label: defaultGenderValueLbl,
  };

  useEffect(() => handleTabChange("Name"), []);

  return (
    <Modal show={showModal} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="mb-0 text-secondary font-14 fw-bold">
            تغییر اطلاعات بیمار
          </p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded">
          <li className="nav-item font-12">
            <a
              className="nav-link active"
              href="#solid-rounded-tab1"
              onClick={() => handleTabChange("Name")}
              data-bs-toggle="tab"
            >
              نام بیمار
            </a>
          </li>
          <li className="nav-item font-12">
            <a
              className="nav-link"
              href="#solid-rounded-tab2"
              onClick={() => handleTabChange("Age")}
              data-bs-toggle="tab"
            >
              سن بیمار
            </a>
          </li>
          <li className="nav-item font-12">
            <a
              className="nav-link"
              href="#solid-rounded-tab3"
              onClick={() => handleTabChange("Gender")}
              data-bs-toggle="tab"
            >
              جنسیت
            </a>
          </li>
          <li className="nav-item font-12">
            <a
              className="nav-link"
              href="#solid-rounded-tab4"
              onClick={() => handleTabChange("Tel")}
              data-bs-toggle="tab"
            >
              تلفن همراه
            </a>
          </li>
          <li className="nav-item font-12">
            <a
              className="nav-link"
              href="#solid-rounded-tab5"
              onClick={() => handleTabChange("NationalID")}
              data-bs-toggle="tab"
            >
              کد ملی
            </a>
          </li>
        </ul>

        <div className="tab-content">
          <div className="tab-pane show active" id="solid-rounded-tab1">
            <Form.Group controlId="patientName">
              <label className="lblAbs font-12">نام</label>
              <Form.Control
                type="text"
                className="rounded"
                onChange={handleInputChange}
                defaultValue={
                  data?.Name ? data.Name : data.name + " " + data.lastName
                }
              />
            </Form.Group>
          </div>
          <div className="tab-pane" id="solid-rounded-tab2">
            <Form.Group controlId="patientAge">
              <label className="lblAbs font-12">سن بیمار</label>
              <Form.Control
                dir="ltr"
                type="text"
                className="rounded"
                onChange={handleInputChange}
                defaultValue={data?.Age ? data.Age : data.age}
              />
            </Form.Group>
          </div>
          <div className="tab-pane" id="solid-rounded-tab3">
            <div className="col-md-12 media-w-100">
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
                defaultValue={selectedGender}
                onChange={handleInputChange}
                key={data?.Gender}
              />
            </div>
          </div>
          <div className="tab-pane" id="solid-rounded-tab4">
            <Form.Group controlId="patientPhoneNumber">
              <label className="lblAbs font-12">تلفن همراه</label>
              <Form.Control
                type="tel"
                className="rounded"
                onChange={handleInputChange}
                defaultValue={data?.Tel ? data.Tel : data.cellPhoneNumber}
              />
            </Form.Group>
          </div>
          <div className="tab-pane" id="solid-rounded-tab5">
            <Form.Group controlId="patientNID">
              <label className="lblAbs font-12">کد ملی</label>
              <Form.Control
                type="text"
                dir="ltr"
                className="rounded"
                onChange={handleInputChange}
                defaultValue={
                  data?.NationalID ? data.NationalID : data.nationalNumber
                }
              />
            </Form.Group>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-center">
        {isLoading ? (
          <Button variant="primary" disabled className="rounded w-25">
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            در حال ثبت
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="rounded w-25"
          >
            ثبت
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EditPatientInfoModal;

