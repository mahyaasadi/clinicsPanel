import Link from "next/link";
import { Tooltip } from "primereact/tooltip";
import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { tableCustomStyles } from "components/commonComponents/customTableStyle/tableStyle.jsx";
import { convertDateFormat } from "utils/convertDateFormat";

const TaminPrescRecordsList = ({ data, prepareDelete }) => {
  const columns = [
    {
      name: "مشخصات بیمار",
      selector: (row) => row.Patient,
      style: {
        display: "flex",
        justifyContent: "flex-start",
      },
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center gap-3">
          <img
            src={"https://irannobat.ir/images/Avatar/" + row.Patient?.Avatar}
            alt="patientAvatar"
            onError={({ currentTarget }) => {
              row.Patient?.Gender === "M" || row.Patient?.Gender === "F"
                ? (currentTarget.src = `assets/img/avatar-${row.Patient.Gender}-pic.png`)
                : (currentTarget.src = `assets/img/avatar-O-pic.png`);
            }}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "8px",
            }}
          />
          <div>
            <p className="mb-0">{row.Patient?.Name}</p>
            <p className="fw-bold">{row.NID}</p>
          </div>
        </div>
      ),
      width: "auto",
    },
    {
      name: "نوع نسخه",
      selector: (row) => row.Type,
      sortable: true,
      width: "auto",
      height: "auto",
    },
    {
      name: "کد پیگیری",
      selector: (row) => row.trackingCode,
      sortable: true,
      width: "auto",
    },
    {
      name: "تاریخ ثبت",
      selector: (row) => convertDateFormat(row.Date),
      sortable: true,
      width: "auto",
    },
    {
      name: "تاریخ انقضا",
      selector: (row) => convertDateFormat(row.ExpierDate),
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
            className="btn btn-sm btn-outline-danger d-flex align-items-center justify-center"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="حذف"
            onClick={() => prepareDelete(row.head_EPRSC_ID, row._id)}
            // href={{
            //   pathname: "/taminPrescription",
            //   query: {
            //     headID: row.head_EPRSC_ID,
            //     pid: row.NID,
            //     prId: row._id,
            //     // centerID: row.CenterID,
            //   },
            // }}
          >
            <FeatherIcon
              icon="trash-2"
              style={{ width: "16px", height: "16px" }}
            />
          </button>
          <Link
            href={{
              pathname: "/taminPrescription",
              query: { headID: row.head_EPRSC_ID, pid: row.NID, prId: row._id },
            }}
            className="btn btn-sm btn-outline-primary btn-border-left editBtn d-flex align-items-center justify-center"
            data-pr-position="top"
          >
            <Tooltip target=".editBtn">ویرایش نسخه</Tooltip>
            <FeatherIcon
              icon="edit-3"
              style={{ width: "16px", height: "16px" }}
            />
          </Link>
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
        <DataTableExtensions {...tableData} filterPlaceholder={" جستجوی نسخه"}>
          <DataTable
            noHeader
            defaultSortField="id"
            defaultSortAsc={false}
            paginationPerPage="30"
            pagination
            highlightOnHover
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

export default TaminPrescRecordsList;

