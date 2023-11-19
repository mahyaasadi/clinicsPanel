import Head from "next/head";
import { useState, useEffect } from "react";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import CashDeskActions from "components/dashboard/cashDesk/actionsModal";
import PatientsCategories from "components/dashboard/cashDesk/patientCategories";
import FilterReceptionItems from "components/dashboard/reception/receptionList/filterReceptionItems";

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
  ActiveReceptionID = null;
const CashDesk = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;
  ClinicUserID = ClinicUser._id;

  const [isLoading, setIsLoading] = useState(true);
  const [patientsInfo, setPatientsInfo] = useState([]);
  const [receptionList, setReceptionList] = useState([]);
  const [kartsOptionList, setKartsOptionsList] = useState([]);
  const [selectedKart, setSelectedKart] = useState(null);
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

  const getReceptionList = () => {
    setIsLoading(true);
    let url = `ClinicReception//FindByClinic/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        // console.log(response.data);
        setReceptionList(response.data);
        if (response.data) getReceptionPatients(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات");
        setIsLoading(false);
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

  // get all karts
  const getKartsData = () => {
    setIsLoading(true);
    let url = `CashDeskKart/getAll/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        let kartOptions = [];
        for (let i = 0; i < response.data.length; i++) {
          const item = response.data[i];
          let obj = {
            value: item._id,
            label: item.Name,
          };
          kartOptions.push(obj);
        }
        setKartsOptionsList(kartOptions);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const applyCashDeskActions = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "ClinicReception/CashDeskAction";
    let data = {
      ReceptionID: ActiveReceptionID,
      UserID: ClinicUserID,
      Price: formProps.price,
      Return: formProps.returnPaymentSwitch ? true : false,
      CartID: selectedKart,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        setPaymentData(response.data.CashDesk);
        getReceptionList();

        e.target.reset();
        setShowPaymentModal(false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
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

  useEffect(() => {
    getReceptionList();
    if (receptionList) {
      getReceptionPatients(receptionList);
    }
    getKartsData();
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
            />
          </div>
        )}

        <CashDeskActions
          data={actionModalData}
          show={showActionsModal}
          onHide={handleCloseActionsModal}
          kartsOptionList={kartsOptionList}
          selectedKart={selectedKart}
          setSelectedKart={setSelectedKart}
          applyCashDeskActions={applyCashDeskActions}
          setActionModalData={setActionModalData}
          paymentData={paymentData}
          isLoading={isLoading}
          showPaymentModal={showPaymentModal}
          setShowPaymentModal={setShowPaymentModal}
        />
      </div>
    </>
  );
};

export default CashDesk;

