import { useState, useEffect } from "react";
import Head from "next/head";
import JDate from "jalali-date";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig";
import { Skeleton } from "primereact/skeleton";
import { convertToFixedNumber } from "utils/convertToFixedNumber";
import Loading from "components/commonComponents/loading/loading";
import DayList from "components/dashboard/appointment/dayList";
import NewPatient from "components/dashboard/patientInfo/addNewPatient";
import AppointmentModal from "components/dashboard/appointment/appointmentModal";
import DelayAppointmentModal from "components/dashboard/appointment/delayAppointmentModal";
import DuplicateAppointmentModal from "components/dashboard/appointment/duplicateAppointmentModal";
import ModalitiesHeader from "components/dashboard/appointment/modalitiesHeader/modalitiesHeader";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import FormOptionsModal from "components/dashboard/patientsArchives/formOptionsModal";
import "/public/assets/css/appointment.css";
import {
  ErrorAlert,
  SuccessAlert,
  QuestionAlert,
  WarningAlert,
} from "class/AlertManage";

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
  ClinicUserID,
  ActivePatientNID,
  ActivePatientID,
  ActiveAppointmentID,
  ActiveDate = null;

const formattedCurrentDate = new JDate().format("YYYY/MM/DD");

const Appointment = ({ ClinicUser }) => {
  const router = useRouter();

  ClinicID = ClinicUser.ClinicID;
  ClinicUserID = ClinicUser._id;

  const [loadingState, setLoadingState] = useState(false);
  const [appointmentIsLoading, setAppointmentIsLoading] = useState(false);
  const [delayIsLoading, setDelayIsLoading] = useState(false);

  // new patient
  const [birthYear, setBirthYear] = useState("");
  const [showBirthDigitsAlert, setShowBirthDigitsAlert] = useState(false);
  const [addPatientIsLoading, setAddPatientIsLoading] = useState(false);

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

  //----- Dates Settings -----//
  const [currentDate, setCurrentDate] = useState();

  const addDayToDate = (day) => {
    let newDate;
    if (currentDate) {
      newDate = new Date(currentDate.getTime() + day * 24 * 60 * 60 * 1000);
      setCurrentDate(newDate);
    }
  };

  let today,
    plus1,
    plus2,
    plus3,
    plus4 = null;

  if (currentDate) {
    today = new Date(currentDate);
    plus1 = new Date(currentDate?.getTime() + 1 * 24 * 60 * 60 * 1000);
    plus2 = new Date(currentDate?.getTime() + 2 * 24 * 60 * 60 * 1000);
    plus3 = new Date(currentDate?.getTime() + 3 * 24 * 60 * 60 * 1000);
    plus4 = new Date(currentDate?.getTime() + 4 * 24 * 60 * 60 * 1000);
  }

  const monthName = plus4?.toLocaleString("fa-IR", { month: "long" });
  const yearValue = plus4?.toLocaleDateString("fa-IR", {
    year: "numeric",
  });

  const displayNextFiveDays = () => {
    addDayToDate(5);

    const newWeek = parseInt(router.query.week || 0, 10) + 1;
    router.push(
      {
        pathname: "/appointment",
        query: { week: newWeek },
      },
      undefined,
      { shallow: true }
    );
  };

  const displayLastFiveDays = () => {
    addDayToDate(-5);

    const newWeek = parseInt(router.query.week || 0, 10) - 1;
    router.push(
      {
        pathname: "/appointment",
        query: "week=" + newWeek,
      },
      undefined,
      { shallow: true }
    );
  };

  const returnToToday = () => {
    setCurrentDate(new Date());

    router.push(
      {
        pathname: "/appointment",
        query: "week=" + 0,
      },
      undefined,
      { shallow: true }
    );
  };

  let Dates = [];
  if (currentDate) {
    Dates = [
      today?.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      plus1?.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      plus2?.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      plus3?.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      plus4?.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    ];
  }

  let todayDay = currentDate?.toLocaleDateString("fa-IR", { weekday: "long" });
  let plus1Day = plus1?.toLocaleDateString("fa-IR", { weekday: "long" });
  let plus2Day = plus2?.toLocaleDateString("fa-IR", { weekday: "long" });
  let plus3Day = plus3?.toLocaleDateString("fa-IR", { weekday: "long" });
  let plus4Day = plus4?.toLocaleDateString("fa-IR", { weekday: "long" });

  let DatesDays = [todayDay, plus1Day, plus2Day, plus3Day, plus4Day];

  //---- Clinics WorkingHours -----//
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

  //----- Get all Appointments -----//
  const getClinicAppointments = () => {
    setLoadingState(true);

    if (currentDate) {
      let url = "Appointment/getByDateClinic";
      let data = {
        ClinicID,
        DateFrom: convertToFixedNumber(
          today.toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        ),
        DateTo: convertToFixedNumber(
          plus4.toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        ),
        ModalityID: ActiveModalityID,
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
    }
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
      CenterID: ClinicID,
      NID: $("#appointmentNationalCode").val(),
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        if (response.data.error == "1") {
          $("#newPatientModal").modal("show");
          $("#appointmentPatientInfoCard").hide("");
          setShowAppointmentModal(false);
        } else {
          ActivePatientID = response.data.user._id;
          setPatientInfo(response.data.user);
          $("#appointmentPatientInfoCard").show("");
          $("#additionalAppointmentInfo").show("");
        }
        setPatientStatIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setPatientStatIsLoading(false);
        ErrorAlert("خطا", "دریافت اطلاعات بیمار با خطا مواجه گردید!");
      });
  };

  const addNewPatient = (props) => {
    setAddPatientIsLoading(true);

    let url = "Patient/addPatient";
    let data = props;
    data.CenterID = ClinicID;
    data.Clinic = true;

    axiosClient
      .post(url, data)
      .then((response) => {
        if (response.data === false) {
          ErrorAlert(
            "خطا",
            "بیمار با اطلاعات وارد شده, تحت پوشش این بیمه نمی باشد!"
          );
          setAddPatientIsLoading(false);
          return false;
        } else if (response.data.errors) {
          ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
          setAddPatientIsLoading(false);
          return false;
        } else {
          SuccessAlert("موفق", "اطلاعات بیمار با موفقیت ثبت گردید!");
          setPatientInfo(response.data);
          $("#newPatientModal").modal("hide");
          $("#patientInfoCard").show("");
        }
        setAddPatientIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
      });
    setAddPatientIsLoading(false);
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
    const formattedDefDate = data.Date.replace(
      /(\d+)\/(\d+)\/(\d+)/,
      "$1/$2/$3"
    );

    if (formattedDefDate < formattedCurrentDate) {
      setModalMode("disableEdit");
      WarningAlert("هشدار", "مهلت ویرایش نوبت به پایان رسیده است!");
    } else {
      setModalMode("edit");
      setShowAppointmentModal(true);
      setEditAppointmentData(data);
      ActivePatientID = data.Patient._id;
      ActiveAppointmentID = data._id;

      setTimeout(() => {
        $("#appointmentPatientInfoCard").show("");
        $("#additionalAppointmentInfo").show("");
      }, 100);
    }
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

    axiosClient
      .post(url, data)
      .then((response) => {
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

  // Duplicate Appointment modal
  const openDuplicateModal = (data) => {
    setShowDuplicateModal(true);
    setDuplicateData(data);
    ActivePatientID = data.Patient._id;
    ActiveAppointmentID = data._id;

    // ActiveDate = data.Date;
    const formattedDefDate = data.Date.replace(
      /(\d+)\/(\d+)\/(\d+)/,
      "$1/$2/$3"
    );

    setTimeout(() => {
      if (formattedDefDate < formattedCurrentDate) {
        setAppointmentDate(formattedCurrentDate);
      } else {
        setAppointmentDate(data.Date?.replace(/""/g, ""));
      }
    }, 100);
  };

  // Add New Form To Patient
  const [showFormOptionsModal, setShowFormOptionsModal] = useState(false);
  const closeFrmOptionsModal = () => setShowFormOptionsModal(false);

  const openFrmOptionsModal = (eventData) => {
    ActivePatientID = eventData.Patient._id;
    setShowFormOptionsModal(true);
  };

  useEffect(() => {
    if (ActiveModalityID !== null) {
      getClinicAppointments();
      setSelectedDepartment(ActiveModalityID);
    }

    // Days Columns Dynamic Height
    var root = document.querySelector(":root");
    let set = 96 - 4 * depOpeningHour;

    root.style.setProperty("--numHours", set);
  }, [ActiveModalityID, currentDate]);

  useEffect(() => {
    const storedWeek = router.query.week * 5;

    if (storedWeek && storedWeek != 0)
      setCurrentDate(
        new Date(new Date().getTime() + storedWeek * 24 * 60 * 60 * 1000)
      );
    else setCurrentDate(new Date());

    setShowBirthDigitsAlert(false);
  }, [router.query]);

  return (
    <>
      <Head>
        <title>نوبت دهی</title>
      </Head>
      <div className="page-wrapper">
        <div className="content container-fluid p-3">
          <div className="row dir-rtl">
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
                            className="btn btn-outline-primary appointmentBtn font-14"
                            onClick={openDelayModal}
                          >
                            <FeatherIcon icon="clock" />
                            ثبت تاخیر
                          </button>

                          <button
                            onClick={() =>
                              openNewAppointmentModal(formattedCurrentDate)
                            }
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
                          displayNextFiveDays={displayNextFiveDays}
                          displayLastFiveDays={displayLastFiveDays}
                          monthName={monthName}
                          yearValue={yearValue}
                          formattedCurrentDate={formattedCurrentDate}
                          returnToToday={returnToToday}
                          loadingState={loadingState}
                          openFrmOptionsModal={openFrmOptionsModal}
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

        <NewPatient
          addNewPatient={addNewPatient}
          ClinicID={ClinicID}
          ActivePatientNID={ActivePatientNID}
          birthYear={birthYear}
          setBirthYear={setBirthYear}
          showBirthDigitsAlert={showBirthDigitsAlert}
          setShowBirthDigitsAlert={setShowBirthDigitsAlert}
          addPatientIsLoading={addPatientIsLoading}
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

        <FormOptionsModal
          show={showFormOptionsModal}
          onHide={closeFrmOptionsModal}
          ClinicID={ClinicID}
          ClinicUserID={ClinicUserID}
          ActivePatientID={ActivePatientID}
        />
      </div>
    </>
  );
};

export default Appointment;
