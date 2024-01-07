import { Modal } from "react-bootstrap";

const PatientFormPreviewModal = ({ show, onHide, data, formValues }) => {
  return (
    <>
      <Modal show={show} onHide={onHide} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-0 text-secondary font-14 fw-bold">
              مشاهده فرم
              {/* {} */}
            </p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            {data?.map((formComponent, index) => (
              <div
                className={formComponent?.className?.replace(
                  "form-control",
                  "mb-4"
                )}
                key={index}
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
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PatientFormPreviewModal;
