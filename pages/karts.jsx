import Head from "next/head";
import { useState, useEffect } from "react";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import FeatherIcon from "feather-icons-react";
import { QuestionAlert, ErrorAlert } from "class/AlertManage.js";
import Loading from "components/commonComponents/loading/loading";
import KartsListTable from "@/components/dashboard/settings/karts/kartsListTable";
import KartModal from "@/components/dashboard/settings/karts/kartModal";

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
const CashDeskKarts = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(true);
  const [kartData, setKartData] = useState([]);
  const [modalMode, setModalMode] = useState("add");
  const [showModal, setShowModal] = useState(false);
  const [editKartData, setEditKartData] = useState([]);

  const handleCloseModal = () => setShowModal(false);

  // get all kartsData
  const getKartsData = () => {
    setIsLoading(true);
    let url = `CashDeskKart/getAll/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setKartData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  // add new kart
  const openAddModal = () => {
    setModalMode("add");
    setShowModal(true);
  };

  const addKart = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "CashDeskKart/add";
    let data = {
      CenterID: ClinicID,
      Name: formProps.kartName,
      Bank: formProps.kartBank,
      Number: formProps.kartNumber,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        setKartData([...kartData, response.data]);
        setShowModal(false);
        e.target.reset();
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        ErrorAlert("خطا", "افزودن پایانه با خطا مواجه گردید!");
        setIsLoading(false);
      });
  };

  // edit kart
  const openEditModal = (data) => {
    setEditKartData(data);
    setModalMode("edit");
    setShowModal(true);
  };

  const editKart = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    const KartID = formProps.kartID;

    let url = `CashDeskKart/update/${KartID}`;
    let Data = {
      CenterID: ClinicID,
      Name: formProps.kartName,
      Bank: formProps.kartBank,
      Number: formProps.kartNumber,
    };

    axiosClient
      .put(url, Data)
      .then((response) => {
        updateItem(formProps.kartID, response.data);
        setShowModal(false);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        ErrorAlert("خطا", "ویرایش پایانه با خطا مواجه گردید!");
        setIsLoading(false);
      });
  };

  const updateItem = (id, newArr) => {
    let index = kartData.findIndex((x) => x._id === id);
    let g = kartData[index];
    g = newArr;

    if (index === -1) {
      console.log("no match");
    } else
      setKartData([
        ...kartData.slice(0, index),
        g,
        ...kartData.slice(index + 1),
      ]);
  };

  // delate kart
  const deleteKart = async (id) => {
    let result = await QuestionAlert(
      "حذف پایانه!",
      "آیا از حذف پایانه مطمئن هستید؟"
    );

    if (result) {
      setIsLoading(true);
      let url = `CashDeskKart/delete/${id}`;
      let data = {
        CenterID: ClinicID,
      };

      await axiosClient
        .delete(url, { data })
        .then((response) => {
          setKartData(kartData.filter((a) => a._id !== id));
          setIsLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          ErrorAlert("خطا", "حذف با خطا مواجه گردید!");
          setIsLoading(true);
        });
    }
  };

  useEffect(() => getKartsData(), []);

  return (
    <>
      <Head>
        <title>پایانه های بانک</title>
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
                            پایانه های بانک
                          </p>
                        </div>
                      </div>
                    </div>

                    <KartsListTable
                      data={kartData}
                      openEditModal={openEditModal}
                      deleteKart={deleteKart}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <KartModal
        show={showModal}
        onHide={handleCloseModal}
        mode={modalMode}
        onSubmit={modalMode == "add" ? addKart : editKart}
        data={editKartData}
        isLoading={isLoading}
      />
    </>
  );
};

export default CashDeskKarts;