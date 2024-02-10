import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getSession, setPatientAvatarUrl } from "lib/session";
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
  const [patientAvatar, setPatientAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getOnePatient = () => {
    setIsLoading(true);
    let url = `Patient/getOne/${ActivePatientID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setPatientData(response.data);
        setPatientAvatar(response.data.Avatar);
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
  let PatientAvatarUrl = setPatientAvatarUrl(
    ActivePatientID + ";" + ClinicUser._id
  );
  console.log(PatientAvatarUrl);
  useEffect(() => {
    ActivePatientID = router.query.id;
    if (ActivePatientID) getOnePatient();
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>ویرایش اطلاعات بیمار</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="card p-2 dir-rtl">
              <div className="card-body">
                <EditPatientInfoFrm
                  data={patientData}
                  patientAvatar={patientAvatar}
                  setPatientAvatar={setPatientAvatar}
                  EditPatient={EditPatient}
                  ActivePatientID={ActivePatientID}
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
