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
}) => {
  console.log({ data });

  let calculatedTotalPC = 0;

  const [paymentData, setPaymentData] = useState([]);
  const [debtPayment, setDebtPayment] = useState(0);
  const [cashPayment, setCashPayment] = useState(
    paymentData?.CashPayment || 0
  );
  const [cartPayment, setCartPayment] = useState(
    paymentData?.CartPayment || 0
  );

  const handleCalculateCost = (e) => {
    const { name, value } = e.target;
    const floatValue = parseFloat(value) || 0;

    if (name === "cashPayment") {
      const newCashPayment = calculatedTotalPC - floatValue - parseFloat(cartPayment) || 0;
      setCashPayment(value);
      setDebtPayment(newCashPayment < 0 ? Math.abs(newCashPayment) : 0);
    } else if (name === "cartPayment") {
      const newCartPayment = calculatedTotalPC - parseFloat(cashPayment) - floatValue || 0;
      setCartPayment(value);
      setDebtPayment(newCartPayment < 0 ? Math.abs(newCartPayment) : 0);
    } else if (name === "debt") {
      const newDebtValue = parseFloat(value) || 0;
      setDebtPayment(newDebtValue);
      setCashPayment(calculatedTotalPC - newDebtValue - parseFloat(cartPayment) || 0);
      setCartPayment(calculatedTotalPC - parseFloat(cashPayment) - newDebtValue || 0);
      return;
    }

    console.log({ cashPayment, cartPayment });
    setDebtPayment(calculatedTotalPC - cashPayment - cartPayment || 0);
    console.log({ debtPayment });

  };

  useEffect(() => {
    setPaymentData(data?.CashDesk)
    console.log({ paymentData });
  }, [data])

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
            <div className="row">
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
                <label className="lblAbs font-12">مبلغ پرداخت نقدی</label>
                <input
                  type="text"
                  dir="ltr"
                  className="form-control floating inputPadding rounded text-secondary"
                  name="cashPayment"
                  onChange={handleCalculateCost}
                  value={cashPayment.toLocaleString()}
                />
              </div>

              <div className="form-group col-lg-6 col-12">
                <label className="lblAbs font-12">مبلغ پرداخت با کارت</label>
                <input
                  type="text"
                  dir="ltr"
                  className="form-control floating inputPadding rounded text-secondary"
                  name="cartPayment"
                  onChange={handleCalculateCost}
                  value={cartPayment.toLocaleString()}
                // defaultValue={calculatedTotalPC}
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
                  name="debt"
                  onChange={handleCalculateCost}
                  value={debtPayment.toLocaleString()}
                />
              </div>

              <div className="form-group col-lg-6 col-12">
                <label className="lblAbs font-12">مبلغ عودت</label>
                <input
                  type="text"
                  dir="ltr"
                  className="form-control floating inputPadding rounded text-secondary"
                  name="returnPayment"
                // onChange={handleCalculateCost}
                // value={data?.CashDesk?.ReturnPayment}
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
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CashDeskActions;
