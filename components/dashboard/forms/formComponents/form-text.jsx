import { Tooltip } from "primereact/tooltip";

const FormText = ({ data, defaultValue, disabled, formDirection }) => {
  return (
    <>
      <div
        className={`
         ${data.className.replace("form-control", "")} my-4 ${
          formDirection ? "dir-ltr" : "dir-rtl"
        }`}
      >
        <label
          className={`lblAbs font-12 fw-bold ${
            formDirection ? "dir-ltr mx-3" : "dir-rtl"
          }`}
        >
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
          className={`${data.className} p-4`}
          name={data.name}
          placeholder={data.placeholder}
          defaultValue={defaultValue ? defaultValue : data.value}
          required={data.required}
          maxLength={data.maxLength}
          type={data.subtype}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default FormText;
