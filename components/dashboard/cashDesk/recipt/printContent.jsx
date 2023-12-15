import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { axiosClient } from "class/axiosConfig";
import FeatherIcon from "feather-icons-react";
import MainRecipt from "components/dashboard/cashDesk/recipt/mainRecipt";
import ArchiveRecipt from "components/dashboard/cashDesk/recipt/archiveRecipt";
import ServicesRecipt from "components/dashboard/cashDesk/recipt/servicesRecipt";

const PrintContent = ({
  ClinicID,
  data,
  paymentData,
  calculatedTotalPC,
  calculateDiscount,
  show,
  onHide,
}) => {
  const [clinicData, setClinicData] = useState([]);

  const AnsLines = clinicData?.PrintSetting?.AnsText?.split("\n");
  const DesLines = clinicData?.PrintSetting?.Description?.split("\n");

  let PatientCost =
    parseInt(paymentData?.CartPayment) + parseInt(paymentData?.CashPayment);

  const getClinicById = () => {
    let url = `Clinic/getOne/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setClinicData(response.data);
      })
      .catch((err) => console.log(err));
  };

  const handlePrint = () => window.print();

  useEffect(() => getClinicById(), []);

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        className="printSection"
        fullscreen={true}
      >
        <Modal.Header closeButton className="modalHeader">
          <div className="col-lg-4">
            <div className="printBtn">
              <button
                type="button"
                className="btn btn-outline-primary d-flex justify-center"
                onClick={() => handlePrint()}
              >
                <FeatherIcon icon="printer" />
              </button>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body dir="ltr" className="p-2">
          <MainRecipt
            data={data}
            clinicData={clinicData}
            AnsLines={AnsLines}
            DesLines={DesLines}
            PatientCost={PatientCost}
            paymentData={paymentData}
            calculatedTotalPC={calculatedTotalPC}
            calculateDiscount={calculateDiscount}
          />

          <div className="row justify-between mt-2">
            <div className="col-6">
              <ServicesRecipt
                data={data}
                clinicData={clinicData}
                paymentData={paymentData}
              />
            </div>
            <div className="col-5">
              <ArchiveRecipt
                data={data}
                clinicData={clinicData}
                calculateDiscount={calculateDiscount}
                paymentData={paymentData}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PrintContent;