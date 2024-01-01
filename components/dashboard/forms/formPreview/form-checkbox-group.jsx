import { useState } from "react";
import RadioButton from "components/commonComponents/radioButton";

const FormCheckbox = ({ data }) => {
  console.log({ data });
  const [selectedOption, setSelectedOption] = useState(null);

  const onChangeRadio = (e, option) => {
    const { name, value } = e.target;
    setSelectedOption(option.value);

    console.log({ name });

    if (value === option.value) option.selected = true;

    // if (name === option.value) {
    //   console.log("object");
    //   setHasQrCode({ QRCode: true, noQRCode: false });
    // }
    // if (name === "noQRCode") {
    //   setHasQrCode({ QRCode: false, noQRCode: true });
    // }
  };

  return (
    <>
      {data.values.map((option, index) => (
        <RadioButton
          key={index}
          id={option.value}
          name={option.label}
          value={option.value}
          onChange={(e) => onChangeRadio(e, option)}
          checked={option.selected}
          text={option.label}
        />
      ))}
    </>
  );
};

export default FormCheckbox;

// <label htmlFor={id} className="radio-label">
// <input
//   className="radio-input"
//   type="radio"
//   name={name}
//   id={id}
//   value={value}
//   onChange={onChange}
//   checked={checked}
// />
// <span className="custom-radio" />
// {text}
// </label>
