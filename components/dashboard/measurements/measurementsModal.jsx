import { Modal } from "react-bootstrap";

const MeasurementsModal = ({
  mode = "add",
  onSubmit,
  data = {},
  isLoading,
  show,
  onHide,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="mb-0 text-secondary font-14 fw-bold">
            {mode === "add" ? "add" : "edit"}
          </p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={onSubmit}>
          {mode === "edit" && (
            <input type="hidden" name="MeasureID" value={data._id} />
          )}

          <div className="form-group">
            <label className="lblAbs font-12">
              عنوان <span className="text-danger">*</span>
            </label>
            <input
              className="form-control floating inputPadding rounded"
              name="PN"
              defaultValue={
                mode == "edit" ? (data.PN ? data.PN : data.Name) : ""
              }
              key={data.PN}
              required
            />
          </div>

          <div className="form-group">
            <label className="lblAbs font-12">عنوان تخصصی</label>
            <input
              className="form-control floating inputPadding rounded"
              name="SN"
              defaultValue={
                mode == "edit" ? (data.SN ? data.SN : data.EngName) : ""
              }
              key={data.SN}
              // required
            />
          </div>

          <div className="submit-section">
            {!isLoading ? (
              <button
                type="submit"
                className="btn btn-primary rounded btn-save font-13"
              >
                {mode === "add" ? "ثبت" : "ثبت تغییرات"}
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

export default MeasurementsModal;
