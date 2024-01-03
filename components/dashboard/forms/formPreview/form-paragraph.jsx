const FormParagraph = ({ data }) => {
  return (
    <>
      {data.subtype === "p" ? (
        <p className={data.className} name={data.name}>
          {data.label}
        </p>
      ) : data.subtype === "blockquote" ? (
        <blockquote className={data.className} name={data.name}>
          {data.label}
        </blockquote>
      ) : data.subtype === "address" ? (
        <address className={data.className} name={data.name}>
          {data.label}
        </address>
      ) : data.subtype === "canvas" ? (
        <canvas className={data.className} name={data.name}>
          {data.label}
        </canvas>
      ) : data.subtype === "output" ? (
        <output className={data.className} name={data.name}>
          {data.label}
        </output>
      ) : (
        ""
      )}
    </>
  );
};

export default FormParagraph;
