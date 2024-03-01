import React from "react";
import { Tooltip } from "primereact/tooltip";
import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";
import "react-data-table-component-extensions/dist/index.css";
import DataTableExtensions from "react-data-table-component-extensions";
import { tableCustomStyles } from "components/commonComponents/customTableStyle/tableStyle.jsx";

const FavItemsListTable = ({ data, removeFavItem, selectedFavItemTab }) => {
    const columns = [
        {
            name: "کد خدمت",
            selector: (row) => row.SrvCode ? row.SrvCode : row.serviceNationalNumber,
            sortable: true,
            width: "auto",
        },
        {
            name: "نام خدمت",
            selector: (row) => row.SrvName ? row.SrvName.substr(0, 35) : row.serviceInterfaceName.substr(0, 35),
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
                        onClick={() => removeFavItem(insuranceMode == "Tamin" ? row.SrvCode : row.serviceNationalNumber)}
                        data-pr-position="left"
                    >
                        <Tooltip target=".removeBtn">حذف</Tooltip>
                        <FeatherIcon
                            icon="trash-2"
                            style={{ width: "15px", height: "15px" }}
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
    );
};

export default FavItemsListTable;
