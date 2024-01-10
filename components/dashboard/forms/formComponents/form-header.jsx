const FormHeader = ({ data, index }) => {
  return (
    <>
      {index !== 0 && <hr className="mt-4" />}
      <div className="mt-1 mb-5 text-center">
        {data.subtype === "h1" ? (
          <h1>{data.label}</h1>
        ) : data.subtype === "h2" ? (
          <h2>{data.label}</h2>
        ) : data.subtype === "h3" ? (
          <h3>{data.label}</h3>
        ) : data.subtype === "h4" ? (
          <h4>{data.label}</h4>
        ) : data.subtype === "h5" ? (
          <h5>{data.label}</h5>
        ) : (
          <h6>{data.label}</h6>
        )}
      </div>
    </>
  );
};

export default FormHeader;
