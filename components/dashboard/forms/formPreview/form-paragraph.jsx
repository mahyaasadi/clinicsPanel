const FormParagraph = ({ data }) => {
  // console.log({ data });

  return (
    <>
      {data.subtype === "p" ? (
        <p className={data.className}>{data.label}</p>
      ) : data.subtype === "blockquote" ? (
        <blockquote className={data.className}>{data.label}</blockquote>
      ) : data.subtype === "address" ? (
        <address className={data.className}>{data.label}</address>
      ) : data.subtype === "canvas" ? (
        <canvas>{data.label}</canvas>
      ) : (
        ""
      )}
    </>
  );
};

export default FormParagraph;
