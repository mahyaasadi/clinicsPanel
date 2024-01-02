import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";
import { Dropdown } from "primereact/dropdown";
import ApplyDiscountModal from "components/dashboard/discounts/applyManualDiscountModal";

const AddItem = ({
  srv,
  discountsList,
  applyDiscount,
  handleEditService,
  deleteService,
  removeDiscount,
  openDiscountModal,
  discountCost,
  setDiscountCost,
  selectedDiscount,
  FUSelectDiscountPercent,
  submitManualDiscount,
}) => {
  let RowTotalPrice = srv.Price * srv.Qty;
  let OrgTotalCost = srv.OC * srv.Qty;
  let PatientCost = RowTotalPrice - OrgTotalCost;
  let DiscountValue = 0;

  if (srv.Discount) {
    if (srv.Discount.Percent) {
      DiscountValue = (PatientCost * parseInt(srv.Discount.Value)) / 100;
    } else {
      DiscountValue = srv.Qty * parseInt(srv.Discount.Value);
    }
    PatientCost = RowTotalPrice - (OrgTotalCost + DiscountValue);
  }

  return (
    <>
      <div dir="rtl" key={srv._id} className="card shadow-sm mb-1">
        <div className="card-body font-13 receptionInfoText">
          <div className="d-flex gap-1 align-items-center justify-between">
            <div className="d-flex gap-2">
              <p className="mb-0">{srv.Code}</p>
              <p className="mb-0">|</p>
              <p>{srv.Name}</p>
            </div>

            <div className="d-flex gap-2 justify-end">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary editBtn height-27"
                data-pr-position="top"
                onClick={() => handleEditService(srv)}
              >
                <Tooltip target=".editBtn">ویرایش</Tooltip>
                <FeatherIcon icon="edit-2" className="prescItembtns" />
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline-primary dicountBtn height-27"
                onClick={openDiscountModal}
                data-pr-position="top"
              >
                <Tooltip target=".dicountBtn">اعمال تخفیف</Tooltip>
                <FeatherIcon icon="credit-card" className="prescItembtns" />
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline-danger removeBtn height-27"
                onClick={() => deleteService(srv._id)}
                data-pr-position="top"
              >
                <Tooltip target=".removeBtn">حذف</Tooltip>
                <FeatherIcon icon="trash" className="prescItembtns" />
              </button>
            </div>
          </div>

          <div className="row">
            <div className="d-flex mt-2 gap-1 flex-wrap text-secondary font-11">
              <div className="d-flex">
                <div>{srv.Qty} عدد</div>
              </div>

              <div className="vertical-line"></div>
              <div className="d-flex paddingR-5">
                قیمت واحد : {srv.Price.toLocaleString()}
                <div className="vertical-line"></div>
                <p className="paddingR-5">
                  قیمت کل : {RowTotalPrice.toLocaleString()}
                </p>
              </div>

              <div className="vertical-line"></div>
              <div className="d-flex">
                <div className="paddingR-5">
                  سهم سازمان :{OrgTotalCost.toLocaleString()}
                </div>
              </div>

              <div className="vertical-line"></div>
              <div className="d-flex">
                <div className="paddingR-5">
                  سهم بیمار :{PatientCost.toLocaleString()}
                </div>
              </div>

              {DiscountValue === 0 ? (
                ""
              ) : (
                <>
                  <div>
                    <div className="paddingR-5 discountContainer">
                      میزان تخفیف : {DiscountValue.toLocaleString()}
                      <button
                        className="btn removeDiscountBtn tooltip-button"
                        type="button"
                        data-pr-position="top"
                        onClick={() => removeDiscount(srv._id)}
                      >
                        <FeatherIcon
                          className="removeDiscountIcon"
                          icon="x-circle"
                        />
                        <Tooltip target=".removeDiscountBtn">حذف تخفیف</Tooltip>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {srv.Des ? (
            <>
              <hr />
              <div className="text-secondary font-11">توضیحات : {srv.Des}</div>
            </>
          ) : (
            ""
          )}
        </div>

        <ApplyDiscountModal
          srv={srv}
          discountCost={discountCost}
          setDiscountCost={setDiscountCost}
          discountsList={discountsList}
          applyDiscount={applyDiscount}
          selectedDiscount={selectedDiscount}
          FUSelectDiscountPercent={FUSelectDiscountPercent}
          submitManualDiscount={submitManualDiscount}
        />
      </div>
    </>
  );
};

export default AddItem;
