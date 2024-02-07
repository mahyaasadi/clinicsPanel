import Link from "next/link";
import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { tableCustomStyles } from "components/commonComponents/customTableStyle/tableStyle.jsx";
import { Tooltip } from "primereact/tooltip";

const PatientsListTable = ({
  data,
  openAppointmentModal,
  openFrmOptionModal,
}) => {
  const columns = [
    {
      name: "بیمار",
      selector: (row) => row.Name,
      sortable: true,
      style: {
        justifyContent: "flex-start",
      },
      cell: (row) => (
        <Link
          href={{
            pathname: "/patientFile",
            query: { id: row._id },
          }}
          className="d-flex justify-center align-items-center gap-3 clinicLink"
        >
          <div>
            <img
              src={"https://irannobat.ir/images/" + row.Avatar}
              alt="patientAvatar"
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "10px",
              }}
              onError={({ currentTarget }) => {
                row.Gender === "M" || row.Gender === "F"
                  ? (currentTarget.src = `assets/img/avatar-${row.Gender}-pic.png`)
                  : (currentTarget.src = `assets/img/avatar-O-pic.png`);
              }}
            />
          </div>
          <div>
            <p className="mb-0">{row.Name}</p>
            <p className="">{row.NationalID}</p>
          </div>
        </Link>
      ),
      width: "auto",
    },
    {
      name: "سن",
      selector: (row) => (row.Age ? row.Age : "-"),
      sortable: true,
      width: "auto",
    },
    {
      name: "نوع بیمه",
      selector: (row) => row.InsuranceName,
      sortable: true,
      width: "auto",
    },
    {
      name: "شماره همراه",
      selector: (row) => row.Tel,
      sortable: true,
      width: "auto",
    },
    {
      name: "عملیات ها",
      selector: (row) => row.action,
      sortable: true,
      cell: (row) => (
        <div className="actions d-flex w-100">
          <Link
            href={{
              pathname: "/editPatientsInfo",
              query: { id: row._id },
            }}
            className="btn btn-sm btn-outline-primary editBtn d-flex align-items-center float-end m-1"
            data-pr-position="top"
          >
            <Tooltip target=".editBtn">ویرایش اطلاعات</Tooltip>
            <FeatherIcon
              icon="edit-3"
              style={{ width: "15px", height: "16px" }}
            />
          </Link>

          <Link
            className="btn btn-sm btn-outline-primary btn-border-l receptionBtn d-flex align-items-center float-end m-1"
            data-pr-position="top"
            href={{
              pathname: "/reception",
              query: { PNID: row.NationalID },
            }}
          >
            <Tooltip target=".receptionBtn">پذیرش</Tooltip>
            <FeatherIcon
              icon="clipboard"
              style={{ width: "15px", height: "16px" }}
            />
          </Link>
          <button
            className="btn btn-sm btn-outline-primary btn-border-l appointBtn d-flex align-items-center float-end m-1"
            data-pr-position="top"
            onClick={() => openAppointmentModal(row._id)}
          >
            <Tooltip target=".appointBtn">نوبت دهی</Tooltip>
            <FeatherIcon
              icon="calendar"
              style={{ width: "15px", height: "16px" }}
            />
          </button>

          <button
            className="btn btn-sm btn-outline-primary btn-border-l newFormBtn d-flex align-items-center float-end m-1"
            data-pr-position="top"
            onClick={() => openFrmOptionModal(row)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-18"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
            <Tooltip target=".newFormBtn">افزودن فرم</Tooltip>
          </button>
          <Link
            className="btn btn-sm btn-outline-primary btn-border-l filesBtn d-flex align-items-center float-end m-1"
            data-pr-position="top"
            href={{
              pathname: "/patientFile",
              query: { id: row._id },
            }}
          >
            <Tooltip target=".filesBtn">نمایش پرونده</Tooltip>
            <FeatherIcon
              icon="folder"
              style={{ width: "15px", height: "16px" }}
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
    <>
      <div className="card-body p-4">
        <div className="table-responsive">
          <DataTableExtensions {...tableData} filterPlaceholder="جستجو بیمار">
            <DataTable
              noHeader
              defaultSortField="id"
              defaultSortAsc={false}
              pagination
              paginationPerPage="50"
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
    </>
  );
};

export default PatientsListTable;
