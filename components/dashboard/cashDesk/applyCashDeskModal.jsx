import { Modal } from "react-bootstrap";
import { Dropdown } from "primereact/dropdown";

const ApplyCashDeskModal = ({
  show,
  onHide,
  kartsOptionList,
  selectedKart,
  setSelectedKart,
  applyCashDeskActions,
  isLoading,
  returnMode,
}) => {
  //   console.log({ returnMode });
  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-0 text-secondary font-14 fw-bold">
              ثبت وضعیت پرداخت
            </p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={applyCashDeskActions} className="mt-2">
            <div className="row">
              <div className="form-group col">
                <label className="lblAbs font-12">
                  {!returnMode
                    ? "مبلغ دریافتی از بیمار"
                    : "مبلغ پرداختی به بیمار"}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  name="price"
                  className="form-control floating inputPadding rounded text-secondary"
                />
              </div>
            </div>

            {!returnMode ? (
              <div id="kartsDropdown" className="col media-mt-1 marginb-1">
                <label className="lblAbs font-12">انتخاب کارت</label>
                <Dropdown
                  value={selectedKart}
                  onChange={(e) => setSelectedKart(e.value)}
                  options={kartsOptionList}
                  optionLabel="label"
                  placeholder="انتخاب کنید"
                  filter
                  showClear
                />
              </div>
            ) : (
              ""
            )}

            {returnMode ? (
              <div className="form-group col d-flex align-items-center justify-center gap-3 d-none">
                <p className="font-12 mt-1 text-secondary">عودت</p>
                <input
                  type="checkbox"
                  hidden="hidden"
                  id="returnPaymentSwitch"
                  name="returnPaymentSwitch"
                  className="showInSliderCheckbox"
                  defaultChecked
                />
                <label
                  className="showInsliderSwitch font-12"
                  htmlFor="returnPaymentSwitch"
                ></label>
              </div>
            ) : (
              ""
            )}

            <div className="submit-section">
              {!isLoading ? (
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
    </>
  );
};

export default ApplyCashDeskModal;
