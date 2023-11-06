"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";

const Sidebar = () => {
  const router = useRouter();

  const [submenuOpen, setSubmenuOpen] = useState(false);

  useEffect(() => {
    const receptionSubRoutes = ["/reception", "/discounts", "/karts"];
    if (receptionSubRoutes.includes(router.pathname)) {
      setSubmenuOpen(true);
    }
  }, []);

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

              <li className="submenu">
                <a href="#" onClick={() => setSubmenuOpen(!submenuOpen)}>
                  <FeatherIcon
                    icon="calendar"
                    style={{ width: "15px", height: "15px" }}
                  />
                  <span>پذیرش</span>
                  <span className="menu-arrow"></span>
                </a>
                <ul
                  className={`hiddenSidebar ${
                    submenuOpen ? "d-block" : "hidden"
                  }`}
                >
                  <li
                    className={router.pathname == "/reception" ? "active" : ""}
                  >
                    <Link href="/reception" className="font-12">
                      پذیرش
                    </Link>
                  </li>

                  <li
                    className={
                      router.pathname == "/receptionRecords" ? "active" : ""
                    }
                  >
                    <Link href="/receptionRecords" className="font-12">
                      سوابق پذیرش
                    </Link>
                  </li>

                  <li
                    className={router.pathname == "/discounts" ? "active" : ""}
                  >
                    <Link href="/discounts" className="font-12">
                      تخفیفات
                    </Link>
                  </li>

                  <li className={router.pathname == "/karts" ? "active" : ""}>
                    <Link href="/karts" className="font-12">
                      پایانه های بانک
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

