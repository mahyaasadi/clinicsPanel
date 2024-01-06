import Image from "next/image";
import FeatherIcon from "feather-icons-react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Tooltip } from "primereact/tooltip";

const AddToListItems = ({ data }) => {
  return (
    <>
      <div dir="rtl">
        <Accordion multiple>
          {data?.map((srv, index) => (
            <AccordionTab
              key={index}
              header={
                <div className="d-flex">
                  <div className="d-flex col-9 gap-3 font-13 align-items-center">
                    {srv.Img ? (
                      <Image
                        src={srv.Img}
                        alt="serviceIcon"
                        width="25"
                        height="25"
                      />
                    ) : (
                      ""
                    )}

                    <div className="d-flex gap-2 font-13 align-items-center prescDetails">
                      <p className="mb-0">{srv.SrvCode}</p>
                      <p className="mb-0">|</p>
                      <p>{srv.SrvName}</p>
                    </div>
                  </div>

                  <div className="d-flex col-3 gap-1 justify-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary editBtn"
                      data-pr-position="top"
                    //   onClick={() => handleEditPrescItem(srv)}
                    >
                      <Tooltip target=".editBtn">ویرایش</Tooltip>
                      <FeatherIcon icon="edit-2" className="prescItembtns" />
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary favItem"
                      data-pr-position="top"
                    //   onClick={() => selectFavEprescItem(srv)}
                    >
                      <Tooltip target=".favItem">نسخه پرمصرف</Tooltip>
                      <FeatherIcon icon="star" className="prescItembtns" />
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger removeBtn"
                      //   onClick={() => _DeleteService(srv.SrvCode, srv.prescId)}
                      data-pr-position="top"
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
                  <div className="d-flex gap-2 ">
                    <div className="srvTypeInfo">
                      نوع نسخه : {srv.PrescType}
                    </div>
                    <div className="srvTypeInfo">تعداد : {srv.Qty}</div>
                  </div>

                  {srv.TimesADay ? (
                    <div className="d-flex gap-2">
                      <div className="srvTypeInfo">
                        تعداد مصرف در روز : {srv.TimesADay}
                      </div>
                      <div className="srvTypeInfo">
                        دستور مصرف : {srv.DrugInstruction}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </AccordionTab>
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default AddToListItems;
