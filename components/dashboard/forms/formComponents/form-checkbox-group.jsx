import { useState } from "react";

const FormCheckbox = ({ data, disabled, defaultValue }) => {
  console.log({ defaultValue });
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
      <div
        className={`${data.inline && "d-inline-flex"}  ${data.className} mb-3`}
      >
        <label className="mb-3">{data.label}</label>

        {data?.values.map((option, index) => (
          <div key={index}>
            <label className="custom_check multiSelectLbl mr-2 mb-0 d-inline-flex font-14">
              {option.label}
              <input
                type="checkbox"
                name={option.label}
                value={option.value}
                id={option.value}
                className="checkbox-input frmCheckbox"
                defaultChecked={option.selected}
                onChange={handleCheckedDepartments}
                disabled={disabled}
              />
              <span className="checkmark" />
            </label>
          </div>
        ))}
      </div>
    </>
  );
};

export default FormCheckbox;
