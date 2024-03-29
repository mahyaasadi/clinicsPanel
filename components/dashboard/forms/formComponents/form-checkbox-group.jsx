const FormCheckbox = ({ data, disabled, defaultValue, formDirection }) => {
  return (
    <>
      <label
        className={`mb-3 margin-left-4 fw-bold font-15  ${
          formDirection ? "dir-ltr" : "dir-rtl"
        }`}
      >
        {data.label} :{" "}
      </label>
      <div
        className={`${data.inline && "row"} ${data.className} mb-4 ${
          formDirection ? "dir-ltr" : "dir-rtl"
        }`}
      >
        {data?.values.map((option, index) => (
          <div className="col-auto" key={index}>
            <div
              className={`form-check  ${
                formDirection ? "form-check-left" : ""
              }`}
              style={{ paddingRight: "2.5em !important" }}
            >
              <label className="form-check-label mx-2" for={option.value}>
                {option.label}
              </label>
              <input
                type="checkbox"
                name={data.name}
                value={option.value}
                id={option.value}
                className={`form-check-input  ${
                  formDirection ? "form-check-input-left" : ""
                }`}
                defaultChecked={
                  defaultValue
                    ? defaultValue.includes(option.value)
                    : option.selected
                }
                disabled={disabled}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FormCheckbox;

// <div key={index} className="">
//   <label className="custom_check multiSelectLbl mr-2 mb-0 d-inline-flex font-14 pull-left">
//     {option.label}
//   </label>
//   <input
//     type="checkbox"
//     name={data.name}
//     value={option.value}
//     id={option.value}
//     className="checkbox-input frmCheckbox"
//     defaultChecked={
//       defaultValue
//         ? defaultValue.includes(option.value)
//         : option.selected
//     }
//     disabled={disabled}
//   />
//   <span className="checkmark" />
// </div>
