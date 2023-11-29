import Event from "../event";
// import { Draggable } from "react-beautiful-dnd";

let month = {
  "01": "فروردین",
  "02": "اردیبهشت",
  "03": "خرداد",
  "04": "تیر",
  "05": "مرداد",
  "06": "شهریور",
  "07": "مهر",
  "08": "آبان",
  "09": "آذر",
  10: "دی",
  11: "بهمن",
  12: "اسفند",
};

const Day = ({ date, appointment, index }) => {
  // console.log({ appointment });
  date = date.split("/");
  let left = 200;
  return (
    // <Draggable draggableId={date} index={index}>
    //   {(provided) => (
    <div
      // ref={provided.innerRef}
      // {...provided.draggableProps}
      // {...provided.dragHandleProps}
      className="day"
    >
      <div className=""></div>

      <div className="events shadow">
        <div className="date">
          <p className="date-num">{date[2]}</p>
          <p className="date-day">{month[date[1]]}</p>
        </div>
        {appointment?.map((event) => {
          return <Event key={event._id} data={event} />;
        })}
      </div>
    </div>
    // )}
    // </Draggable>
  );
};

export default Day;
