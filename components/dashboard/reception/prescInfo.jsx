import { useState, useEffect } from "react";

const PrescInfo = ({ data, ActiveInsuranceType }) => {
  const [totalQty, setTotalQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalOrgCost, setTotalOrgCost] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

  useEffect(() => {
    // console.log({ data });
    let qty = 0;
    let price = 0;
    let oc = 0;
    let discount = 0;

    data.forEach((srvItem) => {
      console.log({ srvItem });
      const itemQty = parseInt(srvItem.Qty);
      const itemPrice = parseInt(srvItem.Price);
      const itemOC = parseInt(srvItem.OC);
      const itemDiscount = srvItem.DiscountValue
        ? parseInt(srvItem.DiscountValue)
        : 0;

      const itemTotalPrice = itemQty * itemPrice;
      const itemTotalOC = itemQty * itemOC;
      const itemTotalDiscount = itemQty * itemDiscount;

      qty += itemQty;
      price += itemTotalPrice;
      oc += itemTotalOC;
      discount += itemDiscount;
    });

    setTotalQty(qty);
    setTotalPrice(price);
    setTotalOrgCost(oc);
    setTotalDiscount(discount);
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
              <p className="">سهم سازمان : {totalOrgCost}</p>
              <p className="">
                سهم بیمار :{" "}
                {/* {(
                  totalPrice -
                  `${
                    ActiveInsuranceType === "1"
                      ? totalSalamatShare
                      : ActiveInsuranceType === "2"
                      ? totalTaminShare
                      : ActiveInsuranceType === "3"
                      ? totalArteshShare
                      : ""
                  }`
                )?.toLocaleString()}{" "} */}
              </p>
            </div>

            {/* {totalDiscount !== 0 && ( */}
            <div className="col">
              <p className="">میزان تخفیف : {totalDiscount}</p>
            </div>
            {/* )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default PrescInfo;
