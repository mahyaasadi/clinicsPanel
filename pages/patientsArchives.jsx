import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig.js";
import { ErrorAlert, SuccessAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import PatientsListTable from "components/dashboard/patientsArchives/patientsListTable";
import CheckPatientNIDModal from "components/dashboard/patientsArchives/checkPatientNIDModal";
import NewPatient from "components/dashboard/patientInfo/addNewPatient";
import NewPatientOptionModal from "components/dashboard/patientInfo/newPatientOptionsModal";
import PendingPatients from "components/dashboard/patientsArchives/pendingPatients";
import ApplyAppointmentModal from "components/dashboard/appointment/applyAppointmentModal";
import FormOptionsModal from "components/dashboard/patientsArchives/formOptionsModal";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";

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
  ActivePatientNID,
  ActivePatientID = null;
const PatientsArchives = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;
  ClinicUserID = ClinicUser._id;

  const [isLoading, setIsLoading] = useState(false);
  const [addPatientIsLoading, setAddPatientIsLoading] = useState(false);

  const [patientsData, setPatientsData] = useState([]);
  const [ActivePatientNID, setActivePatientNID] = useState(null);
  const [pendingPatientsData, setPendingPatientsData] = useState([]);
  const [newPatientData, setNewPatientData] = useState([]);

  const [birthYear, setBirthYear] = useState("");
  const [showBirthDigitsAlert, setShowBirthDigitsAlert] = useState(false);

  // new patient options modal
  const [showNewPatientOptionsModal, setShowNewPatientOptionsModal] =
    useState(false);
  const openNewPatientOptionsModal = () => setShowNewPatientOptionsModal(true);
  const closeNewPatientOptionsModal = () =>
    setShowNewPatientOptionsModal(false);

  const [showModal, setShowModal] = useState(false);
  const openAddModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // formOptionsModal
  const [showFormOptionsModal, setShowFormOptionsModal] = useState(false);
  const openFrmOptionModal = (patientData) => {
    ActivePatientID = patientData._id;
    setShowFormOptionsModal(true);
  };

  const handleCloseFrmModal = () => setShowFormOptionsModal(false);

  // Get all patients records
  const getAllClinicsPatients = () => {
    setIsLoading(true);

    let url = `ClinicReception/myPatient/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
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

  const getActiveNID = (nid) => setActivePatientNID(nid);

  const addNewPatient = (props) => {
    setAddPatientIsLoading(true);

    let url = "Patient/addPatient";
    let data = props;
    data.CenterID = ClinicID;
    data.Clinic = true;

    axiosClient
      .post(url, data)
      .then((response) => {
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
          // console.log(response.data);
          setNewPatientData(response.data);
          setPendingPatientsData([...pendingPatientsData, response.data]);
          setTimeout(() => {
            getAllClinicsPatients();
          }, 100);

          $("#newPatientModal").modal("hide");
          // SuccessAlert("موفق", "اطلاعات بیمار با موفقیت ثبت گردید!");

          setTimeout(() => {
            openNewPatientOptionsModal();
          }, 100);
        }

        setAddPatientIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
        setAddPatientIsLoading(false);
      });
  };

  const DeletePendingPatient = (id) => {
    setPendingPatientsData(pendingPatientsData.filter((a) => a._id !== id));
    getAllClinicsPatients();
  };

  //--- AppointmentModal ---//
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [defaultDepValue, setDefaultDepValue] = useState(null);
  const [ActiveModalityData, setActiveModalityData] = useState(null);

  const handleCloseAppointmentModal = () => setShowAppointmentModal(false);

  const { data: clinicDepartments, isLoading: itIsLoading } =
    useGetAllClinicDepartmentsQuery(ClinicID);

  let modalityOptions = [];
  for (let i = 0; i < clinicDepartments?.length; i++) {
    const item = clinicDepartments[i];
    let obj = {
      value: item._id,
      label: item.Name,
    };
    modalityOptions.push(obj);
  }

  const openAppointmentModal = (patientID) => {
    ActivePatientID = patientID;
    setShowAppointmentModal(true);
    setActiveModalityData(clinicDepartments[0]);

    setDefaultDepValue({
      Name: modalityOptions[0].label,
      _id: modalityOptions[0].value,
    });

    // $("#newPatientOptionsModal").modal("hide");
  };

  const addAppointment = (data) => {
    if (data) {
      setShowAppointmentModal(false);
      SuccessAlert("موفق", "ثبت نوبت با موفقیت انجام گردید!");
    }
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
          <div className="content container-fluid pt-3">
            <div className="card p-1 dir-rtl">
              <div className="row align-items-center p-3">
                <div className="col">
                  <p className="card-title font-14 text-secondary">
                    لیست بیماران در انتظار پذیرش
                  </p>
                </div>

                <div className="col d-flex justify-content-end">
                  <button
                    onClick={openAddModal}
                    className="btn btn-outline-primary btn-add font-13 d-flex aling-items-center"
                  >
                    <i className="me-1">
                      <FeatherIcon icon="plus" />
                    </i>{" "}
                    بیمار جدید
                  </button>
                </div>
              </div>

              <hr className="mt-0 mb-1" />

              <div className="card-body pendingPatientsCard ">
                {pendingPatientsData.map((item, index) => (
                  <PendingPatients
                    key={index}
                    item={item}
                    ClinicID={ClinicID}
                    pendingPatientsData={pendingPatientsData}
                    setPendingPatientsData={setPendingPatientsData}
                    DeletePendingPatient={DeletePendingPatient}
                    openAppointmentModal={openAppointmentModal}
                  />
                ))}
              </div>
            </div>

            <div className="col-sm-12">
              <div className="card dir-rtl">
                <div className="row align-items-center p-3">
                  <div className="col">
                    <p className="card-title font-14 text-secondary">
                      لیست بیماران
                    </p>
                  </div>
                </div>

                <PatientsListTable
                  data={patientsData}
                  openAppointmentModal={openAppointmentModal}
                  openFrmOptionModal={openFrmOptionModal}
                />
              </div>
            </div>
          </div>
        )}

        <CheckPatientNIDModal
          show={showModal}
          onHide={handleCloseModal}
          ClinicID={ClinicID}
          getAllClinicsPatients={getAllClinicsPatients}
          getActiveNID={getActiveNID}
          openAppointmentModal={openAppointmentModal}
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

        <NewPatientOptionModal
          openAppointmentModal={openAppointmentModal}
          data={newPatientData}
          show={showNewPatientOptionsModal}
          onHide={closeNewPatientOptionsModal}
        />

        <ApplyAppointmentModal
          ClinicID={ClinicID}
          show={showAppointmentModal}
          onHide={handleCloseAppointmentModal}
          addAppointment={addAppointment}
          ActivePatientID={ActivePatientID}
          defaultDepValue={defaultDepValue}
          ActiveModalityData={ActiveModalityData}
          setActiveModalityData={setActiveModalityData}
        />

        <FormOptionsModal
          show={showFormOptionsModal}
          onHide={handleCloseFrmModal}
          ClinicID={ClinicID}
          ClinicUserID={ClinicUserID}
          ActivePatientID={ActivePatientID}
        />
      </div>
    </>
  );
};

export default PatientsArchives;

