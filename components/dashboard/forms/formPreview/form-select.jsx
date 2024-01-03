import { Tooltip } from "primereact/tooltip";
import SelectField from "components/commonComponents/selectfield";
import selectfieldColourStyles from "class/selectfieldStyle";

const FormSelect = ({ data }) => {
  // console.log({ data });

  let selectedOption = null;
  const FUSelectOption = (value) => (selectedOption = value);

  return (
    <>
      <div className={data.className.replace("form-control", "")}>
        <label className="lblDrugIns font-11">
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

        <SelectField
          styles={selectfieldColourStyles}
          options={data.values}
          label={true}
          className={"text-center font-12"}
          placeholder={data.placeholder}
          name={data.name}
          onChangeValue={(value) => FUSelectOption(value?.value)}
          required={data.required}
          isClearable
        />
      </div>
    </>
  );
};

export default FormSelect;
