import { useState, useEffect } from "react";
import Head from "next/head";
import JDate from "jalali-date";
import Select from "react-select";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import Loading from "components/commonComponents/loading/loading";
import OverviewStats from "components/dashboard/overview/overviewStats";

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

const jdate = new JDate();
let ClinicID = null;

const Dashboard = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [selectedDuration, setSelectedDuration] = useState("today");
  const [statsPlaceholder, setStatsPlaceholder] = useState(
    "امروز : " + jdate.format("dddd DD MMMM YYYY")
  );
  const [stats, setStats] = useState(null);
  const [statsIsLoading, setStatsIsLoading] = useState(true);

  const overviewOptions = [
    { value: "today", label: "امروز : " + jdate.format("dddd DD MMMM YYYY") },
    { value: "lastWeek", label: "هفته گذشته" },
    {
      value: "lastMonth",
      label: "ماه جاری : " + jdate.format("MMMM YYY"),
    },
  ];

  const getStats = (duration) => {
    setStatsIsLoading(true);
    let url = "ClinicDashboard";

    if (duration === "today") {
      url += "/TodayStatistics";
      setStatsPlaceholder("امروز : " + jdate.format("dddd DD MMMM YYYY"));
    } else if (duration === "lastWeek") {
      url += "/TodayStatistics";
      setStatsPlaceholder("هفته گذشته");
    } else if (duration === "lastMonth") {
      url += "/TodayStatistics";
      setStatsPlaceholder("ماه جاری : " + jdate.format("MMMM YYY"));
    }

    axiosClient.post(url, { ClinicID })
      .then((response) => {
        console.log(response.data);
        setStats(response.data);
        setStatsIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setStatsIsLoading(false)
      })
  };

  useEffect(() => {
    getStats(selectedDuration);
  }, [selectedDuration]);

  return (
    <>
      <Head>
        <title>داشبورد من</title>
      </Head>
      <div className="main-wrapper">
        <div className="page-wrapper">
          {statsIsLoading ? (
            <Loading />
          ) : (
            <div className="content container-fluid pb-0">
              <div className="overview-container">
                <div className="dashboard-header">
                  <div className="col overview-title">
                    <p className="card-title text-secondary font-16">بررسی اجمالی</p>
                  </div>

                  <div className="dashboard-selector font-13">
                    <Select
                      className="select"
                      onChange={(e) => setSelectedDuration(e.value)}
                      options={overviewOptions}
                      placeholder={statsPlaceholder}
                      id="long-value-select"
                      instanceId="long-value-select"
                    />
                  </div>
                </div>
              </div>
              <OverviewStats stats={stats} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;

