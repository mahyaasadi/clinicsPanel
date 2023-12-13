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
}) => {
  const [returnPayment, setReturnPayment] = useState(0);

  let paidCost =
    parseInt(paymentData.CashPayment) + parseInt(paymentData.CartPayment);

  useEffect(() => {
    setTimeout(() => {
      if (paymentData.Debt && paymentData.Debt !== "0") {
        setPaymentDefaultValue(paymentData.Debt);
        console.log("has debt");
      } else if (paidCost === calculatedTotalPC && returnMode === false) {
        setPaymentDefaultValue(0);
        console.log("fullPayment");
      } else if (paidCost < calculatedTotalPC) {
        setPaymentDefaultValue(calculatedTotalPC - paidCost);
        console.log("debt");
      } else if (paidCost > calculatedTotalPC) {
        console.log("in return mode");
        setReturnMode(true);
        setReturnPayment(paidCost - calculatedTotalPC);
      } else {
        setPaymentDefaultValue(calculatedTotalPC);
        console.log("zero payment");
      }
    }, 200);

    return () => {
      setPaymentDefaultValue(0);
      setReturnMode(false);
      setReturnPayment(0);
    };
  }, [paymentData]);

  console.log({ returnMode, returnPayment });

  // let paidCost =
  //   parseInt(paymentData.CashPayment) + parseInt(paymentData.CartPayment);

  // useEffect(() => {
  //   // setTimeout(() => {
  //   if (paidCost === calculatedTotalPC || paidCost > calculatedTotalPC) {
  //     setPaymentDefaultValue(0);
  //     console.log("fullPayment or returnMode");
  //   } else if (paymentData.Debt && paymentData.Debt !== "0") {
  //     setPaymentDefaultValue(paymentData.Debt);
  //     console.log("debt");
  //   } else {
  //     setPaymentDefaultValue(calculatedTotalPC);
  //     console.log("zeroPayment");
  //   }
  //   // }, 300);
  // }, [paymentData]);

  console.log({ paymentDefaultValue });

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
                  // value={
                  //   !returnMode && price === 0
                  //     ? convertToFixedNumber(calculatedTotalPC.toLocaleString())
                  //     : convertToFixedNumber(price.toLocaleString())
                  // }
                  // defaultValue={
                  //   !returnMode ? convertToFixedNumber(calculatedTotalPC) : 0
                  // }
                  value={
                    !returnMode && price === 0
                      ? convertToFixedNumber(
                          paymentDefaultValue?.toLocaleString()
                        )
                      : convertToFixedNumber(price.toLocaleString())
                  }
                  defaultValue={
                    !returnMode
                      ? convertToFixedNumber(paymentDefaultValue)
                      : convertToFixedNumber(returnPayment)
                  }
                  onChange={(e) => convertToLocaleString(e, setPrice)}
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
