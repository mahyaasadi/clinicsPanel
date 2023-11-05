import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";
import { Dropdown } from "primereact/dropdown";

const Item = ({ srv, discountsList, applyDiscount }) => {
  let RowTotalPrice = srv.Price * srv.Qty;
  let OrgTotalCost = srv.OC * srv.Qty;
  let PatientCost = RowTotalPrice - OrgTotalCost;
  let Discount = 0;

  if (srv.Discount) {
    if (srv.Discount.Percent) {
      Discount = (RowTotalPrice * srv.Discount.Value) / 100;
    } else {
      Discount = parseInt(srv.Discount.Value);
    }
    PatientCost = RowTotalPrice - (srv.OC + Discount);
  }

  return (
    <>
      <div dir="rtl" key={srv._id} className="card mb-1">
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
                className="btn btn-sm btn-outline-secondary editBtn height-30"
                data-pr-position="top"
                onClick={() => handleEditService(srv)}
              >
                <Tooltip target=".editBtn">ویرایش</Tooltip>
                <FeatherIcon icon="edit-2" className="prescItembtns" />
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline-danger removeBtn height-30"
                //   onClick={() => _DeleteService(srv.SrvCode, srv.prescId)}
                data-pr-position="top"
              >
                <Tooltip target=".removeBtn">حذف</Tooltip>
                <FeatherIcon icon="trash" className="prescItembtns" />
              </button>

              <div
                className={`discountOptions receptionPage`}
                data-pr-position="top"
              >
                <Dropdown
                  onChange={(e) => applyDiscount(srv._id, e.value, Discount)}
                  options={discountsList}
                  optionLabel="Name"
                />
                <Tooltip target=".discountOptions">سایر موارد</Tooltip>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="d-flex mt-2 gap-1 flex-wrap text-secondary font-11">
              <div className="d-flex">
                <div className="">{srv.Qty} عدد</div>
              </div>

              <div className="vertical-line"></div>
              <div className="d-flex paddingR-5">
                قیمت واحد : {srv.Price}
                <div className="vertical-line"></div>
                <p className="paddingR-5">قیمت کل : {RowTotalPrice}</p>
              </div>

              <div className="vertical-line"></div>
              <div className="d-flex">
                <div className="paddingR-5">سهم سازمان :{OrgTotalCost}</div>
              </div>

              <div className="vertical-line"></div>
              <div className="d-flex">
                <div className="paddingR-5">سهم بیمار :{PatientCost}</div>
              </div>

              {Discount !== 0 && (
                <>
                  <div className="vertical-line"></div>
                  <div className="d-flex">
                    <div className="paddingR-5">میزان تخفیف : {Discount}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Item;
