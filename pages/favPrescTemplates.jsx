import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { QuestionAlert, ErrorAlert } from "class/AlertManage";
import FeatherIcon from "feather-icons-react";
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

let ClinicID = null;
const FavPrescTemplates = ({ ClinicUser }) => {
    ClinicID = ClinicUser.ClinicID;
    return (
        <>
            <Head>
                <title>نسخ پرمصرف</title>
            </Head>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="dir-rtl">
                        oooo
                    </div>
                </div>
            </div>
        </>
    )
}

export default FavPrescTemplates;