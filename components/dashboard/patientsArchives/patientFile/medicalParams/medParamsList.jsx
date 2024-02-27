import FeatherIcon from "feather-icons-react";
import { Modal } from "react-bootstrap"
import { Tooltip } from "primereact/tooltip"
import { axiosClient } from "@/class/axiosConfig";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { tableCustomStyles } from "components/commonComponents/customTableStyle/tableStyle.jsx";
import "react-data-table-component-extensions/dist/index.css";

const MedParamsList = ({ show, onHide, paramName, data, _removeMedParam }) => {
    const columns = [
        {
            name: paramName,
            selector: (row) => row.Value,
            sortable: true,
            width: "auto",
        },
        {
            name: "تاریخ",
            selector: (row) => row.Date,
            sortable: true,
            width: "auto",
        },
        {
            name: "عملیات ها",
            selector: (row) => row.action,
            sortable: true,
            cell: (row) => (
                <div className="actions d-flex">

                    <button
                        data-pr-position="left"
                        className="btn removeBtn trashButton eventBtns d-flex align-items-center p-2"
                        onClick={() => _removeMedParam(row._id)}
                    >
                        <FeatherIcon
                            icon="trash-2"
                            style={{ width: "16px", height: "16px" }}
                        />
                        <Tooltip target=".removeBtn">حذف</Tooltip>
                    </button>
                    <button
                        data-pr-position="right"
                        className="btn editMedBtn trashButton eventBtns d-flex align-items-center p-2"
                    // onClick={() => (row)}
                    >
                        <FeatherIcon
                            icon="edit-2"
                            style={{ width: "16px", height: "16px" }}
                        />
                        <Tooltip target=".editMedBtn">ویرایش</Tooltip>
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
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    <p className="text-secondary fw-bold font-13">اطلاعات نمودار {paramName}</p>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="row">
                    <div className="table-responsive patientFileTbl p-4">
                        <DataTableExtensions {...tableData} filterPlaceholder={"جستجو"}>
                            <DataTable
                                noHeader
                                defaultSortField="id"
                                defaultSortAsc={false}
                                pagination
                                highlightOnHover
                                noDataComponent={
                                    <div style={{ padding: "24px", fontSize: "13px" }}>
                                        اطلاعاتی ثبت نشده است.
                                    </div>
                                }
                                customStyles={tableCustomStyles}
                            />
                        </DataTableExtensions>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default MedParamsList