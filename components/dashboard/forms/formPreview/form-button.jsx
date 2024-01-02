const FormButton = ({ data }) => {
  console.log({ data });
  return (
    <>
      <button
        type={data.subtype}
        className={data.className}
        value={data.value}
        name={data.name}
      >
        {data.label}
      </button>
    </>
  );
};

export default FormButton;
