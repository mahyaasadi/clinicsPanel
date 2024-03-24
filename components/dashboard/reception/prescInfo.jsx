import FeatherIcon from "feather-icons-react";
import { Skeleton } from "primereact/skeleton";

const calculateDiscount = (srvItem, totalPatientCost) => {
  if (srvItem.Discount?.Percent) {
    return (totalPatientCost * parseInt(srvItem.Discount?.Value)) / 100;
  } else if (srvItem.Discount?.Percent === false) {
    return srvItem.Qty * parseInt(srvItem.Discount?.Value);
  }
  return 0;
};

const PrescInfo = ({
  data,
  isLoading,
  openAdditionalCostsModal,
  openWarehouseReceptionModal,
  submitReceptionPrescript,
  depIsLoading
}) => {
  let qty = 0;
  let price = 0;
  let oc = 0;
  let discount = 0;
  let patientCost = 0;

  data.forEach((srvItem) => {
    const itemQty = parseInt(srvItem.Qty);
    const itemPrice = parseInt(srvItem.Price);
    const itemOC = parseInt(srvItem.OC);

    const itemTotalPrice = itemQty * itemPrice;
    const itemTotalOC = itemQty * itemOC;
    let totalPatientCost = itemTotalPrice - itemTotalOC;
    const itemDiscount = calculateDiscount(srvItem, totalPatientCost);
    totalPatientCost -= itemDiscount;

    qty += itemQty;
    price += itemTotalPrice;
    oc += itemTotalOC;
    patientCost += totalPatientCost;
    discount += itemDiscount;
  });

  return (
    <>
      {!depIsLoading ? (
        <div className="card shadow-sm mb-0">
          <div className="card-body">
            <div className="d-flex gap-3 align-items-center justify-between prescDetails">
              <div>
                <p className="text-secondary font-14 fw-bold">اطلاعات پذیرش</p>
              </div>

              {!isLoading ? (
                <div className="d-flex gap-2">
                  <div className="btn-group prescInfoBtnContainer " role="group">
                    <button
                      type="button"
                      className="btn prescInfoBtn font-13 text-secondary fw-bold border-left px-3 d-flex align-items-center gap-2"
                      onClick={() => openAdditionalCostsModal(true)}
                    >
                      <FeatherIcon
                        icon="plus-circle"
                        style={{ width: "15px", height: "15px" }}
                      />
                      افزودن هزینه
                    </button>

                    <button
                      type="button"
                      className="btn prescInfoBtn font-13 text-secondary fw-bold px-3 d-flex align-items-center gap-2"
                      onClick={() => openWarehouseReceptionModal(true, [])}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2px"
                        style={{ width: "15px", height: "15px" }}
                      >
                        <defs></defs>
                        <title />
                        <path
                          className="a"
                          d="M.749,16.5H16.707a1.5,1.5,0,0,0,1.484-1.277L20.058,2.777A1.5,1.5,0,0,1,21.541,1.5h1.708"
                        />
                        <rect
                          className="a"
                          height="6"
                          rx="0.75"
                          ry="0.75"
                          width="6"
                          x="2.249"
                          y="7.5"
                        />
                        <rect
                          className="a"
                          height="9"
                          rx="0.75"
                          ry="0.75"
                          width="7.5"
                          x="8.249"
                          y="4.5"
                        />
                        <circle className="a" cx="4.124" cy="20.625" r="1.875" />
                        <circle className="a" cx="14.624" cy="20.625" r="1.875" />
                      </svg>
                      دسترسی به انبار
                    </button>
                  </div>
                  <div>
                    <button
                      className="btn btn-primary border-radius px-4 font-13 w-100"
                      onClick={() =>
                        submitReceptionPrescript(
                          qty,
                          price,
                          oc,
                          patientCost,
                          discount
                        )
                      }
                    >
                      ثبت پذیرش
                    </button>
                  </div>
                </div>
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

            <hr />

            <div className="row text-secondary font-13 fw-bold prescDetails">
              <div className="col">
                <p>تعداد کل : {qty}</p>
                <p>جمع کل : {price?.toLocaleString()}</p>
              </div>

              <div className="col">
                <p>سهم سازمان : {oc.toLocaleString()}</p>
                <p>سهم بیمار : {patientCost.toLocaleString()}</p>
              </div>

              <div className="col">
                <p>میزان تخفیف : {discount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="prescInfoSkeleton">
          <Skeleton></Skeleton>
        </div>
      )}
    </>
  );
};

export default PrescInfo;
