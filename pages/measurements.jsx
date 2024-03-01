import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import FeatherIcon from "feather-icons-react";
import { ErrorAlert, QuestionAlert } from "class/AlertManage";
import Loading from "@/components/commonComponents/loading/loading";
import MeasurementsList from "@/components/dashboard/settings/measurements/measurementsList";
import MeasurementsModal from "@/components/dashboard/settings/measurements/measurementsModal";

export const getServerSideProps = async ({ req, res }) => {
  const result = await getSession(req, res);

  if (result) {
    const { ClinicUser } = result;
    return {
      props: {
        ClinicUser,
      },
    };
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
const Measurements = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(true);
  const [measurementData, setMeasurementData] = useState([]);
  const [modalMode, setModalMode] = useState("add");
  const [showModal, setShowModal] = useState(false);
  const [editMeasureData, setEditMeasureData] = useState([]);

  const handleCloseModal = () => setShowModal(false);

  // Get All Measurements
  const getMeasurementData = () => {
    setIsLoading(true);
    let url = `MedicalParms/getByCenter/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setMeasurementData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
        setIsLoading(false);
      });
  };

  // Add New Measurement
  const openAddModal = () => {
    setModalMode("add");
    setShowModal(true);
  };

  const addMeasurement = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "MedicalParms/add";
    let data = {
      CenterID: ClinicID,
      Name: formProps.PN,
      EngName: formProps.SN,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        setMeasurementData([...measurementData, response.data]);
        setShowModal(false);
        e.target.reset();
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        ErrorAlert("خطا", "افزودن پارامتر با خطا مواجه گردید!");
        setIsLoading(false);
      });
  };

  // Edit Measurement
  const openEditModal = (data) => {
    setEditMeasureData(data);
    setModalMode("edit");
    setShowModal(true);
  };

  const editMeasurement = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    const MeasureID = formProps.MeasureID;

    let url = `MedicalParms/update/${MeasureID}`;
    let data = {
      CenterID: ClinicID,
      Name: formProps.PN,
      EngName: formProps.SN,
    };

    axiosClient
      .put(url, data)
      .then((response) => {
        updateItem(formProps.MeasureID, response.data);
        setShowModal(false);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        ErrorAlert("خطا", "ویرایش اطلاعات با خطا مواجه گردید!");
        setIsLoading(false);
      });
  };

  const updateItem = (id, newArr) => {
    let index = measurementData.findIndex((x) => x._id === id);
    let g = measurementData[index];
    g = newArr;

    if (index === -1) {
      console.log("no match");
    } else
      setMeasurementData([
        ...measurementData.slice(0, index),
        g,
        ...measurementData.slice(index + 1),
      ]);
  };

  // delate Measurement
  const deleteMeasurement = async (id) => {
    let result = await QuestionAlert("", "آیا از حذف پارامتر مطمئن هستید؟");

    if (result) {
      setIsLoading(true);
      let url = `MedicalParms//delete/${id}`;

      await axiosClient
        .delete(url)
        .then((response) => {
          setMeasurementData(measurementData.filter((a) => a._id !== id));
          setIsLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          ErrorAlert("خطا", "حذف با خطا مواجه گردید!");
          setIsLoading(true);
        });
    }
  };

  useEffect(() => getMeasurementData(), []);

  return (
    <>
      <Head>
        <title>پارامتر های اندازه گیری</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="dir-rtl">
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
                      افزودن
                    </button>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-header border-bottom-0">
                      <div className="row align-items-center">
                        <div className="col">
                          <p className="card-title font-14 text-secondary">
                            پارامترهای اندازه گیری
                          </p>
                        </div>
                      </div>
                    </div>

                    <MeasurementsList
                      data={measurementData}
                      openEditModal={openEditModal}
                      deleteMeasurement={deleteMeasurement}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <MeasurementsModal
        show={showModal}
        onHide={handleCloseModal}
        mode={modalMode}
        onSubmit={modalMode == "add" ? addMeasurement : editMeasurement}
        data={editMeasureData}
        isLoading={isLoading}
      />
    </>
  );
};

export default Measurements;

