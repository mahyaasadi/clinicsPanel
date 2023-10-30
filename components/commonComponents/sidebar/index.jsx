"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";

const Sidebar = () => {
  const router = useRouter();

  return (
    <>
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li className="menu-title">
                <span>اصلی</span>
              </li>
              <li className={router.pathname == "/dashboard" ? "active" : ""}>
                <Link href="/dashboard">
                  <FeatherIcon icon="home" />
                  <span>داشبورد</span>
                </Link>
              </li>
              <li className={router.pathname == "/departments" ? "active" : ""}>
                <Link href="/departments">
                  <FeatherIcon
                    icon="grid"
                    style={{ width: "15px", height: "15px" }}
                  />
                  <span>بخش ها</span>
                </Link>
              </li>
              <li className={router.pathname == "/reception" ? "active" : ""}>
                <Link href="/reception">
                  <FeatherIcon
                    icon="calendar"
                    style={{ width: "15px", height: "15px" }}
                  />
                  <span>پذیرش</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
