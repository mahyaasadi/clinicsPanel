import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig.js";
import { ErrorAlert, QuestionAlert } from "class/AlertManage";
import Paginator from "components/commonComponents/paginator";
import Loading from "components/commonComponents/loading/loading";
import ReceptionList from "@/components/dashboard/reception/receptionList/receptionList";

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
const ReceptionRecords = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(true);
  const [receptionList, setReceptionList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

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
          console.log(response.data);
          setReceptionList(receptionList.filter((a) => a._id !== id));
          setIsLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          setIsLoading(false);
        });
    }
  };

  // apply filter on receptionItems
  let dateFrom,
    dateTo = null;

  const SetRangeDate = (f, t) => {
    dateFrom = f;
    dateTo = t;
  };

  const FUSelectDepartment = (departmentValue) =>
    setSelectedDepartment(departmentValue);

  const applyFilterOnRecItems = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "ClinicReception/Search";
    let data = {
      ClinicID,
      ReceptionID: formProps.receptionID ? formProps.receptionID : "",
      ModalityID: selectedDepartment ? selectedDepartment._id : "",
      NID: formProps.patientNID ? formProps.patientNID : "",
      PatientName: formProps.patientName ? formProps.patientName : "",
      DateFrom: dateFrom ? dateFrom : "",
      DateTo: dateTo ? dateTo : "",
    };

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        // receptionList.filter((x) => x._id === response.data )
        setReceptionList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
                <div className="card">
                  <ReceptionList
                    data={currentItems}
                    deleteReception={deleteReception}
                    applyFilterOnRecItems={applyFilterOnRecItems}
                    SetRangeDate={SetRangeDate}
                    ClinicID={ClinicID}
                    selectedDepartment={selectedDepartment}
                    FUSelectDepartment={FUSelectDepartment}
                  />

                  <Paginator
                    nPages={nPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReceptionRecords;