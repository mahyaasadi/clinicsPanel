import Head from "next/head";
import { useState, useEffect } from "react";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, SuccessAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import CashDeskActions from "components/dashboard/cashDesk/actionsModal";
import PatientsCategories from "components/dashboard/cashDesk/patientCategories";
import FilterReceptionItems from "components/dashboard/receptionsList/filterReceptionItems";
import ApplyAppointmentModal from "components/dashboard/appointment/applyAppointmentModal";
import PatientPaymentsModal from "components/dashboard/cashDesk/patientPaymentsModal";

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
  ActiveReceptionID,
  ActivePatientID = null;
const CashDesk = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;
  ClinicUserID = ClinicUser._id;

  const [isLoading, setIsLoading] = useState(true);
  const [patientsInfo, setPatientsInfo] = useState([]);
  const [receptionList, setReceptionList] = useState([]);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [actionModalData, setActionModalData] = useState([]);

  const [paymentData, setPaymentData] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleCloseActionsModal = () => setShowActionsModal(false);

  // searchBox
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const openActionModal = (receptionID, data) => {
    setShowActionsModal(true);
    ActiveReceptionID = receptionID;
    setActionModalData(data);
    setPaymentData(data?.CashDesk);
  };

  // appointmentModal
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [defaultDepValue, setDefaultDepValue] = useState();
  const [ActiveModalityData, setActiveModalityData] = useState(null);
  const handleCloseAppointmentModal = () => setShowAppointmentModal(false);

  const openNewAppointmentModal = (patientData, modality) => {
    setShowAppointmentModal(true);

    ActivePatientID = patientData._id;
    setActiveModalityData(modality);
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

  // const getReceptionList = () => {
  //   let url = `ClinicReception//FindByClinic/${ClinicID}`;

  //   return new Promise((resolve, reject) => {
  //     axiosClient
  //       .get(url)
  //       .then((response) => {
  //         console.log("findByClinic", response.data);
  //         // setReceptionList(response.data);
  //         // if (response.data) getReceptionPatients(response.data);
  //         setTimeout(() => {
  //           setIsLoading(false);
  //         }, 100);
  //         resolve();
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         ErrorAlert("خطا", "خطا در دریافت اطلاعات");
  //         setIsLoading(false);
  //         reject(err);
  //       });
  //   });
  // };

  const getCashDeskPatientsInfo = () => {
    setIsLoading(true);
    let url = `ClinicReception/CashDeskPatient/${ClinicID}`;

    return new Promise((resolve, reject) => {
      axiosClient
        .get(url)
        .then((response) => {
          setReceptionList(response.data);
          if (response.data) getReceptionPatients(response.data);
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
          resolve();
        })
        .catch((err) => {
          console.log(err);
          ErrorAlert("خطا", "خطا در دریافت اطلاعات");
          setIsLoading(false);
          reject(err);
        });
    });
  };

  const getReceptionPatients = (newReceptionList) => {
    let patientItems = [];
    for (let i = 0; i < newReceptionList.length; i++) {
      const item = newReceptionList[i];
      let obj = {
        id: item._id,
        category: item.CashDesk.Status._id,
        name: item.Patient.Name,
        avatar: item.Patient.Avatar,
        nationalID: item.Patient.NationalID,
        calculated: item.Calculated[0],
        item,
      };
      patientItems.push(obj);
    }
    setPatientsInfo(patientItems);
    return patientsInfo;
  };

  // Apply CashDesk Actions
  const ApplyCashDeskActions = (data) => {
    setIsLoading(true);

    if (data) {
      setPaymentData(data.CashDesk);
      setShowPaymentModal(false);
      // getReceptionList()
      getCashDeskPatientsInfo()
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
        });
    }
  };

  const ApplyFilterOnRecItems = (data) => {
    if (data) getReceptionPatients(data);
  };

  // patient payments modal
  const [showPatientPaymentsModal, setShowPatientPaymentsModal] =
    useState(false);
  const openPatientPaymentsModal = () => setShowPatientPaymentsModal(true);
  const closePatientPaymentsModal = () => setShowPatientPaymentsModal(false);

  useEffect(() => {
    // getReceptionList();
    getCashDeskPatientsInfo();
    if (receptionList) {
      getReceptionPatients(receptionList);
    }
  }, []);

  return (
    <>
      <Head>
        <title>صندوق</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="dir-rtl">
              <FilterReceptionItems
                ClinicID={ClinicID}
                ApplyFilterOnRecItems={ApplyFilterOnRecItems}
                getReceptionList={getCashDeskPatientsInfo}
              />

              <PatientsCategories
                patientsInfo={patientsInfo}
                setPatientsInfo={setPatientsInfo}
                openActionModal={openActionModal}
                isLoading={isLoading}
                openNewAppointmentModal={openNewAppointmentModal}
              />
            </div>
          </div>
        )}

        <CashDeskActions
          ClinicID={ClinicID}
          ClinicUserID={ClinicUserID}
          ActiveReceptionID={ActiveReceptionID}
          show={showActionsModal}
          onHide={handleCloseActionsModal}
          data={actionModalData}
          paymentData={paymentData}
          showPaymentModal={showPaymentModal}
          setShowPaymentModal={setShowPaymentModal}
          ApplyCashDeskActions={ApplyCashDeskActions}
          openPatientPaymentsModal={openPatientPaymentsModal}
        />

        <PatientPaymentsModal
          data={actionModalData}
          onHide={closePatientPaymentsModal}
          show={showPatientPaymentsModal}
        />

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
      </div>
    </>
  );
};

export default CashDesk;

