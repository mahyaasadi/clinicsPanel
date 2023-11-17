import Head from "next/head";
import { getSession } from "lib/session";
import { ErrorAlert, QuestionAlert } from "class/AlertManage";
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

const InsuranceSettings = ({ ClinicUser }) => {
    return (
        <>
            <Head>
                <title>تنظیمات بیمه</title>
            </Head>
            <div className="">
                <div className=""></div>
            </div>
        </>
    )
}

export default InsuranceSettings