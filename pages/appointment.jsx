import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import JDate from "jalali-date";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, SuccessAlert } from "class/AlertManage";
import "/public/assets/css/appointment.css";
import DayList from "components/dashboard/appointment/dayList";
import AddNewAppointmentModal from "components/dashboard/appointment/newAppointmentModal";
import ModalitiesHeader from "components/dashboard/appointment/modalitiesHeader/modalitiesHeader";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import Loading from "components/commonComponents/loading/loading";
import { Skeleton } from "primereact/skeleton";

export const getServerSideProps = async ({ req, res }) => {
  const result = await getSession(req, res);

  if (result) {
    const { ClinicUser } = result;
    return { props: { ClinicUser } };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }
};

let ClinicID,
  ActivePatientNID,
  ActivePatientID,
  ActiveAppointmentDate,
  ActiveModalityID = null;

const Appointment = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [ActiveModalityID, setActiveModalityID] = useState(null);

  const [appointmentIsLoading, setAppointmentIsLoading] = useState(false);
  const [appointmentEvents, setAppointmentEvents] = useState([]);

  // new appointmentModal
  const [showAddNewAppointmentModal, setShowAddNewAppointmentModal] =
    useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [pureStartTime, setPureStartTime] = useState(null);
  const [pureEndTime, setPureEndTime] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const closeNewAppointmentModal = () => setShowAddNewAppointmentModal(false);

  // patientInfo
  const [patientInfo, setPatientInfo] = useState([]);
  const [patientStatIsLoading, setPatientStatIsLoading] = useState(false);

  const addDayToDate = (day, week) => {
    let h = day * 24;
    return new Date(new Date().getTime() + h * 60 * 60 * 1000);
  };

  let today = new JDate(addDayToDate(0)).format("YYYY/MM/DD");
  let plus1 = new JDate(addDayToDate(1)).format("YYYY/MM/DD");
  let plus2 = new JDate(addDayToDate(2)).format("YYYY/MM/DD");
  let plus3 = new JDate(addDayToDate(3)).format("YYYY/MM/DD");
  let plus4 = new JDate(addDayToDate(4)).format("YYYY/MM/DD");

  let Dates = [today, plus1, plus2, plus3, plus4];
  let Hours = [];

  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j = j + 15) {
      const hours = i < 10 ? "0" + i : i;
      const minutes = j < 10 ? "0" + j : j;

      Hours.push(
        <div className="time-marker">
          {hours}:{minutes}
        </div>
      );
    }
  }

  // Modality Header
  const { data: clinicDepartments, isLoading } =
    useGetAllClinicDepartmentsQuery(ClinicID);

  const handleDepClick = (departmentId) => setActiveModalityID(departmentId);

  const getClinicAppointments = () => {
    let url = "Appointment/getByDateClinic";
    let data = {
      ClinicID,
      DateFrom: "1402/09/09",
      DateTo: "1402/09/13",
      ModalityID: ActiveModalityID,
      // PatientID: ActivePatientID,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        setAppointmentEvents(response.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (ActiveModalityID !== null) {
      getClinicAppointments();
    }
  }, [ActiveModalityID]);

  // Add New Appointment
  const openNewAppointmentModal = () => setShowAddNewAppointmentModal(true);

  const FUSelectDepartment = (departmentValue) =>
    setSelectedDepartment(departmentValue);

  const handleStartTimeChange = (time) => {
    setSelectedStartTime(time);
    const pureSTimeValue = time?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    setPureStartTime(pureSTimeValue);
  };

  const handleEndTimeChange = (time) => {
    setSelectedEndTime(time);
    const pureETimeValue = time?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    setPureEndTime(pureETimeValue);
  };

  const getPatientInfo = () => {
    setPatientStatIsLoading(true);

    ActivePatientNID = $("#appointmentNationalCode").val();

    let url = "Patient/checkByNid";
    let data = {
      ClinicID,
      NID: $("#appointmentNationalCode").val(),
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        ActivePatientID = response.data.user._id;
        setPatientInfo(response.data.user);
        setPatientStatIsLoading(false);
        $("#appointmentPatientInfoCard").show("");
        $("#additionalAppointmentInfo").show("");
      })
      .catch((error) => {
        console.log(error);
        setPatientStatIsLoading(false);
        ErrorAlert("خطا", "دریافت اطلاعات بیمار با خطا مواجه گردید!");
      });
  };

  const addAppointment = (e) => {
    e.preventDefault();
    setAppointmentIsLoading(true);

    let url = "Appointment/addClinic";
    let data = {
      ClinicID,
      PatientID: ActivePatientID,
      ModalityID: selectedDepartment ? selectedDepartment : "",
      Date: appointmentDate,
      ST: pureStartTime,
      ET: pureEndTime,
    };

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        //     setAppointmentEvents({appointmentEvents, ...response.data});

        // Assuming response.data is an object with date keys and arrays of appointments
        const newAppointment = response.data;

        console.log({ newAppointment });

        // Iterate through date keys
        let appointmentsForDate = [];
        Object.keys(newAppointment).forEach((dateKey) => {
          if (dateKey === "Date") {
            appointmentsForDate = newAppointment[dateKey];
            console.log(appointmentsForDate);
          }
        });

        Object.entries(newAppointment).forEach(
          ([dateKey, appointmentsForDate]) => {
            // Now you can use appointmentsForDate as needed
            console.log(`Appointments for a date:`, appointmentsForDate);
            let obj = {
              //   Clinic: ,
              //   Date : ,
              //   ET: ,
              // Modality  : ,
              // Patient : ,
              // RegisterDate: ,
              // RegisterTime: ,
              // ST : ,
              // _id: ,
              // __v: ,
            };
          }
        );

        // console.log({ appointmentsForDate });

        // updateAppointments(appointmentsForDate);

        // SuccessAlert("موفق", "ثبت نوبت با موفقیت انجام گردید!");
        setAppointmentIsLoading(false);
        setShowAddNewAppointmentModal(false);
      })
      .catch((err) => {
        console.log(err);
        setAppointmentIsLoading(false);
        ErrorAlert("خطا", "ثبت نوبت با خطا مواجه گردید!");
      });
  };

  const updateAppointments = (newAppointments) => {
    setAppointmentEvents((prevAppointments) => {
      // Use the spread operator to create a shallow copy of the previous state
      let updatedAppointments = { ...prevAppointments };

      // Iterate through newAppointments
      newAppointments.forEach((appointment) => {
        // Extract the date from the appointment, adjust this according to your data structure
        let appointmentDate = appointment.Date; // Adjust this according to your data structure

        console.log({ appointmentDate });
        // Check if the date already exists in the mapping
        // if (updatedAppointments.hasOwnProperty(appointmentDate)) {
        //   // Date exists, add the appointment to the existing array
        //   updatedAppointments[appointmentDate].push(appointment);
        // } else {
        //   // Date doesn't exist, create a new entry with the date as the key
        //   updatedAppointments[appointmentDate] = [appointment];
        // }
      });

      return updatedAppointments;
    });
  };

  return (
    <>
      <Head>
        <title>نوبت دهی</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <div className="content container-fluid">
            <div className="w-100 marginb-3">
              <div className="categoryCard">
                <div className="card-body w-100">
                  <Skeleton className="nav nav-tabs nav-tabs-bottom nav-tabs-scroll">
                    {/*  */}
                  </Skeleton>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="content container-fluid">
            <ModalitiesHeader
              data={clinicDepartments}
              handleDepClick={handleDepClick}
            />

            {/* Appointment List */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-header">
                    <div className="row align-items-center justify-between">
                      <div className="col-7 text-secondary font-15 fw-bold">
                        لیست پذیرش
                      </div>
                      <div className="col-5">
                        <button
                          onClick={openNewAppointmentModal}
                          className="btn btn-primary font-14 float-end"
                        >
                          نوبت جدید
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="card-body appointmentCard">
                    <div className="calendar">
                      <div className="timeline">
                        <div className="spacer"></div>
                        {Hours}
                      </div>

                      <div className="days">
                        <DayList data={appointmentEvents} Dates={Dates} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <AddNewAppointmentModal
          ClinicID={ClinicID}
          show={showAddNewAppointmentModal}
          onHide={closeNewAppointmentModal}
          addAppointment={addAppointment}
          setAppointmentDate={setAppointmentDate}
          selectedStartTime={selectedStartTime}
          selectedEndTime={selectedEndTime}
          handleStartTimeChange={handleStartTimeChange}
          handleEndTimeChange={handleEndTimeChange}
          FUSelectDepartment={FUSelectDepartment}
          appointmentIsLoading={appointmentIsLoading}
          getPatientInfo={getPatientInfo}
          patientStatIsLoading={patientStatIsLoading}
          data={patientInfo}
        />
      </div>
    </>
  );
};

export default Appointment;

/* <DragDropContext */
/* onDragEnd={yourDragEndFunction} */

/* > */

/* <div className="dates dates-header">
    {Dates.map((x, index) => {
      let date = x.split("/");

      return (
        <div className="" key={index}>
          <p className="">روز : {date[2]}</p>
          <p className="">ماه : {month[date[1]]}</p>
        </div>
      )
    })}
  </div> */

/* </DragDropContext> */

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

// const onDragEndFunc = (result) => {
//   const { source, destination } = result;

//   if (!destination) {
//     return;
//   }

//   const reorderedDates = Array.from(Dates);
//   const [removed] = reorderedDates.splice(source.index, 1);
//   reorderedDates.splice(destination.index, 0, removed);
// };
