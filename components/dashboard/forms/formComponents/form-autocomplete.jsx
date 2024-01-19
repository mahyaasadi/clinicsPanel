import { useState, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { Tooltip } from "primereact/tooltip";

const FormAutoComplete = ({ data }) => {
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
    const defaultSelectedOption = data?.values.find(
      (option) => option.selected
    );

    if (defaultSelectedOption) {
      setSelectedOption({
        id: defaultSelectedOption.value,
        name: defaultSelectedOption.label,
        selected: defaultSelectedOption.selected,
      });
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

      <Typeahead
        id="autocompleteInput"
        labelKey="name"
        name={data.name}
        options={options}
        placeholder={data.placeholder}
        onChange={(selected) => handleSelect(selected[0])}
        required={data.required}
      />
      {/* <p>Selected Option: {selectedOption ? selectedOption?.name : "None"}</p> */}
    </div>
  );
};

export default FormAutoComplete;
