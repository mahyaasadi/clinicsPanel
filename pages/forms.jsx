import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import FeatherIcon from "feather-icons-react";
import { QuestionAlert, ErrorAlert } from "class/AlertManage.js";
import Loading from "components/commonComponents/loading/loading";
import FormsTable from "components/dashboard/forms/formsTable";

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
const Forms = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(true);
  const [FormsData, setFormsData] = useState([]);
  const [modalMode, setModalMode] = useState("add");
  const [showModal, setShowModal] = useState(false);
  const [editFormsData, setEditFormsData] = useState([]);

  const handleCloseModal = () => setShowModal(false);

  // get all kartsData
  const getAllFormsData = () => {
    setIsLoading(true);
    let url = `Form/getAll/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setFormsData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
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
          setFormsData(FormsData.filter((a) => a._id !== id));
          setIsLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          ErrorAlert("خطا", "حذف با خطا مواجه گردید!");
          setIsLoading(true);
        });
    }
  };

  useEffect(() => getAllFormsData(), []);

  return (
    <>
      <Head>
        <title>مدیریت فرم ها</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-md-12 d-flex justify-content-end">
                  <Link
                    href="/formBuilder"
                    className="btn btn-primary btn-add font-14"
                  >
                    <i className="me-1">
                      <FeatherIcon icon="plus-square" />
                    </i>{" "}
                    افزودن
                  </Link>
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
                          لیست فرم ها
                        </p>
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
                  <FormsTable data={FormsData} deleteKart={deleteKart} />
                </div>
                <div id="tablepagination" className="dataTables_wrapper"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Forms;
