import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig.js";
import FeatherIcon from "feather-icons-react";
import { ErrorAlert, QuestionAlert, SuccessAlert } from "class/AlertManage";
import Paginator from "components/commonComponents/paginator";
import Loading from "components/commonComponents/loading/loading";
import ApplyAppointmentModal from "components/dashboard/appointment/applyAppointmentModal";
import FilterReceptionItems from "@/components/dashboard/receptionsList/filterReceptionItems";
import ReceptionItem from "@/components/dashboard/receptionsList/receptionItem";
import ReceptionListTable from "@/components/dashboard/receptionsList/receptionListTable";
import FormOptionsModal from "components/dashboard/patientsArchives/formOptionsModal";
import AttachImgFileModal from "components/dashboard/patientsArchives/patientFile/imgFiles/attachImgFileModal";

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
  ActivePatientID,
  ActiveReceptionObjID = null;

const ReceptionsList = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;
  ClinicUserID = ClinicUser._id;

  const [isLoading, setIsLoading] = useState(true);
  const [receptionList, setReceptionList] = useState([]);

  // appointment modal
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [defaultDepValue, setDefaultDepValue] = useState();
  const [ActiveModalityData, setActiveModalityData] = useState(null);
  const handleCloseAppointmentModal = () => setShowAppointmentModal(false);

  // Pagination
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const nPages = Math.ceil(receptionList.length / itemsPerPage);
  const currentItems = receptionList.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Get All Receptions
  const getReceptionList = () => {
    setIsLoading(true);

    let url = `ClinicReception//FindByClinic/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setReceptionList(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات");
        setIsLoading(false);
      });
  };

  // Remove Reception
  const deleteReception = async (id) => {
    let result = await QuestionAlert(
      "حذف!",
      "آیا از حذف نسخه پذیرش اطمینان دارید؟"
    );

    if (result) {
      setIsLoading(true);
      let url = `ClinicReception/delete/${id}`;

      await axiosClient
        .delete(url)
        .then((response) => {
          setReceptionList(receptionList.filter((a) => a._id !== id));
          setIsLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          setIsLoading(false);
        });
    }
  };

  // Apply Filter on ReceptionItems
  const ApplyFilterOnRecItems = (data) => {
    if (data) setReceptionList(data);
  };

  const openAppointmentModal = (patientData, modality) => {
    setShowAppointmentModal(true);

    ActivePatientID = patientData._id;
    setActiveModalityData(modality);
    setDefaultDepValue({
      Name: modality.Name,
      _id: modality._id,
    });
  };

  const addAppointment = (data) => {
    if (data) {
      setShowAppointmentModal(false);
      SuccessAlert("موفق", "ثبت نوبت با موفقیت انجام گردید!");
    }
  };

  // save the reception table ui in localeStorage
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
    localStorage.setItem("activeTab", index.toString());
  };

  useEffect(() => {
    const storedActiveTab = localStorage.getItem("activeTab");
    if (storedActiveTab !== null) {
      setActiveTab(parseInt(storedActiveTab, 10));
    }

    getReceptionList();
  }, []);

  // add new form to patient
  const [showFrmOptionsModal, setShowFormOptionsModal] = useState(false);

  const closePatientFrmOptionsModal = () => setShowFormOptionsModal(false);

  const openFrmOptionsModal = (srv) => {
    ActiveReceptionObjID = srv._id;
    ActivePatientID = srv.Patient._id;
    setShowFormOptionsModal(true);
  };

  // attach imgFiles to patient
  const [ActiveReceptionID, setActiveReceptionID] = useState(null);
  const [ActivePatientName, setActivePatientName] = useState("");
  const [showAttachImgModal, setShowAttachImgFile] = useState(false);

  const openAttachImgFilesModal = (srv) => {
    setShowAttachImgFile(true);
    ActivePatientID = srv.Patient._id;
    setActiveReceptionID(srv.ReceptionID);
    setActivePatientName(srv.Patient.Name);
  };

  // attach imgFile
  const AttachImgFile = (uploadedFile) => {
    SuccessAlert(
      "",
      `تصویر با موفقیت به پرونده ${ActivePatientName} اضافه گردید!`
    );
  };

  return (
    <>
      <Head>
        <title>لیست پذیرش ها</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="row dir-rtl">
              <div className="col-sm-12">
                <div className="row p-4">
                  <div className="">
                    <FilterReceptionItems
                      ClinicID={ClinicID}
                      ApplyFilterOnRecItems={ApplyFilterOnRecItems}
                      getReceptionList={getReceptionList}
                    />
                  </div>

                  <div className="d-flex justify-end mb-2">
                    <ul className="nav nav-tabs nav-tabs-solid justify-end">
                      <li className="nav-item">
                        <a
                          className={`nav-link ${
                            activeTab === 0 ? "active" : ""
                          }`}
                          href="#view-solid-rounded-tab1"
                          data-bs-toggle="tab"
                          onClick={() => handleTabClick(0)}
                        >
                          <FeatherIcon icon="grid" />
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={`nav-link ${
                            activeTab === 1 ? "active" : ""
                          }`}
                          href="#view-solid-rounded-tab2"
                          data-bs-toggle="tab"
                          onClick={() => handleTabClick(1)}
                        >
                          <FeatherIcon icon="list" />
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="tab-content pt-1">
                    <div
                      className={`tab-pane show ${
                        activeTab === 0 ? "active" : ""
                      }`}
                      id="view-solid-rounded-tab1"
                    >
                      <div className="row">
                        {currentItems.map((item, index) => (
                          <ReceptionItem
                            key={index}
                            srv={item}
                            deleteReception={deleteReception}
                            openAppointmentModal={openAppointmentModal}
                            openFrmOptionsModal={openFrmOptionsModal}
                            openAttachImgFilesModal={openAttachImgFilesModal}
                          />
                        ))}
                      </div>

                      {currentItems.length > 0 && (
                        <Paginator
                          nPages={nPages}
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                        />
                      )}
                    </div>

                    <div
                      id="view-solid-rounded-tab2"
                      className={`tab-pane ${activeTab === 1 ? "active" : ""}`}
                    >
                      <div className="card">
                        <ReceptionListTable
                          data={receptionList}
                          deleteReception={deleteReception}
                          openAppointmentModal={openAppointmentModal}
                          openFrmOptionsModal={openFrmOptionsModal}
                          openAttachImgFilesModal={openAttachImgFilesModal}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
          show={showFrmOptionsModal}
          onHide={closePatientFrmOptionsModal}
          ClinicID={ClinicID}
          ClinicUserID={ClinicUserID}
          ActivePatientID={ActivePatientID}
          ActiveReceptionObjID={ActiveReceptionObjID}
        />

        <AttachImgFileModal
          ClinicID={ClinicID}
          show={showAttachImgModal}
          setShowModal={setShowAttachImgFile}
          ActivePatientID={ActivePatientID}
          AttachImgFile={AttachImgFile}
          ActiveReceptionID={ActiveReceptionID}
        />
      </div>
    </>
  );
};

export default ReceptionsList;
