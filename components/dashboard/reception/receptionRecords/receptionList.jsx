import RecordItem from "./recordItem";

const ReceptionList = ({ data, deleteReception }) => {
  return (
    <>
      <div className="row p-4">
        {data.map((item, index) => (
          <RecordItem
            key={index}
            srv={item}
            deleteReception={deleteReception}
          />
        ))}
      </div>
    </>
  );
};

export default ReceptionList;
