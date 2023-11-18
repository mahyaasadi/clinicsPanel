import Head from "next/head";
import { useState, useEffect } from "react";
import { getSession } from "lib/session";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, QuestionAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import InsuranceModal from "components/dashboard/settings/insuranceModal";
import InsuranceListTable from "components/dashboard/settings/insuranceListTable"

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
const InsuranceSettings = ({ ClinicUser }) => {
    ClinicID = ClinicUser.ClinicID;

    const [isLoading, setIsLoading] = useState(true)
    const [insuranceData, setInsuranceData] = useState([]);
    const [editInsuranceData, setEditInsuranceData] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");

    const handleCloseModal = () => setShowModal(false)

    // Get All Insurances
    const getInsuranceData = () => {
        setIsLoading(true);

        let url = "Clinics/getInsuranceOrg";

        axiosClient.get(url)
            .then((response) => {
                console.log(response.data);
                setInsuranceData(response.data)
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err);
                ErrorAlert("خطا", "خطا در دریافت اطلاعات!")
                setIsLoading(false)
            })
    }

    // Add Insurance
    const openAddModal = () => {
        setShowModal(true);
        setModalMode("add")
    }

    const addInsurance = (e) => {
        e.preventDefault();
        setIsLoading(true);

        let formData = new FormData(e.target);
        const formProps = Object.fromEntries(formData);

        let url = "Clinics/addInsurance";
        let data = {
            ClinicID,
            // IID: formProps.,
            // IName: formProps.,
            // IUName: formProps.,
            // IPass: formProps,
        };

        console.log({ data });

        axiosClient
            .post(url, data)
            .then((response) => {
                console.log(response.data);
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err);
                ErrorAlert("خطا", "افزودن بیمه با خطا مواجه گردید!")
                setIsLoading(false)
            })
    }

    // Edit Insurance
    const openEditModal = (data) => {
        setShowModal(true);
        setModalMode("edit");
        setEditInsuranceData(data)
    }

    const editInsurance = (e) => {
        e.preventDefault()
        setIsLoading(true);

        let formData = new FormData(e.target);
        const formProps = Object.fromEntries(formData);

        let url = "Clinics/addInsurance";
        let data = {
            ClinicID,
            // IID: formProps.,
            // IName: formProps.,
            // IUName: formProps.,
            // IPass: formProps,
        };

        console.log({ data });

        axiosClient.put(url, data)
            .then((response) => {
                console.log(response.data);
                // updateItem()
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false)
            })
    }

    const updateItem = (id, newArr) => {
        let index = insuranceData.findIndex((x) => x._id === id);
        let g = insuranceData[index];
        g = newArr;

        if (index === -1) {
            console.log("no match");
        } else
            setInsuranceData([
                ...insuranceData.slice(0, index),
                g,
                ...insuranceData.slice(index + 1),
            ]);
    }

    // Delete Insurance
    const deleteInsurance = async (id) => {
        let result = await QuestionAlert("حذف بیمه!", "آیا از حذف بیمه اطمینان دارید؟");

        if (result) {
            setIsLoading(true);
            let url = `Clinics/DeleteInsurance`;
            let data = {
                CenterID: ClinicID,
                IID: id,
            };

            await axiosClient
                .delete(url, { data })
                .then(function () {
                    setInsuranceData(insuranceData.filter((a) => a._id !== id));
                    setIsLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                    setIsLoading(false);
                });
        }
    }

    useEffect(() => getInsuranceData(), []);

    return (
        <>
            <Head>
                <title>تنظیمات بیمه</title>
            </Head>
            <div className="page-wrapper">
                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="content container-fluid">
                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col-md-12 d-flex justify-content-end">
                                    <button
                                        onClick={openAddModal}
                                        className="btn btn-primary btn-add font-14 media-font-12"
                                    >
                                        <i className="me-1">
                                            <FeatherIcon icon="plus-square" />
                                        </i>{" "}
                                        اضافه کردن
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-header border-bottom-0">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <p className="card-title text-secondary font-14">
                                                    لیست بیمه ها
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <InsuranceListTable
                                        data={insuranceData}
                                    // openEditModal={openEditModal}
                                    // deleteDepartment={deleteDepartment}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <InsuranceModal
                    mode={modalMode}
                    show={showModal}
                    //   onSubmit={modalMode === "add" ? handleAdd : handleEdit}
                    onHide={handleCloseModal}
                    data={editInsuranceData}
                    isLoading={isLoading}
                />
            </div>
        </>
    )
}

export default InsuranceSettings