import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "@/class/axiosConfig";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
// import { setUser } from "redux/slices/userSlice";
// import { addPost } from "redux/slices/postsSlice";
import {
  useGetAllClinicDepartmentsQuery,
  useAddClinicDepartmentMutation,
  useEditClinicDepartmentMutation,
  useDeleteClinicDepartmentMutation,
} from "redux/slices/clinicDepartmentApiSlice";
import Loading from "components/commonComponents/loading/loading";
import { ErrorAlert, QuestionAlert } from "class/AlertManage";
import { convertBase64 } from "utils/convertBase64";
import DepartmentsModal from "components/dashboard/departments/departmentsModal";
import DepartmentsListTable from "components/dashboard/departments/departmentsListTable";

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
const Dashboard = ({ ClinicUser }) => {
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

    console.log({ newDepartment });

    try {
      const response = await addClinicDepartment(newDepartment).unwrap();
      console.log({ response });
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

    console.log({ updatedDepartment });

    try {
      const response = await editClinicDepartment(updatedDepartment).unwrap();
      console.log({ response });
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
                  <DepartmentsListTable
                    data={clinicDepartments}
                    openEditModal={openEditModal}
                    deleteDepartment={deleteDepartment}
                  />
                </div>

                <div id="tablepagination" className="dataTables_wrapper"></div>
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

export default Dashboard;

//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user);
//   const posts = useSelector((state) => state.posts);
//   const [departmentsData, setDepartmentsData] = useState([]);

// const getDepartmentsData = () => {
//   let url = `ClinicDepartment/getAll/${ClinicID}`;

//   axiosClient
//     .get(url)
//     .then((response) => {
//       dispatch(setUser(response.data));
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// const getDepartments = () => {
//   let url = `ClinicDepartment/getAll/${ClinicID}`;

//   axiosClient
//     .get(url)
//     .then((response) => {
//       setDepartmentsData(response.data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// useEffect(() => {
// getDepartmentsData();
// console.log({ user });
// console.log({ departmentsData });
// }, []);
