import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, SuccessAlert } from "class/AlertManage";
import Loading from "@/components/commonComponents/loading/loading";
import CallLogsList from "@/components/dashboard/callLogs/callLogsList";
import NewPatient from "components/dashboard/patientInfo/addNewPatient";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import ApplyAppointmentModal from "components/dashboard/appointment/applyAppointmentModal";

export const getServerSideProps = async ({ req, res }) => {
  const result = await getSession(req, res);
  if (result) {
    const { ClinicUser } = result;
    return {
      props: {
        ClinicUser,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }
};

let ClinicID = null;
const CallLogsHistory = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(false);
  const [callLogsData, setCallLogsData] = useState([]);

  // appointmentModal
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [ActivePatientID, setActivePatientID] = useState(null);
  const [defaultDepValue, setDefaultDepValue] = useState(null);
  const [ActiveModalityData, setActiveModalityData] = useState(null);

  const handleCloseAppointmentModal = () => setShowAppointmentModal(false);

  const { data: clinicDepartments, isLoading: itIsLoading } =
    useGetAllClinicDepartmentsQuery(ClinicID);

  let modalityOptions = [];
  for (let i = 0; i < clinicDepartments?.length; i++) {
    const item = clinicDepartments[i];
    let obj = {
      value: item._id,
      label: item.Name,
    };
    modalityOptions.push(obj);
  }

  const openAppointmentModal = (patientID) => {
    setActivePatientID(patientID);
    setShowAppointmentModal(true);
    setActiveModalityData(clinicDepartments[0]);

    setDefaultDepValue({
      Name: modalityOptions[0].label,
      _id: modalityOptions[0].value,
    });
  };

  const addAppointment = (data) => {
    if (data) {
      setShowAppointmentModal(false);
      SuccessAlert("موفق", "ثبت نوبت با موفقیت انجام گردید!");
    }
  };

  // new patient
  const [birthYear, setBirthYear] = useState("");
  const [showBirthDigitsAlert, setShowBirthDigitsAlert] = useState(false);
  const [addPatientIsLoading, setAddPatientIsLoading] = useState(false);

  const openNewPatientModal = () => $("#newPatientModal").modal("show");

  const getAllCallLogs = () => {
    setIsLoading(true);
    let url = `Sms2/getClinicCallLog/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        console.log(response.data);
        setCallLogsData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const addNewPatient = (props) => {
    setAddPatientIsLoading(true);

    let url = "Patient/addPatient";
    let data = props;
    data.CenterID = ClinicID;
    data.Clinic = true;
    data.CallLog = true;

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);

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
          //   setPatientInfo(response.data);
          getAllCallLogs();
          $("#newPatientModal").modal("hide");
        }
        setAddPatientIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
        setAddPatientIsLoading(false);
      });
  };

  useEffect(() => getAllCallLogs(), []);

  return (
    <>
      <Head>
        <title>سوابق تماس ها</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="dir-rtl">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-header border-bottom-0">
                      <div className="row align-items-center">
                        <div className="col">
                          <p className="card-title text-secondary font-14">
                            سوابق تماس های مطب
                          </p>
                        </div>
                      </div>
                    </div>
                    <CallLogsList
                      data={callLogsData}
                      openAppointmentModal={openAppointmentModal}
                      openNewPatientModal={openNewPatientModal}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <ApplyAppointmentModal
          ClinicID={ClinicID}
          show={showAppointmentModal}
          onHide={handleCloseAppointmentModal}
          addAppointment={addAppointment}
          ActivePatientID={ActivePatientID}
          defaultDepValue={defaultDepValue}
          ActiveModalityData={ActiveModalityData}
          setActiveModalityData={setActiveModalityData}
        />

        <NewPatient
          ClinicID={ClinicID}
          addNewPatient={addNewPatient}
          ActivePatientNID={""}
          birthYear={birthYear}
          setBirthYear={setBirthYear}
          showBirthDigitsAlert={showBirthDigitsAlert}
          setShowBirthDigitsAlert={setShowBirthDigitsAlert}
          addPatientIsLoading={addPatientIsLoading}
        />
      </div>
    </>
  );
};

export default CallLogsHistory;

