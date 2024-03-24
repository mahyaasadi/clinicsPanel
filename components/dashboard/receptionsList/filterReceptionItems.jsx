import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Tooltip } from "primereact/tooltip";
import { axiosClient } from "class/axiosConfig.js";
import { ErrorAlert, WarningAlert } from "class/AlertManage";
import { dateShortcutsData } from "class/staticDropdownOptions";
import RangeDatePicker from "components/commonComponents/datepicker/rangeDatePicker";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import { handleDateOptionsSelect } from "utils/defaultDateRanges";

const FilterReceptionItems = ({
  ClinicID,
  ApplyFilterOnRecItems,
  getReceptionList,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [dateFromOption, setDateFromOption] = useState(null);
  const [dateToOption, setDateToOption] = useState(null);
  const [selectedDateOption, setSelectedDateOption] = useState(null);

  const handleSelect = (option) => {
    handleDateOptionsSelect(
      option,
      setSelectedDateOption,
      setDateFromOption,
      setDateToOption
    );
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
    setDateFromOption(null);
    setDateToOption(null);
    getReceptionList();
  };

  const _applyFilterOnRecItems = (e) => {
    e.preventDefault();
    setSearchIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "ClinicReception/Search";
    let data = {
      ClinicID,
      ModalityID: selectedDepartment ? selectedDepartment._id : "",
      ReceptionID: "",
      NID: "",
      PatientName: "",
      DateFrom: dateFrom ? dateFrom : dateFromOption,
      DateTo: dateTo ? dateTo : dateToOption,
    };

    let receptionInfo = formProps.receptionFilterInfo;
    if (isNaN(parseInt(receptionInfo))) {
      data.PatientName = receptionInfo;
    } else {
      if (receptionInfo.length < 10) {
        data.ReceptionID = receptionInfo;
      } else {
        data.NID = receptionInfo;
      }
    }

    axiosClient
      .post(url, data)
      .then((response) => {
        ApplyFilterOnRecItems(response.data);
        setSearchIsLoading(false);

        // reset
        $("#receptionFilterInfo").val("");
        setDateFromOption(null);
        setDateToOption(null);
        setSelectedDepartment(null);

        if (response.data.length == 0) {
          WarningAlert("", "داده ای یافت نشد!");
        }
      })
      .catch((err) => {
        console.log(err);
        setSearchIsLoading(false);
        ErrorAlert("خطا", "جستجو با خطا مواجه گردید!");
      });
  };

  return (
    <>
      <div className="card shadow-sm filterReceptionCard p-relative">
        <label className="lblAbs fw-bold font-13">جستجوی لیست پذیرش ها</label>
        <form onSubmit={_applyFilterOnRecItems}>
          <div className="card-body row align-items-center mt-3 searchContainerPadding receptionSearch-header">
            <div className="col-12 col-lg-6 col-xl-4 mb-3">
              <label className="lblAbs font-12">
                شناسه پذیرش / کد ملی / نام بیمار
              </label>
              <input
                type="text"
                name="receptionFilterInfo"
                id="receptionFilterInfo"
                className="form-control rounded-sm font-11 articleSearchInput text-center"
              />
            </div>

            <div className="col-12 col-lg-6 col-xl-2 mb-3 receptionListPage">
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

            <div className="col-12 col-lg-6 col-xl-2 mb-3">
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

            <div className="col-12 col-lg-6 col-xl-2 mb-3">
              <RangeDatePicker SetRangeDate={SetRangeDate} />
            </div>

            {!searchIsLoading ? (
              <div className="col-12 col-lg-6 col-xl-1 mb-3">
                <button className="btn btn-primary d-flex justify-center align-items-center w-100 height-40">
                  <i className="fe fe-search"></i>
                </button>
              </div>
            ) : (
              <div className="col-12 col-lg-6 col-xl-1 mb-3">
                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center justify-center w-100 height-40"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                </button>
              </div>
            )}

            <div className="col-12 col-lg-6 col-xl-1 mb-3">
              <button
                onClick={handleResetFilterFields}
                data-pr-position="top"
                className="btn btn-primary d-flex align-items-center justify-center refreshBtn w-100 height-40"
              >
                <i className="fa fa-refresh"></i>
                <Tooltip target=".refreshBtn">تنظیم مجدد</Tooltip>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default FilterReceptionItems;
