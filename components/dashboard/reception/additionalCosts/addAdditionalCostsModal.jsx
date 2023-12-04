import { Modal } from "react-bootstrap";

const AddAdditionalCostModal = ({ show, onHide, onSubmit }) => {
  const QtyChange = (ac, e) => {
    e.stopPropagation();
    let qty = $("#additionalSrvQty").val();

    qty = parseInt(qty);
    if (ac == "+") {
      qty = qty + 1;
    } else {
      if (qty != 1) {
        qty = qty - 1;
      }
    }
    $("#additionalSrvQty").val(qty);
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header>
          <Modal.Title>
            <p className="mb-0 text-secondary font-13 fw-bold">افزودن هزینه</p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="lblAbs font-12">نام خدمت</label>
              <input
                type="text"
                className="form-control floating inputPadding rounded"
                name="additionalSrvName"
              />
            </div>

            <div className="marginb-md1">
              <label className="lblAbs margin-top-left font-12">تعداد</label>
              <div className="row">
                <div className="col-auto">
                  <button
                    type="button"
                    className="btn btn-primary btn-rounded"
                    onClick={(e) => QtyChange("+", e)}
                  >
                    <i className="fe fe-plus"></i>
                  </button>
                </div>
                <div className="col p-0">
                  <input
                    type="text"
                    className="form-control text-center rounded"
                    id="additionalSrvQty"
                    name="additionalSrvQty"
                    dir="ltr"
                    defaultValue="1"
                  />
                </div>
                <div className="col-auto">
                  <button
                    type="button"
                    className="btn btn-primary btn-rounded"
                    onClick={(e) => QtyChange("-", e)}
                  >
                    <i className="fe fe-minus"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="lblAbs font-12">هزینه واحد خدمت (ریال)</label>
              <input
                dir="ltr"
                type="text"
                className="form-control floating inputPadding rounded"
                name="additionalSrvCost"
              />
            </div>

            <div className="submit-section">
              {/* {!appointmentIsLoading ? ( */}
              <button
                type="submit"
                className="btn btn-primary rounded btn-save font-13"
              >
                ثبت
              </button>
              {/* //   ) : ( */}
              {/* //     <button
            //       type="submit"
            //       className="btn btn-primary rounded font-13"
            //       disabled
            //     >
            //       <span
            //         className="spinner-border spinner-border-sm me-2"
            //         role="status"
            //       ></span>
            //       در حال ثبت
            //     </button>
            //   )} */}
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddAdditionalCostModal;
