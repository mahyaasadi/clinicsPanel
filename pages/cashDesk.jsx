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
let ActiveModalityData = {};
const CashDesk = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;
  ClinicUserID = ClinicUser._id;

  const [isLoading, setIsLoading] = useState(true);
  const [patientsInfo, setPatientsInfo] = useState([]);
  const [receptionList, setReceptionList] = useState([]);
  // const [selectedKart, setSelectedKart] = useState(null);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [actionModalData, setActionModalData] = useState([]);
  const [price, setPrice] = useState(0);

  const [paymentData, setPaymentData] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleCloseActionsModal = () => {
    setShowActionsModal(false);
    // setSelectedKart(null);
  };

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
  const handleCloseAppointmentModal = () => setShowAppointmentModal(false);

  const openNewAppointmentModal = (patientData, modality) => {
    setShowAppointmentModal(true);

    ActivePatientID = patientData._id;
    ActiveModalityData = modality;
    setDefaultDepValue({
      Name: modality.Name,
      _id: modality._id,
    });
  };

  const getReceptionList = () => {
    let url = `ClinicReception//FindByClinic/${ClinicID}`;

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

  const applyCashDeskActions = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    let CartID = formProps.kartOption;

    let url = "ClinicReception/CashDeskAction";
    let data = {
      ReceptionID: ActiveReceptionID,
      UserID: ClinicUserID,
      Price: price
        ? price
        : formProps.price !== 0
        ? parseInt(formProps.price.replaceAll(/,/g, ""))
        : 0,
      Return: formProps.returnPaymentSwitch ? true : false,
      CartID: selectedKart ? selectedKart : CartID ? CartID : null,
    };

    console.log({ data });

    // axiosClient
    //   .post(url, data)
    //   .then((response) => {
    //     setPaymentData(response.data.CashDesk);
    //     setShowPaymentModal(false);
    //     setSelectedKart(null);applyCa
    //     CartID = null;
    //     setPaymentDefaultValue(0);

    //     // Reset
    //     getReceptionList()
    //       .then(() => {
    //         setIsLoading(false);
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         setIsLoading(false);
    //         ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
    //       });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setIsLoading(false);
    //     ErrorAlert("خطا", "ثبت اطلاعات با خطا مواجه گردید!");
    //   });
  };

  const ApplyCashDeskActions = (data) => {
    console.log({ data });
    if (data) {
      setPaymentData(data.CashDesk);
      setShowPaymentModal(false);
      getReceptionList();
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
        getReceptionPatients(response.data);
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

  // appointment
  const addAppointment = (data) => {
    if (data) {
      setShowAppointmentModal(false);
      SuccessAlert("موفق", "ثبت نوبت با موفقیت انجام گردید!");
    }
  };

  useEffect(() => {
    getReceptionList();
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
            <FilterReceptionItems
              ClinicID={ClinicID}
              SetRangeDate={SetRangeDate}
              searchIsLoading={searchIsLoading}
              applyFilterOnRecItems={applyFilterOnRecItems}
              selectedDepartment={selectedDepartment}
              FUSelectDepartment={FUSelectDepartment}
              handleResetFilterFields={handleResetFilterFields}
            />

            <PatientsCategories
              patientsInfo={patientsInfo}
              setPatientsInfo={setPatientsInfo}
              openActionModal={openActionModal}
              isLoading={isLoading}
              openNewAppointmentModal={openNewAppointmentModal}
            />
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
          // price={price}
          // setPrice={setPrice}
          // isLoading={isLoading}
          // setSelectedKart={setSelectedKart}
          // kartsOptionList={kartsOptionList}
          // paymentDefaultValue={paymentDefaultValue}
          // setPaymentDefaultValue={setPaymentDefaultValue}
          // returnPayment={returnPayment}
          // setReturnPayment={setReturnPayment}
          // applyCashDeskActions={applyCashDeskActions}
        />

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

export default CashDesk;

