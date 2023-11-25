import { useState } from "react";
import FeatherIcon from "feather-icons-react";
import DtPicker, { convertToFa } from "react-calendar-datetime-picker";
import "react-calendar-datetime-picker/dist/index.css";

const SingleDatePicker = ({ setDate, label }) => {
  const handleDateChange = (e) => {
    if (e?.month.toString().length === 1) {
      e.month = "0" + e.month.toString();
    }
    if (e?.day.toString().length === 1) {
      e.day = "0" + e.day;
    }

    const pickedDate = e?.year + "/" + e?.month + "/" + e?.day;
    setDate(pickedDate);
  };

  return (
    <>
      <div className="datePickerContainer d-flex align-items-center">
        <label className="lblAbs datePickerLbl font-12">{label}</label>
        <DtPicker
          onChange={handleDateChange}
          type="single"
          local="fa"
          inputClass="datePickerInput rounded font-12"
          headerClass="datePickerHeader"
          calenderModalClass="calenderModalContainer"
          placeholder="&nbsp;"
          daysClass="fullDay"
          inputName="date"
          name="selectedDate"
          //   initValue={initialDate}
        />

        <i className="calendarIcon text-secondary">
          <FeatherIcon icon="calendar" />
        </i>
      </div>
    </>
  );
};

export default SingleDatePicker;
