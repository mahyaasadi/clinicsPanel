import { useState, useEffect } from "react";
import Head from "next/head";
import FeatherIcon from "feather-icons-react";
import JDate from "jalali-date";
import Select from "react-select";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import Loading from "components/commonComponents/loading/loading";
import OverviewStats from "components/dashboard/overview/overviewStats";
import FastAccessCards from "components/dashboard/overview/fastAccessCards";
import PaymentChart from "components/dashboard/overview/paymentChart";

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

  const [paymentLabels, setPaymentLabels] = useState([]);
  const [paymentStats, setPaymentStats] = useState([]);
  const [paymentTotalStat, setPaymentTotalStat] = useState(null);
  const [paymentTotalReturn, setPaymentTotalReturn] = useState(null);

  const overviewOptions = [
    { value: "yesterday", label: "دیروز" },
    { value: "today", label: "امروز : " + jdate.format("dddd DD MMMM YYYY") },
    { value: "lastWeek", label: "هفته گذشته" },
    {
      value: "lastMonth",
      label: "ماه جاری : " + jdate.format("MMMM YYY"),
    },
  ];

  const getPaymentStats = (duration) => {
    let url = "ClinicDashboard";

    if (duration === "yesterday") {
      url += "/yesterdayPaymentStatistics";
    } else if (duration === "today") {
      url += "/TodayPaymentStatistics";
    } else if (duration === "lastWeek") {
      url += "/TodayPaymentStatistics";
    } else if (duration === "lastMonth") {
      url += "/TodayPaymentStatistics";
    }

    axiosClient
      .post(url, { ClinicID })
      .then((response) => {
        console.log(response.data);
        setPaymentTotalStat(response.data.Sum);
        setPaymentTotalReturn(response.data.ReturnSum);

        const labels = [];
        const counts = [];
        for (let i = 0; i < response.data?.SumDetail?.length; i++) {
          const item = response.data.SumDetail[i];
          labels.push(item.Name);
          counts.push(item.Sum);
        }
        setPaymentLabels(labels);
        setPaymentStats(counts);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getGeneralStats = (duration) => {
    setStatsIsLoading(true);
    let url = "ClinicDashboard";

    if (duration === "yesterday") {
      url += "/yesterdayStatistics";
      setStatsPlaceholder("دیروز");
      getPaymentStats("yesterday");
    } else if (duration === "today") {
      url += "/TodayStatistics";
      setStatsPlaceholder("امروز : " + jdate.format("dddd DD MMMM YYYY"));
      getPaymentStats("today");
    } else if (duration === "lastWeek") {
      url += "/lastWeekStatistics";
      setStatsPlaceholder("هفته گذشته");
      getPaymentStats("lastWeek");
    } else if (duration === "lastMonth") {
      url += "/monthStatistics";
      setStatsPlaceholder("ماه جاری : " + jdate.format("MMMM YYY"));
      getPaymentStats("lastMonth");
    }

    axiosClient
      .post(url, { ClinicID })
      .then((response) => {
        console.log(response.data);
        setStats(response.data);
        setStatsIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setStatsIsLoading(false);
      });
  };

  useEffect(() => {
    getGeneralStats(selectedDuration);
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
            <div className="content container pb-0">
              <div className="overview-container">
                <div className="dashboard-header">
                  <div className="col overview-title">
                    <p className="card-title text-secondary font-15">
                      میز کار شخصی {ClinicUser.FullName}
                    </p>
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

              <div className="row">
                {/* <div className="col-12">
                  <FastAccessCards />
                </div> */}

                <div className="col-md-7"></div>

                <div className="col-md-5 d-flex">
                  <div className="h-100">
                    <div className="card h-50 mb-0">
                      <div className="card-body d-flex justify-center align-items-center text-center">
                        <span className="dash-widget-icon bg-waiting">
                          <FeatherIcon icon="loader" />
                        </span>
                        <div className="h-50 d-flex flex-col justify-center align-items-center font-15 text-secondary fw-bold">
                          <p className="mb-1">درآمد کل</p>
                          <p>{paymentTotalStat?.toLocaleString() + " ریال"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="card h-50">
                      <div className="card-body d-flex justify-center align-items-center text-center">
                        <span className="dash-widget-icon bg-waiting">
                          <FeatherIcon icon="loader" />
                        </span>
                        <div className="h-50 d-flex flex-col justify-center align-items-center font-15 text-secondary fw-bold">
                          <p className="mb-1">مبلغ بازگردانده شده</p>
                          <p>
                            {paymentTotalReturn?.toLocaleString() + " ریال"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <PaymentChart data={paymentStats} labels={paymentLabels} />
                  </div>
                </div>
              </div>

              <div class="mt-4 row align-items-center">
                <p
                  class="text-secondary fw-bold font-14"
                  style={{
                    position: "absolute",
                    top: "32.25rem",
                    width: "165px",
                    backgroundColor: "#fafaf9",
                    zIndex: "400",
                  }}
                >
                  بررسی مراجعات مطب
                </p>
                <hr style={{ position: "relative" }} />
              </div>

              <div className="row mt-5">
                <OverviewStats stats={stats} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;

