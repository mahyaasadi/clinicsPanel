import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { tableCustomStyles } from "components/commonComponents/customTableStyle/tableStyle.jsx";
// import { Tooltip } from "primereact/tooltip";

const DepartmentsListTable = ({ data, openEditModal, deleteDepartment }) => {
  const columns = [
    {
      name: "نام",
      selector: (row) => row.Name,
      sortable: true,
      width: "250px",
    },
    {
      name: "نام تخصصی",
      selector: (row) => row.EngName,
      sortable: true,
      width: "250px",
    },
    {
      name: "آیکون",
      selector: (row) => row.Icon,
      cell: (row) =>
        row.Icon ? (
          <div className="articleCurrentImg">
            <img style={{ width: "35px" }} src={row.Icon} alt="" />
            {/* <Tooltip target=".removeImgBtn">حذف آیکون</Tooltip> */}
            <button
              className="btn removeImgBtn tooltip-button"
              type="button"
              data-pr-position="top"
              // onClick={}
            >
              <FeatherIcon className="removeLogoBtnIcon" icon="x-circle" />
            </button>
          </div>
        ) : (
          ""
        ),
      width: "500px",
    },
    {
      name: "عملیات ها",
      selector: (row) => row.action,
      sortable: true,
      cell: (row) => (
        <div className="actions d-flex gap-1">
          <button
            className="btn btn-sm btn-outline-danger removeBtn"
            onClick={() => deleteDepartment(row._id)}
            data-pr-position="top"
          >
            {/* <Tooltip target=".removeBtn">حذف</Tooltip> */}
            <FeatherIcon
              icon="trash-2"
              style={{ width: "16px", height: "16px" }}
            />
          </button>
          <button
            className="btn btn-sm btn-outline-secondary btn-border-left editBtn"
            data-pr-position="top"
            onClick={() => openEditModal(row)}
          >
            {/* <Tooltip target=".editBtn">ویرایش</Tooltip> */}
            <FeatherIcon
              icon="edit-3"
              style={{ width: "16px", height: "16px" }}
            />
          </button>
        </div>
      ),
      width: "200px",
    },
  ];

  const tableData = {
    columns,
    data,
  };

  return (
    <div className="card-body p-4">
      <div className="table-responsive">
        <DataTableExtensions {...tableData}>
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

export default DepartmentsListTable;