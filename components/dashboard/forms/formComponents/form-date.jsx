import { useState } from "react";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";
import { Tooltip } from "primereact/tooltip";

const FormDate = ({ data }) => {
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
                className="form-control"
                placeholder={data.placeholder}
              />
            </div>
          )
        )}
      </div>
    </>
  );
};

export default FormDate;
