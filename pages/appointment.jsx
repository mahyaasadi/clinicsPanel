import { useState, useEffect } from "react";
import Head from "next/head";
import JDate from "jalali-date";
import { getSession } from "lib/session";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig";
import { Skeleton } from "primereact/skeleton";
import { ErrorAlert, SuccessAlert, QuestionAlert } from "class/AlertManage";
import DayList from "components/dashboard/appointment/dayList";
import Loading from "components/commonComponents/loading/loading";
import AppointmentModal from "components/dashboard/appointment/appointmentModal";
import AddNewPatient from "components/dashboard/patientInfo/addNewPatient";
import DelayAppointmentModal from "components/dashboard/appointment/delayAppointmentModal";
import DuplicateAppointmentModal from "components/dashboard/appointment/duplicateAppointmentModal";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import ModalitiesHeader from "components/dashboard/appointment/modalitiesHeader/modalitiesHeader";
import "/public/assets/css/appointment.css";

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
  ActiveAppointmentID = null;

let ActiveDate = null;
const jdate = new JDate();
const todaysDate = jdate.format("YYYY/MM/DD");

const Appointment = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [loadingState, setLoadingState] = useState(false);
  const [appointmentIsLoading, setAppointmentIsLoading] = useState(false);
  const [delayIsLoading, setDelayIsLoading] = useState(false);
  const [appointmentEvents, setAppointmentEvents] = useState([]);

  // modalitiesHeader
  const [ActiveModalityID, setActiveModalityID] = useState(null);
  const [depOpeningHour, setDepOpeningHour] = useState(0);
  const [depClosingHour, setDepClosingHour] = useState(24);

  // appointmentModal
  const [modalMode, setModalMode] = useState("add");
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [editAppointmentData, setEditAppointmentData] = useState([]);

  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    ActiveDate = null;
  };

  // delayAppointmentModal
  const [showDelayModal, setShowDelayModal] = useState(false);
  const closeDelayModal = () => setShowDelayModal(false);
  const openDelayModal = () => setShowDelayModal(true);

  // duplicateAppointmentModal
  const [showDupliacteModal, setShowDuplicateModal] = useState(false);
  const closeDuplicateModal = () => setShowDuplicateModal(false);
  const [duplicateData, setDuplicateData] = useState([]);

  const [pureStartTime, setPureStartTime] = useState(null);
  const [pureEndTime, setPureEndTime] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // patientInfo
  const [patientInfo, setPatientInfo] = useState([]);
  const [patientStatIsLoading, setPatientStatIsLoading] = useState(false);

  const addDayToDate = (day) => {
    let h = day * 24;
    return new Date(new Date().getTime() + h * 60 * 60 * 1000);
  };

  let today = new JDate(addDayToDate(0)).format("YYYY/MM/DD");
  let plus1 = new JDate(addDayToDate(1)).format("YYYY/MM/DD");
  let plus2 = new JDate(addDayToDate(2)).format("YYYY/MM/DD");
  let plus3 = new JDate(addDayToDate(3)).format("YYYY/MM/DD");
  let plus4 = new JDate(addDayToDate(4)).format("YYYY/MM/DD");

  let todayDay = new JDate(addDayToDate(0)).format("dddd");
  let plus1Day = new JDate(addDayToDate(1)).format("dddd");
  let plus2Day = new JDate(addDayToDate(2)).format("dddd");
  let plus3Day = new JDate(addDayToDate(3)).format("dddd");
  let plus4Day = new JDate(addDayToDate(4)).format("dddd");

  let Dates = [today, plus1, plus2, plus3, plus4];
  let DatesDays = [todayDay, plus1Day, plus2Day, plus3Day, plus4Day];
  let Hours = [];

  for (let i = depOpeningHour; i < depClosingHour; i++) {
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

  const hoursOptions = [];
  for (let i = depOpeningHour; i < depClosingHour; i++) {
    for (let j = 0; j < 60; j = j + 15) {
      const hours = i < 10 ? "0" + i : i;
      const minutes = j < 10 ? "0" + j : j;
      const str = hours + ":" + minutes;
      let obj = {
        value: str,
        label: str,
      };
      hoursOptions.push(obj);
    }
  }

  // Get all Appointments
  const getClinicAppointments = () => {
    setLoadingState(true);

    let url = "Appointment/getByDateClinic";
    let data = {
      ClinicID,
      DateFrom: today,
      DateTo: plus4,
      ModalityID: ActiveModalityID,
      // PatientID: ActivePatientID,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        setAppointmentEvents(response.data);
        setLoadingState(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingState(false);
      });
  };

  // Modality Header
  const { data: clinicDepartments, isLoading } =
    useGetAllClinicDepartmentsQuery(ClinicID);

  const handleDepClick = (departmentId, depOpeningHour, depClosingHour) => {
    setActiveModalityID(departmentId);
    setDepOpeningHour(depOpeningHour);
    setDepClosingHour(depClosingHour);
  };

  // PatientInfo in AppointmentModal
  const getPatientInfo = (e) => {
    e.preventDefault();

    ActivePatientNID = $("#appointmentNationalCode").val();
    setPatientStatIsLoading(true);

    let url = "Patient/checkByNid";
    let data = {
      ClinicID,
      NID: $("#appointmentNationalCode").val(),
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        // console.log(response.data);
        if (response.data.error == "1") {
          $("#newPatientModal").modal("show");
          setShowAppointmentModal(false);
        } else {
          ActivePatientID = response.data.user._id;
          setPatientInfo(response.data.user);
          $("#appointmentPatientInfoCard").show("");
          $("#additionalAppointmentInfo").show("");
        }
        setPatientStatIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setPatientStatIsLoading(false);
        ErrorAlert("خطا", "دریافت اطلاعات بیمار با خطا مواجه گردید!");
      });
  };

  const addNewPatient = (props) => {
    let url = "Patient/addPatient";
    let data = props;
    data.CenterID = ClinicID;

    axiosClient
      .post(url, data)
      .then((response) => {
        setPatientInfo(response.data);
        $("#newPatientModal").modal("hide");
        $("#patientInfoCard").show("");
        if (response.data === false) {
          ErrorAlert(
            "خطا",
            "بیمار با اطلاعات وارد شده, تحت پوشش این بیمه نمی باشد!"
          );
          return false;
        } else if (response.data.errors) {
          ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
          return false;
        } else {
          SuccessAlert("موفق", "اطلاعات بیمار با موفقیت ثبت گردید!");
        }
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
      });
  };

  // Add New Appointment
  const openNewAppointmentModal = (date) => {
    setModalMode("add");
    ActiveDate = date;

    setTimeout(() => {
      setShowAppointmentModal(true);
    }, 200);
  };

  const FUSelectStartTime = (startTime) => setPureStartTime(startTime);
  const FUSelectEndTime = (endTime) => setPureEndTime(endTime);
  const FUSelectDepartment = (departmentValue) =>
    setSelectedDepartment(departmentValue);

  const addAppointment = (e) => {
    e.preventDefault();
    setAppointmentIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "Appointment/addClinic";
    let data = {
      ClinicID,
      PatientID: ActivePatientID,
      ModalityID: selectedDepartment ? selectedDepartment : ActiveModalityID,
      Date: appointmentDate,
      ST: pureStartTime ? pureStartTime : formProps.pureStartTime,
      ET: pureEndTime ? pureEndTime : formProps.pureEndTime,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);

        if (appointmentEvents.hasOwnProperty(response.data.Date)) {
          // If it exists, directly push the new appointment to the existing array
          appointmentEvents[response.data.Date].push(response.data);
        } else {
          // If it doesn't exist, create a new key-value pair with the new date as the key and an array containing the new appointment as the value
          appointmentEvents[response.data.Date] = [response.data];
        }

        setAppointmentIsLoading(false);
        setShowAppointmentModal(false);
        setShowDuplicateModal(false);
        SuccessAlert("موفق", "ثبت نوبت با موفقیت انجام گردید!");
      })
      .catch((err) => {
        console.log(err);
        setAppointmentIsLoading(false);
        ErrorAlert("خطا", "ثبت نوبت با خطا مواجه گردید!");
      });
  };

  // Edit Appointment
  const openEditAppointmentModal = (data, appointmentID) => {
    setModalMode("edit");
    setShowAppointmentModal(true);
    setEditAppointmentData(data);
    ActivePatientID = data.Patient._id;
    ActiveAppointmentID = data._id;

    setTimeout(() => {
      $("#appointmentPatientInfoCard").show("");
      $("#additionalAppointmentInfo").show("");
    }, 100);
  };

  const editAppointment = (e) => {
    e.preventDefault();
    setAppointmentIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = `Appointment/updateClinic/${ActiveAppointmentID}`;
    let data = {
      ClinicID,
      PatientID: ActivePatientID,
      ModalityID: selectedDepartment
        ? selectedDepartment
        : formProps.selectedDepartment,
      Date: appointmentDate,
      ST: pureStartTime ? pureStartTime : formProps.pureStartTime,
      ET: pureEndTime ? pureEndTime : formProps.pureEndTime,
    };

    axiosClient
      .put(url, data)
      .then((response) => {
        updateAppointmentItem(
          ActiveAppointmentID,
          response.data,
          formProps.OldDate
        );
        setAppointmentIsLoading(false);
        setShowAppointmentModal(false);
      })
      .catch((err) => {
        console.log(err);
        setAppointmentIsLoading(false);
        ErrorAlert("خطا", "ویرایش اطلاعات با خطا مواجه گردید!");
      });
  };

  const endHoursOptions = pureStartTime
    ? hoursOptions.filter((option) => option.value > pureStartTime)
    : hoursOptions;

  const updateAppointmentItem = (id, newArr, oldDate) => {
    // Check if the date has changed
    if (oldDate !== newArr.Date) {
      // Remove the old entry
      if (appointmentEvents[oldDate]) {
        const index = appointmentEvents[oldDate].findIndex(
          (item) => item._id === id
        );

        if (index !== -1) {
          appointmentEvents[oldDate].splice(index, 1);

          // If no items are left for the old date, remove the date entry
          if (appointmentEvents[oldDate].length === 0) {
            delete appointmentEvents[oldDate];
          }
        }
      }
    } else {
      const existingEntry = appointmentEvents[oldDate].find(
        (item) => item._id === id
      );

      if (existingEntry) {
        existingEntry.ST = newArr.ST;
        existingEntry.ET = newArr.ET;
        existingEntry.ModalityID = newArr.ModalityID;
        getClinicAppointments();
        return;
      }
    }

    // Update the appointmentEvents with the new date
    if (appointmentEvents[newArr.Date]) {
      appointmentEvents[newArr.Date].push(newArr);
    } else {
      appointmentEvents[newArr.Date] = [newArr];
    }
  };

  // Delete Appointment
  const deleteAppointment = async (id, date) => {
    let result = await QuestionAlert(
      "حذف نوبت!",
      "آیا از حذف نوبت اطمینان دارید؟"
    );

    if (result) {
      setLoadingState(true);
      let url = `Appointment/deleteClinic/${id}`;

      axiosClient
        .delete(url)
        .then((response) => {
          if (appointmentEvents[date]) {
            const index = appointmentEvents[date].findIndex(
              (item) => item._id === id
            );

            if (index !== -1) {
              // Remove the entry from the array
              appointmentEvents[date].splice(index, 1);

              // If no items are left for the date, delete the date entry
              if (appointmentEvents[date].length === 0) {
                delete appointmentEvents[date];
              }
            }
          }
          setAppointmentEvents({ ...appointmentEvents });
          setLoadingState(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingState(false);
        });
    }
  };

  // Delay in Appointments
  const delayHoursOptions = [];
  for (let i = 1; i < 11; i++) {
    const hourOption = i;
    let obj = {
      value: hourOption,
      label: hourOption,
    };
    delayHoursOptions.push(obj);
  }

  const delayMinutesOptions = [];
  for (let i = 15; i < 60; i = i + 15) {
    const minOption = i;
    let obj = {
      value: minOption,
      label: minOption,
    };
    delayMinutesOptions.push(obj);
  }

  let delayHr,
    delayMin = null;
  const FUSelectDelayHour = (hour) => (delayHr = hour);
  const FUSelectDelayMinute = (minute) => (delayMin = minute);

  const applyDelayOnAppointments = (e) => {
    e.preventDefault();
    setDelayIsLoading(true);

    let url = "Appointment/SetDelayClinic";
    let data = {
      ClinicID,
      ModalityID: ActiveModalityID,
      Date: appointmentDate,
      DelayH: delayHr ? delayHr : 0,
      DelayM: delayMin ? delayMin : 0,
    };

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        getClinicAppointments();

        SuccessAlert("موفق", "ثبت تاخیر با موفقیت ثبت گردید!");
        setDelayIsLoading(false);
        closeDelayModal();
      })
      .catch((err) => {
        console.log(err);
        setDelayIsLoading(false);
        ErrorAlert("خطا", "ثبت تاخیر با خطا مواجه گردید!");
      });
  };

  // DuplicateAppointment modal
  const openDuplicateModal = (data) => {
    setShowDuplicateModal(true);
    setDuplicateData(data);

    ActiveDate = data.Date;
    setAppointmentDate(ActiveDate?.replace(/""/g, ""));

    ActivePatientID = data.Patient._id;
    ActiveAppointmentID = data._id;
  };

  useEffect(() => {
    if (ActiveModalityID !== null) {
      getClinicAppointments();
      setSelectedDepartment(ActiveModalityID);
    }

    // columns dynamic height
    var root = document.querySelector(":root");
    let set = 96 - 4 * depOpeningHour;
    root.style.setProperty("--numHours", set);
  }, [ActiveModalityID]);

  return (
    <>
      <Head>
        <title>نوبت دهی</title>
      </Head>
      <div className="page-wrapper">
        <div className="content container-fluid p-3">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <div className="row align-items-center justify-between">
                    <div className="d-flex align-items-center justify-between flex-col-md media-md-gap">
                      {!isLoading ? (
                        <div className="col-md-7 col-12">
                          <ModalitiesHeader
                            data={clinicDepartments}
                            handleDepClick={handleDepClick}
                          />
                        </div>
                      ) : (
                        <Skeleton>
                          <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded paddingb-0">
                            <li className="nav-item">
                              <a className="nav-link"></a>
                            </li>
                          </ul>
                        </Skeleton>
                      )}

                      <div className="col-md-5 col-12 d-flex justify-end">
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-outline-secondary appointmentBtn font-14 "
                            onClick={openDelayModal}
                          >
                            <span className="">
                              <FeatherIcon icon="clock" />
                            </span>
                            ثبت تاخیر
                          </button>
                          {/* <button
                            className="btn btn-outline-secondary appointmentBtn font-14 delayButton"
                            onClick={openDelayModal}>
                            <span class="delayIcon"><FeatherIcon icon="clock" /></span>
                            <span class="delayText">ثبت تاخیر</span>
                          </button> */}
                          <button
                            onClick={() => openNewAppointmentModal(todaysDate)}
                            className="btn btn-primary appointmentBtn font-14 float-end"
                          >
                            <FeatherIcon icon="plus-square" />
                            نوبت جدید
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {loadingState ? (
                  <Loading />
                ) : (
                  <div className="card-body appointmentCard">
                    <div className="calendar">
                      {/* <div className="timeline text-secondary font-13">
                        <div className="spacer"></div>
                        <div className="spacer"></div>
                        <div className="spacer"></div>
                        {Hours}
                      </div> */}

                      <div className="days">
                        <DayList
                          data={appointmentEvents}
                          Dates={Dates}
                          DatesDays={DatesDays}
                          depOpeningHour={depOpeningHour}
                          openEditAppointmentModal={openEditAppointmentModal}
                          deleteAppointment={deleteAppointment}
                          openNewAppointmentModal={openNewAppointmentModal}
                          openDuplicateModal={openDuplicateModal}
                          Hours={Hours}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <AppointmentModal
          data={editAppointmentData}
          mode={modalMode}
          ClinicID={ClinicID}
          show={showAppointmentModal}
          onHide={closeAppointmentModal}
          onSubmit={modalMode === "add" ? addAppointment : editAppointment}
          setAppointmentDate={setAppointmentDate}
          FUSelectStartTime={FUSelectStartTime}
          FUSelectEndTime={FUSelectEndTime}
          FUSelectDepartment={FUSelectDepartment}
          appointmentIsLoading={appointmentIsLoading}
          getPatientInfo={getPatientInfo}
          patientStatIsLoading={patientStatIsLoading}
          patientInfo={patientInfo}
          hoursOptions={hoursOptions}
          selectedDepartment={selectedDepartment}
          ActiveDate={ActiveDate}
          endHoursOptions={endHoursOptions}
        />

        <AddNewPatient
          addNewPatient={addNewPatient}
          ClinicID={ClinicID}
          ActivePatientNID={ActivePatientNID}
        />

        <DelayAppointmentModal
          show={showDelayModal}
          onHide={closeDelayModal}
          onSubmit={applyDelayOnAppointments}
          setAppointmentDate={setAppointmentDate}
          isLoading={delayIsLoading}
          delayHoursOptions={delayHoursOptions}
          delayMinutesOptions={delayMinutesOptions}
          FUSelectDelayHour={FUSelectDelayHour}
          FUSelectDelayMinute={FUSelectDelayMinute}
        />

        <DuplicateAppointmentModal
          show={showDupliacteModal}
          onHide={closeDuplicateModal}
          onSubmit={addAppointment}
          data={duplicateData}
          ClinicID={ClinicID}
          selectedDepartment={selectedDepartment}
          FUSelectDepartment={FUSelectDepartment}
          setAppointmentDate={setAppointmentDate}
          hoursOptions={hoursOptions}
          appointmentIsLoading={appointmentIsLoading}
          appointmentDate={appointmentDate}
          FUSelectStartTime={FUSelectStartTime}
          FUSelectEndTime={FUSelectEndTime}
          endHoursOptions={endHoursOptions}

        />
      </div>
    </>
  );
};

export default Appointment;

// {loadingState ? <Loading /> : (
//   <div className="card-body appointmentCard">
//     <div className="calendar">
//       <div className="timeline">
//         <div className="spacer"></div>
//         {Hours}
//       </div>

//       <div className="days">
//         <DayList
//           data={appointmentEvents}
//           Dates={Dates}
//           openEditAppointmentModal={openEditAppointmentModal}
//           deleteAppointment={deleteAppointment}
//         />
//       </div>
//     </div>
//   </div>
// )}
