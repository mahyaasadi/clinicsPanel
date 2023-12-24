import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig.js";
import { ErrorAlert, QuestionAlert, SuccessAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import PatientsListTable from "components/dashboard/patientsArchives/patientsListTable";
import CheckPatientNIDModal from "components/dashboard/patientsArchives/checkPatientNIDModal";
import NewPatient from "components/dashboard/patientInfo/addNewPatient";
import PendingPatients from "components/dashboard/patientsArchives/pendingPatients";

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
  ActivePatientNID = null;
const PatientsArchives = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(false);
  const [addPatientIsLoading, setAddPatientIsLoading] = useState(false);

  const [patientsData, setPatientsData] = useState([]);
  const [pendingPatientsData, setPendingPatientsData] = useState([]);
  const [birthYear, setBirthYear] = useState("");
  const [showBirthDigitsAlert, setShowBirthDigitsAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const openAddModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Get all patients records
  const getAllClinicsPatients = () => {
    setIsLoading(true);

    let url = `ClinicReception/myPatient/${ClinicID}`;
    axiosClient
      .get(url)
      .then((response) => {
        // console.log(response.data);
        setPatientsData(response.data.Patient);
        setPendingPatientsData(response.data.Pending);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
      });
  };

  const GetPatientInfo = (data) => {
    ActivePatientNID = $("#patientNationalCode").val();
  };

  const addNewPatient = (props) => {
    setAddPatientIsLoading(true);

    let url = "Patient/addPatient";
    let data = props;
    data.CenterID = ClinicID;
    data.Clinic = true;

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);

        if (response.data === false) {
          ErrorAlert(
            "خطا",
            "بیمار با اطلاعات وارد شده, تحت پوشش این بیمه نمی باشد!"
          );
          setAddPatientIsLoading(false);

          return false;
        } else if (response.data.errors) {
          ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
          setAddPatientIsLoading(false);

          return false;
        } else {
          setPendingPatientsData([...pendingPatientsData, response.data]);
          setTimeout(() => {
            getAllClinicsPatients();
          }, 100);
          $("#newPatientModal").modal("hide");
          SuccessAlert("موفق", "اطلاعات بیمار با موفقیت ثبت گردید!");
        }

        setAddPatientIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
        setAddPatientIsLoading(false);
      });
  };

  useEffect(() => {
    getAllClinicsPatients();

    $("#BtnActiveSearch").hide();
    $("#getPatientCloseBtn").hide();
    setShowBirthDigitsAlert(false);
  }, []);

  return (
    <>
      <Head>
        <title>پرونده بیماران</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-md-12 d-flex justify-content-end">
                  <button
                    onClick={openAddModal}
                    className="btn btn-primary btn-add font-14"
                  >
                    <i className="me-1">
                      <FeatherIcon icon="plus-square" />
                    </i>{" "}
                    اضافه کردن
                  </button>
                </div>
              </div>
            </div>

            <PendingPatients data={pendingPatientsData} />

            <div className="col-sm-12">
              <label className="lblAbs fw-bold font-14">
                لیست پرونده های بیماران
              </label>
              <div className="card">
                <div className="card-header border-bottom-0">
                  <div className="row align-items-center">
                    <div className="col-auto d-flex flex-wrap"></div>
                  </div>
                </div>

                <PatientsListTable data={patientsData} />
              </div>
            </div>
          </div>
        )}

        <CheckPatientNIDModal
          show={showModal}
          onHide={handleCloseModal}
          ClinicID={ClinicID}
          GetPatientInfo={GetPatientInfo}
        />

        <NewPatient
          ClinicID={ClinicID}
          addNewPatient={addNewPatient}
          ActivePatientNID={ActivePatientNID}
          birthYear={birthYear}
          setBirthYear={setBirthYear}
          showBirthDigitsAlert={showBirthDigitsAlert}
          setShowBirthDigitsAlert={setShowBirthDigitsAlert}
          addPatientIsLoading={addPatientIsLoading}
        />
      </div>
    </>
  );
};

export default PatientsArchives;

