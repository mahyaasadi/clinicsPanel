import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Modal } from "react-bootstrap";
import { axiosClient } from "class/axiosConfig";
import SelectField from "components/commonComponents/selectfield";
import selectfieldColourStyles from "class/selectfieldStyle";

const FormOptionsModal = ({
  show,
  onHide,
  ClinicID,
  ClinicUserID,
  ActivePatientID,
}) => {
  const router = useRouter();

  const [formsData, setFormsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // get all formsData
  const getAllFormsData = () => {
    let url = `Form/getAll/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        console.log(response.data);
        setFormsData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let formOptions = [];
  for (let i = 0; i < formsData.length; i++) {
    const item = formsData[i];
    let obj = {
      label: item.Name,
      value: item._id,
    };
    formOptions.push(obj);
  }

  let selectedForm = null;
  const FUSelectFormOption = (value) => {
    selectedForm = value;
    router.push({
      pathname: "/attachFormToPatientFile",
      query: { FID: value, PID: ActivePatientID },
    });
  };

  useEffect(() => getAllFormsData(), []);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="mb-0 text-secondary font-14 fw-bold">
            افزودن فرم به پرونده بیمار
          </p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div>
          <label className="lblDrugIns font-12">
            انتخاب فرم <span className="text-danger">*</span>
          </label>

          <SelectField
            styles={selectfieldColourStyles}
            options={formOptions}
            label={true}
            className="text-center font-12"
            placeholder={"انتخاب کنید"}
            onChange={(value) => FUSelectFormOption(value?.value)}
            isClearable
            required
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default FormOptionsModal;
