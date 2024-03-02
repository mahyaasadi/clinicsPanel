import Link from "next/link";
import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { tableCustomStyles } from "components/commonComponents/customTableStyle/tableStyle.jsx";
import { Tooltip } from "primereact/tooltip";

const CallLogsList = ({ data }) => {
    const columns = [
        {
            name: "شماره تماس گیرنده",
            selector: (row) => row.Tel,
            sortable: true,
            width: "auto",
        },
        {
            name: "اطلاعات تماس گیرنده",
            selector: (row) => row.Patient,
            sortable: true,
            cell: (row) => (
                <div className="">
                    {!row.Patient ? "-" : (
                        <div className="d-flex align-items-center gap-2">
                            <Link
                                href={{
                                    query: { id: row.Patient._id },
                                    pathname: "/patientFile",
                                }}
                                className="receptionImgLink"
                            >
                                <img
                                    src={"https://irannobat.ir/images/Avatar/" + row.Patient.Avatar}
                                    alt="patientAvatar"
                                    style={{
                                        width: "35px",
                                        height: "35px",
                                        borderRadius: "10px",
                                    }}
                                    onError={({ currentTarget }) => {
                                        row.Patient.Gender === "F" || row.Patient.Gender === "M"
                                            ? (currentTarget.src = `assets/img/avatar-${row.Patient.Gender}-pic.png`)
                                            : (currentTarget.src = `assets/img/avatar-O-pic.png`);
                                    }}
                                />
                            </Link>

                            <Link
                                href={{
                                    query: { id: row.Patient._id },
                                    pathname: "/patientFile",
                                }}
                                className="receptionLink"
                            >
                                <p className="mb-0">{row.Patient.Name} {row.Patient.Age ? "," + row.Patient.Age + " ساله" : ""}</p>
                                <p className="fw-bold mb-0">{row.Patient.NationalID}</p>
                                {row.Patient.InsuranceName && (
                                    <p className="">نوع بیمه : {row.Patient.InsuranceName}</p>
                                )}
                            </Link>
                        </div>
                    )}
                </div>
            ),
            width: "auto",
        },
        {
            name: "تاریخ تماس",
            selector: (row) => row.Tel,
            sortable: true,
            cell: (row) => (
                <div className="actions d-flex flex-col align-items-center">
                    <p className="mb-1">{row.Date}</p>
                    <p className="">{row.Time}</p>
                </div>
            ),
            width: "auto",
        },

        {
            name: "عملیات ها",
            selector: (row) => row.action,
            sortable: true,
            cell: (row) => (
                <div className="actions d-flex gap-1">
                    <Link
                        className="btn btn-sm btn-outline-primary btn-border-l receptionBtn d-flex align-items-center float-end m-1"
                        data-pr-position="top"
                        href={{
                            pathname: "/reception",
                            query: { PNID: row.Patient?.NationalID },
                        }}
                    >
                        <Tooltip target=".receptionBtn">پذیرش</Tooltip>
                        <FeatherIcon
                            icon="clipboard"
                            style={{ width: "15px", height: "16px" }}
                        />
                    </Link>
                    {/* <button
                        className="btn btn-sm btn-outline-primary btn-border-left editBtn"
                        // onClick={() => updateDiscount(row)}
                        data-pr-position="top"
                    >
                        <Tooltip target=".editBtn">ویرایش</Tooltip>
                        <FeatherIcon
                            icon="edit-3"
                            style={{ width: "16px", height: "16px" }}
                        />
                    </button> */}
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

export default CallLogsList