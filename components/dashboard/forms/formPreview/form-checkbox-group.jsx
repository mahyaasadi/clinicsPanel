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
      <div
        className={`${data.inline && "d-inline-flex"}  ${data.className} mb-3`}
      >
        {data?.values.map((option, index) => (
          <div key={index}>
            {/* <input
            // key={index}
            type="checkbox"
            name={option.label}
            value={option.value}
            id={option.value}
            className="checkbox-input frmCheckbox"
            defaultChecked={option.selected}
            onChange={handleCheckedDepartments}
          />

          <label htmlFor={option.value}>{option.label}</label> */}

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
