import Link from "next/link";
import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { tableCustomStyles } from "components/commonComponents/customTableStyle/tableStyle.jsx";
import "react-data-table-component-extensions/dist/index.css";

const SurgeryRecordsList = ({
  data,
  openSurgeryModal,
  openEditSurgeryModal,
}) => {
  // console.log({ data });
  const columns = [
    {
      name: "جراحی",
      selector: (row) => row.Name,
      sortable: true,
      width: "auto",
    },
    {
      name: "تاریخ جراحی",
      selector: (row) => (row.EditDate ? row.Date : "-"),
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
          >
            <FeatherIcon
              icon="trash-2"
              style={{ width: "16px", height: "16px" }}
            />
            <Tooltip target=".removeBtn">حذف</Tooltip>
          </button>
          <Link
            onClick={() => openEditSurgeryModal(row)}
            className="btn editBtn d-flex eventBtns align-items-center p-2"
            data-pr-position="right"
          >
            <FeatherIcon
              icon="edit-2"
              style={{ width: "15px", height: "15px" }}
            />
            <Tooltip target=".editBtn">ویرایش</Tooltip>
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
      <div className="card border-gray mb-2">
        <div className="card-body">
          <div className="card-header p-2 pt-0 mb-2">
            <div className="row align-items-center justify-evenly">
              <div className="col">
                <p className="fw-bold text-secondary font-13">سوابق جراحی</p>
              </div>

              <div className="col d-flex justify-end">
                <button
                  onClick={() => openSurgeryModal(data)}
                  className="btn text-secondary font-12 d-flex align-items-center gap-1 fw-bold p-0 formBtns"
                >
                  <FeatherIcon icon="plus" />
                  سابقه جدید
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="table-responsive patientFileTbl p-2">
              <DataTableExtensions {...tableData}>
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
        </div>
      </div>
    </>
  );
};

export default SurgeryRecordsList;
