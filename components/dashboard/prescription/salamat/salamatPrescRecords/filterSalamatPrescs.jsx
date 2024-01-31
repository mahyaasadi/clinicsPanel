import { useState } from "react";
import JDate from "jalali-date";
import { Tooltip } from "primereact/tooltip";
import { axiosClient } from "@/class/axiosConfig";
import { ErrorAlert, WarningAlert } from "class/AlertManage";
import { Dropdown } from "primereact/dropdown";
import { dateShortcutsData } from "class/staticDropdownOptions";
import { handleDateOptionsSelect } from "utils/defaultDateRanges";
import RangeDatePicker from "components/commonComponents/datepicker/rangeDatePicker";

const FilterSalamatPrescs = ({
  ClinicID,
  applyFilterOnSalamatPrescs,
  getAllSalamatPrescRecords,
}) => {
  const [applyIsLoading, setApplyIsLoading] = useState(false);
  const [selectedDateOption, setSelectedDateOption] = useState(null);
  const [dateFromOption, setDateFromOption] = useState(null);
  const [dateToOption, setDateToOption] = useState(null);

  // Filter PrescriptionRecords
  let dateFrom = "";
  let dateTo = "";
  const SetRangeDate = (dateF, dateT) => {
    dateFrom = dateF;
    dateTo = dateT;
  };

  const _applyFilterOnSalamatPrescs = (e) => {
    e.preventDefault();
    setApplyIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "BimehSalamat/SearchSamadCode/ByDate";
    let data = {
      SavePresc: 1,
      Status: "O",
      CenterID: ClinicID,
      NID: formProps.patientNID,
      DateFrom: dateFromOption
        ? dateFromOption.replaceAll(/\//g, "")
        : dateFrom
        ? dateFrom.replaceAll(/\//g, "")
        : "",
      DateTo: dateToOption
        ? dateToOption.replaceAll(/\//g, "")
        : dateTo
        ? dateTo.replaceAll(/\//g, "")
        : "",
    };

    if (!dateFrom && !dateFromOption) {
      WarningAlert("هشدار", "انتخاب بازه زمان الزامی است!");
      setApplyIsLoading(false);
    } else {
      axiosClient
        .post(url, data)
        .then((response) => {
          if (response.data.res.info) {
            applyFilterOnSalamatPrescs(response.data.res.info);
            setApplyIsLoading(false);
          } else {
            setApplyIsLoading(false);
            ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
          }
          if (response.data.res.resCode === -9322) {
            WarningAlert("", "داده ای یافت نشد!");
          }
        })
        .catch((err) => {
          console.log(err);
          ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
          setApplyIsLoading(false);
        });
    }
  };

  const handleSelect = (option) => {
    handleDateOptionsSelect(
      option,
      setSelectedDateOption,
      setDateFromOption,
      setDateToOption
    );
  };

  return (
    <>
      <>
        <label className="lblAbs fw-bold font-13">جستجوی پیشرفته نسخ</label>
        <div className="card shadow-sm ">
          <form onSubmit={_applyFilterOnSalamatPrescs}>
            <div className=" card-body row align-items-center mt-2 searchContainerPadding receptionSearch-header">
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
              <div className="col-md-12 col-lg-3">
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

              <div className="col-lg-2 col-12 gap-1 d-flex searchReceptionBtn justify-center">
                {!applyIsLoading ? (
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
      </>
    </>
  );
};

export default FilterSalamatPrescs;
