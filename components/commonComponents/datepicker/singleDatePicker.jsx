import JDate from "jalali-date";
import FeatherIcon from "feather-icons-react";
import { DtPicker } from "react-calendar-datetime-picker";
import "react-calendar-datetime-picker/dist/style.css";
import { Tooltip } from "primereact/tooltip";

const jdate = new JDate();
const currentYear = jdate.getFullYear();
const currentMonth = jdate.getMonth();
const currentDay = jdate.getDate();

let initialDate = null;

const SingleDatePicker = ({
  setDate,
  label,
  defaultDate,
  birthDateMode,
  requiredClass,
  placeholderText,
  description,
  name,
}) => {
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

  let minimumDate = null;
  if (birthDateMode) {
    minimumDate = "";
  } else {
    minimumDate = {
      year: currentYear,
      month: currentMonth,
      day: currentDay,
    };
  }

  const handleDateChange = (e) => {
    if (e?.month.toString().length === 1) e.month = "0" + e.month.toString();
    if (e?.day.toString().length === 1) e.day = "0" + e.day;

    const pickedDate = e?.year + "/" + e?.month + "/" + e?.day;
    setDate(pickedDate);
  };

  return (
    <>
      <div className="datePickerContainer d-flex align-items-center">
        <label className="lblAbs datePickerLbl font-12">
          {label} {requiredClass && <span className="text-danger">*</span>}{" "}
          {description && (
            <span
              className="newAppointBtn autocompleteTooltip"
              data-pr-position="top"
            >
              <span className="autocompleteTooltipIcon">?</span>
              <Tooltip target=".newAppointBtn">{description}</Tooltip>
            </span>
          )}
        </label>
        <DtPicker
          onChange={handleDateChange}
          type="single"
          local="fa"
          inputClass={"datePickerInput rounded font-12 " + name}
          headerClass="datePickerHeader"
          calenderModalClass="calenderModalContainer"
          placeholder={placeholderText ? placeholderText : "&nbsp;"}
          daysClass="fullDay"
          name={name}
          initValue={initialDate}
          minDate={minimumDate}
          required={requiredClass ? requiredClass : false}
        />

        <i className="calendarIcon text-secondary">
          <FeatherIcon icon="calendar" />
        </i>
      </div>
    </>
  );
};

export default SingleDatePicker;
