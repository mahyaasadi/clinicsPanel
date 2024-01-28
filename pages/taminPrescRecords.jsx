import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
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

let ClinicID = null
const TaminPrescRecords = ({ ClinicUser }) => {
    ClinicID = ClinicUser.ClinicID;
    const [isLoading, setIsLoading] = useState(false);

    // Get All Tamin Prescs
    const getAllTaminPrescRecords = () => {
        setIsLoading(true)

        let url = "BimehTamin/CenterPrescription";
        let data = { CenterID: ClinicID };

        axiosClient.post(url, data)
            .then((response) => {
                console.log(response.data);
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false)

            })
    }

    useEffect(() => getAllTaminPrescRecords(), []);

    return (
        <>
            <Head>
                <title>نسخ تامین اجتماعی </title>
            </Head>
            <div className="page-wrapper">
                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="content container-fluid">
                        <div className="row dir-rtl">
                            <div className="col-sm-12">
                                {/* <FilterSalamatPrescs
                                    SetRangeDate={SetRangeDate}
                                    applyIsLoading={applyIsLoading}
                                    applyFilterOnSalamatPrescs={applyFilterOnSalamatPrescs}
                                    getAllSalamatPrescRecords={getAllSalamatPrescRecords}
                                /> */}

                                <div className="card">
                                    <div className="card-header border-bottom-0">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <p className="card-title font-15 text-secondary">
                                                    نسخ ثبت شده خدمات درمانی
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <SalamatPrescRecordsList
                                        printIsLoading={printIsLoading}
                                        data={prescRecords}
                                        getPatientInfo={getPatientInfo}
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default TaminPrescRecords