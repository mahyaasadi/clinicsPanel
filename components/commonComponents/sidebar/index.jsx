"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";

const Sidebar = () => {
  const router = useRouter();

  const [prescriptionSubmenuOpen, setPrescriptionSubMenuOpen] = useState(false);
  const [formBuilderSubMenuOpen, setFormBuilderSubMenuOpen] = useState(false);
  const [settingsSubMenuOpen, setSettingsSubMenuOpen] = useState(false);

  useEffect(() => {
    const prescriptionSubRoutes = [
      "/taminPrescription",
      "/taminPrescRecords",
      "/salamatPrescription",
      "/salamatPrescRecords",
    ];

    const formBuildersRoutes = ["/formBuilder", "/forms"];

    const settingsSubRoutes = [
      "/insuranceSettings",
      "/departments",
      "/discounts",
      "/karts",
      "reciptSettings",
    ];

    if (prescriptionSubRoutes.includes(router.pathname)) {
      setPrescriptionSubMenuOpen(true);
    } else {
      setPrescriptionSubMenuOpen(false);
    }

    if (formBuildersRoutes.includes(router.pathname)) {
      setFormBuilderSubMenuOpen(true);
    } else {
      setFormBuilderSubMenuOpen(false);
    }

    if (settingsSubRoutes.includes(router.pathname)) {
      setSettingsSubMenuOpen(true);
    } else {
      setSettingsSubMenuOpen(false);
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
                    className="w-19"
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

              <li className="menu-title font-12">
                <span>پذیرش / نوبت دهی</span>
              </li>

              <li className={router.pathname == "/reception" ? "active" : ""}>
                <Link href="/reception">
                  <FeatherIcon
                    icon="clipboard"
                    style={{ width: "17px", height: "17px" }}
                  />
                  <span>پذیرش</span>
                </Link>
              </li>

              <li
                className={router.pathname == "/receptionsList" ? "active" : ""}
              >
                <Link href="/receptionsList">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                    />
                  </svg>

                  <span>لیست پذیرش ها</span>
                </Link>
              </li>

              <li className={router.pathname == "/cashDesk" ? "active" : ""}>
                <Link href="/cashDesk">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                    />
                  </svg>

                  <span>صندوق</span>
                </Link>
              </li>

              <li className={router.pathname == "/appointment" ? "active" : ""}>
                <Link href="/appointment">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-19"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                    />
                  </svg>
                  <span>نوبت دهی</span>
                </Link>
              </li>

              <li className="menu-title font-12">
                <span>نسخه نویسی بیمه ها</span>
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
                    style={{ width: "18px", height: "18px" }}
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
                      router.pathname == "/taminPrescRecords" ? "active" : ""
                    }
                  >
                    <Link href="/taminPrescRecords" className="font-12">
                      نسخ تامین اجتماعی
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
                  <li
                    className={
                      router.pathname == "/salamatPrescRecords" ? "active" : ""
                    }
                  >
                    <Link href="/salamatPrescRecords" className="font-12">
                      نسخ خدمات درمانی
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="menu-title font-12"></li>

              <li className={router.pathname == "/chat" ? "active" : ""}>
                <Link href="/chat">
                  <FeatherIcon
                    icon="message-circle"
                    style={{ width: "17px", height: "17px" }}
                  />
                  <span>سامانه گفتگو</span>
                </Link>
              </li>

              <li className="menu-title font-12">
                <span>تنظیمات پایه</span>
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
                    <Link href="/formBuilder" className="font-12">
                      فرم جدید
                    </Link>
                  </li>
                  <li className={router.pathname == "/forms" ? "active" : ""}>
                    <Link href="/forms" className="font-12">
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
                    style={{ width: "18px", height: "18px" }}
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
                  <li
                    className={
                      router.pathname == "/departments" ? "active" : ""
                    }
                  >
                    <Link href="/departments" className="font-12">
                      بخش ها
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
                      کارت ها
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
