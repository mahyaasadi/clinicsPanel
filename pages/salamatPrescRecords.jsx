import { useState, useEffect } from "react";
import Head from "next/head";
import JDate from "jalali-date";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, WarningAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import SalamatPrescRecordsList from "components/dashboard/prescription/salamat/salamatPrescRecords/salamatPrescRecordsList";
import FilterSalamatPrescs from "components/dashboard/prescription/salamat/salamatPrescRecords/filterSalamatPrescs";

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
        setIsLoading(false);
        if (response.data.res.info) {
          setPrescRecords(response.data.res.info);
        }
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
        setIsLoading(false);
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
          if (response.data.res.info.print) {
            downloadPDF(response.data.res.info.print, prescData);
          } else {
            ErrorAlert("خطا", "نسخه ای برای پرینت موجود نمی باشد");
          }
          setPrintIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPrintIsLoading(false);
          ErrorAlert("خطا", "نسخه ای برای پرینت موجود نمی باشد");
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

  // Filter in Salamat Prescs
  const applyFilterOnSalamatPrescs = (data) => {
    setPrescRecords(data);
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
            <div className="row dir-rtl">
              <div className="col-sm-12">
                <FilterSalamatPrescs
                  ClinicID={ClinicID}
                  applyFilterOnSalamatPrescs={applyFilterOnSalamatPrescs}
                  getAllSalamatPrescRecords={getAllSalamatPrescRecords}
                />

                <div className="card">
                  <div className="card-header border-bottom-0">
                    <div className="row align-items-center">
                      <div className="col">
                        <p className="card-title font-15 text-secondary">
                          نسخ ثبت شده خدمات درمانی
                        </p>
                      </div>
                    </div>
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
