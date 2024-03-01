import { Tooltip } from "primereact/tooltip";
import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";
import "react-data-table-component-extensions/dist/index.css";
import DataTableExtensions from "react-data-table-component-extensions";
import { tableCustomStyles } from "components/commonComponents/customTableStyle/tableStyle.jsx";

const MeasurementsList = ({ data, openEditModal, deleteMeasurement }) => {
    const columns = [
        {
            name: "عنوان",
            selector: (row) => row.PN ? row.PN : row.Name,
            sortable: true,
            width: "auto",
        },
        {
            name: "عنوان تخصصی",
            selector: (row) => row.SN ? row.SN : row.EngName,
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
                        className="btn btn-sm btn-outline-danger removeBtn d-flex align-items-center"
                        onClick={() => deleteMeasurement(row._id)}
                        data-pr-position="top"
                    >
                        <Tooltip target=".removeBtn">حذف</Tooltip>
                        <FeatherIcon
                            icon="trash-2"
                            style={{ width: "16px", height: "16px" }}
                        />
                    </button>
                    <button
                        onClick={() => openEditModal(row)}
                        className="btn btn-sm btn-outline-primary btn-border-left editBtn d-flex align-items-center"
                        data-pr-position="top"
                    >
                        <Tooltip target=".editBtn">ویرایش</Tooltip>
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
                <DataTableExtensions {...tableData} filterPlaceholder={"جستجو"}>
                    <DataTable
                        noHeader
                        defaultSortField="id"
                        defaultSortAsc={false}
                        pagination
                        highlightOnHover
                        paginationPerPage="30"
                        customStyles={tableCustomStyles}
                        noDataComponent={
                            <div style={{ padding: "24px", fontSize: "13px" }}>
                                موردی برای نمایش وجود ندارد.
                            </div>
                        }
                    />
                </DataTableExtensions>
            </div>
        </div>
    )
}

export default MeasurementsList