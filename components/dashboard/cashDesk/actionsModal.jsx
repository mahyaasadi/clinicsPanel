import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Dropdown } from "primereact/dropdown";

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
}) => {
  console.log({ data });
  console.log({ paymentData });

  // let CalCart = 0;
  // let CalCash = 0;
  // let CalDebt = 0;
  // let CalReturn = 0;
  let calculatedTotalPC = 0;

  // const [debtPayment, setDebtPayment] = useState(0);
  // const [cashPayment, setCashPayment] = useState(paymentData?.CashPayment || 0);
  // const [cartPayment, setCartPayment] = useState(paymentData?.CartPayment || 0);
  // const [returnPayment, setReturnPayment] = useState(0);

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
      console.log(_CalCash);
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

  // const handleCalculateCost = (e) => {
  //   const { name, value } = e.target;
  //   const floatValue = value || 0;

  //   if (name === "cashPayment") {
  //     const newCashPayment = calculatedTotalPC - floatValue - cartPayment || 0;
  //     setCashPayment(floatValue);
  //     // setDebtPayment(
  //     //   newCashPayment < 0
  //     //     ? Math.abs(newCashPayment)
  //     //     : calculatedTotalPC - cashPayment
  //     // );
  //     setDebtPayment(
  //       newCashPayment < 0
  //         ? Math.abs(newCashPayment)
  //         : calculatedTotalPC - floatValue
  //     );
  //   } else if (name === "cartPayment") {
  //     const newCartPayment = calculatedTotalPC - cashPayment - floatValue || 0;
  //     setCartPayment(floatValue);
  //     // setDebtPayment(newCartPayment < 0 ? Math.abs(newCartPayment) : 0);
  //     setDebtPayment(
  //       newCartPayment < 0
  //         ? Math.abs(newCartPayment)
  //         : calculatedTotalPC - floatValue
  //     );
  //   } else if (name === "debt") {
  //     const newDebtValue = floatValue || 0;
  //     setDebtPayment(newDebtValue);
  //     setCashPayment(calculatedTotalPC - newDebtValue - cartPayment || 0);
  //     setCartPayment(calculatedTotalPC - cashPayment - newDebtValue || 0);
  //     return;
  //   }
  // };

  // useEffect(() => {
  //   const totalPayments = parseFloat(cashPayment) + parseFloat(cartPayment);
  //   const remainingPayment = calculatedTotalPC - totalPayments;
  //   const returnPaymentValue = remainingPayment < 0 ? remainingPayment : 0;

  //   console.log({
  //     calculatedTotalPC,
  //     totalPayments,
  //     remainingPayment,
  //   });

  //   setReturnPayment(returnPaymentValue);

  //   if (returnPaymentValue) {
  //     setDebtPayment(0);
  //   } else {
  //     setDebtPayment(
  //       calculatedTotalPC - parseFloat(cashPayment) - parseFloat(cartPayment) ||
  //         0
  //     );
  //   }

  //   console.log({
  //     cashPayment,
  //     cartPayment,
  //     calculatedTotalPC,
  //     debtPayment,
  //     returnPayment,
  //   });
  // }, [cashPayment, cartPayment, calculatedTotalPC, debtPayment, returnPayment]);

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-0 text-secondary font-14 fw-bold">
              وضعیت پرداخت ها
            </p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={applyCashDeskActions}>
            {/* <div className="row">
              <div className="cashDeskPatientInfo text-center rounded text-secondary col-lg-4 font-13">
                نام بیمار : {data?.Patient?.Name}
              </div>
              <div className="cashDeskPatientInfo text-center rounded text-secondary col-lg-4 font-13">
                پزشک ارجاع دهنده : {data?.RefDoc?.FullName}
              </div>
              <div className="cashDeskPatientInfo text-center rounded text-secondary col-lg-4 font-13">
                تاریخ نسخه : {data?.Date}
              </div>
            </div>

            <div className="table-responsive">
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
                        <td>{RowPatientCost}</td>
                        <td>{RowOrgCost.toLocaleString()}</td>
                        <td>{RowTotalDiscount}</td>
                      </tr>
                    );
                  })}

                  {data?.Calculated?.map(
                    (x) => (
                      (calculatedTotalPC = x.TotalPC),
                      (
                        <>
                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{x.TotalQty?.toLocaleString()}</td>
                            <td>{x.TotalPrice?.toLocaleString()}</td>
                            <td>{x.TotalPC?.toLocaleString()}</td>
                            <td>{x.TotalOC?.toLocaleString()}</td>
                            <td>{x.TotalDiscount?.toLocaleString()}</td>
                          </tr>
                        </>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>

            <hr className="marginb-1 margint-3" />

            <div className="row margint-3">
              <div className="form-group col-lg-6 col-12">
                <label className="lblAbs font-12">مبلغ پرداخت با کارت</label>
                <input
                  type="text"
                  dir="ltr"
                  id="cartPayment"
                  className="form-control floating inputPadding rounded text-secondary"
                  name="cartPayment"
                  onChange={handleCalculateCost}
                  defaultValue={
                    paymentData?.CartPayment
                      ? paymentData.CartPayment.toLocaleString()
                      : calculatedTotalPC
                  }
                />
              </div>
              <div className="form-group col-lg-6 col-12">
                <label className="lblAbs font-12">مبلغ پرداخت نقدی</label>
                <input
                  type="text"
                  dir="ltr"
                  className="form-control floating inputPadding rounded text-secondary"
                  id="cashPayment"
                  name="cashPayment"
                  onChange={handleCalculateCost}
                  defaultValue={
                    paymentData?.CashPayment
                      ? paymentData?.CashPayment.toLocaleString()
                      : 0
                  }
                />
              </div>
            </div>

            <div className="row">
              <div className="form-group col-lg-6 col-12">
                <label className="lblAbs font-12">مبلغ بدهی</label>
                <input
                  type="text"
                  dir="ltr"
                  className="form-control floating inputPadding rounded text-secondary"
                  id="debt"
                  name="debt"
                  onChange={handleCalculateCost}
                  defaultValue={
                    paymentData?.Debt ? paymentData?.Debt.toLocaleString() : 0
                  }
                />
              </div>

              <div className="form-group col-lg-6 col-12">
                <label className="lblAbs font-12">مبلغ عودت</label>
                <input
                  type="text"
                  dir="ltr"
                  className="form-control floating inputPadding rounded text-secondary"
                  id="returnPayment"
                  name="returnPayment"
                  onChange={handleCalculateCost}
                  defaultValue={
                    paymentData?.ReturnPayment ? paymentData?.ReturnPayment : 0
                  }
                />
              </div>
            </div>

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

            <div className="submit-section">
              <button
                type="submit"
                className="btn btn-primary rounded btn-save font-13"
              >
                ثبت
              </button>
            </div> */}
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CashDeskActions;
