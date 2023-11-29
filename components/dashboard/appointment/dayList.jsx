import Day from "./day";
// import { Droppable } from "react-beautiful-dnd";

const DayList = ({ data, Dates }) => {
  // console.log({ data, Dates });

  return (
    <>
      {/* <Droppable droppableId="days" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="row"
          > */}
      {Dates.map((date, index) => {
        // console.log(data[date]);
        return (
          <Day date={date} key={date} index={index} appointment={data[date]} />
        );
      })}
      {/* {provided.placeholder} */}
      {/* </div> */}
      {/* //   )} */}
      {/* // </Droppable> */}
    </>
  );
};

export default DayList;