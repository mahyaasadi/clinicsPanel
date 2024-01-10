const FormButton = ({ data }) => {
  return (
    <>
      <button
        type={data.subtype}
        className={data.className + " w-50"}
        value={data.value}
        name={data.name}
      >
        {data.label}
      </button>
    </>
  );
};

export default FormButton;
