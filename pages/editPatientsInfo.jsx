import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig.js";
import EditPatientInfoFrm from "components/dashboard/patientsArchives/editPatientInfoFrm";
import Loading from "components/commonComponents/loading/loading";

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
const EditPatientsInfo = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;
  const router = useRouter();

  const [patientData, setPatientData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getOnePatient = () => {
    setIsLoading(true);
    let url = `Patient/getOne/${ActivePatientID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setPatientData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const EditPatient = (data) => {
    if (data) setPatientData(data);
  };

  useEffect(() => {
    ActivePatientID = router.query.id;
    if (ActivePatientID) getOnePatient();
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>تکمیل پرونده بیمار</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="card p-2">
              <div className="card-body">
                <EditPatientInfoFrm
                  data={patientData}
                  EditPatient={EditPatient}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EditPatientsInfo;
