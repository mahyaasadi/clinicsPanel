import { useState, useEffect } from "react";
import Head from "next/head";
import JDate from "jalali-date";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig.js";
import { ErrorAlert, QuestionAlert, SuccessAlert } from "class/AlertManage";
import Paginator from "components/commonComponents/paginator";
import Loading from "components/commonComponents/loading/loading";
import ReceptionList from "@/components/dashboard/receptionsList/receptionList";
import ApplyAppointmentModal from "components/dashboard/appointment/applyAppointmentModal";

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
  ActivePatientID,
  ActiveModalityID,
  ActiveModalityName = null;

const jdate = new JDate();

const ReceptionRecords = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(true);
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [appointmentIsLoading, setAppointmentIsLoading] = useState(false);
  const [receptionList, setReceptionList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // appointment modal
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const handleCloseAppointmentModal = () => setShowAppointmentModal(false);

  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [pureStartTime, setPureStartTime] = useState(null);
  const [pureEndTime, setPureEndTime] = useState(null);

  // Pagination
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const nPages = Math.ceil(receptionList.length / itemsPerPage);
  const currentItems = receptionList.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Get All Receptions
  const getReceptionList = () => {
    setIsLoading(true);

    let url = `ClinicReception//FindByClinic/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        // console.log(response.data);
        setReceptionList(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات");
        setIsLoading(false);
      });
  };

  // Remove Reception
  const deleteReception = async (id) => {
    let result = await QuestionAlert(
      "حذف!",
      "آیا از حذف نسخه پذیرش اطمینان دارید؟"
    );

    if (result) {
      setIsLoading(true);
      let url = `ClinicReception/delete/${id}`;

      await axiosClient
        .delete(url)
        .then((response) => {
          setReceptionList(receptionList.filter((a) => a._id !== id));
          setIsLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          setIsLoading(false);
        });
    }
  };

  // Apply Filter on ReceptionItems
  let dateFrom,
    dateTo = null;

  const SetRangeDate = (f, t) => {
    dateFrom = f;
    dateTo = t;
  };

  const FUSelectDepartment = (departmentValue) =>
    setSelectedDepartment(departmentValue);

  const applyFilterOnRecItems = (e) => {
    e.preventDefault();
    setSearchIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "ClinicReception/Search";
    let data = {
      ClinicID,
      ReceptionID: formProps.receptionID ? formProps.receptionID : "",
      ModalityID: selectedDepartment ? selectedDepartment._id : "",
      NID: formProps.patientNID ? formProps.patientNID : "",
      PatientName: formProps.patientName ? formProps.patientName : "",
      DateFrom: dateFrom ? dateFrom : "",
      DateTo: dateTo ? dateTo : "",
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        setReceptionList(response.data);
        setSearchIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setSearchIsLoading(false);
      });
  };

  const handleResetFilterFields = () => {
    setSearchIsLoading(false);
    setSelectedDepartment(null);
    $("#receptionID").val("");
    $("#patientNID").val("");
    $("#patientName").val("");
  };

  // Appointments
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

  const [defaultDepValue, setDefaultDepValue] = useState();
  const openAppointmnetModal = (patientData, modalityID, modalityName) => {
    ActivePatientID = patientData._id;
    ActiveModalityID = modalityID;
    ActiveModalityName = modalityName;
    setDefaultDepValue({
      Name: ActiveModalityName,
      _id: ActiveModalityID,
    });
    setShowAppointmentModal(true);
  };

  const [appointmentDate, setAppointmentDate] = useState(null);

  const FUSelectStartTime = (startTime) => setPureStartTime(startTime);
  const FUSelectEndTime = (endTime) => setPureEndTime(endTime);

  const addAppointment = (e) => {
    e.preventDefault();
    setAppointmentIsLoading(true);

    let url = "Appointment/addClinic";
    let data = {
      ClinicID,
      PatientID: ActivePatientID,
      ModalityID: selectedDepartment ? selectedDepartment : ActiveModalityID,
      Date: appointmentDate,
      ST: pureStartTime,
      ET: pureEndTime,
    };

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        // console.log(response.data);
        setShowAppointmentModal(false);
        SuccessAlert("موفق", "ثبت نوبت با موفقیت انجام گردید!");
        setAppointmentIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ثبت نوبت با خطا مواجه گردید!");
        setAppointmentIsLoading(false);
      });
  };

  useEffect(() => getReceptionList(), []);

  return (
    <>
      <Head>
        <title>لیست پذیرش ها</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="row">
              <div className="col-sm-12">
                <div className="card ">
                  <ReceptionList
                    data={currentItems}
                    ClinicID={ClinicID}
                    deleteReception={deleteReception}
                    applyFilterOnRecItems={applyFilterOnRecItems}
                    handleResetFilterFields={handleResetFilterFields}
                    SetRangeDate={SetRangeDate}
                    selectedDepartment={selectedDepartment}
                    FUSelectDepartment={FUSelectDepartment}
                    searchIsLoading={searchIsLoading}
                    openAppointmnetModal={openAppointmnetModal}
                  />

                  {currentItems.length > 0 && (
                    <Paginator
                      nPages={nPages}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />
                  )}
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
          setAppointmentDate={setAppointmentDate}
          selectedStartTime={selectedStartTime}
          selectedEndTime={selectedEndTime}
          FUSelectStartTime={FUSelectStartTime}
          FUSelectEndTime={FUSelectEndTime}
          selectedDepartment={defaultDepValue}
          FUSelectDepartment={FUSelectDepartment}
          appointmentIsLoading={appointmentIsLoading}
          hoursOptions={hoursOptions}
        />
      </div>
    </>
  );
};

export default ReceptionRecords;
