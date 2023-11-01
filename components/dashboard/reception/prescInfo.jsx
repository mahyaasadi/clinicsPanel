import { useState, useEffect } from "react";

const PrescInfo = ({ data, ActiveInsuranceType }) => {
  const [totalQty, setTotalQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalSalamatShare, setTotalSalamatShare] = useState(0);
  const [totalTaminShare, setTotalTaminShare] = useState(0);
  const [totalArteshShare, setTotalArteshShare] = useState(0);

  useEffect(() => {
    let qty = 0;
    let price = 0;
    let ss = 0;
    let st = 0;
    let sa = 0;

    data.forEach((srvItem) => {
      const itemQty = parseInt(srvItem.Qty);
      const itemPrice = parseInt(srvItem.Price);
      const itemSS = parseInt(srvItem.SS);
      const itemST = parseInt(srvItem.ST);
      const itemSA = parseInt(srvItem.SA);

      const itemTotalPrice = itemQty * itemPrice;
      const itemTotalSS = itemQty * itemSS;
      const itemTotalST = itemQty * itemST;
      const itemTotalSA = itemQty * itemSA;

      qty += itemQty;
      price += itemTotalPrice;
      ss += itemTotalSS;
      st += itemTotalST;
      sa += itemTotalSA;
    });

    setTotalQty(qty);
    setTotalPrice(price);
    setTotalSalamatShare(ss);
    setTotalTaminShare(st);
    setTotalArteshShare(sa);
  }, [data]);

  return (
    <>
      <div className="card mb-0">
        <div className="card-body">
          <div className="d-flex gap-2 align-items-center justify-between">
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
              <p className="">
                سهم سازمان :{" "}
                {ActiveInsuranceType === "1"
                  ? totalSalamatShare?.toLocaleString()
                  : ActiveInsuranceType === "2"
                  ? totalTaminShare?.toLocaleString()
                  : ActiveInsuranceType === "3"
                  ? totalArteshShare?.toLocaleString()
                  : ""}
              </p>
              <p className="">
                سهم بیمار :{" "}
                {(
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
                )?.toLocaleString()}{" "}
              </p>
            </div>

            <div className="col">
              <p className="">میزان تخفیف : </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrescInfo;
