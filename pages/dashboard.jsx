import { useState, useEffect } from "react";
import Head from "next/head";
import FeatherIcon from "feather-icons-react";
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
      url += "/lastWeekStatistics";
      setStatsPlaceholder("هفته گذشته");
    } else if (duration === "lastMonth") {
      url += "/monthStatistics";
      setStatsPlaceholder("ماه جاری : " + jdate.format("MMMM YYY"));
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
                    <p className="card-title text-secondary font-16">
                      بررسی اجمالی
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
                <div className="col-md-9">
                  <OverviewStats stats={stats} />
                </div>
                <div className="col-md-3">
                  <div class="row">
                    <div class="col-sm-6 d-flex">
                      <div class="spl-items flex-fill">
                        <a href="/reactjs/template-rtl/admin/reviews">
                          <h6>Doctor Ratings</h6>
                        </a>
                      </div>
                    </div>
                    <div class="col-sm-6 d-flex">
                      <div class="spl-items flex-fill">
                        <a href="/reactjs/template-rtl/admin/transactions-list">
                          <i>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="feather feather-credit-card "
                            >
                              <g>
                                <rect
                                  x="1"
                                  y="4"
                                  width="22"
                                  height="16"
                                  rx="2"
                                  ry="2"
                                ></rect>
                                <line x1="1" y1="10" x2="23" y2="10"></line>
                              </g>
                            </svg>
                          </i>
                          <h6>Transactions</h6>
                        </a>
                      </div>
                    </div>
                    <div class="col-sm-6 d-flex">
                      <div class="spl-items flex-fill">
                        <a href="/reactjs/template-rtl/admin/settings">
                          <i>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="feather feather-sliders "
                            >
                              <g>
                                <line x1="4" y1="21" x2="4" y2="14"></line>
                                <line x1="4" y1="10" x2="4" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12" y2="3"></line>
                                <line x1="20" y1="21" x2="20" y2="16"></line>
                                <line x1="20" y1="12" x2="20" y2="3"></line>
                                <line x1="1" y1="14" x2="7" y2="14"></line>
                                <line x1="9" y1="8" x2="15" y2="8"></line>
                                <line x1="17" y1="16" x2="23" y2="16"></line>
                              </g>
                            </svg>
                          </i>
                          <h6>Settings</h6>
                        </a>
                      </div>
                    </div>
                    <div class="col-sm-6 d-flex">
                      <div class="spl-items flex-fill">
                        <a href="/reactjs/template-rtl/admin/appointment-list">
                          <i>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="feather feather-calendar "
                            >
                              <g>
                                <rect
                                  x="3"
                                  y="4"
                                  width="18"
                                  height="18"
                                  rx="2"
                                  ry="2"
                                ></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </g>
                            </svg>
                          </i>
                          <h6>Appointments</h6>
                        </a>
                      </div>
                    </div>
                    <div class="col-sm-6 d-flex">
                      <div class="spl-items flex-fill">
                        <a href="/reactjs/template-rtl/admin/specialities">
                          <i>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="feather feather-package "
                            >
                              <g>
                                <line
                                  x1="16.5"
                                  y1="9.4"
                                  x2="7.5"
                                  y2="4.21"
                                ></line>
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                              </g>
                            </svg>
                          </i>
                          <h6>Specialities</h6>
                        </a>
                      </div>
                    </div>
                    <div class="col-sm-6 d-flex">
                      <div class="spl-items flex-fill">
                        <a href="/reactjs/template-rtl/admin/patient-list">
                          <i>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="feather feather-users "
                            >
                              <g>
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </g>
                            </svg>
                          </i>
                          <h6>Patients</h6>
                        </a>
                      </div>
                    </div>
                  </div>
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

