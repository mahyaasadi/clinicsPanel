
import { useState, useEffect } from "react";
import RadioButton from "components/commonComponents/radioButton";

const FormRadioGroup = ({ data }) => {

  const [selectedOption, setSelectedOption] = useState(null);

  const onChangeRadio = (e) => {
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
    // Find the default selected option and set it as the initial state
    const defaultSelectedOption = data.values.find((option) => option.selected);
    if (defaultSelectedOption) {
      setSelectedOption(defaultSelectedOption.value);
    }
  }, [data.values]);

  return (
    <>
      {data.values.map((option, index) => (
        <RadioButton
          key={index}
          id={option.value}
          name={option.label}
          value={option.value}
          onChange={onChangeRadio}
          checked={selectedOption === option.value}
          text={option.label}
        />
      ))}
    </>
  );
};

export default FormRadioGroup;
