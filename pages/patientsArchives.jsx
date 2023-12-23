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
  const [patientsData, setPatientsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const openAddModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [birthYear, setBirthYear] = useState("");
  const [showBirthDigitsAlert, setShowBirthDigitsAlert] = useState(false);

  // Get all patients records
  const getAllClinicsPatients = () => {
    setIsLoading(true);

    let url = `ClinicReception/myPatient/${ClinicID}`;
    axiosClient
      .get(url)
      .then((response) => {
        console.log(response.data);
        setPatientsData(response.data);
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
    let url = "Patient/addPatient";
    let data = props;
    data.CenterID = ClinicID;
    data.Clinic = true;

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);

        setPatientsData([...patientsData, response.data]);
        // getAllClinicsPatients();
        $("#newPatientModal").modal("hide");

        if (response.data === false) {
          ErrorAlert(
            "خطا",
            "بیمار با اطلاعات وارد شده, تحت پوشش این بیمه نمی باشد!"
          );
          return false;
        } else if (response.data.errors) {
          ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
          return false;
        } else {
          SuccessAlert("موفق", "اطلاعات بیمار با موفقیت ثبت گردید!");
        }
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
      });
  };

  const editPatientInfo = (e) => {
    e.preventDefault();

    let url = "Patient/editPatient";
    let data = {};

    console.log({ data });
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

            <div className="col-sm-12">
              <div className="card">
                <div className="card-header border-bottom-0">
                  <div className="row align-items-center">
                    <div className="col">
                      <p className="card-title font-14 text-secondary">
                        لیست پرونده های بیماران
                      </p>
                    </div>
                    <div className="col-auto d-flex flex-wrap">
                      <div className="form-custom me-2">
                        <div
                          id="tableSearch"
                          className="dataTables_wrapper"
                        ></div>
                      </div>
                    </div>
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
        />
      </div>
    </>
  );
};

export default PatientsArchives;

