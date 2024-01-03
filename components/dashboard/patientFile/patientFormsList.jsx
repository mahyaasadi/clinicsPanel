import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { tableCustomStyles } from "components/commonComponents/customTableStyle/tableStyle.jsx";
import "react-data-table-component-extensions/dist/index.css";

const PatientsFormsList = ({ data }) => {
  const columns = [
    {
      name: "نام",
      selector: (row) => data.Name,
      sortable: true,
      width: "auto",
    },
    // {
    //   name: "نام تخصصی",
    //   selector: (row) => data.EngName,
    //   sortable: true,
    //   width: "auto",
    // },
    {
      name: "عملیات ها",
      selector: (row) => data.action,
      sortable: true,
      cell: (row) => (
        <div className="actions d-flex gap-1">
          <button className="btn btn-sm btn-outline-danger removeBtn d-flex align-items-center">
            <FeatherIcon
              icon="trash-2"
              style={{ width: "16px", height: "16px" }}
            />
          </button>
          <button
            className="btn btn-sm btn-outline-primary btn-border-left editBtn d-flex align-items-center"
            data-pr-position="top"
          >
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
    <div className="row">
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

export default PatientsFormsList;
