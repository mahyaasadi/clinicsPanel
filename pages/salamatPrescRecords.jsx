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
  console.log({ todaysFormattedDate });

  const [isLoading, setIsLoading] = useState(false);
  const [prescRecords, setPrescRecords] = useState([]);
  // const [dateFrom, setDateFrom] = useState("");
  // const [dateTo, setDateTo] = useState("");
  const [ActivePatientNID, setActivePatientNID] = useState("");

  let dateFrom,
    dateTo = null;
  const SetRangeDate = (F, T) => {
    // if (dateF && dateT) {
    // setDateFrom(jDate.format("YYYYMMDD"));
    // setDateTo(jDate.format("YYYYMMDD"));
    // } else {
    dateFrom = F;
    dateTo = T;
    // setDateFrom(dateF.replaceAll(/\//g, ""));
    // setDateTo(dateT.replaceAll(/\//g, ""));
    console.log({ F, T });
    // }
  };

  // Get All SalamatPrescription Records
  const getAllSalamatPrescRecords = () => {
    // setIsLoading(true);

    let url = "BimehSalamat/SearchSamadCode/ByDate";
    let data = {
      SavePresc: 1,
      Status: "O",
      CenterID: ClinicID,
      NID: ActivePatientNID,
      DateFrom: dateFrom ? dateFrom : todaysFormattedDate,
      DateTo: todaysFormattedDate ? todaysFormattedDate : dateTo,
    };

    console.log({ data });

    // axiosClient
    //   .post(url, data)
    //   .then((response) => {
    //     console.log(response.data);

    //     if (response.data.res.info) {
    //       setPrescRecords(response.data.res.info);
    //       setIsLoading(false);
    //     } else {
    //       setIsLoading(true);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setIsLoading(false);
    //   });
  };

  const applyFilterOnSalamatPrescs = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    setActivePatientNID(formProps.patientNID);

    // inja data ro az _function begire then
    // SavePresc: 1,
    //   Status: "O",
    //   CenterID: ClinicID,

    // in 3 ta ro behesh ezafe kone
    // example FilterOnRecItems

    // update data then pass it to getAllSalamatPrescRecords();
  };

  useEffect(() => {
    getAllSalamatPrescRecords();
  }, []);

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
