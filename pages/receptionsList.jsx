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
let ActiveModalityData = {};

const ReceptionsList = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(true);
  const [receptionList, setReceptionList] = useState([]);
  const [defaultDepValue, setDefaultDepValue] = useState();

  // appointment modal
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
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
    if (data) {
      setReceptionList(data);
    }
  };

  const openAppointmentModal = (patientData, modality) => {
    setShowAppointmentModal(true);

    ActivePatientID = patientData._id;
    ActiveModalityData = modality;
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

  useEffect(() => getReceptionList(), []);

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
            <div className="row">
              <div className="col-sm-12">
                <div className="card row p-4">
                  <div>
                    <FilterReceptionItems
                      ClinicID={ClinicID}
                      ApplyFilterOnRecItems={ApplyFilterOnRecItems}
                    />
                  </div>

                  <div className="d-flex justify-end">
                    <ul className="nav nav-tabs nav-tabs-solid justify-end">
                      <li className="nav-item">
                        <a
                          className="nav-link active"
                          href="#solid-rounded-tab1"
                          data-bs-toggle="tab"
                        >
                          <FeatherIcon icon="grid" />
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          href="#solid-rounded-tab2"
                          data-bs-toggle="tab"
                        >
                          <FeatherIcon icon="list" />
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="tab-content pt-1">
                    <div
                      className="tab-pane show active"
                      id="solid-rounded-tab1"
                    >
                      <div className="row">
                        {currentItems.map((item, index) => (
                          <ReceptionItem
                            key={index}
                            srv={item}
                            deleteReception={deleteReception}
                            openAppointmentModal={openAppointmentModal}
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

                    <div className="tab-pane" id="solid-rounded-tab2">
                      <ReceptionListTable
                        data={receptionList}
                        deleteReception={deleteReception}
                        openAppointmentModal={openAppointmentModal}
                      />
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
        />
      </div>
    </>
  );
};

export default ReceptionsList;
