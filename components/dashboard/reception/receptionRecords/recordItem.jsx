import FeatherIcon from "feather-icons-react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Tooltip } from "primereact/tooltip";

const RecordItem = ({ srv }) => {
    return (
        <>
            <div className="col-sm-6 col-xxl-4 receptionRecordCard">
                <div className="card marginb-sm">
                    <div className="card-body text-secondary">
                        <div className="font-11">شناسه پذیرش : {srv.ReceptionID}</div>
                        <hr />
                        <div className="d-flex gap-4 align-items-center">
                            <div className="">
                                <img
                                    src={"https://irannobat.ir/images/" + srv.Patient.Avatar}
                                    alt="patientAvatar"
                                    style={{
                                        width: "35px",
                                        height: "35px",
                                        borderRadius: "10px",
                                    }}
                                    onError={({ currentTarget }) => {
                                        currentTarget.src = "assets/img/NotFoundAvatar.jpeg";
                                    }}
                                />
                            </div>
                            <div className="">
                                <p className="mb-1 font-12">
                                    نام بیمار : {srv.Patient.Name}
                                </p>
                                <p className="font-11">
                                    کد ملی : {srv.Patient.NationalID}
                                </p>
                            </div>
                        </div>
                        <hr />
                        <div className="d-flex gap-4 align-items-center">
                            <div className="">
                                <img
                                    src={srv.Modality.Icon}
                                    alt="modalityIcon"
                                    style={{
                                        width: "35px",
                                        height: "35px",
                                        borderRadius: "10px",
                                    }}
                                />
                            </div>
                            <div className="font-12">
                                بخش انتخابی : {srv.Modality.Name}
                            </div>
                        </div>

                        <hr />

                        <Accordion multiple>
                            {srv.Items?.map((item, index) => (
                                <AccordionTab
                                    key={index}
                                    header={
                                        <div className="d-flex">
                                            <div className="d-flex col-9 gap-2 align-items-center">
                                                <div className="d-flex gap-2 font-12 align-items-center prescDetails">
                                                    <p className="mb-0">{item.Code}</p>
                                                    <p className="mb-0">|</p>
                                                    <p>{item.Name}</p>
                                                </div>
                                            </div>

                                            <div className="d-flex col-3 gap-1 justify-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary editBtn p-1"
                                                    data-pr-position="top"
                                                // onClick={() => handleEditPrescItem(item)}
                                                >
                                                    <Tooltip target=".editBtn">ویرایش</Tooltip>
                                                    <FeatherIcon icon="edit-2" className="prescItembtns" />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger removeBtn p-1"
                                                    data-pr-position="top"
                                                // onClick={() => _DeleteService(item.SrvCode, item.prescId)}
                                                >
                                                    <Tooltip target=".removeBtn">حذف</Tooltip>
                                                    <FeatherIcon icon="trash" className="prescItembtns" />
                                                </button>
                                            </div>
                                        </div>
                                    }
                                >
                                    <div className="row">
                                        <div className="d-flex mt-2 gap-2 flex-wrap">
                                            <div className="d-flex gap-2">
                                                <div className="srvTypeInfo">
                                                    {item.Qty} عدد
                                                </div>
                                                <div className="srvTypeInfo">قیمت واحد : {item.Price.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionTab>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RecordItem