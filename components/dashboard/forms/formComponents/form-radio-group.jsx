import { useState, useEffect } from "react";
import { Tooltip } from "primereact/tooltip";
import RadioButton from "components/commonComponents/radioButton";

const FormRadioGroup = ({ data, defaultValue }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const onChangeRadio = (e) => setSelectedOption(e.target.value);

  useEffect(() => {
    const defaultSelectedOption = data.values.find(
      (option) => option.value === defaultValue
    );

    if (defaultSelectedOption) {
      defaultSelectedOption.selected = true;
      setSelectedOption(defaultSelectedOption.value);
    }
  }, [data.values]);

  return (
    <>
      <div className="mt-2">
        <label className="font-13 text-secondary">
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
      </div>

      <div className={data.inline ? "d-inline-flex" : "d-flex flex-col"}>
        {data.values.map((option, index) => (
          <RadioButton
            key={index}
            id={option.value}
            name={data.name}
            value={option.value}
            onChange={onChangeRadio}
            checked={selectedOption === option.value}
            text={option.label}
            requiredOption={data.required}
          />
        ))}
      </div>
    </>
  );
};

export default FormRadioGroup;
