import { Tooltip } from "primereact/tooltip";

const FormTextarea = ({ data, defaultValue, disabled }) => {
  return (
    <>
      <div className={`${data.className.replace("form-control", "")} mb-3`}>
        <label className="lblAbs font-13">
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

        <textarea
          type={data.subtype}
          className={`${data.className} floating inputPadding rounded`}
          name={data.name}
          defaultValue={defaultValue ? defaultValue : data.value}
          key={data.name}
          rows={data.rows}
          maxLength={data.maxLength}
          placeholder={data.placeholder}
          required={data.required}
          disabled={disabled}
        ></textarea>
      </div>
    </>
  );
};

export default FormTextarea;
