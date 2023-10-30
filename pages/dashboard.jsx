import Head from "next/head";
import { getSession } from "lib/session";
import Loading from "components/commonComponents/loading/loading";

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

const Dashboard = ({ ClinicUser }) => {
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
