import { useState, useEffect } from "react";

const FormCheckbox = ({ data, disabled, defaultValue, defaultSelected }) => {
  console.log({ data });
  console.log({ defaultValue, defaultSelected });

  if (defaultSelected) {
    console.log(defaultSelected[data.name]);
  }

  // const [frmCheckboxStatus, setFrmCheckboxStatus] = useState({
  //   frmOptionsList: [],
  // });

  // const _handleCheckedDepartments = (e) => {
  //   const { value, checked } = e.target;
  //   const { frmOptionsList } = frmCheckboxStatus;

  //   console.log(`${value} is ${checked}`);

  //   checked
  //     ? setFrmCheckboxStatus((prevState) => ({
  //         frmOptionsList: [...prevState.frmOptionsList, value],
  //       }))
  //     : setFrmCheckboxStatus((prevState) => ({
  //         frmOptionsList: prevState.frmOptionsList.filter((e) => e !== value),
  //       }));
  // };

  // useEffect(() => {
  //   data.values.map((x) => {
  //     if (x.selected) {
  //       setFrmCheckboxStatus((prevState) => ({
  //         frmOptionsList: [...prevState.frmOptionsList, x.value],
  //       }));
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   getCheckedBoxes(frmCheckboxStatus);
  // }, [frmCheckboxStatus]);

  return (
    <>
      <div
        className={`${data.inline && "d-inline-flex"} ${data.className} mb-3`}
      >
        <label className="mb-3">{data.label}</label>

        {data?.values.map((option, index) => (
          <div key={index}>
            <label className="custom_check multiSelectLbl mr-2 mb-0 d-inline-flex font-14">
              {option.label}
              <input
                type="checkbox"
                name={data.name}
                value={option.value}
                id={option.value}
                className="checkbox-input frmCheckbox"
                defaultChecked={option.selected}
                // onChange={_handleCheckedDepartments}
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
