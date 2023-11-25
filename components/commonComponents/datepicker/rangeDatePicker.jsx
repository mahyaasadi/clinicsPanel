import { useState } from "react";
import FeatherIcon from "feather-icons-react";
import DtPicker, { convertToFa } from "react-calendar-datetime-picker";
import "react-calendar-datetime-picker/dist/index.css";

const RangeDatePicker = ({ SetRangeDate }) => {
  const setLocalDate = (value) => {
    let dateFrom =
      value?.from?.year.toString() +
      "/" +
      (value?.from?.month < 10
        ? "0" + value?.from?.month
        : value?.from?.month.toString()) +
      "/" +
      (value?.from?.day < 10
        ? "0" + value?.from?.day
        : value?.from?.day.toString());

    let dateTo =
      value?.to?.year.toString() +
      "/" +
      (value?.to?.month < 10
        ? "0" + value?.to?.month
        : value?.to?.month.toString()) +
      "/" +
      (value?.to?.day < 10 ? "0" + value?.to?.day : value?.to?.day.toString());

    SetRangeDate(dateFrom, dateTo);
  };

  return (
    <>
      <div className="datePickerContainer d-flex align-items-center">
        <label className="lblAbs datePickerLbl font-11">بازه تاریخ</label>
        <DtPicker
          onChange={setLocalDate}
          type="range"
          local="fa"
          inputClass="datePickerInput font-11"
          headerClass="datePickerHeader"
          calenderModalClass="calenderModalContainer"
          placeholder="&nbsp;"
          inputName="date"
          clearBtn
        />

        <i className="calendarIcon text-secondary">
          <FeatherIcon icon="calendar" />
        </i>
      </div>
    </>
  );
};

export default RangeDatePicker;
