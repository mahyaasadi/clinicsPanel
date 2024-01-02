const FormParagraph = ({ data }) => {
  return (
    <>
      {data.subtype === "p" ? (
        <p className={data.className}>{data.label}</p>
      ) : data.subtype === "blockquote" ? (
        <blockquote className={data.className}>{data.label}</blockquote>
      ) : data.subtype === "address" ? (
        <address className={data.className}>{data.label}</address>
      ) : data.subtype === "canvas" ? (
        <canvas className={data.className}>{data.label}</canvas>
      ) : data.subtype === "output" ? (
        <output className={data.className}>{data.label}</output>
      ) : (
        ""
      )}
    </>
  );
};

export default FormParagraph;
