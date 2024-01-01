import { useState, useEffect } from "react";
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const FormAutoComplete = ({ data }) => {
  console.log({ data });

  const [selectedOption, setSelectedOption] = useState(null);

  let options = []
  for (let i = 0; i < data?.values.length; i++) {
    const element = data?.values[i];
    let obj = {
      id: element.value,
      name: element.label,
      selected: element.selected
    }
    options.push(obj)
  }

  useEffect(() => {
    const defaultSelectedOption = data?.values.find((option) => option.selected);
    if (defaultSelectedOption) {
      setSelectedOption({ id: defaultSelectedOption.value, name: defaultSelectedOption.label, selected: defaultSelectedOption.selected });
    }
  }, [data.values]);

  const handleSelect = (selected) => {
    setSelectedOption(selected);
  };

  return (
    <div className="container mt-5">
      <label htmlFor="autocompleteInput" className="form-label">React Autocomplete:</label>
      <Typeahead
        id="autocompleteInput"
        labelKey="name"
        options={options}
        placeholder="Start typing..."
        onChange={selected =>
          handleSelect(selected[0])
        }
      />
      <p>Selected Option: {selectedOption?.name ? selectedOption?.name : selectedOption?.label ? selectedOption?.label : 'None'}</p>
    </div>
  );
};

export default FormAutoComplete;