import { Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import PatientHorizontalCard from "components/dashboard/patientInfo/patientHorizontalCard";
import { Tooltip } from "primereact/tooltip";

const PatientFormPreviewModal = ({
  show,
  onHide,
  data,
  patientData,
  formValues,
}) => {
  const handlePrint = () => window.print();

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
          <div className={`row ${data?.formData?.ltr ? "dir-ltr" : "dir-rtl"}`}>
            <div className="marginb-3">
              <PatientHorizontalCard
                data={patientData}
                avatarEditMode={true}
                generalEditMode={true}
              />
            </div>

            {data.formData?.formData[0] &&
              JSON.parse(data.formData.formData[0])?.map(
                (formComponent, index) => (
                  <div
                    key={index}
                    className={`my-3 ${
                      formComponent.type !== "header" && "col-md-6"
                    }`}
                  >
                    {formComponent.type === "header" ? (
                      <formComponent.subtype
                        className={
                          formComponent.type === "header"
                            ? "text-center my-4"
                            : ""
                        }
                      >
                        <p className="fw-bold">{formComponent.label}</p>
                        <hr />
                      </formComponent.subtype>
                    ) : (
                      <div
                        className={`my-3 ${
                          data.formData.ltr ? "dir-ltr" : "dir-rtl"
                        }`}
                      >
                        <label
                          className={`lblAbs fw-bold font-15  ${
                            data.formData.ltr && "mx-3"
                          }`}
                          style={{ color: "#B45309" }}
                        >
                          {formComponent.label}{" "}
                          {formComponent.required && (
                            <span className="text-danger">*</span>
                          )}
                          {formComponent.description && (
                            <span
                              className={`des-${index} autocompleteTooltip`}
                              tooltip={formComponent.description}
                              data-pr-position="top"
                            >
                              <span className="autocompleteTooltipIcon">?</span>
                              <Tooltip target={`.des-${index}`}>
                                {formComponent.description}
                              </Tooltip>
                            </span>
                          )}
                        </label>

                        <p className="p-4 patientFrmInput">
                          {formValues &&
                            (formComponent.type === "checkbox-group" &&
                            Array.isArray(formValues[formComponent.name]) ? (
                              <span className="mx-3">
                                {formValues[formComponent.name].map(
                                  (value, index) => (
                                    <span
                                      key={index}
                                      className="mx-2 fw-bold d-flex flex-col font-14 text-secondary"
                                    >
                                      {value}
                                      {/* {index !==
                                        formValues[formComponent.name].length -
                                          1 && ","} */}
                                    </span>
                                  )
                                )}
                              </span>
                            ) : (
                              formValues[formComponent.name]
                            ))}
                        </p>
                      </div>
                    )}
                  </div>
                )
              )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PatientFormPreviewModal;
