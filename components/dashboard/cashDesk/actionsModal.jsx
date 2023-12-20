import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import ApplyCashDeskModal from "./applyCashDeskModal";
import PrintContent from "components/dashboard/cashDesk/recipt/printContent";

const calculateDiscount = (srvItem, totalPatientCost) => {
  if (srvItem.Discount?.Percent) {
    return (totalPatientCost * parseInt(srvItem.Discount?.Value)) / 100;
  } else if (srvItem.Discount?.Percent === false) {
    return srvItem.Qty * parseInt(srvItem.Discount?.Value);
  }
  return 0;
};

const CashDeskActions = ({
  ClinicID,
  ClinicUserID,
  ActiveReceptionID,
  show,
  onHide,
  ApplyCashDeskActions,
  data,
  paymentData,
  showPaymentModal,
  setShowPaymentModal,
}) => {
  let calculatedTotalPC = 0;

  const [returnMode, setReturnMode] = useState(false);
  const [cashMode, setCashMode] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const handleClosePrintModal = () => setShowPrintModal(false);

  const handlePaymentBtn = () => {
    setReturnMode(false);
    setCashMode(false);
    setShowPaymentModal(true);
  };

  const handleCashPaymentBtn = () => {
    setReturnMode(false);
    setCashMode(true);
    setShowPaymentModal(true);
  };

  const handleReturnPaymentBtn = () => {
    setReturnMode(true);
    setCashMode(false);
    setShowPaymentModal(true);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        size="xl"
        className="cashDeskActionModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="row p-2 text-secondary font-14 fw-bold margin-right-sm">
              نام بیمار : {data?.Patient?.Name} {" | "}
              تاریخ نسخه : {data?.Date}
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          <div className="row media-flex-column media-gap-md px-10">
            <div className="col-12 col-xl-3">
              <button
                type="submit"
                className="btn btn-primary rounded text-center font-13 d-flex align-items-center gap-2 justify-center w-100"
                onClick={handlePaymentBtn}
              >
                <FeatherIcon icon="credit-card" />
                واریز وجه با کارت
              </button>
            </div>

            <div className="col-12 col-xl-3">
              <button
                type="submit"
                className="btn btn-primary rounded text-center font-13 d-flex align-items-center gap-2 justify-center w-100"
                onClick={handleCashPaymentBtn}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-21"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />
                </svg>
                دریافت وجه نقد
              </button>
            </div>
            <div className="col-12 col-xl-3">
              <button
                type="submit"
                className="btn btn-primary text-center rounded font-13 d-flex align-items-center gap-2 justify-center w-100"
                onClick={handleReturnPaymentBtn}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-21"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                  />
                </svg>
                پرداخت وجه به بیمار
              </button>
            </div>

            <div className="col-12 col-xl-3">
              <button
                type="button"
                className="btn btn-outline-primary text-center rounded font-13 d-flex align-items-center gap-2 justify-center w-100"
                onClick={() => setShowPrintModal(true)}
              >
                <FeatherIcon icon="printer" />
                چاپ قبض
              </button>
            </div>
          </div>

          <div className="table-responsive p-2">
            <table className="table mt-4 font-13 text-secondary table-bordered">
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
                          <td>جمع کل </td>
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

          <div className="table-responsive p-2">
            <table className="table mt-4 font-12 text-secondary table-bordered">
              <tbody>
                <tr>
                  <td>
                    مبلغ پرداخت با کارت :{" "}
                    {paymentData?.CartPayment
                      ? parseInt(paymentData.CartPayment).toLocaleString()
                      : 0}{" "}
                    ریال
                  </td>
                  <td>
                    مبلغ پرداخت نقدی :{" "}
                    {paymentData?.CashPayment
                      ? parseInt(paymentData?.CashPayment).toLocaleString()
                      : 0}{" "}
                    ریال
                  </td>
                  <td>
                    جمع مبالغ واریزی به بیمار:{" "}
                    {paymentData?.ReturnedPayment
                      ? parseInt(paymentData.ReturnedPayment).toLocaleString()
                      : 0}{" "}
                    ریال
                  </td>
                  <td>
                    مبلغ بدهی :{" "}
                    {paymentData?.Debt
                      ? parseInt(paymentData?.Debt).toLocaleString()
                      : 0}{" "}
                    ریال
                  </td>
                  <td>
                    مبلغ عودت :{" "}
                    {paymentData?.ReturnPayment
                      ? parseInt(paymentData?.ReturnPayment).toLocaleString()
                      : 0}{" "}
                    ریال
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>

      <PrintContent
        show={showPrintModal}
        onHide={handleClosePrintModal}
        data={data}
        paymentData={paymentData}
        calculatedTotalPC={calculatedTotalPC}
        calculateDiscount={calculateDiscount}
        ClinicID={ClinicID}
      />

      <ApplyCashDeskModal
        ClinicID={ClinicID}
        ClinicUserID={ClinicUserID}
        ActiveReceptionID={ActiveReceptionID}
        show={showPaymentModal}
        setShowPaymentModal={setShowPaymentModal}
        ApplyCashDeskActions={ApplyCashDeskActions}
        returnMode={returnMode}
        setReturnMode={setReturnMode}
        cashMode={cashMode}
        calculatedTotalPC={calculatedTotalPC}
        paymentData={paymentData}
      />
    </>
  );
};

export default CashDeskActions;

// calculate functionality
// const handleCalculateCost = (e) => {
//   const { name, value } = e.target;
//   let result = 0;
//   let _CalCart = parseInt($("#cartPayment").val()) || 0;
//   let _CalCash = parseInt($("#cashPayment").val()) || 0;

//   if (name === "cartPayment" || name === "cashPayment") {
//     if (name === "cartPayment") _CalCart = value;
//     if (name === "cashPayment") _CalCash = value;
//     let payment = parseInt(_CalCart) + parseInt(_CalCash);
//     result = calculatedTotalPC - payment;
//     if (result < 0) {
//       $("#debt").val("0");
//       $("#returnPayment").val(result);
//     } else {
//       $("#debt").val(result);
//       $("#returnPayment").val(0);
//     }
//   } else {
//     let _CalDebt = 0;
//     let _CalReturn = 0;
//     if (name === "debt") {
//       _CalDebt = value;
//       result = calculatedTotalPC - _CalDebt;
//       if (result < 0) result = 0;
//       $("#cartPayment").val(result);
//       $("#returnPayment").val(0);
//     }

//     if (name === "returnPayment") _CalReturn = value;
//   }
// };
