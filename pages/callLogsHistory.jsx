import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import Loading from "@/components/commonComponents/loading/loading";
import CallLogsList from "@/components/dashboard/callLogs/callLogsList";

export const getServerSideProps = async ({ req, res }) => {
    const result = await getSession(req, res);
    if (result) {
        const { ClinicUser } = result;
        return {
            props: {
                ClinicUser,
            },
        };
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
const CallLogsHistory = ({ ClinicUser }) => {
    ClinicID = ClinicUser.ClinicID;

    const [isLoading, setIsLoading] = useState(false);
    const [callLogsData, setCallLogsData] = useState([])

    const getAllCallLogs = () => {
        setIsLoading(true)
        let url = `Sms2/getClinicCallLog/${ClinicID}`

        axiosClient.get(url)
            .then((response) => {
                console.log(response.data);
                setCallLogsData(response.data)
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false)
            })
    }

    useEffect(() => getAllCallLogs(), []);

    return (
        <>
            <Head>
                <title>سوابق تماس ها</title>
            </Head>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="dir-rtl">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-header border-bottom-0">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <p className="card-title text-secondary font-14">
                                                    لیست تخفیفات پذیرش
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <CallLogsList
                                        data={callLogsData}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CallLogsHistory