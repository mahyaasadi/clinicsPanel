import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";

const FormFile = ({ data }) => {
  return (
    <>
      <div className="form-group mt-2">
        <label className="text-secondary">
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
          type="file"
          className={`upload ${data.className}`}
          name={data.name}
          // onChange={displayNewAvatar}
          required={data.required}
          placeholder={data.label}
          multiple={data.multiple}
        />
      </div>
    </>
  );
};

export default FormFile;
