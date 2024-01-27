import { Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import dynamic from "next/dynamic";

const PatientFormPreviewModal = ({ show, onHide, data, formValues }) => {
  console.log({ data, formValues });

  const handlePrint = () => window.print();
  const componentsArr = [];

  data?.map((x, index) => {
    const MyComponent = dynamic(() =>
      import("components/dashboard/forms/formComponents/form-" + x?.type)
    );

    componentsArr.push(
      <MyComponent
        data={x}
        key={index}
        index={index}
        defaultValue={formValues[x.name]}
      />
    );
  });

  return (
    <>
      <Modal show={show} onHide={onHide} centered fullscreen={true}>
        <Modal.Header closeButton className="modalHeader">
          <div className="col-lg-4">
            <button
              type="button"
              className="btn btn-outline-primary d-flex justify-center"
              onClick={() => handlePrint()}
            >
              <FeatherIcon icon="printer" />
            </button>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            {/* {data?.map((formComponent, index) => (
              <div
                key={index}
                className={formComponent?.className?.replace(
                  "form-control",
                  "mb-4"
                )}
              >
                {formComponent.type === "header" ? (
                  <formComponent.subtype
                    className={
                      formComponent.type === "header" ? "text-center mb-4" : ""
                    }
                  >
                    <p className="fw-bold">{formComponent.label}</p>
                    <hr />
                  </formComponent.subtype>
                ) : (
                  <div>
                    <label className="lblAbs fw-bold font-13">
                      {formComponent.label}
                    </label>
                    <p className="p-3 patientFrmInput">
                      {formValues[formComponent.name]}
                    </p>
                  </div>
                )}
              </div>
            ))} */}

            <div className="row">
              {componentsArr.map((component, index) => component)}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PatientFormPreviewModal;
