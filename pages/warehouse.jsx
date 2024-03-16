import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import FeatherIcon from "feather-icons-react";
import { QuestionAlert, ErrorAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import WarehouseItemsList from "components/dashboard/warehouse/warehouseItemsList";
import WarehouseModal from "components/dashboard/warehouse/warehouseModal";
import ChangeItemStockModal from "components/dashboard/warehouse/changeItemStockModal";

export const getServerSideProps = async ({ req, res }) => {
  const result = await getSession(req, res);

  if (result) {
    const { ClinicUser } = result;
    return {
      props: {
        ClinicUser,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }
};

let ClinicID = null;
const Warehouse = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(false);
  const [actionIsLoading, setActionIsLoading] = useState(false);
  const [warehouseItemsData, setWarehouseItemsData] = useState([]);
  const [editWarehouseItemsData, setEditWarehouseItemsData] = useState([]);
  const [modalMode, setModalMode] = useState("add");
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);

  // Get All Warehouse Items
  const getAllWarehouseItems = () => {
    setIsLoading(true);
    let url = `Warehouse/get/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setWarehouseItemsData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
      });
  };

  // Add Item
  const openAddModal = () => {
    setModalMode("add");
    setShowModal(true);
  };

  const addItemToWarehouse = (e) => {
    e.preventDefault();
    setActionIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "Warehouse/add";
    let data = {
      CenterID: ClinicID,
      Name: formProps.itemName,
      Code: formProps.itemCode,
      UnitName: formProps.unitName,
      Unit: formProps.unit,
      ConsumptionUnit: formProps.consumptionUnit,
      Tag: formProps.itemTag,
      Des: formProps.itemDes,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        setWarehouseItemsData([...warehouseItemsData, response.data]);
        setShowModal(false);
        e.target.reset();
        setActionIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setActionIsLoading(false);
        ErrorAlert("خطا", "افزودن کالا با خطا مواجه گردید!");
      });
  };

  // Edit Item
  const openEditModal = (data) => {
    setEditWarehouseItemsData(data);
    setModalMode("edit");
    setShowModal(true);
  };

  const editWarehouseItem = (e) => {
    e.preventDefault();
    setActionIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = `Warehouse/update/${formProps.EditWItemID}`;
    let data = {
      CenterID: ClinicID,
      Name: formProps.itemName,
      Code: formProps.itemCode,
      UnitName: formProps.unitName,
      Unit: formProps.unit,
      ConsumptionUnit: formProps.consumptionUnit,
      Tag: formProps.itemTag,
      Des: formProps.itemDes,
    };

    axiosClient
      .put(url, data)
      .then((response) => {
        updateItem(formProps.EditWItemID, response.data);
        e.target.reset();
        setShowModal(false);
        setActionIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ویرایش اطلاعات با خطا مواجه گردید!");
        setActionIsLoading(false);
      });
  };

  const updateItem = (id, newArr) => {
    let index = warehouseItemsData.findIndex((x) => x._id === id);
    let g = warehouseItemsData[index];
    g = newArr;
    if (index === -1) {
      console.log("no match");
    } else
      setWarehouseItemsData([
        ...warehouseItemsData.slice(0, index),
        g,
        ...warehouseItemsData.slice(index + 1),
      ]);
  };

  // Remove Item
  const removeWarehouseItem = async (id) => {
    let result = await QuestionAlert("", "آیا از حذف کالا اطمینان دارید؟");

    if (result) {
      setActionIsLoading(true);
      let url = `Warehouse/delete/${id}`;

      await axiosClient
        .delete(url)
        .then((response) => {
          setWarehouseItemsData(warehouseItemsData.filter((a) => a._id !== id));
          setActionIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          ErrorAlert("خطا", "حذف کالا با خطا مواجه گردید!");
          setActionIsLoading(false);
        });
    }
  };

  // Change Stock Modal
  const [stockModalMode, setStockModalMode] = useState("increase");
  const [showStockModal, setShowStockModal] = useState(false);
  const [ActiveItemID, setActiveItemID] = useState(null);
  const [itemQty, setItemQty] = useState(0);
  const closeStockModal = () => {
    setShowStockModal(false);
    setItemQty(0);
  };

  const openIncreaseStockModal = (data) => {
    setEditWarehouseItemsData(data);
    setActiveItemID(data._id);
    setStockModalMode("increase");
    setShowStockModal(true);
  };

  const openDecreaseStockModal = (data) => {
    setEditWarehouseItemsData(data);
    setActiveItemID(data._id);
    setStockModalMode("decrease");
    setShowStockModal(true);
  };

  const changeStockQuantity = (e) => {
    e.preventDefault();
    setActionIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url =
      stockModalMode == "increase"
        ? `Warehouse/StockIncrease/${ActiveItemID}`
        : `Warehouse/StockDecrease/${ActiveItemID}`;

    let data = { Qty: itemQty };

    axiosClient
      .post(url, data)
      .then((response) => {
        if (response.data.err) {
          ErrorAlert("", response.data.msg);
          setActionIsLoading(false);
          setShowStockModal(false);
          setItemQty(0);
          return false;
        } else {
          updateItem(ActiveItemID, response.data);
          setActionIsLoading(false);
          setItemQty(0);
          setShowStockModal(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setActionIsLoading(false);
      });
  };

  useEffect(() => getAllWarehouseItems(), []);

  return (
    <>
      <Head>
        <title>انبار</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="row dir-rtl">
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-md-12 d-flex justify-content-end">
                    <button
                      onClick={openAddModal}
                      className="btn btn-primary btn-add font-14"
                    >
                      <i className="me-1">
                        <FeatherIcon icon="plus-square" />
                      </i>{" "}
                      افزودن
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-sm-12">
                <div className="card">
                  <div className="card-header border-bottom-0">
                    <div className="row align-items-center">
                      <div className="col">
                        <p className="card-title text-secondary font-14">
                          لیست کالا های انبار
                        </p>
                      </div>
                    </div>
                  </div>

                  <WarehouseItemsList
                    data={warehouseItemsData}
                    openEditModal={openEditModal}
                    removeWarehouseItem={removeWarehouseItem}
                    openIncreaseStockModal={openIncreaseStockModal}
                    openDecreaseStockModal={openDecreaseStockModal}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <WarehouseModal
        mode={modalMode}
        show={showModal}
        onHide={handleCloseModal}
        actionIsLoading={actionIsLoading}
        data={editWarehouseItemsData}
        onSubmit={modalMode == "edit" ? editWarehouseItem : addItemToWarehouse}
      />

      <ChangeItemStockModal
        mode={stockModalMode}
        show={showStockModal}
        onHide={closeStockModal}
        actionIsLoading={actionIsLoading}
        onSubmit={changeStockQuantity}
        data={editWarehouseItemsData}
        itemQty={itemQty}
        setItemQty={setItemQty}
      />
    </>
  );
};

export default Warehouse;
