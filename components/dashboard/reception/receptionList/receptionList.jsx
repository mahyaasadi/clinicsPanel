import ReceptionItem from "./receptionItem";

const ReceptionList = ({ data, deleteReception }) => {
  return (
    <>
      <div className="row p-4">
        {data.map((item, index) => (
          <ReceptionItem
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
