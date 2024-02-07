import { useState, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { Tooltip } from "primereact/tooltip";

const FormAutoComplete = ({ data, defaultValue }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  let options = [];
  for (let i = 0; i < data?.values.length; i++) {
    const element = data?.values[i];
    let obj = {
      id: element.value,
      name: element.label,
      selected: element.selected,
    };
    options.push(obj);
  }

  const handleSelect = (selected) => setSelectedOption(selected);

  useEffect(() => {
    if (defaultValue) {
      const defaultSelectedOption = data?.values.find(
        (option) => option.label === defaultValue
      );

      if (defaultSelectedOption) {
        setSelectedOption({
          id: defaultSelectedOption.value,
          name: defaultSelectedOption.label,
          selected: defaultSelectedOption.selected,
        });
      }
    }
  }, [data.values]);

  return (
    <div className="container">
      <label htmlFor="autocompleteInput" className="form-label">
        {data.label} {data.required && <span className="text-danger">*</span>}
      </label>
      <span
        className="newAppointBtn autocompleteTooltip"
        tooltip={data.description}
        data-pr-position="top"
      >
        <span className="autocompleteTooltipIcon">?</span>
        <Tooltip target=".newAppointBtn">{data.description}</Tooltip>
      </span>

      <input
        type="hidden"
        name={data.name}
        value={selectedOption ? selectedOption?.name : ""}
      />

      <Typeahead
        id="autocompleteInput"
        labelKey="name"
        options={options}
        placeholder={data.placeholder}
        onChange={(selected) => handleSelect(selected[0])}
        required={data.required}
        defaultSelected={selectedOption ? [selectedOption] : []}
      />
      <p>{selectedOption ? selectedOption?.name : ""}</p>
    </div>
  );
};

export default FormAutoComplete;
