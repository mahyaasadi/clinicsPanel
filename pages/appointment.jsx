import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import JDate from "jalali-date";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, SuccessAlert } from "class/AlertManage";
// import { resetServerContext } from "react-beautiful-dnd";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "/public/assets/css/appointment.css";
import DayList from "components/dashboard/appointment/dayList";
import AddNewAppointmentModal from "components/dashboard/appointment/newAppointmentModal";
import ModalitiesHeader from "components/dashboard/appointment/modalitiesHeader/modalitiesHeader";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";

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
  ActiveAppointmentDate = null;
const Appointment = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;
  // resetServerContext();

  const [appointmentIsLoading, setAppointmentIsLoading] = useState(false);
  const [appointmentEvent, setAppointmentEvent] = useState([]);

  // new appointmentModal
  const [showAddNewAppointmentModal, setShowAddNewAppointmentModal] =
    useState(false);
  const [defaultDepValue, setDefaultDepValue] = useState();
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [pureStartTime, setPureStartTime] = useState(null);
  const [pureEndTime, setPureEndTime] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // patientInfo
  const [patientInfo, setPatientInfo] = useState([]);
  const [patientStatIsLoading, setPatientStatIsLoading] = useState(false);

  const closeNewAppointmentModal = () => setShowAddNewAppointmentModal(false);

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

  const [disabledHours, setDisabledHours] = useState([]);
  const [submittedAppointments, setSubmittedAppointments] = useState([]);
  const hoursOptions = [];

  for (let i = 0; i <= 23; i++) {
    for (let j = 0; j < 60; j = j + 15) {
      const hours = i < 10 ? "0" + i : i;
      const minutes = j < 10 ? "0" + j : j;
      hoursOptions.push({
        label: `${hours}:${minutes}`,
        value: `${hours}:${minutes}`,
      });
    }
  }

  const ActiveAppointmentDate = Object.keys(submittedAppointments);
  // console.log(ActiveAppointmentDate[0]);

  for (let i = 0; i <= 23; i++) {
    for (let j = 0; j < 60; j = j + 15) {
      const hours = i < 10 ? "0" + i : i;
      const minutes = j < 10 ? "0" + j : j;

      // console.log(`${hours}:${minutes}`);

      // Check if the current time is occupied in the API response
      const isDisabled = submittedAppointments[ActiveAppointmentDate]?.find(
        (appointment) =>
          appointment.ET === `${hours}:${minutes}` &&
          appointment.ST === `${hours}:${minutes}`

        // console.log(appointment.ST)
      );

      // console.log({ isDisabled });

      //   hoursOptions.push({
      //     label: `${hours}:${minutes}`,
      //     value: `${hours}:${minutes}`,
      //     isDisabled,
      //   });
    }
  }

  const getClinicAppointments = () => {
    let url = "Appointment/getByDateClinic";
    let data = {
      ClinicID,
      DateFrom: "1402/09/08",
      DateTo: "1402/09/12",
      // PatientID:
      // ModalityID:
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        setAppointmentEvent(response.data);
      })
      .catch((err) => console.log(err));
  };

  console.log({ appointmentEvent });

  // const onDragEndFunc = (result) => {
  //   const { source, destination } = result;

  //   if (!destination) {
  //     return;
  //   }

  //   const reorderedDates = Array.from(Dates);
  //   const [removed] = reorderedDates.splice(source.index, 1);
  //   reorderedDates.splice(destination.index, 0, removed);
  // };

  useEffect(() => getClinicAppointments(), []);

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

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);

        ActivePatientID = response.data.user._id;
        setPatientInfo(response.data.user);
        setPatientStatIsLoading(false);
        $("#appointmentPatientInfoCard").show("");
        $("#newAppointmentDate").show("");
      })
      .catch((error) => {
        console.log(error);
        setPatientStatIsLoading(false);
        ErrorAlert("خطا", "دریافت اطلاعات بیمار با خطا مواجه گردید!");
      });
  };

  const getSubmittedAppointments = () => {
    let url = "Appointment/getByDateClinic";
    let data = {
      ClinicID,
      DateFrom: appointmentDate,
      DateTo: appointmentDate,
      // PatientID: ActivePatientID,
    };

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        $("#additionalAppointmentInfo").show("");
        setSubmittedAppointments(response.data);
      })
      .catch((err) => console.log(err));
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

    // axiosClient
    //   .post(url, data)
    //   .then((response) => {
    //     console.log(response.data);
    //     setShowAddNewAppointmentModal(false);
    //     setAppointmentIsLoading(false);
    // SuccessAlert("موفق", "ثبت نوبت با موفقیت انجام گردید!");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setAppointmentIsLoading(false);
    //     ErrorAlert("خطا", "ثبت نوبت با خطا مواجه گردید!");
    //   });
  };

  // useEffect(() => {
  //   const disabledHoursArray = [];
  //   for (const key in submittedAppointments) {
  //     const appointment = submittedAppointments[key];
  //     console.log({ appointment });
  //     const startTime = appointment[0].ST?.split(":");
  //     const endTime = appointment[0].ET?.split(":");

  //     console.log({ startTime });
  //     for (let i = startTime[0]; i <= endTime[0]; i++) {
  //       disabledHoursArray.push(i < 10 ? "0" + i : i);
  //     }
  //   }
  //   setDisabledHours(disabledHoursArray);
  // }, [submittedAppointments]);

  // Modality Header
  const handleDepClick = (departmentId) => {
    console.log({ departmentId });
    // setIsLoading(true);

    // const correspondingModality = modalityData.find(
    //   (mod) => mod._id === departmentId
    // );

    // if (correspondingModality) {
    //   setCurrentSubDepartments(correspondingModality.Sub);
    //   setIsLoading(false);
    // } else {
    //   setCurrentSubDepartments([]);
    //   setIsLoading(false);
    // }
  };

  const { data: clinicDepartments, isLoading } =
    useGetAllClinicDepartmentsQuery(ClinicID);

  return (
    <>
      <Head>
        <title>نوبت دهی</title>
      </Head>
      <div className="page-wrapper">
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
                    {/* <DragDropContext */}
                    {/* // onDragEnd={yourDragEndFunction} */}
                    {/* // > */}
                    <div className="days">
                      <DayList data={appointmentEvent} Dates={Dates} />
                    </div>
                    {/* </DragDropContext> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
          selectedDepartment={defaultDepValue}
          FUSelectDepartment={FUSelectDepartment}
          appointmentIsLoading={appointmentIsLoading}
          getPatientInfo={getPatientInfo}
          patientStatIsLoading={patientStatIsLoading}
          data={patientInfo}
          getSubmittedAppointments={getSubmittedAppointments}
          hoursOptions={hoursOptions}
        />
      </div>
    </>
  );
};

export default Appointment;
