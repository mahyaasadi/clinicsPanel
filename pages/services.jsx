import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, QuestionAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import ServicesModal from "components/dashboard/services/servicesModal";
import ServicesListTable from "components/dashboard/services/servicesListTable";

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

let ClinicID = null;
const Services = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const router = useRouter();
  const DepID = router.query.id;
  const DepName = router.query.name;

  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [servicesData, setServicesData] = useState([]);
  const [editServiceData, setEditServiceData] = useState([]);
  const [serviceCost, setServiceCost] = useState(0);
  const [taminShare, setTaminShare] = useState(0);
  const [salamatShare, setSalamatShare] = useState(0);
  const [arteshShare, setArteshShare] = useState(0);

  const handleCloseModal = () => {
    setShowModal(false);
    setServiceCost(0);
    setTaminShare(0);
    setArteshShare(0);
    setSalamatShare(0);
  };

  const getDepServices = () => {
    setIsLoading(true);
    let url = `/ClinicDepartment/getOne/${DepID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setServicesData(response.data.Services);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
      });
  };

  // add service
  const openAddModal = (Add) => {
    setModalMode("add");
    setShowModal(true);

    if (Add) {
      setServiceCost(0);
      setTaminShare(0);
      setSalamatShare(0);
      setArteshShare(0);
      setEditServiceData([]);
    }
  };

  const addService = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "ClinicDepartment/AddService";
    const data = {
      ClinicID,
      DepartmentID: DepID,
      Code: formProps.internalCode,
      Name: formProps.serviceName,
      EngName: formProps.serviceEngName,
      Price: serviceCost,
      SA: arteshShare,
      ST: taminShare,
      SS: salamatShare,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        setServicesData([...servicesData, response.data]);
        setShowModal(false);
        setIsLoading(false);

        // reset
        e.target.reset();
        setServiceCost(0);
        setTaminShare(0);
        setSalamatShare(0);
        setArteshShare(0);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "افزودن سرویس با خطا مواجه گردید!");
        setIsLoading(false);
      });
  };

  // edit service
  const openEditModal = (data) => {
    setEditServiceData(data);
    setModalMode("edit");
    setShowModal(true);
  };

  const editService = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    let serviceID = formProps.serviceID;

    let url = "ClinicDepartment/EditService";
    const data = {
      ClinicID,
      DepartmentID: DepID,
      ServiceID: serviceID,
      Code: formProps.internalCode,
      Name: formProps.serviceName,
      EngName: formProps.serviceEngName,
      Price: serviceCost
        ? serviceCost
        : formProps.servicePrice !== 0
        ? formProps.servicePrice.replaceAll(/,/g, "")
        : 0,
      SA: arteshShare
        ? arteshShare
        : formProps.arteshShare !== 0
        ? formProps.arteshShare.replaceAll(/,/g, "")
        : 0,
      ST: taminShare
        ? taminShare
        : formProps.taminShare !== 0
        ? formProps.taminShare.replaceAll(/,/g, "")
        : 0,
      SS: salamatShare
        ? salamatShare
        : formProps.salamatShare !== 0
        ? formProps.salamatShare.replaceAll(/,/g, "")
        : 0,
    };

    axiosClient
      .put(url, data)
      .then((response) => {
        updateItem(formProps.serviceID, response.data);
        setShowModal(false);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        ErrorAlert("خطا", "ویرایش اطلاعات سرویس با خطا مواجه گردید!");
      });
  };

  const updateItem = (id, newArr) => {
    let index = servicesData.findIndex((x) => x._id === id);
    let g = servicesData[index];
    g = newArr;

    if (index === -1) {
      console.log("no match");
    } else
      setServicesData([
        ...servicesData.slice(0, index),
        g,
        ...servicesData.slice(index + 1),
      ]);
  };

  // delete service
  const deleteService = async (id) => {
    let result = await QuestionAlert(
      "حذف سرویس!",
      "آیا از حذف سرویس مطمئن هستید"
    );

    if (result) {
      let url = "ClinicDepartment/DeleteService";
      let data = {
        DepartmentID: DepID,
        ServiceID: id,
      };

      await axiosClient
        .delete(url, { data })
        .then((response) => {
          setServicesData(servicesData.filter((a) => a._id !== id));
        })
        .catch(function (error) {
          console.log(error);
          ErrorAlert("خطا", "حذف سرویس با خطا مواجه گردید!");
        });
    }
  };

  useEffect(() => getDepServices(), []);

  return (
    <>
      <Head>
        <title>مدیریت سرویس ها</title>
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
                    onClick={() => openAddModal(true)}
                    className="btn btn-primary btn-add font-14 media-font-12"
                  >
                    <i className="me-1">
                      <FeatherIcon icon="plus-square" />
                    </i>{" "}
                    اضافه کردن
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
                        <p className="card-title font-15 text-secondary">
                          لیست خدمات بخش {DepName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ServicesListTable
                    data={servicesData}
                    openEditModal={openEditModal}
                    deleteService={deleteService}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <ServicesModal
          mode={modalMode}
          show={showModal}
          onHide={handleCloseModal}
          onSubmit={modalMode === "add" ? addService : editService}
          data={editServiceData}
          isLoading={isLoading}
          serviceCost={serviceCost}
          setServiceCost={setServiceCost}
          taminShare={taminShare}
          setTaminShare={setTaminShare}
          salamatShare={salamatShare}
          setSalamatShare={setSalamatShare}
          arteshShare={arteshShare}
          setArteshShare={setArteshShare}
        />
      </div>
    </>
  );
};

export default Services;
