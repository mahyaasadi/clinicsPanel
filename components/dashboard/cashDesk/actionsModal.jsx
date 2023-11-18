import { useState } from "react";
import { Modal } from "react-bootstrap";
import ApplyCashDeskModal from "./applyCashDeskModal";

const calculateDiscount = (srvItem, totalPatientCost) => {
  if (srvItem.Discount?.Percent) {
    return (totalPatientCost * parseInt(srvItem.Discount?.Value)) / 100;
  } else if (srvItem.Discount?.Percent === false) {
    return srvItem.Qty * parseInt(srvItem.Discount?.Value);
  }
  return 0;
};

const CashDeskActions = ({
  show,
  onHide,
  kartsOptionList,
  selectedKart,
  setSelectedKart,
  applyCashDeskActions,
  data,
  paymentData,
  isLoading,
  showPaymentModal,
  setShowPaymentModal,
}) => {
  // console.log({ data, paymentData });

  const [returnMode, setReturnMode] = useState(false);

  const handleCloseModal = () => setShowPaymentModal(false);

  const handlePaymentBtn = () => {
    setReturnMode(false);
    setShowPaymentModal(true);
  };

  const handleReturnPaymentBtn = () => {
    setReturnMode(true);
    setShowPaymentModal(true);
  };

  let calculatedTotalPC = 0;

  const handleCalculateCost = (e) => {
    const { name, value } = e.target;
    let result = 0;
    let _CalCart = parseInt($("#cartPayment").val()) || 0;
    let _CalCash = parseInt($("#cashPayment").val()) || 0;

    if (name === "cartPayment" || name === "cashPayment") {
      if (name === "cartPayment") _CalCart = value;
      if (name === "cashPayment") _CalCash = value;
      let payment = parseInt(_CalCart) + parseInt(_CalCash);
      result = calculatedTotalPC - payment;
      if (result < 0) {
        $("#debt").val("0");
        $("#returnPayment").val(result);
      } else {
        $("#debt").val(result);
        $("#returnPayment").val(0);
      }
    } else {
      let _CalDebt = 0;
      let _CalReturn = 0;
      if (name === "debt") {
        _CalDebt = value;
        result = calculatedTotalPC - _CalDebt;
        if (result < 0) result = 0;
        $("#cartPayment").val(result);
        $("#returnPayment").val(0);
      }

      if (name === "returnPayment") _CalReturn = value;
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="row p-2 text-secondary font-14 fw-bold margin-right-sm">
              {/* <div className="cashDeskPatientInfo text-center rounded text-secondary col-lg-6 font-13"> */}
              نام بیمار : {data?.Patient?.Name} {" | "}
              {/* </div> */}
              {/* <div className="cashDeskPatientInfo text-center rounded text-secondary col-lg-6 font-13"> */}
              تاریخ نسخه : {data?.Date}
              {/* </div> */}
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row p-2 gap-2">
            <button
              type="submit"
              className="btn btn-primary rounded btn-save font-13 col-lg-3"
              onClick={handlePaymentBtn}
            >
              دریافت وجه از بیمار
            </button>
            <button
              type="submit"
              className="btn btn-outline-secondary rounded btn-save font-13 col-lg-3"
              onClick={handleReturnPaymentBtn}
            >
              پرداخت وجه به بیمار
            </button>
          </div>

          <div className="table-responsive actionTable">
            <table className="table mt-4 font-13 text-secondary">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">کد خدمت</th>
                  <th scope="col">نام خدمت</th>
                  <th scope="col">تعداد</th>
                  <th scope="col">مبلغ کل</th>
                  <th scope="col">سهم بیمار</th>
                  <th scope="col">سهم سازمان</th>
                  <th scope="col">تخفیف</th>
                </tr>
              </thead>

              <tbody className="font-13 text-secondary">
                {data?.Items?.map((item, index) => {
                  let RowTotalCost = item.Price * item.Qty;
                  let RowOrgCost = item.Qty * item.OC;
                  let RowPatientCost = RowTotalCost - RowOrgCost;
                  let RowTotalDiscount = calculateDiscount(
                    item,
                    RowPatientCost
                  );

                  if (RowTotalDiscount) RowPatientCost -= RowTotalDiscount;

                  return (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.Code}</td>
                      <td>{item.Name}</td>
                      <td>{item.Qty}</td>
                      <td>{RowTotalCost.toLocaleString()}</td>
                      <td>{RowPatientCost.toLocaleString()}</td>
                      <td>{RowOrgCost.toLocaleString()}</td>
                      <td>{RowTotalDiscount.toLocaleString()}</td>
                    </tr>
                  );
                })}

                {data?.Calculated
                  ? ((calculatedTotalPC = data?.Calculated?.TotalPC),
                    (
                      <>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            {data?.Calculated?.TotalQty?.toLocaleString()}
                          </td>
                          <td>
                            {data?.Calculated?.TotalPrice?.toLocaleString()}
                          </td>
                          <td>{data?.Calculated?.TotalPC?.toLocaleString()}</td>
                          <td>{data?.Calculated?.TotalOC?.toLocaleString()}</td>
                          <td>
                            {data?.Calculated?.TotalDiscount?.toLocaleString()}
                          </td>
                        </tr>
                      </>
                    ))
                  : ""}
              </tbody>
            </table>
          </div>

          <div className="row p-2 media-gap-sm">
            <div className="col-lg-3 col-12">
              <label className="lblAbs font-12">مبلغ پرداخت با کارت</label>
              <div
                dir="ltr"
                className="form-control floating rounded text-secondary"
              >
                {paymentData?.CartPayment
                  ? parseInt(paymentData.CartPayment).toLocaleString()
                  : parseInt(calculatedTotalPC).toLocaleString()}
              </div>
            </div>
            <div className="col-lg-3 col-12">
              <label className="lblAbs font-12">مبلغ پرداخت نقدی</label>
              <div
                dir="ltr"
                className="form-control floating rounded text-secondary"
              >
                {paymentData?.CashPayment
                  ? parseInt(paymentData?.CashPayment).toLocaleString()
                  : 0}
              </div>
            </div>

            <div className="col-lg-3 col-12">
              <label className="lblAbs font-12">مبلغ بدهی</label>
              <div
                dir="ltr"
                className="form-control floating rounded text-secondary"
              >
                {paymentData?.Debt ? parseInt(paymentData?.Debt).toLocaleString() : 0}
              </div>
            </div>

            <div className="col-lg-3 col-12">
              <label className="lblAbs font-12">مبلغ عودت</label>
              <div
                dir="ltr"
                className="form-control floating rounded text-secondary"
              >
                {paymentData?.ReturnPayment ? parseInt(paymentData?.ReturnPayment).toLocaleString() : 0}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <ApplyCashDeskModal
        show={showPaymentModal}
        onHide={handleCloseModal}
        kartsOptionList={kartsOptionList}
        selectedKart={selectedKart}
        setSelectedKart={setSelectedKart}
        applyCashDeskActions={applyCashDeskActions}
        isLoading={isLoading}
        returnMode={returnMode}
      />
    </>
  );
};

export default CashDeskActions;