"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";

const Sidebar = () => {
  const router = useRouter();
  const [receptionSubmenuOpen, setReceptionSubmenuOpen] = useState(false);
  const [prescriptionSubmenuOpen, setPrescriptionSubMenuOpen] = useState(false);
  const [settingsSubMenuOpen, setSettingsSubMenuOpen] = useState(false);
  const [appointmentsubMenuOpen, setAppointmentsubMenuOpen] = useState(false);

  useEffect(() => {
    const receptionSubRoutes = [
      "/reception",
      "/discounts",
      "/receptionRecords",
      "/cashDesk",
    ];

    const prescriptionSubRoutes = [
      "/taminPrescription",
      "/salamatPrescription",
    ];

    const settingsSubRoutes = [
      "/insuranceSettings",
      "/karts",
      "reciptSettings",
    ];

    const appointmentSubRoutes = ["/appointment"];

    if (receptionSubRoutes.includes(router.pathname)) {
      setReceptionSubmenuOpen(true);
    }
    if (prescriptionSubRoutes.includes(router.pathname)) {
      setPrescriptionSubMenuOpen(true);
    }
    if (settingsSubRoutes.includes(router.pathname)) {
      setSettingsSubMenuOpen(true);
    }
    if (appointmentSubRoutes.includes(router.pathname)) {
      setAppointmentsubMenuOpen(true);
    }
  }, [router.pathname]);

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
                    icon="clipboard"
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
                    className={router.pathname == "/cashDesk" ? "active" : ""}
                  >
                    <Link href="/cashDesk" className="font-12">
                      صندوق
                    </Link>
                  </li>

                  <li
                    className={router.pathname == "/discounts" ? "active" : ""}
                  >
                    <Link href="/discounts" className="font-12">
                      تخفیفات
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="submenu">
                <a
                  href="#"
                  onClick={() =>
                    setAppointmentsubMenuOpen(!appointmentsubMenuOpen)
                  }
                >
                  <FeatherIcon
                    icon="calendar"
                    style={{ width: "15px", height: "15px" }}
                  />
                  <span>نوبت دهی</span>
                  <span className="menu-arrow"></span>
                </a>
                <ul
                  className={`hiddenSidebar ${
                    appointmentsubMenuOpen ? "d-block" : "hidden"
                  }`}
                >
                  <li
                    className={
                      router.pathname == "/appointment" ? "active" : ""
                    }
                  >
                    <Link href="/appointment" className="font-12">
                      نوبت دهی
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
                      router.pathname == "/taminPrescription" ? "active" : ""
                    }
                  >
                    <Link href="/taminPrescription" className="font-12">
                      تامین اجتماعی
                    </Link>
                  </li>

                  <li
                    className={
                      router.pathname == "/salamatPrescription" ? "active" : ""
                    }
                  >
                    <Link href="/salamatPrescription" className="font-12">
                      خدمات درمانی
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="submenu">
                <a
                  href="#"
                  onClick={() => setSettingsSubMenuOpen(!settingsSubMenuOpen)}
                >
                  <FeatherIcon
                    icon="settings"
                    style={{ width: "15px", height: "15px" }}
                  />
                  <span>تنظیمات</span>
                  <span className="menu-arrow"></span>
                </a>
                <ul
                  className={`hiddenSidebar ${
                    settingsSubMenuOpen ? "d-block" : "hidden"
                  }`}
                >
                  <li
                    className={
                      router.pathname == "/insuranceSettings" ? "active" : ""
                    }
                  >
                    <Link href="/insuranceSettings" className="font-12">
                      بیمه ها
                    </Link>
                  </li>
                  <li className={router.pathname == "/karts" ? "active" : ""}>
                    <Link href="/karts" className="font-12">
                      پایانه های بانک
                    </Link>
                  </li>
                  <li
                    className={
                      router.pathname == "/reciptSettings" ? "active" : ""
                    }
                  >
                    <Link href="/reciptSettings" className="font-12">
                      تنظیمات چاپ قبض
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

