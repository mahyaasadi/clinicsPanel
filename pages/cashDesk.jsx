import Head from "next/head";
import { useState, useEffect } from "react";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import CashDeskActions from "components/dashboard/cashDesk/actionsModal";
import PatientsCategories from "components/dashboard/cashDesk/patientCategories";

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
  ActiveReceptionID = null;
const CashDesk = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(true);
  const [patientsInfo, setPatientsInfo] = useState([]);
  const [kartData, setKartData] = useState([]);
  const [kartsOptionList, setKartsOptionsList] = useState([]);
  const [selectedKart, setSelectedKart] = useState(null);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [actionModalData, setActionModalData] = useState([]);

  const handleCloseActionsModal = () => setShowActionsModal(false);

  const openActionModal = (receptionID, data) => {
    setShowActionsModal(true);
    ActiveReceptionID = receptionID;
    setActionModalData(data);
  };

  const getReceptionList = () => {
    setIsLoading(true);
    let url = `ClinicReception//FindByClinic/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        // console.log(response.data);

        let patientItems = [];
        for (let i = 0; i < response.data.length; i++) {
          const item = response.data[i];
          let obj = {
            id: item._id,
            category: "6550ab29aaffd91260889560",
            name: item.Patient.Name,
            avatar: item.Patient.Avatar,
            nationalID: item.Patient.NationalID,
            calculated: item.Calculated[0],
            item,
          };
          patientItems.push(obj);
        }
        setPatientsInfo(patientItems);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات");
        setIsLoading(false);
      });
  };

  // // get all kartsData
  const getKartsData = () => {
    setIsLoading(true);
    let url = `CashDeskKart/getAll/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setKartData(response.data);
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
      CashPayment: formProps.cashPayment,
      CartPayment: formProps.cartPayment,
      Cart: selectedKart,
      Debt: formProps.debt,
      ReturnPayment: formProps.returnPayment,
    };

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        setShowActionsModal(false);
        e.target.reset();
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getReceptionList();
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
        />
      </div>
    </>
  );
};

export default CashDesk;

