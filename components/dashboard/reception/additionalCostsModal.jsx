import { Modal } from "react-bootstrap";
import { convertToLocaleString } from "utils/convertToLocaleString";

const AdditionalCostsModal = ({
  show,
  onHide,
  mode,
  onSubmit,
  additionalCost,
  setAdditionalCost,
  editSrvData,
}) => {
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
            <p className="mb-0 text-secondary font-14 fw-bold">
              {mode ? "ویرایش اطلاعات" : "ثبت سایر هزینه ها"}
            </p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="hidden"
                name="additionalSrvCode"
                value={mode ? editSrvData.Code : ""}
              />
              <input
                type="hidden"
                name="additionalSrvID"
                value={mode ? editSrvData._id : ""}
              />

              <label className="lblAbs font-12">نام هزینه</label>
              <input
                type="text"
                className="form-control floating inputPadding rounded"
                name="additionalSrvName"
                defaultValue={mode ? editSrvData.Name : ""}
              />
            </div>

            <div className="marginb-md1">
              <label className="lblAbs margin-top-left font-12">تعداد</label>
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
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
                    defaultValue={mode ? editSrvData.Qty : "1"}
                  />
                </div>
                <div className="col-auto">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={(e) => QtyChange("-", e)}
                  >
                    <i className="fe fe-minus"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="lblAbs font-12">هزینه واحد (ریال)</label>
              <input
                dir="ltr"
                type="text"
                className="form-control floating inputPadding rounded"
                name="additionalSrvCost"
                value={
                  additionalCost !== 0
                    ? additionalCost.toLocaleString()
                    : editSrvData?.Price?.toLocaleString()
                }
                defaultValue={mode ? editSrvData.Price : 0}
                onChange={(e) => convertToLocaleString(e, setAdditionalCost)}
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

export default AdditionalCostsModal;
