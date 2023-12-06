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
  const [serviceCost, setServiceCost] = useState(0);
  const [editServiceData, setEditServiceData] = useState([]);

  const handleCloseModal = () => {
    setShowModal(false);
    setServiceCost(0);
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
  const openAddModal = () => {
    setModalMode("add");
    setShowModal(true);
    if (modalMode === "add") setServiceCost(0);
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
      Price: formProps.servicePrice,
      // Price: serviceCost,
      SA: formProps.arteshShare,
      ST: formProps.taminShare,
      SS: formProps.salamatShare,
    };

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        setServicesData([...servicesData, response.data]);
        setShowModal(false);
        setIsLoading(false);
        e.target.reset();
        setServiceCost(0);
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
      Price: formProps.servicePrice,
      // Price: formProps.servicePrice ? formProps.servicePrice : serviceCost,
      SA: formProps.arteshShare,
      ST: formProps.taminShare,
      SS: formProps.salamatShare,
    };

    console.log({ data });

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
                    onClick={openAddModal}
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
        />
      </div>
    </>
  );
};

export default Services;
