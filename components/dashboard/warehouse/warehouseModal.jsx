import { Modal } from "react-bootstrap";

const WarehouseModal = ({
  mode = "add",
  onSubmit,
  data = {},
  actionIsLoading,
  show,
  onHide,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="mb-0 text-secondary font-14 fw-bold">
            {mode == "add" ? "افزودن کالا" : "ویرایش اطلاعات"}
          </p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={onSubmit}>
          {mode === "edit" && (
            <input type="hidden" name="EditWItemID" value={data._id} />
          )}

          <div className="row">
            <div className="col-lg-6 col-12">
              <div className="form-group">
                <label className="lblAbs font-12">
                  عنوان کالا <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control floating inputPadding rounded"
                  name="itemName"
                  defaultValue={mode == "edit" ? data.Name : ""}
                  key={data.Name}
                  required
                />
              </div>
            </div>

            <div className="col-lg-6 col-12">
              <div className="form-group">
                <label className="lblAbs font-12">
                  کد کالا <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control floating inputPadding rounded"
                  dir="ltr"
                  name="itemCode"
                  defaultValue={mode == "edit" ? data.Code : ""}
                  key={data.Code}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 col-12">
              <div className="form-group">
                <label className="lblAbs font-12">
                  عنوان واحد <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control floating inputPadding rounded"
                  name="unitName"
                  defaultValue={mode == "edit" ? data.UnitName : ""}
                  key={data.UnitName}
                  required
                />
              </div>
            </div>

            <div className="col-lg-4 col-12">
              <div className="form-group">
                <label className="lblAbs font-12">
                  مقدار واحد <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control floating inputPadding rounded"
                  dir="ltr"
                  name="unit"
                  defaultValue={mode == "edit" ? data.Unit : ""}
                  key={data.Unit}
                  required
                />
              </div>
            </div>

            <div className="col-lg-4 col-12">
              <div className="form-group">
                <label className="lblAbs font-12">
                  مقدار مصرف واحد <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control floating inputPadding rounded"
                  dir="ltr"
                  name="consumptionUnit"
                  defaultValue={mode == "edit" ? data.ConsumptionUnit : ""}
                  key={data.ConsumptionUnit}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 col-12">
              <div className="form-group">
                <label className="lblAbs font-12">تگ</label>
                <input
                  className="form-control floating inputPadding rounded"
                  name="itemTag"
                  defaultValue={mode == "edit" ? data.Tag : ""}
                  key={data.Tag}
                />
              </div>
            </div>

            <div className="col-lg-6 col-12">
              <div className="form-group">
                <label className="lblAbs font-12">توضیحات</label>
                <input
                  type="text"
                  className="form-control floating inputPadding rounded"
                  name="itemDes"
                  defaultValue={mode == "edit" ? data.Des : ""}
                  key={data.Des}
                />
              </div>
            </div>
          </div>

          <div className="submit-section">
            {!actionIsLoading ? (
              <button
                type="submit"
                className="btn btn-primary rounded btn-save font-13"
              >
                {mode == "add" ? "ثبت اطلاعات" : "ثبت تغییرات"}
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

export default WarehouseModal;
