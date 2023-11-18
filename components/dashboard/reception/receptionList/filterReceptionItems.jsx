import { Dropdown } from "primereact/dropdown";
import DatePicker from "components/commonComponents/datepicker";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";

const FilterReceptionItems = ({
  applyFilterOnRecItems,
  handleResetFilterFields,
  SetRangeDate,
  ClinicID,
  selectedDepartment,
  FUSelectDepartment,
  searchIsLoading,
}) => {
  // Fetching departments
  const { data: clinicDepartments } = useGetAllClinicDepartmentsQuery(ClinicID);

  return (
    <>
      <label className="lblAbs fw-bold font-13">جستجوی لیست پذیرش ها</label>
      <div className="card shadow">
        <form onSubmit={applyFilterOnRecItems}>
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
              <DatePicker SetRangeDate={SetRangeDate} />
            </div>

            <div className="col-lg-1 col-12 gap-1 d-flex searchReceptionBtn justify-center">
              {!searchIsLoading ? (
                <>
                  <button
                    // onClick={handleSearchClick}
                    className="btn btn-primary w-48 d-flex justify-center align-items-center"
                  >
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
                <i class="fa fa-refresh"></i>
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
