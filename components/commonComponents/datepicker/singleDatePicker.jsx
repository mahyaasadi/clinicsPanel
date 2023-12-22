import JDate from "jalali-date";
import FeatherIcon from "feather-icons-react";
import DtPicker, { convertToFa } from "react-calendar-datetime-picker";
import "react-calendar-datetime-picker/dist/index.css";

const jdate = new JDate();
const currentYear = jdate.getFullYear();
const currentMonth = jdate.getMonth();
const currentDay = jdate.getDate();

let initialDate = null;

const SingleDatePicker = ({ setDate, label, defaultDate }) => {
  if (defaultDate) {
    defaultDate = defaultDate.replaceAll(/\//g, "");
    initialDate = {
      year: parseInt(defaultDate.substr(0, 4)),
      month: parseInt(defaultDate.substr(4, 2)),
      day: parseInt(defaultDate.substr(6, 2)),
    };
  } else {
    initialDate = {
      year: currentYear,
      month: currentMonth,
      day: currentDay,
    };
  }

  const minimumDate = {
    year: currentYear,
    month: currentMonth,
    day: currentDay,
  };

  const handleDateChange = (e) => {
    if (e?.month.toString().length === 1) e.month = "0" + e.month.toString();
    if (e?.day.toString().length === 1) e.day = "0" + e.day

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
          initValue={initialDate}
          minDate={minimumDate}
        />

        <i className="calendarIcon text-secondary">
          <FeatherIcon icon="calendar" />
        </i>
      </div>
    </>
  );
};

export default SingleDatePicker;
