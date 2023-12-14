import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Dropdown } from "primereact/dropdown";
import { convertToLocaleString } from "utils/convertToLocaleString";
import { convertToFixedNumber } from "utils/convertToFixedNumber";

const ApplyCashDeskModal = ({
  show,
  onHide,
  kartsOptionList,
  selectedKart,
  setSelectedKart,
  applyCashDeskActions,
  isLoading,
  returnMode,
  setReturnMode,
  cashMode,
  calculatedTotalPC,
  price,
  setPrice,
  paymentData,
  paymentDefaultValue,
  setPaymentDefaultValue,
  returnPayment,
  setReturnPayment,
}) => {
  let paidCost = 0;
  if (paymentData.CashPayment || paymentData.CartPayment) {
    paidCost =
      parseInt(paymentData.CashPayment) + parseInt(paymentData.CartPayment);
  }

  useEffect(() => {
    setTimeout(() => {
      if (paymentData.Debt && paymentData.Debt !== "0") {
        setPaymentDefaultValue(parseInt(paymentData.Debt));
      } else if (paidCost === calculatedTotalPC && returnMode === false) {
        setPaymentDefaultValue(0);
      } else if (paidCost < calculatedTotalPC) {
        setPaymentDefaultValue(calculatedTotalPC - paidCost);
      } else if (
        paymentData.ReturnedPayment !== "0" &&
        paymentData.ReturnPayment == "0"
      ) {
        setReturnPayment(0);
        setPaymentDefaultValue(0);
      } else if (
        paymentData.ReturnPayment &&
        paymentData.ReturnPayment !== "0"
      ) {
        setReturnMode(true);
        setReturnPayment(parseInt(paymentData.ReturnPayment));
      } else {
        setPaymentDefaultValue(calculatedTotalPC);
      }
    }, 200);

    return () => {
      setPaymentDefaultValue(0);
      setReturnMode(false);
      setReturnPayment(0);
    };
  }, [paymentData]);

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
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
                    : "مبلغ پرداختی به بیمار"}{" "}
                  (ریال)
                </label>
                <input
                  id="priceInput"
                  type="text"
                  dir="ltr"
                  name="price"
                  className="form-control floating inputPadding rounded text-secondary"
                  value={
                    returnMode
                      ? convertToFixedNumber(returnPayment.toLocaleString())
                      : !returnMode && price === 0
                      ? convertToFixedNumber(
                          paymentDefaultValue?.toLocaleString()
                        )
                      : convertToFixedNumber(price.toLocaleString())
                  }
                  onChange={(e) => {
                    if (!returnMode) {
                      convertToLocaleString(e, setPrice);
                    } else {
                      convertToLocaleString(e, setReturnPayment);
                    }
                  }}
                  // defaultValue={convertToFixedNumber(paymentDefaultValue)}
                />
              </div>
            </div>

            {!returnMode && !cashMode ? (
              <div id="kartsDropdown" className="col media-mt-1 marginb-1">
                <label className="lblAbs font-12">
                  انتخاب کارت <span className="text-danger">*</span>
                </label>
                <Dropdown
                  value={selectedKart}
                  onChange={(e) => setSelectedKart(e.value)}
                  options={kartsOptionList}
                  optionLabel="label"
                  placeholder="انتخاب کنید"
                  showClear
                  required
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

            <div className="submit-section mt-1">
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
