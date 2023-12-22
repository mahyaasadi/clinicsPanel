import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import RangeDatePicker from "components/commonComponents/datepicker/rangeDatePicker";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import { Tooltip } from "primereact/tooltip";

const FilterReceptionItems = ({
  ClinicID,
  ApplyFilterOnRecItems,
  // applyFilterOnRecItems,
  // handleResetFilterFields,
  // SetRangeDate,
  // selectedDepartment,
  // FUSelectDepartment,
  // searchIsLoading,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchIsLoading, setSearchIsLoading] = useState(false)

  // Fetching departments
  const { data: clinicDepartments } = useGetAllClinicDepartmentsQuery(ClinicID);

  let dateFrom,
    dateTo = null;

  const SetRangeDate = (f, t) => {
    dateFrom = f;
    dateTo = t;
  };

  const FUSelectDepartment = (departmentValue) =>
    setSelectedDepartment(departmentValue);

  const handleResetFilterFields = () => {
    setSearchIsLoading(false);
    setSelectedDepartment(null);
    $("#receptionID").val("");
    $("#patientNID").val("");
    $("#patientName").val("");
  };

  const _applyFilterOnRecItems = (e) => {
    e.preventDefault();
    setSearchIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "ClinicReception/Search";
    let data = {
      ClinicID,
      ReceptionID: formProps.receptionID ? formProps.receptionID : "",
      ModalityID: selectedDepartment ? selectedDepartment._id : "",
      NID: formProps.patientNID ? formProps.patientNID : "",
      PatientName: formProps.patientName ? formProps.patientName : "",
      DateFrom: dateFrom ? dateFrom : "",
      DateTo: dateTo ? dateTo : "",
    };

    console.log({ data });

    // axiosClient
    //   .post(url, data)
    //   .then((response) => {
    //     console.log(response.data);
    // ApplyFilterOnRecItems(response.data)
    //     setReceptionList(response.data);
    //     setSearchIsLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setSearchIsLoading(false);
    //   })
  }

  return (
    <>
      <label className="lblAbs fw-bold font-13">جستجوی لیست پذیرش ها</label>
      <div className="card filterReceptionCard">
        <form onSubmit={_applyFilterOnRecItems}>
          <div className="card-body row align-items-center mt-3 searchContainerPadding receptionSearch-header">
            <div className="col-lg-2 col-12">
              <label className="lblAbs font-11">شناسه پذیرش</label>
              <input
                type="text"
                dir="ltr"
                name="receptionID"
                id="receptionID"
                className="form-control rounded-sm font-11 articleSearchInput"
              />
            </div>

            <div className="col-lg-2 col-12 receptionListPage">
              <label className="lblAbs font-11">بخش</label>
              <Dropdown
                value={selectedDepartment}
                onChange={(e) => FUSelectDepartment(e.value)}
                options={clinicDepartments}
                optionLabel="Name"
                placeholder="انتخاب کنید"
                showClear
              />
            </div>

            <div className="col-lg-2 col-12">
              <label className="lblAbs font-11">کد ملی بیمار</label>
              <input
                type="text"
                dir="ltr"
                name="patientNID"
                id="patientNID"
                className="form-control rounded-sm font-11 articleSearchInput"
              />
            </div>

            <div className="col-lg-2 col-12">
              <label className="lblAbs font-11">نام بیمار</label>
              <input
                type="text"
                name="patientName"
                id="patientName"
                className="form-control rounded-sm font-11 articleSearchInput"
              />
            </div>

            <div className="col-lg-3 col-12">
              <RangeDatePicker SetRangeDate={SetRangeDate} />
            </div>

            <div className="col-lg-1 col-12 gap-1 d-flex searchReceptionBtn justify-center">
              {!searchIsLoading ? (
                <>
                  <button className="btn btn-primary w-48 d-flex justify-center align-items-center">
                    <i className="fe fe-search"></i>
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary w-48 d-flex align-items-center justify-center"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                </button>
              )}
              <button
                onClick={handleResetFilterFields}
                data-pr-position="top"
                className="btn btn-primary w-48 d-flex align-items-center justify-center refreshBtn"
              >
                <i className="fa fa-refresh"></i>
              </button>
              <Tooltip target=".refreshBtn">تنظیم مجدد</Tooltip>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default FilterReceptionItems;
