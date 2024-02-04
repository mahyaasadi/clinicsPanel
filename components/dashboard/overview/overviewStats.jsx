import Image from "next/image";
import { returnPayment } from "components/commonComponents/imagepath";
import FeatherIcon from "feather-icons-react";

const OverviewStats = ({ stats }) => {
  return (
    <>
      <div className="col w-md-100">
        <div className="card overViewCard">
          <div className="card-body">
            <div className="dash-widget-header">
              <span className="dash-widget-icon bg-totalReq">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  style={{ width: "28px", color: "#2d536e" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              </span>

              <div className="dash-count">
                <p className="dash-title mb-2 fw-bold">بیماران</p>
                <div className="dash-counts">
                  <p style={{ color: "#6995b5" }}>
                    {stats?.Total === undefined
                      ? 0
                      : stats?.Total?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="d-flex justify-end align-items-center">
            <i className="fas fa-caret-up" style={{ color: "green" }} />
            <p className="trade-level mb-2 mx-2 font-12 fw-bold">روز گذشته</p>
          </div> */}
        </div>
      </div>

      <div className="col w-md-100">
        <div className="card overViewCard">
          <div className="card-body">
            <div className="dash-widget-header">
              <span className="dash-widget-icon bg-talking">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  style={{ width: "30px", color: "#2b632b" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                  />
                </svg>
              </span>
              <div className="dash-count">
                <p className="dash-title mb-2 fw-bold">پرداختی کامل</p>
                <div className="dash-counts" style={{ color: "#64a364" }}>
                  <p>
                    {stats?.Detail["تایید پرداخت"] === undefined
                      ? 0
                      : stats?.Detail["تایید پرداخت"].toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="d-flex justify-end align-items-center">
            <i className="fas fa-caret-up" style={{ color: "green" }} />
            <p className="trade-level mb-2 mx-2 font-12 fw-bold">روز گذشته</p>
          </div> */}
        </div>
      </div>

      <div className="col w-md-100">
        <div className="card overViewCard">
          <div className="card-body">
            <div className="dash-widget-header">
              <span className="dash-widget-icon bg-waiting">
                <FeatherIcon
                  icon="loader"
                  style={{ width: "30px", color: "#6e5c2e" }}
                />
              </span>
              <div className="dash-count">
                <p className="dash-title mb-2 fw-bold">در انتظار پرداخت</p>
                <div className="dash-counts" style={{ color: "#c4a149" }}>
                  <p>
                    {stats?.Detail["در انتظار پرداخت"] === undefined
                      ? 0
                      : stats?.Detail["در انتظار پرداخت"].toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="d-flex justify-end align-items-center">
            <i className="fas fa-caret-down" style={{ color: "tomato" }} />
            <p className="trade-level mb-2 mx-2 font-12 fw-bold">روز گذشته</p>
          </div> */}
        </div>
      </div>

      <div className="col w-md-100">
        <div className="card overViewCard">
          <div className="card-body">
            <div className="dash-widget-header">
              <span className="dash-widget-icon bg-totalDebt">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  style={{ width: "30px", color: "#ffb3b3" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />
                </svg>
              </span>
              <div className="dash-count">
                <p className="dash-title mb-2 fw-bold">بدهکاران</p>
                <div className="dash-counts" style={{ color: "#9c4d48" }}>
                  <p>
                    {stats?.Detail.بدهکار === undefined
                      ? 0
                      : stats?.Detail.بدهکار.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="d-flex justify-end align-items-center">
            <i className="fas fa-caret-down" style={{ color: "tomato" }} />
            <p className="trade-level mb-2 mx-2 font-12 fw-bold">روز گذشته</p>
          </div> */}
        </div>
      </div>

      <div className="col w-md-100">
        <div className="card overViewCard">
          <div className="card-body">
            <div className="dash-widget-header">
              <span className="dash-widget-icon bg-turnGiven">
                <Image
                  src="/assets/img/return2.png"
                  alt="returnPaymentIcon"
                  width="32"
                  height="32"
                />
              </span>
              <div className="dash-count">
                <p className="dash-title mb-2 fw-bold">طلبکاران</p>
                <div className="dash-counts" style={{ color: "#90916e" }}>
                  <p>
                    {stats?.Detail.طلبکار === undefined
                      ? 0
                      : stats?.Detail.طلبکار.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="d-flex justify-end align-items-center">
            <i className="fas fa-caret-up" style={{ color: "green" }} />
            <p className="trade-level mb-2 mx-2 font-12 fw-bold">روز گذشته</p>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default OverviewStats;
