import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { tableCustomStyles } from "components/commonComponents/customTableStyle/tableStyle.jsx";
import { Tooltip } from "primereact/tooltip";

const ReceptionListTable = ({
  data,
  deleteReception,
  openAppointmentModal,
}) => {
  console.log("hiiiiiiiiiiii");

  const router = useRouter();

  const columns = [
    {
      name: "بیمار",
      selector: (row) => row.action,
      sortable: true,
      style: {
        justifyContent: "flex-start"
      },
      cell: (row) => (
        <div className="d-flex justify-center align-items-center gap-3">
          <div>
            <img
              src={"https://irannobat.ir/images/" + row.Patient.Avatar}
              alt="patientAvatar"
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "10px",
              }}
              onError={({ currentTarget }) => {
                row.Patient.Gender
                  ? (currentTarget.src = `assets/img/avatar-${row.Patient.Gender}-pic.png`)
                  : (currentTarget.src = `assets/img/avatar-O-pic.png`);
              }}
            />
          </div>
          <div>
            <p>{row.Patient.Name}</p>
          </div>
        </div>
      ),
      width: "300px",
    },
    {
      name: "شماره پذیرش",
      selector: (row) => row.ReceptionID,
      sortable: true,
      width: "150px",
    },
    {
      name: "کد ملی",
      selector: (row) => row.Patient.NationalID,
      sortable: true,
      width: "200px",
    },
    {
      name: "تاریخ پذیرش",
      selector: (row) => row.Date,
      sortable: true,
      width: "250px",
    },
    {
      name: "بخش",
      selector: (row) => row.Modality.Name,
      sortable: true,
      width: "500px",
    },
    {
      name: "عملیات ها",
      selector: (row) => row.action,
      sortable: true,
      cell: (row) => (
        <div className="actions d-flex gap-1">
          <button
            className="btn btn-sm btn-outline-danger removeBtn d-flex align-items-center"
            onClick={() => deleteReception(row._id)}
            data-pr-position="left"
          >
            <Tooltip target=".removeBtn">حذف</Tooltip>
            <FeatherIcon
              icon="trash-2"
              style={{ width: "16px", height: "16px" }}
            />
          </button>
          <button
            className="btn btn-sm btn-outline-primary btn-border-left editBtn d-flex align-items-center"
            data-pr-position="top"
            onClick={() =>
              router.push({
                pathname: "/reception",
                query: { id: row._id, receptionID: row.ReceptionID },
              })
            }
          >
            <Tooltip target=".editBtn">ویرایش</Tooltip>
            <FeatherIcon
              icon="edit-3"
              style={{ width: "16px", height: "16px" }}
            />
          </button>
          <button
            type="button"
            data-pr-position="right"
            className="btn btn-outline-primary editBtn receptBtnPadding appointment"
            onClick={() => openAppointmentModal(row?.Patient, row?.Modality)}
          >
            <FeatherIcon
              icon="calendar"
              className="prescItembtns"
              style={{ width: "20px", height: "20px" }}
            />
            <Tooltip target=".appointment">نوبت دهی</Tooltip>
          </button>
        </div>
      ),
      width: "150px",
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
  );
};

export default ReceptionListTable;

