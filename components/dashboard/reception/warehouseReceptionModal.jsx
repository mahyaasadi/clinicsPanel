import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Dropdown } from "primereact/dropdown";
import { convertToLocaleString } from "utils/convertToLocaleString";

let warehouseItemCode = 200000;
const WarehouseReceptionModal = ({
  show,
  onHide,
  mode,
  warehouseItemsData,
  ActiveModalityID,
  addedSrvItems,
  setAddedSrvItems,
  editSrvData,
  editWarehouseReceptionItem,
}) => {
  const [selectedWItem, setSelectedWItem] = useState(null);
  const [WItemCost, setWItemCost] = useState(0);

  const FUSelectWItem = (WItem) => setSelectedWItem(WItem);

  const QtyChange = (ac, e) => {
    e.stopPropagation();
    let qty = $("#warehouseItemQty").val();

    qty = parseInt(qty);
    if (ac == "+") {
      qty = qty + 1;
    } else {
      if (qty != 1) {
        qty = qty - 1;
      }
    }
    $("#warehouseItemQty").val(qty);
  };

  const submitWarehouseItem = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let data = {
      _id: selectedWItem._id,
      Code: warehouseItemCode++,
      Name: selectedWItem.Name,
      Qty: formProps.warehouseItemQty,
      Price: WItemCost,
      OC: 0,
      Discount: 0,
      ModalityID: ActiveModalityID,
    };

    e.target.reset();
    setWItemCost(0);
    setSelectedWItem(null);
    setAddedSrvItems([...addedSrvItems, data]);
    onHide();
  };

  const foundItem = warehouseItemsData.find(
    (item) => item.Name === editSrvData.Name
  );

  const _editWarehouseReceptionItem = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let data = {
      _id: editSrvData._id,
      Code: editSrvData.Code,
      Name: editSrvData.Name,
      Qty: formProps.warehouseItemQty,
      Price: WItemCost ? WItemCost : editSrvData.Price,
      OC: 0,
      Discount: 0,
      ModalityID: ActiveModalityID,
    };

    console.log({ data });

    editWarehouseReceptionItem(editSrvData._id, data, foundItem._id);
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header>
          <Modal.Title>
            <p className="mb-0 text-secondary font-13 fw-bold">
              {mode ? "افزودن کالا از انبار" : "ویرایش اطلاعات"}{" "}
              {!mode && (
                <>
                  {"| "} {editSrvData.Name}
                </>
              )}
            </p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form
            onSubmit={mode ? submitWarehouseItem : _editWarehouseReceptionItem}
          >
            <input
              type="hidden"
              name="WItemCode"
              value={!mode ? editSrvData.Code : ""}
            />
            <input
              type="hidden"
              name="WItemID"
              value={!mode ? editSrvData._id : ""}
            />

            {mode && (
              <>
                <label className="lblAbs font-12">انتخاب کالا</label>
                <Dropdown
                  value={selectedWItem}
                  onChange={(e) => FUSelectWItem(e.target.value)}
                  options={warehouseItemsData}
                  optionLabel="Name"
                  placeholder="انتخاب کنید"
                  filter
                  showClear
                  disabled={!mode}
                />
              </>
            )}

            <div className="my-3">
              <label className="lblAbs margin-top-left font-12">تعداد</label>
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={(e) => QtyChange("+", e)}
                  >
                    <i className="fe fe-plus"></i>
                  </button>
                </div>
                <div className="col p-0">
                  <input
                    type="text"
                    className="form-control text-center rounded"
                    id="warehouseItemQty"
                    name="warehouseItemQty"
                    dir="ltr"
                    defaultValue={!mode ? editSrvData.Qty : "1"}
                  />
                </div>
                <div className="col-auto">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={(e) => QtyChange("-", e)}
                  >
                    <i className="fe fe-minus"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="lblAbs font-12">هزینه واحد (ریال)</label>
              <input
                dir="ltr"
                type="text"
                className="form-control floating inputPadding rounded"
                name="additionalSrvCost"
                value={
                  WItemCost !== 0
                    ? WItemCost.toLocaleString()
                    : editSrvData?.Price?.toLocaleString()
                }
                defaultValue={!mode ? editSrvData.Price : 0}
                onChange={(e) => convertToLocaleString(e, setWItemCost)}
              />
            </div>

            <div className="submit-section">
              <button
                type="submit"
                className="btn btn-primary rounded btn-save font-13"
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

export default WarehouseReceptionModal;
