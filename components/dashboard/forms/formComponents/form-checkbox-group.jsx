const FormCheckbox = ({ data, disabled, defaultValue }) => {
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
                defaultChecked={
                  defaultValue
                    ? defaultValue.includes(option.value)
                    : option.selected
                }
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
