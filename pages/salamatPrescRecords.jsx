import { useState, useEffect } from "react";
import Head from "next/head";
import JDate from "jalali-date";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert } from "class/AlertManage";
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
  const [printIsLoading, setPrintIsLoading] = useState(false);
  const [applyIsLoading, setApplyIsLoading] = useState(false);
  const [prescRecords, setPrescRecords] = useState([]);

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

    axiosClient
      .post(url, data)
      .then((response) => {
        if (response.data.res.info) {
          setPrescRecords(response.data.res.info);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
        }
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
        setIsLoading(false);
      });
  };

  // Filter PrescriptionRecords
  let dateFrom = "";
  let dateTo = "";
  const SetRangeDate = (dateF, dateT) => {
    dateFrom = dateF;
    dateTo = dateT;
  };

  const applyFilterOnSalamatPrescs = (e) => {
    e.preventDefault();
    setApplyIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "BimehSalamat/SearchSamadCode/ByDate";
    let data = {
      SavePresc: 1,
      Status: "O",
      CenterID: ClinicID,
      NID: formProps.patientNID,
      DateFrom:
        dateFrom.indexOf("undefined") !== -1
          ? ""
          : dateFrom.replaceAll(/\//g, ""),
      DateTo:
        dateTo.indexOf("undefined") !== -1 ? "" : dateTo.replaceAll(/\//g, ""),
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);

        if (response.data.res.info) {
          setPrescRecords(response.data.res.info);
          setApplyIsLoading(false);
        } else {
          setApplyIsLoading(false);
          ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
        }
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
        setApplyIsLoading(false);
      });
  };

  // Print Salamat Prescription
  const getPatientInfo = (prescData) => {
    let url = "BimehSalamat/GetPatientSession";
    let data = {
      CenterID: ClinicID,
      NID: prescData.nationalNumber,
      SavePresc: 1,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        if (response.data.res.info) {
          setTimeout(() => {
            printSalamatPresc(
              prescData,
              response.data.res.info.citizenSessionId
            );
          }, 100);
        }
      })
      .catch((error) => {
        console.log(error);
        ErrorAlert("خطا", "دریافت اطلاعات بیمار با خطا مواجه گردید!");
      });
  };

  const printSalamatPresc = (prescData, CitizenSessionId) => {
    setPrintIsLoading(true);
    if (CitizenSessionId) {
      let url = "BimehSalamat/PrintOrder";
      let data = {
        CenterID: ClinicID,
        SavePresc: 1,
        CitizenSessionId,
        SamadCode: prescData.samadCode,
        type: "all",
      };

      axiosClient
        .post(url, data)
        .then((response) => {
          downloadPDF(response.data.res.info.print, prescData);
          setPrintIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPrintIsLoading(false);
        });
    } else {
      ErrorAlert("خطا", "استعلام اطلاعات بیمار با خطا مواجه گردید!");
    }
  };

  const downloadPDF = (pdf, prescData) => {
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    const fileName =
      prescData.name +
      prescData.lastName +
      "_" +
      prescData.nationalNumber +
      ".pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

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
                  applyIsLoading={applyIsLoading}
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

                    {/* <div className="col-auto d-flex flex-wrap">
                      <div className="form-custom me-2">
                        <div
                          id="tableSearch"
                          className="dataTables_wrapper"
                        ></div>
                      </div>
                    </div> */}
                  </div>

                  <SalamatPrescRecordsList
                    printIsLoading={printIsLoading}
                    data={prescRecords}
                    getPatientInfo={getPatientInfo}
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

export default SalamatPrescRecords;
