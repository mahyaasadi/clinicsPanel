import Head from "next/head";
import { useEffect } from "react";
import { getSession } from "lib/session";
import { useState } from "react";
import FeatherIcon from "feather-icons-react";
import { convertBase64 } from "utils/convertBase64";
import { ErrorAlert, QuestionAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import DepartmentsModal from "components/dashboard/departments/departmentsModal";
import DepartmentsListTable from "components/dashboard/departments/departmentsListTable";
import {
  useGetAllClinicDepartmentsQuery,
  useAddClinicDepartmentMutation,
  useEditClinicDepartmentMutation,
  useDeleteClinicDepartmentMutation,
} from "redux/slices/clinicDepartmentApiSlice";

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
const Departments = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editDepartmentData, setEditDeparmentData] = useState([]);

  const handleCloseModal = () => setShowModal(false);

  // Fetching data
  const {
    data: clinicDepartments,
    error,
    isLoading,
  } = useGetAllClinicDepartmentsQuery(ClinicID);

  // Mutations
  const [addClinicDepartment] = useAddClinicDepartmentMutation();
  const [editClinicDepartment] = useEditClinicDepartmentMutation();
  const [deleteClinicDepartment] = useDeleteClinicDepartmentMutation();

  // add department
  const openAddModal = () => {
    setShowModal(true);
    setModalMode("add");
  };

  let clinicIcon = null;
  const handleAdd = async (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    if (formProps.clinicIcon && formProps.clinicIcon.size != 0) {
      clinicIcon = await convertBase64(formProps.clinicIcon);
    }

    const newDepartment = {
      ClinicID,
      Name: formProps.departmentName,
      EngName: formProps.departmentEngName,
      Icon: clinicIcon,
    };

    try {
      const response = await addClinicDepartment(newDepartment).unwrap();
      setShowModal(false);
    } catch (error) {
      console.log(error);
      ErrorAlert("خطا", "افزودن بخش با خطا مواجه گردید!");
    }
  };

  // edit department
  const openEditModal = (data) => {
    setModalMode("edit");
    setShowModal(true);
    setEditDeparmentData(data);
  };

  let newClinicIcon = null;
  const handleEdit = async (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    if (formProps.clinicIcon && formProps.clinicIcon.size != 0) {
      newClinicIcon = await convertBase64(formProps.clinicIcon);
    }

    let updatedDepartment = {
      ClinicID,
      DepartmentID: formProps.departmentID,
      Name: formProps.departmentName,
      EngName: formProps.departmentEngName,
      Icon: newClinicIcon ? newClinicIcon : formProps.currentIcon,
    };

    try {
      const response = await editClinicDepartment(updatedDepartment).unwrap();
      setShowModal(false);
    } catch (error) {
      console.log(error);
      ErrorAlert("خطا", "ویرایش اطلاعات با خطا مواجه گردید!");
    }
  };

  const deleteDepartment = async (id) => {
    let result = await QuestionAlert(
      "حذف بخش!",
      "آیا از حذف بخش اطمینان دارید؟"
    );

    let data = {
      ClinicID,
      DepartmentID: id,
    };

    if (result) {
      try {
        const response = await deleteClinicDepartment(data).unwrap();
      } catch (error) {
        console.log(error);
        ErrorAlert("خطا", "حذف بخش با خطا مواجه گردید!");
      }
    }
  };

  useEffect(() => {
    console.log({ clinicDepartments });
  }, [clinicDepartments]);

  return (
    <>
      <Head>
        <title>مدیریت بخش ها</title>
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
                        <p className="card-title text-secondary font-14">
                          لیست بخش ها
                        </p>
                      </div>
                    </div>
                  </div>

                  <DepartmentsListTable
                    data={clinicDepartments}
                    openEditModal={openEditModal}
                    deleteDepartment={deleteDepartment}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <DepartmentsModal
          mode={modalMode}
          show={showModal}
          onSubmit={modalMode === "add" ? handleAdd : handleEdit}
          onHide={handleCloseModal}
          data={editDepartmentData}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default Departments;
