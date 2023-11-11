import Link from "next/link";
import FeatherIcon from "feather-icons-react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Tooltip } from "primereact/tooltip";

const ReceptionItem = ({ srv, deleteReception }) => {
  return (
    <>
      <div className="col-sm-6 col-lg-4 col-xxl-3 mt-3">
        <div className="card h-100 marginb-sm">
          <div className="card-header mb-2 bg-primary-light">
            <div className="d-flex gap-4 align-items-center">
              <img
                src={srv.Modality.Icon}
                alt="modalityIcon"
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "10px",
                }}
              />
              <div className="font-12">بخش : {srv.Modality.Name}</div>
            </div>
          </div>

          <div dir="rtl" className="card-body pt-2 text-secondary">
            <div className="d-flex gap-4 align-items-center mt-2">
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

              <div className="font-11">
                <div className="fw-bold mb-2">
                  شناسه پذیرش : {srv.ReceptionID}
                </div>
                <div className="d-flex gap-2 mb-1">
                  <FeatherIcon icon="calendar" className="prescItembtns" />
                  <div className="">{srv.Date}</div>
                  <div className="">,</div>
                  <div className="">{srv.Time}</div>
                </div>
                <p className="mb-1 d-flex gap-2">
                  <FeatherIcon icon="user" className="prescItembtns" />
                  {srv.Patient.Name}
                </p>
                <div className="d-flex gap-2 align-items-center">
                  <div className="w-16 m-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-100 m-0"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                      />
                    </svg>
                  </div>

                  {srv.Patient.NationalID}
                </div>
              </div>
            </div>
            <hr />

            <div className="itemSrvSection">
              <div className="p-2">
                <div
                  dir="rtl"
                  className="text-secondary font-12 d-flex gap-2 align-items-center justify-between mb-3"
                >
                  <div className="d-flex gap-2 align-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-16 marginR-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
                      />
                    </svg>
                    <div className="">سرویس ها</div>
                  </div>

                  <div className="d-flex gap-1 align-items-center">
                    <Link
                      type="button"
                      className="editBtn"
                      data-pr-position="top"
                      href={{
                        pathname: "/reception",
                        query: { id: srv._id, receptionID: srv.ReceptionID },
                      }}
                    >
                      <Tooltip target=".editBtn">ویرایش</Tooltip>
                      <FeatherIcon icon="edit-3" className="prescItembtns" />
                    </Link>

                    <button
                      type="button"
                      className="btn removePresc p-0"
                      data-pr-position="top"
                      onClick={() => deleteReception(srv._id)}
                    >
                      <Tooltip target=".removePresc">حذف</Tooltip>
                      <FeatherIcon icon="trash" className="prescItembtns" />
                    </button>
                  </div>
                </div>

                <Accordion dir="rtl" multiple>
                  {srv.Items?.map((item, index) => (
                    <AccordionTab
                      key={index}
                      header={
                        <div className="d-flex flex-wrap gap-2 font-12 align-items-center">
                          <p className="mb-0">{item.Code}</p>
                          <p className="mb-0">|</p>
                          <p>{item.Name}</p>
                        </div>
                      }
                    >
                      <div className="d-flex mt-2 gap-2 flex-wrap text-secondary font-11">
                        <div className="">{item.Qty} عدد</div>
                        <div className="">
                          قیمت واحد : {item.Price.toLocaleString()}
                        </div>
                      </div>
                    </AccordionTab>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceptionItem;

