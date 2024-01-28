import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
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
    { value: "lastWeek", label: "هفته گذشته" },
    { value: "yesterday", label: "دیروز" },
    { value: "today", label: "امروز : " + jdate.format("dddd DD MMMM YYYY") },
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
      url += "/lastWeekPaymentStatistics";
    } else if (duration === "lastMonth") {
      url += "/TodayPaymentStatistics";
    }

    axiosClient
      .post(url, { ClinicID })
      .then((response) => {
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
              <div className="dir-rtl">
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
                  <div className="col-md-6 col-lg-7 mb-1">
                    <div className="row">
                      <div className="col-lg-3 pe-lg-0">
                        <div className="row">
                          <div className="col-md-6 col-lg-12">
                            <div className="card CardPayment mb-1">
                              <div className="card-body justify-center align-items-center text-center">
                                <span className="dash-finance-icon bg-talking">
                                  <Image
                                    src="/assets/img/total2.png"
                                    alt=""
                                    width="35"
                                    height="35"
                                  />
                                </span>
                                <div className="justify-center align-items-center  text-secondary fw-bold">
                                  <p className="mb-0 font-14">درآمد کل</p>
                                  <p className="font-16 fw-bold">
                                    {paymentTotalStat
                                      ? paymentTotalStat.toLocaleString() +
                                      " ریال"
                                      : "-"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-12">
                            <div className="card CardPayment mb-0">
                              <div className="card-body d-flex flex-col justify-center align-items-center text-center">
                                <span className="dash-finance-icon bg-turnGiven d-flex justify-center align-center">
                                  <Image
                                    src="/assets/img/cash3.png"
                                    alt=""
                                    width="40"
                                    height="40"
                                  />
                                </span>
                                <div className="h-50 d-flex flex-col justify-center align-items-center font-15 text-secondary fw-bold">
                                  <p className="mb-0 font-14">
                                    مبلغ بازگردانده شده
                                  </p>
                                  <p className="font-16 fw-bold">
                                    {paymentTotalReturn
                                      ? paymentTotalReturn.toLocaleString() +
                                      " ریال"
                                      : "-"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-9 ps-lg-0">
                        <PaymentChart
                          data={paymentStats}
                          labels={paymentLabels}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-5 d-flex flex-col gap-10">
                    <FastAccessCards />
                  </div>
                </div>

                <div className="mt-4 row align-items-center">
                  <p className="text-secondary fw-bold font-15 clinicLine">
                    بررسی مراجعات مطب
                  </p>
                  <hr style={{ position: "relative", marginTop: "1.5rem" }} />
                </div>

                <div className="row mt-5 justify-between">
                  <OverviewStats stats={stats} />
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;

