import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig.js";
import { ErrorAlert, QuestionAlert, SuccessAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import PatientsFormsList from "components/dashboard/patientFile/patientFormsList";
import PatientCard from "components/dashboard/patientFile/PatientCard";

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
const PatientFile = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [patientData, setPatientData] = useState([]);
  const [patientForms, setPatientForms] = useState([]);

  const getOnePatient = () => {
    setIsLoading(true);
    let url = `Patient/getOne/${ActivePatientID}`;

    axiosClient
      .get(url)
      .then((response) => {
        console.log(response.data);
        setPatientData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const getPatientForms = () => {
    let url = `Form/patientFormGetByUserID/${ActivePatientID}`;

    axiosClient
      .get(url)
      .then((response) => {
        // console.log(response.data);
        setPatientForms(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let InsuranceType,
    GenderType = null;
  if (patientData) {
    switch (patientData.Insurance) {
      case "1":
        InsuranceType = "سلامت ایرانیان";
        break;
      case "2":
        InsuranceType = "تامین اجتماعی";
        break;
      case "3":
        InsuranceType = "نیروهای مسلح";
        break;
      case "4":
        InsuranceType = "آزاد";
      default:
        break;
    }

    switch (patientData.Gender) {
      case "M":
        GenderType = "مرد";
        break;
      case "F":
        GenderType = "زن";
        break;
      case "O":
        GenderType = "دیگر";
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    ActivePatientID = router.query.id;
    if (ActivePatientID) {
      getOnePatient();
      getPatientForms();
    }
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>پرونده بیمار</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="card">
              <div className="card-body p-4">
                {/* <div className="table-responsive marginb-3 shadow-sm"> */}
                {/* <table className="table mt-4 font-13 fw-bold text-secondary table-bordered">
                    <tbody>
                      <tr>
                        <td>نام بیمار</td>
                        <td>نوع بیمه</td>
                        <td>کد ملی</td>
                        <td>سن</td>
                        <td>جنسیت</td>
                      </tr>
                      <tr>
                        <td>
                          <div className="patientAvatar d-flex justify-center">
                            <div className="d-flex gap-2 align-items-center">
                              <img
                                src={
                                  "https://irannobat.ir/images/" +
                                  patientData.avatar
                                }
                                alt="patientAvatar"
                                onError={({ currentTarget }) => {
                                  patientData?.Gender
                                    ? (currentTarget.src = `assets/img/avatar-${patientData?.Gender}-pic.png`)
                                    : (currentTarget.src = `assets/img/avatar-O-pic.png`);
                                }}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "10px",
                                }}
                              />
                              <p className="fw-bold font-13">
                                {patientData?.Name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>{InsuranceType}</td>
                        <td>{patientData.NationalID}</td>
                        <td>{patientData.Age}</td>
                        <td>{GenderType}</td>
                      </tr>
                    </tbody>
                  </table> */}
                <PatientCard data={patientData} />
                {/* </div> */}

                <div className="row p-2 mt-4">
                  <div className="card col-md-6 col-12 shadow">
                    <label className="lblAbs font-13">فرم های بیمار</label>
                    <div className="card-body">
                      <PatientsFormsList data={patientForms} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PatientFile;
