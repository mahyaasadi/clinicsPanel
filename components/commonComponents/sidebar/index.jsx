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
  const [formBuilderSubMenuOpen, setFormBuilderSubMenuOpen] = useState(false);

  useEffect(() => {
    const body = $("body");
    const subMenus = $(".subdrop + ul");

    const receptionSubRoutes = [
      "/reception",
      "/discounts",
      "/receptionsList",
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

    const formBuildersRoutes = ["/formBuilder", "/forms"];

    if (receptionSubRoutes.includes(router.pathname)) {
      setReceptionSubmenuOpen(true);
    }
    if (prescriptionSubRoutes.includes(router.pathname)) {
      setPrescriptionSubMenuOpen(true);
    }
    if (settingsSubRoutes.includes(router.pathname)) {
      setSettingsSubMenuOpen(true);
    }
    if (formBuildersRoutes.includes(router.pathname)) {
      setFormBuilderSubMenuOpen(true);
    }
  }, [router.pathname]);

  return (
    <>
      <div className="sidebar shadow" id="sidebar">
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
                    style={{ width: "17px", height: "17px" }}
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
                    style={{ width: "17px", height: "17px" }}
                  />
                  <span>پذیرش</span>
                  <span className="menu-arrow"></span>
                </a>
                <ul
                  id="hiddenSidebar"
                  className={`hiddenSidebar ${
                    receptionSubmenuOpen ? "d-block" : "hidden"
                  }`}
                >
                  <li
                    className={router.pathname == "/reception" ? "active" : ""}
                  >
                    <Link href="/reception" className="font-13">
                      پذیرش
                    </Link>
                  </li>

                  <li
                    className={
                      router.pathname == "/receptionsList" ? "active" : ""
                    }
                  >
                    <Link href="/receptionsList" className="font-13">
                      لیست پذیرش ها
                    </Link>
                  </li>

                  <li
                    className={router.pathname == "/cashDesk" ? "active" : ""}
                  >
                    <Link href="/cashDesk" className="font-13">
                      صندوق
                    </Link>
                  </li>

                  <li
                    className={router.pathname == "/discounts" ? "active" : ""}
                  >
                    <Link href="/discounts" className="font-13">
                      تخفیفات
                    </Link>
                  </li>
                </ul>
              </li>

              <li className={router.pathname == "/appointment" ? "active" : ""}>
                <Link href="/appointment">
                  <FeatherIcon
                    icon="calendar"
                    style={{ width: "17px", height: "17px" }}
                  />
                  <span>نوبت دهی</span>
                </Link>
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
                    style={{ width: "17px", height: "17px" }}
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
                    <Link href="/taminPrescription" className="font-13">
                      تامین اجتماعی
                    </Link>
                  </li>

                  <li
                    className={
                      router.pathname == "/salamatPrescription" ? "active" : ""
                    }
                  >
                    <Link href="/salamatPrescription" className="font-13">
                      خدمات درمانی
                    </Link>
                  </li>
                </ul>
              </li>

              <li
                className={
                  router.pathname == "/patientsArchives" ? "active" : ""
                }
              >
                <Link href="/patientsArchives">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-21"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
                    />
                  </svg>
                  <span>پرونده بیماران</span>
                </Link>
              </li>

              <li className="submenu">
                <a
                  href="#"
                  onClick={() =>
                    setFormBuilderSubMenuOpen(!formBuilderSubMenuOpen)
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-21"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                    />
                  </svg>
                  <span>فرم سازها</span>
                  <span className="menu-arrow"></span>
                </a>

                <ul
                  className={`hiddenSidebar ${
                    formBuilderSubMenuOpen ? "d-block" : "hidden"
                  }`}
                >
                  <li
                    className={
                      router.pathname == "/formBuilder" ? "active" : ""
                    }
                  >
                    <Link href="/formBuilder" className="font-13">
                      فرم جدید
                    </Link>
                  </li>
                  <li className={router.pathname == "/forms" ? "active" : ""}>
                    <Link href="/forms" className="font-13">
                      فرم ها
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
                    style={{ width: "17px", height: "17px" }}
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
                    <Link href="/insuranceSettings" className="font-13">
                      بیمه ها
                    </Link>
                  </li>
                  <li className={router.pathname == "/karts" ? "active" : ""}>
                    <Link href="/karts" className="font-13">
                      کارت ها
                    </Link>
                  </li>
                  <li
                    className={
                      router.pathname == "/reciptSettings" ? "active" : ""
                    }
                  >
                    <Link href="/reciptSettings" className="font-13">
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

