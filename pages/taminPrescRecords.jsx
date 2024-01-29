import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, QuestionAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import TaminPrescRecordsList from "components/dashboard/prescription/tamin/taminPrescRecords/taminPrescRecordsList";
import FilterTaminPrescs from "components/dashboard/prescription/tamin/taminPrescRecords/filterTaminPrescs";

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

                  <TaminPrescRecordsList data={taminPrescList} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TaminPrescRecords;
