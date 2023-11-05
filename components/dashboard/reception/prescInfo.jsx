import { useState, useEffect } from "react";

const calculateDiscount = (srvItem) => {
  if (srvItem.Discount?.Percent) {
    return (srvItem.Price * parseInt(srvItem.Discount?.Value) / 100);
  } else if (srvItem.Discount?.Percent === false) {
    return parseInt(srvItem.Discount?.Value);
  }
  return 0;
};

const PrescInfo = ({ data }) => {
  const [totalQty, setTotalQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalOrgCost, setTotalOrgCost] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [patientTotalCost, setPatientTotalCost] = useState(0)

  useEffect(() => {
    let qty = 0;
    let price = 0;
    let oc = 0;
    let discount = 0;
    let patientCost = 0

    data.forEach((srvItem) => {
      const itemQty = parseInt(srvItem.Qty);
      const itemPrice = parseInt(srvItem.Price);
      const itemOC = parseInt(srvItem.OC);
      const itemDiscount = calculateDiscount(srvItem);

      const itemTotalPrice = itemQty * itemPrice;
      const itemTotalOC = itemQty * itemOC;
      const itemTotalDiscount = itemQty * itemDiscount;
      const totalPatientCost = itemTotalPrice - itemTotalOC - itemDiscount

      qty += itemQty;
      price += itemTotalPrice;
      oc += itemTotalOC;
      patientCost += totalPatientCost
      discount += itemTotalDiscount;
    });

    setTotalQty(qty);
    setTotalPrice(price);
    setTotalOrgCost(oc);
    setTotalDiscount(discount);
    setPatientTotalCost(patientCost)
  }, [data]);

  return (
    <>
      <div className="card mb-0">
        <div className="card-body">
          <div className="d-flex gap-2 align-items-center justify-between ">
            <div className="">
              <p className="text-secondary fw-bold">اطلاعات پذیرش</p>
            </div>
            <button
              className="btn btn-primary border-radius px-4 font-13"
            //   onClick={}
            >
              ثبت پذیرش
            </button>
          </div>

          <hr />

          <div className="row text-secondary font-13 fw-bold">
            <div className="col ">
              <p className="">تعداد کل : {totalQty}</p>
              <p className="">جمع کل : {totalPrice?.toLocaleString()}</p>
            </div>

            <div className="col">
              <p className="">سهم سازمان : {totalOrgCost.toLocaleString()}</p>
              <p className="">
                سهم بیمار : {patientTotalCost.toLocaleString()}
              </p>
            </div>

            {/* {totalDiscount !== 0 && ( */}
            <div className="col">
              <p className="">میزان تخفیف : {totalDiscount.toLocaleString()}</p>
            </div>
            {/* )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default PrescInfo;
