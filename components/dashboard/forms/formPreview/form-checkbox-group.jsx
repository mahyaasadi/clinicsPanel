import { useState } from "react";

const FormCheckbox = ({ data }) => {
  const [departmentsCheckboxStatus, setDepartmentsCheckboxStatus] = useState({
    departmentsOptionsList: [],
  });

  const handleCheckedDepartments = (e) => {
    const { value, checked } = e.target;
    const { departmentsOptionsList } = departmentsCheckboxStatus;

    console.log(`${value} is ${checked}`);

    checked
      ? setDepartmentsCheckboxStatus({
        departmentsOptionsList: [...departmentsOptionsList, value],
      })
      : setDepartmentsCheckboxStatus({
        departmentsOptionsList: departmentsOptionsList.filter(
          (e) => e !== value
        ),
      });
  };

  return (
    <>
      {data?.values.map((option, index) => (
        <div className="" key={index}>
          <input
            key={index}
            type="checkbox"
            name={option.label}
            value={option.value}
            id={option.value}
            className="checkbox-input frmCheckbox"
            defaultChecked={option.selected}
            onChange={handleCheckedDepartments}
          />

          <label htmlFor={option.value}>{option.label}</label>
        </div>
      ))}
    </>
  );
};

export default FormCheckbox;