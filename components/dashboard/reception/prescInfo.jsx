import AdditionalCostsModal from "@/components/dashboard/reception/additionalCostsModal";

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
  submitReceptionPrescript,
  isLoading,
  mode,
  show,
  onHide,
  openAdditionalCostsModal,
  submitAdditionalCosts,
  additionalCost,
  setAdditionalCost,
  editSrvData,
  editAdditionalCost,
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
      <div className="card mb-0">
        <div className="card-body">
          <div className="d-flex gap-3 align-items-center justify-between prescDetails">
            <div>
              <p className="text-secondary fw-bold">اطلاعات پذیرش</p>
            </div>

            {!isLoading ? (
              <div className="d-flex gap-2">
                <div>
                  <button
                    className="btn btn-outline-secondary border-radius px-4 font-13 w-100"
                    onClick={() => openAdditionalCostsModal(true)}
                  >
                    افزودن هزینه
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

        <AdditionalCostsModal
          show={show}
          onHide={onHide}
          onSubmit={!mode ? submitAdditionalCosts : editAdditionalCost}
          mode={mode}
          additionalCost={additionalCost}
          setAdditionalCost={setAdditionalCost}
          editSrvData={editSrvData}
        />
      </div>
    </>
  );
};

export default PrescInfo;
