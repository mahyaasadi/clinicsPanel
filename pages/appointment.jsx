import { useState, useEffect } from "react";
import Head from "next/head";
import JDate from "jalali-date";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, SuccessAlert, QuestionAlert } from "class/AlertManage";
import "/public/assets/css/appointment.css";
import DayList from "components/dashboard/appointment/dayList";
import AppointmentModal from "components/dashboard/appointment/appointmentModal";
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
  ActiveAppointmentID = null;

const Appointment = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [appointmentIsLoading, setAppointmentIsLoading] = useState(false);
  const [appointmentEvents, setAppointmentEvents] = useState([]);

  // appointmentModal
  const [modalMode, setModalMode] = useState("add");
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [ActiveModalityID, setActiveModalityID] = useState(null);
  const [editAppointmentData, setEditAppointmentData] = useState([]);
  const closeAppointmentModal = () => setShowAppointmentModal(false);

  const [pureStartTime, setPureStartTime] = useState(null);
  const [pureEndTime, setPureEndTime] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

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

  const hoursOptions = [];

  for (let i = 0; i < 24; i++) {
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
        console.log(response.data);
        setAppointmentEvents(response.data);
      })
      .catch((err) => console.log(err));
  };

  // Modality Header
  const { data: clinicDepartments, isLoading } =
    useGetAllClinicDepartmentsQuery(ClinicID);

  const handleDepClick = (departmentId) => setActiveModalityID(departmentId);

  // PatientInfo in AppointmentModal
  const getPatientInfo = () => {
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

  // Add New Appointment
  const openNewAppointmentModal = () => {
    setModalMode("add");
    setShowAppointmentModal(true);
  };

  const FUSelectStartTime = (startTime) => setPureStartTime(startTime);
  const FUSelectEndTime = (endTime) => setPureEndTime(endTime);
  const FUSelectDepartment = (departmentValue) =>
    setSelectedDepartment(departmentValue);

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

    //     if (appointmentEvents.hasOwnProperty(response.data.Date)) {
    //       // If it exists, directly push the new appointment to the existing array
    //       appointmentEvents[response.data.Date].push(response.data);
    //     } else {
    //       // If it doesn't exist, create a new key-value pair with the new date as the key and an array containing the new appointment as the value
    //       appointmentEvents[response.data.Date] = [response.data];
    //     }

    //     setAppointmentIsLoading(false);
    //     setShowAppointmentModal(false);
    //     SuccessAlert("موفق", "ثبت نوبت با موفقیت انجام گردید!");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setAppointmentIsLoading(false);
    //     ErrorAlert("خطا", "ثبت نوبت با خطا مواجه گردید!");
    //   });
  };

  // Edit Appointment
  const openEditAppointmentModal = (data, appointmentID) => {
    setShowAppointmentModal(true);
    setModalMode("edit");
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

    console.log({ data });

    axiosClient
      .put(url, data)
      .then((response) => {
        console.log(response.data);
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

  const updateAppointmentItem = (id, newArr, OldDate) => {
    // if (appointmentEvents[newArr.Date]) {
    //   appointmentEvents[newArr.Date].push(newArr);
    // } else {
    //   appointmentEvents[newArr.Date] = [newArr];
    // }

    // let found = false;
    // for (let key in appointmentEvents) {
    //   let arr = appointmentEvents[key];

    //   for (let i = 0; i < arr.length; i++) {
    //     if (arr[i]._id === id) {
    //       console.log("found it!");
    //       arr[i] = newArr;
    //       found = true;
    //       break;
    //     } else {
    //       console.log("didn't found it!");
    //     }
    //   }

    //   if (found) break;
    // }

    // Check if the date has changed
    if (OldDate !== newArr.Date) {
      // Remove the old entry
      if (appointmentEvents[OldDate]) {
        const index = appointmentEvents[OldDate].findIndex(
          (item) => item._id === id
        );
        if (index !== -1) {
          appointmentEvents[OldDate].splice(index, 1);

          // If no items are left for the old date, remove the date entry
          if (appointmentEvents[OldDate].length === 0) {
            delete appointmentEvents[OldDate];
          }
        }
      }
    } else {
      const existingEntry = appointmentEvents[OldDate].find(
        (item) => item._id === id
      );

      if (existingEntry) {
        existingEntry.ST = newArr.ST;
        existingEntry.ET = newArr.ET;
        existingEntry.ModalityID = newArr.ModalityID;
        return
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
    // let result = await QuestionAlert(
    //   "حذف نوبت!",
    //   "آیا از حذف نوبت اطمینان دارید؟"
    // );

    // if (result) {
    //   console.log(appointmentEvents[date]);
    //   let url = `Appointment/deleteClinic/${id}`;

    //   const existingEntry = appointmentEvents[date].find(
    //     (item) => item._id === id
    //   );


    //   axiosClient
    //     .delete(url)
    //     .then((response) => {
    //       console.log(response.data);
    //       if (existingEntry) delete appointmentEvents[date];

    //       //     let filteredAppointments = [];

    //       //     // for (let key in appointmentEvents) {
    //       //     //   let arr = appointmentEvents[key];

    //       //     //   console.log({ arr });

    //       //     //   let filteredArr = arr.filter((item) => item._id !== id);
    //       //     //   // console.log({ filteredArr });

    //       //     //   // Add the filtered array to the final result
    //       //     //   filteredAppointments = [...filteredAppointments, ...filteredArr];
    //       //     // }

    //       //     console.log({ filteredAppointments });
    //       //     console.log({ appointmentEvents });

    //       //     return filteredAppointments;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
    let result = await QuestionAlert(
      "حذف نوبت!",
      "آیا از حذف نوبت اطمینان دارید؟"
    );

    if (result) {
      console.log(appointmentEvents[date]);
      let url = `Appointment/deleteClinic/${id}`;

      // Check if the date entry exists
      if (appointmentEvents[date]) {
        const existingEntryIndex = appointmentEvents[date].findIndex(
          (item) => item._id === id
        );

        if (existingEntryIndex !== -1) {
          console.log({ existingEntryIndex });
          // Remove the entry from the array
          appointmentEvents[date].splice(existingEntryIndex, 1);

          // If no items are left for the date, delete the date entry
          if (appointmentEvents[date].length === 0) {
            delete appointmentEvents[date];
          }
        }
      }


      console.log({ appointmentEvents });

      axiosClient
        .delete(url)
        .then((response) => {
          console.log(response.data);
          setAppointmentEvents({ ...appointmentEvents });
          // getClinicAppointments()
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (ActiveModalityID !== null) {
      getClinicAppointments()
      setSelectedDepartment(ActiveModalityID)
    }
  }, [ActiveModalityID]);

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
          // <Loading />
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
                        <DayList
                          data={appointmentEvents}
                          Dates={Dates}
                          openEditAppointmentModal={openEditAppointmentModal}
                          deleteAppointment={deleteAppointment}
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div className="table-responsive">
                    <table style={{ width: "100%" }}>
                      <thead style={{ display: "flex", justifyContent: "space-evenly", width: "100%" }}>
                        {Dates.map((x, index) => {
                          let date = x.split("/");
                          return (
                            <tr key={index}>
                              <th>{date[2]} {month[date[1]]}</th>
                            </tr>
                          );
                        })}
                      </thead>
                      <DayList data={appointmentEvents} Dates={Dates} />
                    </table>
                  </div> */}

                  {/* <div className="table-responsive">
                    <table style={{ width: "100%", display: "grid" }}>
                      <thead style={{ display: "flex", justifyContent: "space-between", width: "100%", position: "fixed", backgroundColor: "aquamarine", height: "5vh" }}>
                        {Dates.map((x, index) => {
                          let date = x.split("/");
                          return (
                            <tr key={index} style={{ width: "20%", display: "flex", justifyContent: "center" }}>
                              <th>{date[2]} {month[date[1]]}</th>
                            </tr>
                          );
                        })}
                      </thead>
                      <tbody className="d-flex">

                        <tr className="">
                          <td className="">
                            {Hours}
                          </td>
                        </tr>

                        <tr className="">
                          <td className="">
                            {Dates.map((date, index) => {
                              return (
                                <Day date={date} key={date} index={index} appointment={appointmentEvents[date]} />
                              );
                            })}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div> */}
                  {/* 
                  <table className="table mt-4 font-13 text-secondary">
                    <thead>
                      <tr>
                        <th>#</th>

                        {Dates.map((x, index) => {
                          let date = x.split("/")
                          return (

                            <th key={index}>{date[2]} {month[date[1]]}</th>
                          );
                        })}
                      </tr>
                    </thead>

                    <tbody className="font-13 text-secondary">

                      <tr>
                        <td >
                          {/* <div className="timeline"> */}
                  {/* <div className="spacer"></div> */}
                  {/* {Hours} */}
                  {/* </div> */}
                  {/* </td>
              </tr> */}

                  {/* <tr>
                        <td></td>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                      </tr>

                      <tr>
                        <td></td>
                        <td>8</td>
                        <td>9</td>
                        <td>10</td>
                        <td>11</td>
                        <td>12</td>
                      </tr> */}
                  {/* 
            </tbody>
          </table> * /} */}
                </div>
              </div>
            </div>
          </div>
        )}

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
        />
      </div>
    </>
  );
};

export default Appointment;

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
