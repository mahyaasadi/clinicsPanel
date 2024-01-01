const FormButton = ({ data }) => {
  console.log({ data });
  return (
    <>
      <button type={data.subtype} className={data.className} value={data.value}>
        {data.label}
      </button>
    </>
  );
};

export default FormButton;
