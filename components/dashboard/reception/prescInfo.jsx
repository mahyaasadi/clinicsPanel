import { useState, useEffect } from "react";

let totalQty = 0;
let totalPrice = 0;
let totalPatientCost = 0;
let totalOrgCost = 0;
let itemTotalPrice = 0;
let totalDiscount = 0;

const PrescInfo = ({ data }) => {
  console.log({ data });

  const [totalQty, setTotalQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    let qty = 0;
    let price = 0;

    data.forEach((srvItem) => {
      const itemQty = parseInt(srvItem.Qty);
      const itemPrice = parseInt(srvItem.Price);
      const itemTotalPrice = itemQty * itemPrice;

      qty += itemQty;
      price += itemTotalPrice;
    });

    setTotalQty(qty);
    setTotalPrice(price);
  }, [data]);

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="prescript-header d-flex gap-2 align-items-center justify-between">
            <div className="">
              <p className="text-secondary fw-bold">اطلاعات نسخه</p>
            </div>
            <button
              className="btn btn-primary border-radius px-4 font-13"
              //   onClick={}
            >
              ثبت پذیرش
            </button>
          </div>

          <hr />

          <div className="row text-secondary font-12">
            <div className="col ">
              <p className="">تعداد کل : {totalQty}</p>
              <p className="">میزان پرداختی کل : {totalPrice}</p>
            </div>
            <div className="col ">سهم سازمان : </div>
            <div className="col">
              <p className="">سهم بیمار : </p>
              <p className="">میزان تخفیف : </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrescInfo;
