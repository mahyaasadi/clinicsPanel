const FormButton = ({ data, defaultValue, disabled }) => {
  return (
    <div className="d-flex justify-center">
      <button
        type={data.subtype}
        className={data.className + " w-25"}
        value={data.value}
        name={data.name}
        disabled={disabled}
      >
        {data.label}
      </button>
    </div>
  );
};

export default FormButton;
