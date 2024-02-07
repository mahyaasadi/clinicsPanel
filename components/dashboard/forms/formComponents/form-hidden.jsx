const FormHidden = ({ data }) => {
  return (
    <>
      <div>
        <input type="hidden" name={data.name} value={data.value} />
      </div>
    </>
  );
};

export default FormHidden;
