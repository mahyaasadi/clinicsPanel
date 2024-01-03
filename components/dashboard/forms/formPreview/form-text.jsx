import { Tooltip } from "primereact/tooltip";

const FormText = ({ data, defaultValue }) => {
  return (
    <>
      <div className={data.className.replace("form-control", "") + " mt-3"}>
        <label className="lblAbs font-12">
          {data.label} {data.required && <span className="text-danger">*</span>}{" "}
          {data.description && (
            <span
              className="newAppointBtn autocompleteTooltip"
              data-pr-position="top"
            >
              <span className="autocompleteTooltipIcon">?</span>
              <Tooltip target=".newAppointBtn">{data.description}</Tooltip>
            </span>
          )}
        </label>

        <input
          className={data.className}
          name={data.name}
          placeholder={data.placeholder}
          defaultValue={defaultValue ? defaultValue : data.value}
          required={data.required}
          maxLength={data.maxLength}
          type={data.subtype}
        />
      </div>
    </>
  );
};

export default FormText;
