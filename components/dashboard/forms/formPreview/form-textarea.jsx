const FormTextarea = ({ data }) => {
  console.log({ data });
  return (
    <>
      <div className={`${data.className.replace("form-control", "")} mb-3`}>
        <label className="lblAbs font-13">{data.label}</label>
        <textarea
          type={data.subtype}
          className={`${data.className} floating inputPadding rounded`}
          name={data.name}
          defaultValue={data.value}
          key={data.name}
          rows={data.rows}
        ></textarea>
      </div>
    </>
  );
};

export default FormTextarea;
