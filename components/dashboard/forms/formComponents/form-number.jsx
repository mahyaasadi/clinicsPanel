import { Tooltip } from "primereact/tooltip";

const FormNumber = ({ data, defaultValue, disabled, formDirection }) => {
  return (
    <>
      <div className="w-25 mt-3">
        <label className="lblAbs font-12">
          {data.label} {data.required && <span className="text-danger">*</span>}
          {data.description && (
            <span
              className="newAppointBtn autocompleteTooltip"
              data-pr-position="top"
            >
              <span className="autocompleteTooltipIcon">?</span>
              <Tooltip target=".newAppointBtn">{data.description}</Tooltip>
            </span>
          )}{" "}
        </label>

        <input
          className={data.className}
          type="number"
          name={data.name}
          defaultValue={defaultValue ? defaultValue : data.value}
          required={data.required}
          placeholder={data.placeholder}
          min={data.min}
          max={data.max}
          step={data.step}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default FormNumber;
