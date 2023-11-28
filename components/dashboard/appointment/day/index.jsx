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
  return (
    // <Draggable draggableId={date} index={index}>
    //   {(provided) => (
    <div
      // ref={provided.innerRef}
      // {...provided.draggableProps}
      // {...provided.dragHandleProps}
      className="day"
      // style={{ position: "fixed" }}
    >
      <div className="">
        <div class="date">
          <p class="date-num">{date[2]}</p>
          <p class="date-day">{month[date[1]]}</p>
        </div>
      </div>

      <div class="events shadow">
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
