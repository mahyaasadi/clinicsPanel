import RecordItem from "./recordItem";

const ReceptionList = ({ data }) => {
  console.log({ data });

  return (
    <>
      <div className="row p-4">
        {data.map((item, index) => (
          <RecordItem key={index} srv={item} />
        ))}
      </div>
    </>
  );
};

export default ReceptionList;
