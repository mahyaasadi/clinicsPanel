import { useState, useEffect } from "react";
import { axiosClient } from "class/axiosConfig";
import { Modal } from "react-bootstrap";
import { Dropdown } from "primereact/dropdown";
import { ErrorAlert } from "class/AlertManage";
import { convertToLocaleString } from "utils/convertToLocaleString";
import { convertToFixedNumber } from "utils/convertToFixedNumber";
import SelectField from "components/commonComponents/selectfield";
import selectfieldColourStyles from "class/selectfieldStyle";

const ApplyCashDeskModal = ({
  ClinicID,
  ClinicUserID,
  ActiveReceptionID,
  show,
  setShowPaymentModal,
  returnMode,
  setReturnMode,
  cashMode,
  calculatedTotalPC,
  paymentData,
  ApplyCashDeskActions,
}) => {
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKart, setSelectedKart] = useState(null);
  const [kartsOptionList, setKartsOptionsList] = useState([]);
  const [returnPayment, setReturnPayment] = useState(0);
  const [paymentDefaultValue, setPaymentDefaultValue] = useState(0);

  const onHide = () => {
    setShowPaymentModal(false);
    setPrice(0);
  };

  // get all karts
  const getKartsData = () => {
    setIsLoading(true);
    let url = `CashDeskKart/getAll/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        let kartOptions = [];
        for (let i = 0; i < response.data.length; i++) {
          const item = response.data[i];
          let obj = {
            value: item._id,
            label: item.Name,
          };
          kartOptions.push(obj);
        }
        setKartsOptionsList(kartOptions);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const _applyCashDeskActions = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    let CartID = formProps.kartOption;

    let url = "ClinicReception/CashDeskAction";
    let data = {
      ReceptionID: ActiveReceptionID,
      UserID: ClinicUserID,
      Price: price
        ? price
        : formProps.price !== 0
          ? parseInt(formProps.price.replace(/٬/g, ",").replace(/,/g, ""))
          : 0,
      Return: formProps.returnPaymentSwitch ? true : false,
      CartID: selectedKart ? selectedKart : CartID ? CartID : null,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        ApplyCashDeskActions(response.data);

        // Reset
        setSelectedKart(null);
        CartID = null;
        setPaymentDefaultValue(0);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        ErrorAlert("خطا", "ثبت اطلاعات با خطا مواجه گردید!");
      });
  };

  let paidCost = 0;
  if (paymentData?.CashPayment || paymentData?.CartPayment) {
    paidCost =
      parseInt(paymentData.CashPayment) + parseInt(paymentData.CartPayment);
  }

  useEffect(() => {
    setTimeout(() => {
      if (paymentData?.Debt && paymentData?.Debt !== "0") {
        setPaymentDefaultValue(parseInt(paymentData.Debt));
      } else if (paidCost === calculatedTotalPC && returnMode === false) {
        setPaymentDefaultValue(0);
      } else if (paidCost < calculatedTotalPC) {
        setPaymentDefaultValue(calculatedTotalPC - paidCost);
      } else if (
        paymentData?.ReturnedPayment !== "0" &&
        paymentData?.ReturnPayment == "0"
      ) {
        setReturnPayment(0);
        setPaymentDefaultValue(0);
      } else if (
        paymentData?.ReturnPayment &&
        paymentData?.ReturnPayment !== "0"
      ) {
        setReturnMode(true);
        setReturnPayment(parseInt(paymentData?.ReturnPayment));
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

  useEffect(() => getKartsData(), []);

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
          <form onSubmit={_applyCashDeskActions} className="mt-2">
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
                />
              </div>
            </div>

            {!returnMode && !cashMode ? (
              <div id="kartsDropdown" className="col media-mt-1 marginb-1">
                <label className="lblDrugIns font-12">
                  انتخاب کارت <span className="text-danger">*</span>
                </label>
                <SelectField
                  className="text-center font-12"
                  styles={selectfieldColourStyles}
                  onChangeValue={(value) => setSelectedKart(value?.value)}
                  options={kartsOptionList}
                  optionLabel="label"
                  name="kartOption"
                  placeholder="انتخاب کنید"
                  defaultValue={kartsOptionList[0]}
                  isClearable
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
