import { useState, useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Tooltip } from "primereact/tooltip";

const AddToListItems = ({ data, ActiveInsuranceType, handleEditService }) => {
  // console.log({ data });
  return (
    <>
      <div dir="rtl">
        <Accordion multiple activeIndex={[0]}>
          {data?.map((srv, index) => (
            <AccordionTab
              key={index}
              header={
                <div className="d-flex">
                  <div className="d-flex col-9 gap-2 font-13 align-items-center">
                    <div className="d-flex gap-2 font-13 align-items-center prescDetails">
                      <p className="mb-0">{srv.Code}</p>
                      <p className="mb-0">|</p>
                      <p>{srv.Name}</p>
                    </div>
                  </div>

                  <div className="d-flex col-3 gap-1 justify-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary editBtn"
                      data-pr-position="top"
                      onClick={() => handleEditService(srv)}
                    >
                      <Tooltip target=".editBtn">ویرایش</Tooltip>
                      <FeatherIcon icon="edit-2" className="prescItembtns" />
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

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary removeBtn"
                      //   onClick={() => _DeleteService(srv.SrvCode, srv.prescId)}
                      data-pr-position="top"
                    >
                      <Tooltip target=".removeBtn">حذف</Tooltip>
                      <FeatherIcon
                        icon="more-horizontal"
                        className="prescItembtns"
                      />
                    </button>
                  </div>
                </div>
              }
            >
              <div className="row">
                <div className="d-flex mt-2 gap-1 flex-wrap">
                  <div className="d-flex">
                    <div className="srvTypeInfo">تعداد : {srv.Qty}</div>
                  </div>
                  <div className="d-flex">
                    <div className="srvTypeInfo">
                      قیمت : {srv.Price?.toLocaleString()} تومان | جمع کل :{" "}
                      {(srv.Qty * srv.Price)?.toLocaleString()} تومان
                    </div>
                  </div>

                  <div className="d-flex">
                    <div className="srvTypeInfo">
                      سهم سازمان :{" "}
                      {(
                        srv.Qty *
                        `${
                          ActiveInsuranceType === "1"
                            ? srv.SS
                            : ActiveInsuranceType === "2"
                            ? srv.ST
                            : ActiveInsuranceType === "3"
                            ? srv.SA
                            : ""
                        }`
                      )?.toLocaleString()}{" "}
                      تومان
                    </div>
                  </div>
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
