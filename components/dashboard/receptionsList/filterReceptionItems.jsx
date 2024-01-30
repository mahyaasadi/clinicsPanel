import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Tooltip } from "primereact/tooltip";
import { axiosClient } from "class/axiosConfig.js";
import { ErrorAlert } from "class/AlertManage";
import { dateShortcutsData } from "class/staticDropdownOptions";
import RangeDatePicker from "components/commonComponents/datepicker/rangeDatePicker";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import { handleDateOptionsSelect } from "utils/defaultDateRanges"

const FilterReceptionItems = ({ ClinicID, ApplyFilterOnRecItems, getReceptionList }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [dateFromOption, setDateFromOption] = useState(null);
  const [dateToOption, setDateToOption] = useState(null);
  const [selectedDateOption, setSelectedDateOption] = useState(null);

  const handleSelect = (option) => {
    handleDateOptionsSelect(option, setSelectedDateOption, setDateFromOption, setDateToOption);
  };

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
    setDateFromOption("")
    setDateToOption("")
    getReceptionList()
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
      DateFrom: dateFrom ? dateFrom : dateFromOption,
      DateTo: dateTo ? dateTo : dateToOption,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        ApplyFilterOnRecItems(response.data);
        setSearchIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setSearchIsLoading(false);
        ErrorAlert("خطا", "جستجو با خطا مواجه گردید!");
      });
  };

  return (
    <>
      <label className="lblAbs fw-bold font-13">جستجوی لیست پذیرش ها</label>
      <div className="card shadow filterReceptionCard">
        <form onSubmit={_applyFilterOnRecItems}>
          <div className="card-body row align-items-center mt-3 searchContainerPadding receptionSearch-header">
            <div className="col-lg-3 col-12">
              <label className="lblAbs font-12">شناسه پذیرش</label>
              <input
                type="text"
                dir="ltr"
                name="receptionID"
                id="receptionID"
                className="form-control rounded-sm font-11 articleSearchInput"
              />
            </div>

            <div className="col-lg-3 col-12 receptionListPage">
              <label className="lblAbs font-12">بخش</label>
              <Dropdown
                value={selectedDepartment}
                onChange={(e) => FUSelectDepartment(e.value)}
                options={clinicDepartments}
                optionLabel="Name"
                placeholder="انتخاب کنید"
                showClear
              />
            </div>

            <div className="col-lg-3 col-12">
              <label className="lblAbs font-12">کد ملی بیمار</label>
              <input
                type="text"
                dir="ltr"
                name="patientNID"
                id="patientNID"
                className="form-control rounded-sm font-11 articleSearchInput"
              />
            </div>

            <div className="col-lg-3 col-12">
              <label className="lblAbs font-12">نام بیمار</label>
              <input
                type="text"
                name="patientName"
                id="patientName"
                className="form-control rounded-sm font-11 articleSearchInput"
              />
            </div>

            <div className="row mt-3">
              <div className="col-md-12 col-md-6 col-lg-4">
                <label className="lblAbs font-12">بازه های پیش فرض</label>
                <Dropdown
                  options={dateShortcutsData}
                  value={selectedDateOption}
                  onChange={(e) => handleSelect(e.value)}
                  optionLabel="label"
                  placeholder="انتخاب نمایید"
                  showClear
                />
              </div>

              <div className="col-lg-4 col-12">
                <RangeDatePicker SetRangeDate={SetRangeDate} />
              </div>

              {/* <div className="col-4"> */}
              {!searchIsLoading ? (
                <>
                  <button className="btn btn-primary col-2 d-flex justify-center align-items-center">
                    <i className="fe fe-search"></i>
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary col-2 d-flex align-items-center justify-center"
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
                className="btn btn-primary d-flex col-2 align-items-center justify-center refreshBtn"
              >
                <i className="fa fa-refresh"></i>
                <Tooltip target=".refreshBtn">تنظیم مجدد</Tooltip>
              </button>
              {/* </div> */}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default FilterReceptionItems;
