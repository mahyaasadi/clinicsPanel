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

  const getReceptionList = () => {
    let url = `ClinicReception//FindByClinic/${ClinicID}`;

    return new Promise((resolve, reject) => {
      axiosClient
        .get(url)
        .then((response) => {
          console.log("findByClinic", response.data);
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

  const getCashDeskPatientsInfo = () => {
    // setIsLoading(true);
    let url = `ClinicReception/CashDeskPatient/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        console.log("cashDeskReception", response.data);

        // let patientItems = [];
        // for (let i = 0; i < response.data.length; i++) {
        //   const item = response.data[i];
        //   let calculatedCost = 0;

        //   item.Calculated?.map((x) => {
        //     calculatedCost += parseInt(x.RowTotalPatientCost);
        //   });

        //   let obj = {
        //     id: item._id,
        //     category: 1,
        //     name: item.Patient.Name,
        //     avatar: item.Patient.Avatar,
        //     nationalID: item.Patient.NationalID,
        //     totalPatientCost: calculatedCost,
        //     item,
        //   };
        //   patientItems.push(obj);
        // }
        // setPatientsInfo(patientItems);
        // setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // setIsLoading(false);
      });
  };

  const getReceptionPatients = (newReceptionList) => {
    let patientItems = [];
    for (let i = 0; i < newReceptionList.length; i++) {
      const item = newReceptionList[i];
      let obj = {
        id: item._id,
        category: item.CashDesk.Status,
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
      getReceptionList()
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

  useEffect(() => {
    getReceptionList();
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
                getReceptionList={getReceptionList}
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

