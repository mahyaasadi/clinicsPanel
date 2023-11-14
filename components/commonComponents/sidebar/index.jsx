"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";

const Sidebar = () => {
  const router = useRouter();
  const [receptionSubmenuOpen, setReceptionSubmenuOpen] = useState(false);
  const [prescriptionSubmenuOpen, setPrescriptionSubMenuOpen] = useState(false);

  useEffect(() => {
    const receptionSubRoutes = [
      "/reception",
      "/discounts",
      "/receptionRecords",
      "/cashDesk",
      "/karts",
    ];

    if (receptionSubRoutes.includes(router.pathname)) {
      setReceptionSubmenuOpen(true);
    }

    const prescriptionSubRoutes = ["/prescription"];

    if (prescriptionSubRoutes.includes(router.pathname)) {
      setPrescriptionSubMenuOpen(true);
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
                <a
                  href="#"
                  onClick={() => setReceptionSubmenuOpen(!receptionSubmenuOpen)}
                >
                  <FeatherIcon
                    icon="calendar"
                    style={{ width: "15px", height: "15px" }}
                  />
                  <span>پذیرش</span>
                  <span className="menu-arrow"></span>
                </a>
                <ul
                  className={`hiddenSidebar ${
                    receptionSubmenuOpen ? "d-block" : "hidden"
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
                      لیست پذیرش ها
                    </Link>
                  </li>

                  <li
                    className={router.pathname == "/discounts" ? "active" : ""}
                  >
                    <Link href="/discounts" className="font-12">
                      تخفیفات
                    </Link>
                  </li>

                  <li
                    className={router.pathname == "/cashDesk" ? "active" : ""}
                  >
                    <Link href="/cashDesk" className="font-12">
                      صندوق
                    </Link>
                  </li>
                  <li className={router.pathname == "/karts" ? "active" : ""}>
                    <Link href="/karts" className="font-12">
                      پایانه های بانک
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="submenu">
                <a
                  href="#"
                  onClick={() =>
                    setPrescriptionSubMenuOpen(!prescriptionSubmenuOpen)
                  }
                >
                  <FeatherIcon
                    icon="file-text"
                    style={{ width: "15px", height: "15px" }}
                  />
                  <span>نسخه نویسی</span>
                  <span className="menu-arrow"></span>
                </a>
                <ul
                  className={`hiddenSidebar ${
                    prescriptionSubmenuOpen ? "d-block" : "hidden"
                  }`}
                >
                  <li
                    className={
                      router.pathname == "/prescription" ? "active" : ""
                    }
                  >
                    <Link href="/prescription" className="font-12">
                      نسخه نویسی
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
