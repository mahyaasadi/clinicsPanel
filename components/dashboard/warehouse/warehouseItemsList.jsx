import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { tableCustomStyles } from "components/commonComponents/customTableStyle/tableStyle.jsx";
import { Tooltip } from "primereact/tooltip";

const WarehouseItemsList = ({ data, openEditModal, removeWarehouseItem }) => {
  data?.map((center, index) => (data[index].rowNumber = index + 1));

  const columns = [
    {
      name: "ردیف",
      selector: (row) => row.rowNumber,
      sortable: true,
      width: "auto",
    },
    {
      name: "عنوان",
      selector: (row) => row.Name,
      sortable: true,
      width: "auto",
    },
    {
      name: "کد",
      selector: (row) => row.Code,
      sortable: true,
      width: "auto",
    },
    {
      name: "عنوان واحد",
      selector: (row) => row.UnitName,
      sortable: true,
      width: "auto",
    },
    {
      name: "مقدار واحد",
      selector: (row) => row.Unit,
      sortable: true,
      width: "auto",
    },
    {
      name: "مقدار مصرف واحد",
      selector: (row) => row.ConsumptionUnit,
      sortable: true,
      width: "auto",
    },
    {
      name: "تگ",
      selector: (row) => row.Tag,
      sortable: true,
      width: "auto",
    },
    {
      name: "عملیات ها",
      selector: (row) => row.action,
      sortable: true,
      cell: (row) => (
        <div className="actions d-flex gap-1">
          <button
            className="btn p-2 btn-outline-danger reomveBtn d-flex align-items-center"
            onClick={() => removeWarehouseItem(row._id)}
            data-pr-position="top"
          >
            <Tooltip target=".reomveBtn">حذف</Tooltip>
            <FeatherIcon
              icon="trash-2"
              style={{ width: "16px", height: "16px" }}
            />
          </button>
          <button
            className="btn p-2 btn-outline-primary btn-border-left editBtn d-flex align-items-center"
            onClick={() => openEditModal(row)}
            data-pr-position="right"
          >
            <Tooltip target=".editBtn">ویرایش</Tooltip>
            <FeatherIcon
              icon="edit-3"
              style={{ width: "16px", height: "16px" }}
            />
          </button>
        </div>
      ),
      width: "auto",
    },
  ];

  const tableData = {
    columns,
    data,
  };

  return (
    <div className="card-body p-4">
      <div className="table-responsive">
        <DataTableExtensions {...tableData} filterPlaceholder={"جستجو"}>
          <DataTable
            noHeader
            defaultSortField="id"
            defaultSortAsc={false}
            pagination
            highlightOnHover
            noDataComponent={
              <div style={{ padding: "24px", fontSize: "13px" }}>
                موردی برای نمایش وجود ندارد.
              </div>
            }
            customStyles={tableCustomStyles}
          />
        </DataTableExtensions>
      </div>
    </div>
  );
};

export default WarehouseItemsList;
