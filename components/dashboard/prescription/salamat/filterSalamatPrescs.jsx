import { Tooltip } from "primereact/tooltip";
import RangeDatePicker from "components/commonComponents/datepicker/rangeDatePicker";

const FilterSalamatPrescs = ({
  SetRangeDate,
  applyFilterOnSalamatPrescs,
  getAllSalamatPrescRecords,
}) => {
  return (
    <>
      <div>
        <label className="lblAbs fw-bold font-13">جستجوی پیشرفته نسخ</label>
        <div className="card shadow-sm ">
          <form onSubmit={applyFilterOnSalamatPrescs}>
            <div className=" card-body row align-items-center mt-2 searchContainerPadding receptionSearch-header">
              <div className="col-lg-5 col-12">
                <label className="lblAbs font-12">کد ملی بیمار</label>
                <input
                  type="text"
                  dir="ltr"
                  name="patientNID"
                  id="patientNID"
                  className="form-control rounded-sm font-11 articleSearchInput"
                />
              </div>

              <div className="col-lg-5 col-12">
                <RangeDatePicker SetRangeDate={SetRangeDate} />
              </div>

              <div className="col-lg-2 col-12 gap-1 d-flex searchReceptionBtn justify-center">
                {/* {!searchIsLoading ? ( */}
                <>
                  <button className="btn btn-primary w-48 d-flex justify-center align-items-center">
                    <i className="fe fe-search"></i>
                  </button>
                </>
                {/* ) : ( */}
                {/* <button
                type="submit"
                className="btn btn-primary w-48 d-flex align-items-center justify-center"
                disabled
              >
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                ></span>
              </button> */}
                {/* )} */}
                <button
                  onClick={getAllSalamatPrescRecords}
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
      </div>
    </>
  );
};

export default FilterSalamatPrescs;
