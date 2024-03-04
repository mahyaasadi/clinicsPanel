import { useState } from "react";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";
import { Tooltip } from "primereact/tooltip";

const FormDate = ({ data, defaultValue, disabled, formDirection }) => {
  const [date, setDate] = useState(null);

  return (
    <>
      <div className="">
        {data.subtype === "date" ? (
          <div className="w-25 mt-3">
            <SingleDatePicker
              setDate={setDate}
              label={data.label}
              requiredClass={data.required}
              description={data.description}
              placeholderText={data.placeholder}
              name={data.name}
              birthDateMode={true}
              defaultDate={defaultValue ? defaultValue : null}
            />
          </div>
        ) : (
          data.subtype === "time" && (
            <div className="datePickerContainer d-flex align-items-center w-50 mt-3">
              <label className="lblAbs datePickerLbl font-11">
                {data.label}
                {data.required && <span className="text-danger">*</span>}
                {data.description && (
                  <span
                    className="newAppointBtn autocompleteTooltip"
                    data-pr-position="top"
                  >
                    <span className="autocompleteTooltipIcon">?</span>
                    <Tooltip target=".newAppointBtn">
                      {data.description}
                    </Tooltip>
                  </span>
                )}
              </label>

              <input
                type="time"
                id={data.name}
                name={data.name}
                className="form-control"
                placeholder={data.placeholder}
                defaultValue={defaultValue ? defaultValue : ""}
                disabled={disabled}
              />
            </div>
          )
        )}
      </div>
    </>
  );
};

export default FormDate;
