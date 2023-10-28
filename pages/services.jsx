import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "@/class/axiosConfig";
import { useState, useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import Loading from "components/commonComponents/loading/loading";
import ServicesModal from "components/dashboard/services/servicesModal";
import ServicesListTable from "components/dashboard/services/servicesListTable";
import {
  useAddMutation,
  useEditMutation,
  useDeleteMutation,
} from "redux/slices/clinicServicesApiSlice";
import { useGetAllQuery } from "redux/slices/clinicDepartmentsApiSlice";

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

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editServiceData, setEditServiceData] = useState([]);

  const handleCloseModal = () => setShowModal(false);

  // Fetching data
  const { data: clinicServices, error, isLoading } = useGetAllQuery(ClinicID);
  // Mutations
  const [addClinicDepartment] = useAddMutation();
  const [editClinicDepartment] = useEditMutation();
  const [deleteClinicDepartment] = useDeleteMutation();

  console.log(clinicServices);

  // add service
  const openAddModal = () => {
    setShowModal(true);
    setModalMode("add");
  };

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
                        <h5 className="card-title font-16">لیست بخش ها</h5>
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
                  <ServicesListTable
                    data={clinicServices}
                  // openEditModal={openEditModal}
                  />
                </div>

                <div id="tablepagination" className="dataTables_wrapper"></div>
              </div>
            </div>
          </div>
        )}
        <ServicesModal
          mode={modalMode}
          show={showModal}
          onHide={handleCloseModal}
          // onSubmit={modalMode === "add" ? handleAdd : handleEdit}
          // data={editServiceData}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default Services;
