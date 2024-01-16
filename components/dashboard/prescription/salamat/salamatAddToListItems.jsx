import { useState, useEffect } from "react";
import Image from "next/image";
import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";

const SalamatAddToListItems = ({
  data,
  editPrescMode,
  salamatHeaderList,
  consumptionOptions,
  handleEditService,
  deleteService,
}) => {
  useEffect(() => {
    console.log("prescriptionItemsData", data);
  }, [data]);

  let consumptionLbl = "";
  let SrvPrescImage = "";

  return (
    <>
      {data.map((srv, index) =>
        srv.typeId === 5 ? (
          ""
        ) : (
          <div key={index} dir="rtl" className="card shadow-sm mb-1">
            <div className="card-body receptionInfoText">
              <div className="d-flex gap-1 align-items-center justify-between">
                <div className="d-flex gap-3 font-13 fw-bold">
                  {
                    ((SrvPrescImage = salamatHeaderList.find(
                      (x) => x.id === srv.typeId
                    )),
                      console.log())
                  }
                  <Image
                    src={SrvPrescImage ? SrvPrescImage?.img : srv.prescTypeImg}
                    alt="prescTypeImg"
                    width="24"
                    height="24"
                  />
                  <p>{srv.serviceInterfaceName}</p>
                </div>

                <div className="d-flex gap-2 justify-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary editBtn height-27"
                    data-pr-position="top"
                    onClick={() => handleEditService(srv)}
                  >
                    <Tooltip target=".editBtn">ویرایش</Tooltip>
                    <FeatherIcon icon="edit-2" className="prescItembtns" />
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger removeBtn height-27"
                    onClick={() => deleteService(srv.checkCode)}
                    data-pr-position="top"
                  >
                    <Tooltip target=".removeBtn">حذف</Tooltip>
                    <FeatherIcon icon="trash" className="prescItembtns" />
                  </button>
                </div>
              </div>

              <div className="row">
                {
                  ((consumptionLbl = consumptionOptions.find(
                    (x) => x.title === srv.consumption
                  )),
                    console.log())
                }
                <div className="d-flex mt-2 gap-1 flex-wrap text-secondary font-12">
                  <div>{srv.numberOfRequest} عدد</div>

                  {srv.consumption && <div className="vertical-line"></div>}
                  <div className="d-flex paddingR-5">
                    {editPrescMode && consumptionLbl
                      ? consumptionLbl.label
                      : srv.consumption
                        ? srv.consumption
                        : ""}
                    <div className="vertical-line"></div>
                    <p className="paddingR-5">
                      {srv.consumptionInstruction &&
                        "دستور مصرف : " + srv.consumptionInstruction}
                      {srv.numberOfPeriod &&
                        "تعداد در وعده : " + srv.numberOfPeriod}
                    </p>
                  </div>
                </div>
              </div>

              {srv.description && srv.description != "" ? (
                <>
                  <hr />
                  <div className="text-secondary font-12">
                    توضیحات :{srv.description}
                  </div>
                </>
              ) : (
                ""
              )}

              {srv.snackMessages && srv.snackMessages.length !== 0 && (
                <div className="font-12 mt-3">
                  {srv.snackMessages.map((x, index) => (
                    <div
                      key={index}
                      className={`alert alert-${x.type === "S"
                          ? "success"
                          : x.type === "I"
                            ? "info"
                            : x.type === "E"
                              ? "danger"
                              : "warning"
                        } alert-dismissible fade show`}
                      role="alert"
                    >
                      {x.text}
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                      ></button>
                    </div>
                  ))}
                </div>
              )}

              {srv.infoMessages && srv.infoMessages.length !== 0 && (
                <div className="font-12 mt-3">
                  {srv.infoMessages.map((x, index) => (
                    <div
                      key={index}
                      className="alert alert-info alert-dismissible fade show"
                      role="alert"
                    >
                      {x.text}
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                      ></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}
    </>
  );
};

export default SalamatAddToListItems;
