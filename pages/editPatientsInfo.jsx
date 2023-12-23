import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig.js";
import EditPatientInfoFrm from "components/dashboard/patientsArchives/editPatientInfoFrm";

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

  const getOnePatient = () => {
    let url = `Patient/getOne/${ActivePatientID}`;

    axiosClient
      .get(url)
      .then((response) => {
        console.log(response.data);
        setPatientData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
        <div className="content container-fluid">
          <label className="lblAbs fw-bold font-13">تکمیل پرونده بیمار</label>
          <div className="card p-2">
            <div className="card-body">
              <EditPatientInfoFrm data={patientData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPatientsInfo;
