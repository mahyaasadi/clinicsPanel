import { useState, useEffect } from "react";
import Head from "next/head";
import { axiosClient } from "class/axiosConfig";
import { getSession } from "lib/session";

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

  const [statsIsLoading, setStatsIsLoading] = useState(true);

  const getStats = () => {
    setStatsIsLoading(true);
    let url = "ClinicDashboard/TodayStatistics";

    axiosClient
      .post(url, { ClinicID })
      .then((response) => {
        console.log(response.data);
        // setStats(response.data);
        setStatsIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setStatsIsLoading(false);
      });
  };

  useEffect(() => {
    getStats();
  }, []);
  return (
    <>
      <Head>
        <title>داشبورد من</title>
      </Head>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid pb-0">
            <div className="overview-container">
              <div className="dashboard-header">
                <div className="col overview-title">
                  <p className="card-title text-secondary font-16">داشبورد</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

