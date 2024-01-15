import { useState, useEffect } from "react";
import Head from "next/head";
import JDate from "jalali-date";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, SuccessAlert, WarningAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import SalamatPrescRecordsList from "components/dashboard/prescription/salamat/salamatPrescRecordsList";
import FilterSalamatPrescs from "components/dashboard/prescription/salamat/filterSalamatPrescs";

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
const SalamatPrescRecords = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const jDate = new JDate();
  let todaysFormattedDate = jDate.format("YYYYMMDD");

  const [isLoading, setIsLoading] = useState(false);
  const [prescRecords, setPrescRecords] = useState([]);
  // const [ActivePatientNID, setActivePatientNID] = useState("");

  // Get All SalamatPrescription Records
  const getAllSalamatPrescRecords = () => {
    setIsLoading(true);

    let url = "BimehSalamat/SearchSamadCode/ByDate";
    let data = {
      SavePresc: 1,
      Status: "O",
      CenterID: ClinicID,
      NID: "",
      DateFrom: todaysFormattedDate,
      DateTo: todaysFormattedDate,
    };

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);

        if (response.data.res.info) {
          setPrescRecords(response.data.res.info);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          ErrorAlert("خطا", "خطا در دریافت اطلاعات!")
        }
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات!")
        setIsLoading(false);
      });
  };

  // Filter PrescriptionRecords
  let dateFrom,
    dateTo = null;
  const SetRangeDate = (dateF, dateT) => {
    dateFrom = dateF?.replaceAll(/\//g, "");
    dateTo = dateT?.replaceAll(/\//g, "");

    console.log({ dateFrom, dateTo });
  };

  const applyFilterOnSalamatPrescs = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    // setActivePatientNID(formProps.patientNID);

    let url = "BimehSalamat/SearchSamadCode/ByDate";
    let data = {
      SavePresc: 1,
      Status: "O",
      CenterID: ClinicID,
      NID: formProps.patientNID,
      DateFrom: dateFrom,
      DateTo: dateTo
    }

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);

        if (response.data.res.info) {
          setPrescRecords(response.data.res.info);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          ErrorAlert("خطا", "خطا در دریافت اطلاعات!")
        }
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات!")
        setIsLoading(false);
      });
  };

  // const resetFilterOptions = () => {
  //   getAllSalamatPrescRecords();

  //   set
  // }

  useEffect(() => getAllSalamatPrescRecords(), []);

  return (
    <>
      <Head>
        <title>نسخ خدمات درمانی</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="row">
              <div className="col-sm-12">
                <FilterSalamatPrescs
                  SetRangeDate={SetRangeDate}
                  applyFilterOnSalamatPrescs={applyFilterOnSalamatPrescs}
                  getAllSalamatPrescRecords={getAllSalamatPrescRecords}
                />

                <div className="card">
                  <div className="card-header border-bottom-0">
                    <div className="row align-items-center">
                      <div className="col">
                        <p className="card-title font-15 text-secondary">
                          سوابق نسخ ثبت شده
                        </p>
                      </div>
                    </div>

                    {/* <div className="col-auto d-flex flex-wrap"> */}
                    <div className="form-custom me-2">
                      <div
                        id="tableSearch"
                        className="dataTables_wrapper"
                      ></div>
                    </div>
                    {/* </div> */}
                  </div>

                  <SalamatPrescRecordsList data={prescRecords} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SalamatPrescRecords;
