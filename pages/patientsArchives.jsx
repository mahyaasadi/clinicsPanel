import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig.js";
import { ErrorAlert, QuestionAlert, SuccessAlert } from "class/AlertManage";
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

let ClinicID = null
const PatientsArchives = ({ ClinicUser }) => {
    ClinicID = ClinicUser.ClinicID;

    const [isLoading, setIsLoading] = useState(false)

    // Get all patients records
    const getAllClinicsPatients = () => {
        setIsLoading(true)

        let url = ``
        axiosClient.get(url)
            .then((response) => {
                console.log(response.data);
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
                ErrorAlert("خطا", "خطا در دریافت اطلاعات!")
            })
    }

    useEffect(() => getAllClinicsPatients(), []);

    return (
        <>
            <Head>
                <title>پرونده بیماران</title>
            </Head>
            <div className="page-wrapper">
                <div className="content container-fluid">heyyy</div>
            </div>
        </>
    )
}

export default PatientsArchives;