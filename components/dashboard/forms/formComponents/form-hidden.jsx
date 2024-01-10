const FormHidden = ({ data }) => {
  return (
    <>
      <div className="">
        <input type="hidden" name={data.name} value={data.value} />
      </div>
    </>
  );
};

export default FormHidden;
