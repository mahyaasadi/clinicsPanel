import { Modal } from "react-bootstrap";

const ChangeItemStockModal = ({
  mode,
  onSubmit,
  actionIsLoading,
  show,
  onHide,
  data,
  itemQty,
  setItemQty,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="mb-0 text-secondary font-14 fw-bold">
            {mode == "increase" ? "افزودن به موجودی" : "کاستن از موجودی"}
          </p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={onSubmit}>
          <div className="form-group mt-2">
            <label className="lblAbs font-12">
              {mode == "increase" ? "تعداد افزوده " : "تعداد کاسته "}
            </label>
            <input
              type="number"
              className="form-control floating inputPadding rounded"
              name="itemQty"
              min="0"
              value={itemQty}
              onChange={(e) => setItemQty(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table mt-3 font-13 text-secondary table-bordered shadow-sm">
              <thead>
                <tr>
                  <th scope="col">نتیجه</th>

                  <th scope="col d-flex flex-col">
                    <p className="mb-0">
                      {mode == "increase"
                        ? "میزان افزوده شده"
                        : "میزان کاسته شده"}
                    </p>
                    <p>
                      {mode == "increase"
                        ? `( مقدار واحد x تعداد افزوده )`
                        : `(مقدار مصرف واحد x تعداد کاسته)`}
                    </p>
                  </th>
                  <th scope="col">مقدار اولیه موجودی</th>
                </tr>
              </thead>

              <tbody className="font-13 text-secondary">
                <tr>
                  <th scope="row">
                    {mode == "increase"
                      ? data.Stock + itemQty * data.Unit
                      : data.Stock - itemQty * data.ConsumptionUnit}
                  </th>
                  <td>
                    {mode == "increase"
                      ? itemQty * data.Unit
                      : itemQty * data.ConsumptionUnit}
                  </td>
                  <td>{data.Stock}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="submit-section">
            {!actionIsLoading ? (
              <button
                type="submit"
                className="btn btn-primary rounded btn-save font-13"
              >
                ثبت
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

export default ChangeItemStockModal;
