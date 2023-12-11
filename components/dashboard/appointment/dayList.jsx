import Day from "./day";
import JDate from "jalali-date";
import FeatherIcon from "feather-icons-react";

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

const jdate = new JDate();

const DayList = ({
  data,
  Dates,
  DatesDays,
  openNewAppointmentModal,
  openEditAppointmentModal,
  deleteAppointment,
  depOpeningHour,
}) => {
  let currentMonth = jdate.format("MMM");

  return (
    <div className="appointmentTableContainer">
      <div className="d-flex justify-center">

        <div className="col"></div>
        <div className="col currentMonthContainer font-17 fw-bold text-center">
          {currentMonth}
        </div>
        {/* <div className="col d-flex justify-end">
          <button className="paginateBtn">
            <FeatherIcon
              icon="arrow-right"
              style={{ width: "13px", color: "white" }}
            />
          </button>
          <button className="paginateBtn">
            <FeatherIcon
              icon="arrow-left"
              style={{ width: "13px", color: "white" }}
            />
          </button>
        </div> */}

      </div>
      <table className="table">
        <thead className="bg-light sticky-top top-0">
          <tr>
            {Dates.map(
              (date, index) => (
                (date = date.split("/")),
                (
                  // console.log(date[2][0] + date[2][1]),
                  <th key={index}>
                    <div className="date d-flex flex-col">
                      <div className="mb-1">{DatesDays[index]}</div>
                      <div className="d-flex align-items-center">
                        <p className="date-num DateDayContainer">{date[2]}</p>
                        {/* {date[2] === date[2][0] + date[2][1] ? (
                          <p className="">YYY</p>
                        ) : (
                          <p className="">NNN</p>
                        )} */}
                      </div>
                    </div>
                  </th>
                )
              )
            )}
          </tr>
        </thead>

        <tbody>
          <tr>
            {Dates.map((date, index) => {
              return (
                <td key={index} className="p-0">
                  <Day
                    date={date}
                    key={date}
                    appointment={data[date]}
                    openNewAppointmentModal={openNewAppointmentModal}
                    openEditAppointmentModal={openEditAppointmentModal}
                    deleteAppointment={deleteAppointment}
                    depOpeningHour={depOpeningHour}
                  />
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DayList;

// import Day from "./day";
// let month = {
//   "01": "فروردین",
//   "02": "اردیبهشت",
//   "03": "خرداد",
//   "04": "تیر",
//   "05": "مرداد",
//   "06": "شهریور",
//   "07": "مهر",
//   "08": "آبان",
//   "09": "آذر",
//   10: "دی",
//   11: "بهمن",
//   12: "اسفند",
// };

// const DayList = ({
//   data,
//   Dates,
//   openNewAppointmentModal,
//   openEditAppointmentModal,
//   deleteAppointment,
//   depOpeningHour,
// }) => {
//   return (
//     <>
//       <table className="table w-auto">
//         <thead className="bg-light sticky-top">
//           <tr>
//             {Dates.map((date, index) => {
//               date = date.split("/");
//               return (
//                 <th key={index}>
//                   <div className="date">
//                     <p className="date-num">{date[2]}</p>
//                     <p className="date-day">{month[date[1]]}</p>
//                   </div>
//                 </th>
//               );
//             })}
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             {Dates.map((date, index) => {
//               return (
//                 <td key={index} className="p-0">
//                   <Day
//                     date={date}
//                     key={date}
//                     appointment={data[date]}
//                     openNewAppointmentModal={openNewAppointmentModal}
//                     openEditAppointmentModal={openEditAppointmentModal}
//                     deleteAppointment={deleteAppointment}
//                     depOpeningHour={depOpeningHour}
//                   />
//                 </td>
//               );
//             })}
//           </tr>
//         </tbody>
//       </table>
//     </>
//   );
// };

// export default DayList;
