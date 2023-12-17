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
  ActivePatientID = null;
let ActiveModalityData = {};

const jdate = new JDate();

const ReceptionsList = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(true);
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [receptionList, setReceptionList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [defaultDepValue, setDefaultDepValue] = useState();

  // appointment modal
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const handleCloseAppointmentModal = () => setShowAppointmentModal(false);

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
        console.log(response.data);
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

  const openAppointmentModal = (patientData, modality) => {
    setShowAppointmentModal(true);

    ActivePatientID = patientData._id;
    ActiveModalityData = modality;
    setDefaultDepValue({
      Name: modality.Name,
      _id: modality._id,
    });
  };

  const addAppointment = (data) => {
    if (data) {
      setShowAppointmentModal(false);
      SuccessAlert("موفق", "ثبت نوبت با موفقیت انجام گردید!");
    }
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
                <div className="card">
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
                    openAppointmentModal={openAppointmentModal}
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
          ActivePatientID={ActivePatientID}
          defaultDepValue={defaultDepValue}
          ActiveModalityData={ActiveModalityData}
        />
      </div>
    </>
  );
};

export default ReceptionsList;
