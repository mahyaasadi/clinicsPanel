import Image from "next/image";
import { Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";

const PrintContent = ({
  data,
  paymentData,
  calculatedTotalPC,
  calculateDiscount,
  show,
  onHide,
}) => {
  return (
    <>
      <Modal show={show} onHide={onHide} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="row p-2 text-secondary font-14 fw-bold margin-right-sm">
              نام بیمار : {data?.Patient?.Name} {" | "}
              تاریخ نسخه : {data?.Date}
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
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
                {paymentData?.Debt
                  ? parseInt(paymentData?.Debt).toLocaleString()
                  : 0}
              </div>
            </div>

            <div className="col-lg-3 col-12">
              <label className="lblAbs font-12">مبلغ عودت</label>
              <div
                dir="ltr"
                className="form-control floating rounded text-secondary"
              >
                {paymentData?.ReturnPayment
                  ? parseInt(paymentData?.ReturnPayment).toLocaleString()
                  : 0}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PrintContent;
