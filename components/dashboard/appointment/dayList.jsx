import Day from "./day";

const DayList = ({ data, Dates }) => {
  //   console.log(data);

  //   let arr = Object.entries(data);
  //   console.log(arr);

  return (
    <>
      {Dates.map((date) => {
        // console.log(data[date]);
        return <Day date={date} key={date} appointment={data[date]} />;
      })}
    </>
  );
};
export default DayList;
