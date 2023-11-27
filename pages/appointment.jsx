import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import JDate from "jalali-date";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import DayList from "components/dashboard/appointment/dayList";
import "/public/assets/css/appointment.css";
let ClinicID = null;
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

const Appointment = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;
  const [appointmentEvent, setAppointmentEvent] = useState([]);

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
      Hours.push(
        <div class="time-marker">
          {i} : {j}
        </div>
      );
    }
  }

  const getClinicAppointments = () => {
    let url = "Appointment/getByDateClinic";
    let data = {
      ClinicID,
      // DateFrom: "",
      // DateTo: "",
      DateFrom: "1402/09/06",
      DateTo: "1402/09/10",
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        setAppointmentEvent(response.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getClinicAppointments();
  }, []);

  return (
    <>
      <Head>
        <title>نوبت دهی</title>
      </Head>
      <div className="page-wrapper">
        <div className="content container-fluid">
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
                      <Link
                        href="/reception"
                        className="btn btn-primary font-14 float-end"
                      >
                        پذیرش جدید
                      </Link>
                    </div>
                  </div>
                </div>

                <div class="calendar">
                  <div class="timeline">
                    <div class="spacer"></div>
                    {Hours}
                  </div>
                  <div class="days">
                    <DayList data={appointmentEvent} Dates={Dates} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointment;
