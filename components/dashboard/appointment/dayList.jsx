import Day from "./day";
import JDate from "jalali-date";
import FeatherIcon from "feather-icons-react";

const jdate = new JDate();

const DayList = ({
  data,
  Dates,
  DatesDays,
  openNewAppointmentModal,
  openEditAppointmentModal,
  openDuplicateModal,
  deleteAppointment,
  depOpeningHour,
  Hours,
  displayNextFiveDays,
  displayLastFiveDays,
}) => {
  let currentMonth = jdate.format("MMM YYYY");
  let todaysDate = String(jdate.getDate());

  return (
    <div className="appointmentTableContainer">
      <div className="d-flex justify-center ">
        <button
          className="btn btn-outline-primary font-14 d-flex align-items-center justify-center gap-1 h-35 nextDaysBtn"
          onClick={displayNextFiveDays}
        >
          <FeatherIcon icon="chevron-right" />
          <p className="mb-1">بعدی</p>
        </button>
        <div className="col currentMonthContainer text-secondary fw-bold text-center">
          {currentMonth}
        </div>
        <button
          className="btn btn-outline-primary font-14 d-flex align-items-center justify-center gap-1 h-35 prevDaysBtn"
          onClick={displayLastFiveDays}
        >
          <p className="mb-1">قبلی</p>
          <FeatherIcon icon="chevron-left" />
        </button>
      </div>

      <div className="tContainer">
        <table className="table">
          <thead className="bg-light text-secondary">
            <tr>
              <th></th>
              {Dates.map(
                (date, index) => (
                  (date = date.split("/")),
                  (
                    <th key={index}>
                      <div className="date d-flex flex-col">
                        <div className="mb-1">{DatesDays[index]}</div>
                        <div className="d-flex align-items-center">
                          <p
                            className={`${date[2] === todaysDate ? "todaysDate" : ""
                              } date-num DateDayContainer`}
                          >
                            {date[2]}
                          </p>
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
              <td>
                <div className="timeline text-secondary font-13">{Hours}</div>
              </td>
              {Dates.map((date, index) => {
                return (
                  <td key={index} className="p-0">
                    <Day
                      date={date}
                      appointment={data[date]}
                      openNewAppointmentModal={openNewAppointmentModal}
                      openEditAppointmentModal={openEditAppointmentModal}
                      openDuplicateModal={openDuplicateModal}
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
