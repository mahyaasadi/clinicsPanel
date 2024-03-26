import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, QuestionAlert } from "class/AlertManage";
import GetPinInput from "components/commonComponents/pinInput";
import Loading from "components/commonComponents/loading/loading";
import FilterTaminPrescs from "components/dashboard/prescription/tamin/taminPrescRecords/filterTaminPrescs";
import TaminPrescRecordsList from "components/dashboard/prescription/tamin/taminPrescRecords/taminPrescRecordsList";

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

let ClinicID = null;
const TaminPrescRecords = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(false);
  const [taminPrescList, setTaminPrescList] = useState([]);
  const [prescData, setPrescData] = useState(null);

  // Get All Tamin Prescs
  const getAllTaminPrescRecords = () => {
    setIsLoading(true);

    let url = "BimehTamin/CenterPrescription";
    let data = { CenterID: ClinicID };

    axiosClient
      .post(url, data)
      .then((response) => {
        setTaminPrescList(response.data.result);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const applyFilterOnTaminPrescs = (data) => setTaminPrescList(data);

  // pinInput modal
  const [showPinModal, setShowPinModal] = useState(false);
  const closePinModal = () => setShowPinModal(false);

  // to trigger the pin send
  const getOneEprscData = (headerID, prID) => {
    let url = "TaminEprsc/GetEpresc";
    let data = {
      CenterID: ClinicID,
      headerID: headerID,
    };

    if (headerID) {
      axiosClient
        .post(url, data)
        .then((response) => {
          // console.log("getOneEprsc", response.data);
        })
        .catch((error) => console.log(error));
    }
  };

  const prepareDelete = async (headerID, prID) => {
    let result = await QuestionAlert("", "آیا از حذف نسخه اطمینان دارید؟");

    if (result) {
      setPrescData({ headerID, prID });
      getOneEprscData(headerID, prID);

      setTimeout(() => {
        setShowPinModal(true);
      }, 1000);
    }
  };

  const getPinInputValue = (code) => {
    if (prescData) {
      deletePresc(prescData.headerID, prescData.prID, ClinicID, code);
    }

    setShowPinModal(false);
  };

  const deletePresc = (headerID, prID, centerID, otpCode) => {
    let url = "TaminEprsc/PrescriptionDelete";
    let data = { headerID, PrID: prID, CenterID: ClinicID, otpCode };

    axiosClient
      .post(url, data)
      .then((response) => {
        setTaminPrescList(taminPrescList.filter((a) => a._id !== prID));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => getAllTaminPrescRecords(), []);

  return (
    <>
      <Head>
        <title>نسخ تامین اجتماعی</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="row dir-rtl">
              <div className="col-sm-12">
                <FilterTaminPrescs
                  ClinicID={ClinicID}
                  applyFilterOnTaminPrescs={applyFilterOnTaminPrescs}
                  getAllTaminPrescRecords={getAllTaminPrescRecords}
                />

                <div className="card">
                  <div className="card-header border-bottom-0  pb-0">
                    <div className="row align-items-center">
                      <div className="col">
                        <p className="card-title font-15 text-secondary">
                          نسخ ثبت شده تامین اجتماعی
                        </p>
                      </div>
                    </div>
                  </div>

                  <TaminPrescRecordsList
                    data={taminPrescList}
                    prepareDelete={prepareDelete}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <GetPinInput
        show={showPinModal}
        onHide={closePinModal}
        getPinInputValue={getPinInputValue}
      />
    </>
  );
};

export default TaminPrescRecords;

