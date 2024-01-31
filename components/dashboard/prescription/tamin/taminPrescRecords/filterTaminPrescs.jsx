import { useState, useEffect } from "react";
import JDate from "jalali-date";
import { Tooltip } from "primereact/tooltip";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, WarningAlert } from "class/AlertManage";
import { Dropdown } from "primereact/dropdown";
import { dateShortcutsData } from "class/staticDropdownOptions";
import { handleDateOptionsSelect } from "utils/defaultDateRanges";
import RangeDatePicker from "components/commonComponents/datepicker/rangeDatePicker";

const FilterTaminPrescs = ({
  ClinicID,
  applyFilterOnTaminPrescs,
  getAllTaminPrescRecords,
}) => {
  const [applyIsLoading, setApplyIsLoading] = useState(false);
  const [selectedDateOption, setSelectedDateOption] = useState(null);
  const [dateFromOption, setDateFromOption] = useState(null);
  const [dateToOption, setDateToOption] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);

  let dateFrom,
    dateTo = null;
  const SetRangeDate = (f, t) => {
    dateFrom = f;
    dateTo = t;
  };

  const _applyFilterOnTaminPrescs = (e) => {
    e.preventDefault();
    setApplyIsLoading(true);

    let url = "BimehTamin/CenterPrescription";
    let data = {
      CenterID: ClinicID,
      dateFrom: dateFromOption
        ? dateFromOption.replaceAll(/\//g, "")
        : dateFrom
        ? dateFrom.replaceAll(/\//g, "")
        : "",
      dateTo: dateToOption
        ? dateToOption.replaceAll(/\//g, "")
        : dateTo
        ? dateTo.replaceAll(/\//g, "")
        : "",
      NID: isNaN(patientInfo) ? null : patientInfo,
      Name: isNaN(patientInfo) ? patientInfo : null,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        applyFilterOnTaminPrescs(response.data.result);
        if (response.data.result.length == 0) {
          WarningAlert("", "داده ای یافت نشد!");
        }

        //reset
        setApplyIsLoading(false);
        setPatientInfo(null);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "دریافت اطلاعات نسخ با خطا مواجه گردید!");
        setApplyIsLoading(false);
      });
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
      <div>
        <label className="lblAbs fw-bold font-13">جستجوی پیشرفته نسخ</label>
        <div className="card shadow-sm">
          <div className="card-header border-bottom-0 margin-top-1 marginb-md1">
            <form onSubmit={_applyFilterOnTaminPrescs}>
              <div className="row">
                <div className="col-md-12 col-md-9 col-lg-3 mt-3">
                  <div className="input-group">
                    <label className="lblAbs font-12 ">
                      کد ملی / نام بیمار
                    </label>
                    <input
                      type="text"
                      name="patientInfo"
                      className="form-control rounded text-center"
                      value={patientInfo}
                      onChange={(e) => setPatientInfo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-12 col-md-9 col-lg-3 mt-3">
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

                <div className="col-md-12 col-lg-3 mt-3">
                  <RangeDatePicker SetRangeDate={SetRangeDate} />
                </div>

                <div className="col-md-12 col-lg-3 mt-3 row">
                  <div className="col-6">
                    {!applyIsLoading ? (
                      <>
                        <button type="submit" className="btn btn-primary w-100">
                          <i className="fe fe-search"></i>
                        </button>
                      </>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled
                      >
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                        ></span>
                      </button>
                    )}
                  </div>

                  <div className="col-6">
                    <button
                      onClick={getAllTaminPrescRecords}
                      data-pr-position="top"
                      className="btn btn-primary refreshBtn w-100"
                    >
                      <i className="fa fa-refresh"></i>
                      <Tooltip target=".refreshBtn">تنظیم مجدد</Tooltip>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterTaminPrescs;
