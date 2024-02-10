import Image from "next/image";
import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";
import { Skeleton } from "primereact/skeleton";

const AddToListItems = ({
  data,
  DeleteService,
  handleEditService,
  setPrescriptionItemsData,
  prescDataIsLoading,
  selectFavTaminItem,
}) => {
  const _DeleteService = (id, prescId) => {
    setPrescriptionItemsData(data.filter((a) => a.SrvCode !== id));
    DeleteService(id, prescId);
  };

  return (
    <>
      <div className="prescItemBox">
        {data?.map((srv, index) =>
          !prescDataIsLoading ? (
            <div dir="rtl" className="card shadow-sm mb-1" key={index}>
              <div className="card-body receptionInfoText d-flex justify-between">
                <div className="align-items-center justify-between">
                  <div className="d-flex gap-3 font-13 fw-bold">
                    {srv?.Img ? (
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
                      <p className="mb-0">{srv?.SrvCode}</p>
                      <p className="mb-0">|</p>
                      <p>{srv?.SrvName}</p>
                    </div>
                  </div>

                  <div className="d-flex mt-2 gap-2 flex-wrap">
                    <div className="d-flex gap-2 ">
                      <div className="">
                        نوع نسخه : {srv?.PrescType && srv?.PrescType + " |"}
                      </div>
                      <div className="">
                        {srv?.Qty && srv.Qty + " عدد" + " |"}
                      </div>
                    </div>

                    {srv?.TimesADay ? (
                      <div className="d-flex gap-2">
                        <div className="">
                          تعداد مصرف در روز :{" "}
                          {srv?.TimesADay && srv.TimesADay + " |"}
                        </div>
                        <div className="">
                          دستور مصرف : {srv?.DrugInstruction}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  {srv?.description && srv.description != "" ? (
                    <>
                      <hr />
                      <div className="text-secondary font-12">
                        توضیحات :{srv.description}
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>

                <div className="row font-12 text-secondary">
                  <div className="d-flex gap-1 justify-end">
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
                      className="btn btn-sm btn-outline-primary favItem height-27"
                      data-pr-position="top"
                      onClick={() => selectFavTaminItem(srv)}
                    >
                      <Tooltip target=".favItem">خدمت پرمصرف</Tooltip>
                      <FeatherIcon icon="star" className="prescItembtns" />
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger removeBtn height-27"
                      onClick={() => _DeleteService(srv.SrvCode, srv.prescId)}
                      data-pr-position="top"
                    >
                      <Tooltip target=".removeBtn">حذف</Tooltip>
                      <FeatherIcon icon="trash" className="prescItembtns" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Skeleton className="mb-2" key={index}></Skeleton>
          )
        )}
      </div>
    </>
  );
};

export default AddToListItems;
