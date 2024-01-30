import Image from "next/image";
import FeatherIcon from "feather-icons-react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Tooltip } from "primereact/tooltip";

const AddToListItems = ({ data }) => {
  return (
    <>
      <div className="prescItemBox">
        {data?.map((srv, index) => (
          <div dir="rtl" className="card shadow-sm mb-1" key={index}>
            <div className="card-body receptionInfoText">
              <div className="d-flex gap-1 align-items-center justify-between">
                <div className="d-flex gap-3 font-13 fw-bold">
                  {srv.Img ? (
                    <Image
                      src={srv.Img}
                      alt="serviceIcon"
                      width="30"
                      height="30"
                    />
                  ) : (
                    ""
                  )}

                  <div className="d-flex gap-2 font-13 align-items-center">
                    <p className="mb-0">{srv.SrvCode}</p>
                    <p className="mb-0">|</p>
                    <p>{srv.SrvName}</p>
                  </div>
                </div>

                <div className="d-flex gap-1 justify-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary editBtn height-27"
                    data-pr-position="top"
                    //   onClick={() => handleEditPrescItem(srv)}
                  >
                    <Tooltip target=".editBtn">ویرایش</Tooltip>
                    <FeatherIcon icon="edit-2" className="prescItembtns" />
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary favItem height-27"
                    data-pr-position="top"
                    //   onClick={() => selectFavEprescItem(srv)}
                  >
                    <Tooltip target=".favItem">نسخه پرمصرف</Tooltip>
                    <FeatherIcon icon="star" className="prescItembtns" />
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger removeBtn height-27"
                    //   onClick={() => _DeleteService(srv.SrvCode, srv.prescId)}
                    data-pr-position="top"
                  >
                    <Tooltip target=".removeBtn">حذف</Tooltip>
                    <FeatherIcon icon="trash" className="prescItembtns" />
                  </button>
                </div>
              </div>

              <div className="row font-12 text-secondary">
                <div className="d-flex mt-2 gap-2 flex-wrap">
                  <div className="d-flex gap-2 ">
                    <div className="">
                      نوع نسخه : {srv.PrescType && srv.PrescType + " |"}
                    </div>
                    <div className="">تعداد : {srv.Qty && srv.Qty + " |"}</div>
                  </div>

                  {srv.TimesADay ? (
                    <div className="d-flex gap-2">
                      <div className="">
                        تعداد مصرف در روز :{" "}
                        {srv.TimesADay && srv.TimesADay + " |"}
                      </div>
                      <div className="">دستور مصرف : {srv.DrugInstruction}</div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AddToListItems;
