import { Modal } from "react-bootstrap";
import { Dropdown } from "primereact/dropdown";
import { Tooltip } from "primereact/tooltip";
import selectfieldColourStyles from "class/selectfieldStyle";
import SelectField from "components/commonComponents/selectfield";
import discountPercentDataClass from "class/discountPercentDataClass";

const ApplyDiscountModal = ({
  srv,
  show,
  onHide,
  discountCost,
  setDiscountCost,
  discountsList,
  applyDiscount,
  selectedDiscount,
  FUSelectDiscountPercent,
  submitManualDiscount,
}) => {
  // const handleDiscountChange = (event) => {
  //   const rawValue = event.target.value.replace(/,/g, "");
  //   const parsedValue = parseFloat(rawValue);

  //   if (!isNaN(parsedValue)) {
  //     setDiscountCost(parsedValue);
  //   } else {
  //     setDiscountCost("");
  //   }

  //   console.log(event.target.value);
  // };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-0 text-secondary font-14 fw-bold">اعمال تخفیف</p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={submitManualDiscount}>
            <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded font-13">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  href="#solid-rounded-tab1"
                  data-bs-toggle="tab"
                >
                  انتخاب تخفیف
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#solid-rounded-tab2"
                  data-bs-toggle="tab"
                >
                  وارد کردن تخفیف
                </a>
              </li>
            </ul>

            <div className="tab-content">
              <div className="tab-pane show active" id="solid-rounded-tab1">
                <label className="lblAbs font-12">مورد تخفیف</label>

                <div data-pr-position="top">
                  <Dropdown
                    value={selectedDiscount}
                    onChange={(e) => applyDiscount(srv._id, e.value, e)}
                    options={discountsList}
                    optionLabel="Name"
                    placeholder="انتخاب نمایید"
                  />
                </div>
              </div>

              <div className="tab-pane" id="solid-rounded-tab2">
                <div className="form-group">
                  <label className="lblAbs font-12">توضیحات</label>
                  <input
                    type="text"
                    className="form-control floating inputPadding rounded"
                    name="receptionDiscountDes"
                  />
                </div>

                <div className="form-group">
                  <label className="lblAbs font-12">
                    مبلغ / درصد تخفیف <span className="text-danger">*</span>
                  </label>
                  <input
                    dir="ltr"
                    type="text"
                    className="form-control floating inputPadding rounded"
                    name="receptionDiscountValue"
                  />
                </div>

                <div className="col media-w-100 font-12">
                  <label className="lblDrugIns font-12">
                    روش محاسبه <span className="text-danger">*</span>
                  </label>

                  <SelectField
                    styles={selectfieldColourStyles}
                    options={discountPercentDataClass}
                    label={true}
                    className="text-center"
                    placeholder={"روش محاسبه را انتخاب کنید"}
                    required
                    name="receptionDiscountOptions"
                    onChange={(e) => FUSelectDiscountPercent(srv._id, e?.value)}
                  />
                </div>
              </div>
            </div>

            <div className="submit-section">
              <button
                type="submit"
                className="btn btn-sm btn-primary rounded btn-save font-13"
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

export default ApplyDiscountModal;
