import { useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import DatePicker from "components/commonComponents/datepicker";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";

const FilterReceptionItems = ({
  applyFilterOnRecItems,
  SetRangeDate,
  ClinicID,
  selectedDepartment,
  FUSelectDepartment,
}) => {
  // Fetching departments
  const {
    data: clinicDepartments,
    error,
    isLoading,
  } = useGetAllClinicDepartmentsQuery(ClinicID);

  return (
    <>
      <label className="lblAbs fw-bold font-13">جستجوی لیست پذیرش ها</label>
      <div className="card">
        <form onSubmit={applyFilterOnRecItems}>
          <div
            id="centerSearchFrm"
            className="card-body filterCentersContainer row align-items-center mt-3"
          >
            <div className="col-md-2 col-12">
              <label className="lblAbs font-11">شناسه پذیرش</label>
              <input
                type="text"
                dir="ltr"
                name="receptionID"
                className="form-control rounded-sm font-11 articleSearchInput"
              />
            </div>

            <div className="col-md-2 col-12 receptionListPage">
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

            <div className="col-md-2 col-12">
              <label className="lblAbs font-11">کد ملی بیمار</label>
              <input
                type="text"
                dir="ltr"
                name="patientNID"
                className="form-control rounded-sm font-11 articleSearchInput"
              />
            </div>

            <div className="col-md-2 col-12">
              <label className="lblAbs font-11">نام بیمار</label>
              <input
                type="text"
                name="patientName"
                className="form-control rounded-sm font-11 articleSearchInput"
              />
            </div>

            <div className="col-md-3 col-12">
              <DatePicker SetRangeDate={SetRangeDate} />
            </div>

            {/* <div className="search col-md-3 col-12">
            <label className="lblAbs font-11">جستجوی مرکز</label>
            <input
              //   onKeyUp={handleSearchSubmit}
              //   onChange={handleInputChange}
              id="centerSearchInput"
              autoComplete="off"
              className="form-control rounded-sm font-11 articleSearchInput"
              placeholder="نام مرکز / نام پزشک ..."
              type="text"
              />
            </div> */}

            <div className="col-md-1 col-12">
              {/* {!searchIsLoading ? ( */}
              <button
                // onClick={handleSearchClick}
                className="btn btn-primary w-100"
              >
                <i className="fe fe-search"></i>
              </button>
              {/* ) : ( */}
              {/* <button type="submit" className="btn btn-primary w-100" disabled>
                <span
                className="spinner-border spinner-border-sm"
                role="status"
                ></span>
            </button> */}
              {/* )} */}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default FilterReceptionItems;
