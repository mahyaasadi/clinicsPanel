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
  const [formsData, setFormsData] = useState([]);

  // get all formsData
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

  // delete form
  const deleteForm = async (id) => {
    let result = await QuestionAlert(
      "حذف فرم!",
      "آیا از حذف فرم اطمینان دارید؟"
    );

    if (result) {
      setIsLoading(true);
      let url = `Form/Delete/${id}`;
      let data = {
        CenterID: ClinicID,
        UserID: ClinicUser._id
      };

      await axiosClient
        .delete(url, { data })
        .then((response) => {
          setFormsData(formsData.filter((a) => a._id !== id));
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

                  <FormsTable data={formsData} deleteForm={deleteForm} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Forms;
