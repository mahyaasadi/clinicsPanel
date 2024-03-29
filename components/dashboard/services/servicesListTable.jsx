import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { tableCustomStyles } from "components/commonComponents/customTableStyle/tableStyle.jsx";
import { Tooltip } from "primereact/tooltip";

const ServicesListTable = ({ data, openEditModal, deleteService }) => {
  const columns = [
    {
      name: "کد داخلی",
      selector: (row) => row.Code,
      sortable: true,
      width: "auto",
    },
    {
      name: "نام خدمت",
      selector: (row) => row.Name,
      sortable: true,
      width: "auto",
    },
    {
      name: "نام تخصصی خدمت",
      selector: (row) => row.EngName,
      sortable: true,
      width: "auto",
    },
    {
      name: "هزینه خدمت",
      selector: (row) =>
        row.Price ? row.Price.toLocaleString() + " ریال" : "-",
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
            className="btn btn-sm btn-outline-danger removeBtn"
            onClick={() => deleteService(row._id)}
            data-pr-position="top"
          >
            <Tooltip target=".removeBtn">حذف</Tooltip>
            <FeatherIcon
              icon="trash-2"
              style={{ width: "16px", height: "16px" }}
            />
          </button>
          <button
            className="btn btn-sm btn-outline-primary btn-border-left editBtn"
            data-pr-position="top"
            onClick={() => openEditModal(row)}
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
            paginationPerPage="30"
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

export default ServicesListTable;
