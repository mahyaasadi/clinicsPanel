import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Dropdown } from "primereact/dropdown";
import { axiosClient } from "class/axiosConfig";
import { convertToLocaleString } from "utils/convertToLocaleString";

const WarehouseReceptionModal = ({
  show,
  onHide,
  mode,
  ClinicID,
  ActiveModalityID,
  addedSrvItems,
  setAddedSrvItems,
  editSrvData,
}) => {
  console.log({ mode, editSrvData });

  let warehouseItemCode = 300000;
  const [warehouseItemsData, setWarehouseItemsData] = useState([]);

  // Get All Warehouse Items
  const getAllWarehouseItems = () => {
    let url = `Warehouse/get/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setWarehouseItemsData(response.data);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
      });
  };

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

    console.log({ data });

    e.target.reset();
    setWItemCost(0);
    setSelectedWItem(null);
    setAddedSrvItems([...addedSrvItems, data]);
    onHide();
  };

  useEffect(() => getAllWarehouseItems(), []);

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header>
          <Modal.Title>
            <p className="mb-0 text-secondary font-13 fw-bold">
              {mode == "add" ? "افزودن کالا از انبار" : "ویرایش اطلاعات"}
            </p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={submitWarehouseItem}>
            <input
              type="hidden"
              name="WItemCode"
              value={mode == "edit" ? editSrvData.Code : ""}
            />
            <input
              type="hidden"
              name="WItemID"
              value={mode == "edit" ? editSrvData._id : ""}
            />

            <label className="lblAbs font-12">انتخاب کالا</label>
            <Dropdown
              value={selectedWItem}
              onChange={(e) => FUSelectWItem(e.target.value)}
              options={warehouseItemsData}
              optionLabel="Name"
              placeholder="انتخاب کنید"
              filter
              showClear
              disabled={mode == "edit"}
            />

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
                    // defaultValue="1"
                    defaultValue={mode == "edit" ? editSrvData.Qty : "1"}
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
                value={WItemCost.toLocaleString()}
                // defaultValue={mode ? editSrvData.Price : 0}
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