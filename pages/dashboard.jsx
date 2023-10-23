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
  console.log({ ClinicUser });
  return (
    <>
      <Head>
        <title>داشبورد من</title>
      </Head>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid pb-0">oooooo</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

