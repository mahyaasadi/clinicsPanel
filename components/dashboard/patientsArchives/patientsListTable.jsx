import Link from "next/link";
import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { tableCustomStyles } from "components/commonComponents/customTableStyle/tableStyle.jsx";
import { Tooltip } from "primereact/tooltip";

const PatientsListTable = ({ data }) => {
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
                row.Gender
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
        <div className="actions d-flex w-100 ">
          <button
            className="btn btn-sm btn-outline-danger removeBtn d-flex align-items-center float-end m-1"
            // onClick={() => deleteDepartment(row._id)}
            data-pr-position="top"
          >
            <Tooltip target=".removeBtn">حذف</Tooltip>
            <FeatherIcon
              icon="trash-2"
              style={{ width: "15px", height: "16px" }}
            />
          </button>
          <Link
            href={{
              pathname: "/editPatientsInfo",
              query: { id: row._id },
            }}
            className="btn btn-sm btn-outline-primary editBtn d-flex align-items-center float-end m-1"
            data-pr-position="top"
            // onClick={() => openEditModal(row)}
          >
            <Tooltip target=".editBtn">تکمیل پرونده</Tooltip>
            <FeatherIcon
              icon="edit-3"
              style={{ width: "15px", height: "16px" }}
            />
          </Link>
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
          <DataTableExtensions {...tableData}>
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
