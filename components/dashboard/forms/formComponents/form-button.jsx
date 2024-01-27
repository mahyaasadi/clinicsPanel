const FormButton = ({ data, defaultValue, disabled }) => {
  console.log({ defaultValue });
  return (
    <>
      <button
        type={data.subtype}
        className={data.className + " w-50"}
        value={data.value}
        name={data.name}
        disabled
      >
        {data.label}
      </button>
    </>
  );
};

export default FormButton;
