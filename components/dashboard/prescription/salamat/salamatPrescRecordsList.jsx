import Link from "next/link";
import { Tooltip } from "primereact/tooltip";
import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { tableCustomStyles } from "components/commonComponents/customTableStyle/tableStyle.jsx";

const SalamatPrescRecordsList = ({ data }) => {
  const columns = [
    {
      name: "مشخصات بیمار",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="d-flex flex-col gap-1 align-items-center">
          <div className="d-flex align-items-center gap-3">
            <img
              src={row.picture}
              alt="patientAvatar"
              onError={({ currentTarget }) => {
                row.Gender === "M" || row.Gender === "F"
                  ? (currentTarget.src = `assets/img/avatar-${row.Gender}-pic.png`)
                  : (currentTarget.src = `assets/img/avatar-O-pic.png`);
              }}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "8px",
              }}
            />
            <div>
              <p className="mb-0">
                {row.name} {row.lastName}{" "}
                {row.age ? "," + row.age + " ساله " : "-"}
              </p>
              <p className="fw-bold">{row.nationalNumber}</p>
            </div>
          </div>
        </div>
      ),
      width: "auto",
    },
    {
      name: "کد پیگیری",
      selector: (row) => (row.trackingCode ? row.trackingCode : "-"),
      sortable: true,
      width: "auto",
    },
    {
      name: "تاریخ ثبت",
      selector: (row) => row.creationDate,
      sortable: true,
      cell: (row) => (
        <div className="d-flex flex-col gap-1 align-items-center">
          <p className="mb-0">
            {row.creationDate ? row.creationDate.split(" ")[0] : "-"}
          </p>
          <p>{row.creationDate ? row.creationDate.split(" ")[1] : "-"}</p>
        </div>
      ),
      width: "auto",
    },
    {
      name: "نوع بیمه",
      selector: (row) => (row.productName ? row.productName : "-"),
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
            className="btn btn-sm btn-outline-danger removeBtn d-flex align-items-center justify-center"
            // onClick={() => deleteKart(row._id)}
            data-pr-position="top"
          >
            <Tooltip target=".removeBtn">حذف</Tooltip>
            <FeatherIcon
              icon="trash-2"
              style={{ width: "16px", height: "16px" }}
            />
          </button>
          <Link
            href={{
              query: { SC: row.samadCode, PID: row.nationalNumber },
              pathname: "/salamatPrescription",
            }}
            className="btn btn-sm btn-outline-primary btn-border-left editBtn d-flex align-items-center justify-center"
            onClick={() => console.log({ row })}
            data-pr-position="top"
          >
            <Tooltip target=".editBtn">ویرایش</Tooltip>
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
        <DataTableExtensions {...tableData}>
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

export default SalamatPrescRecordsList;
