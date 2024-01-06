import { Modal } from "react-bootstrap";

const PatientFormPreviewModal = ({ show, onHide, data, formValues }) => {
  console.log({ data, formValues });
  //   let arrayOfFormData = [];

  //   if (data) arrayOfFormData = JSON.parse(data.formData.formData[0]);

  //   console.log({ arrayOfFormData });
  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
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
            {data?.map(
              (formComponent, index) => (
                console.log({ formComponent }),
                (
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
                          formComponent.type === "header"
                            ? "text-center mb-4"
                            : ""
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
                )
              )
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PatientFormPreviewModal;
