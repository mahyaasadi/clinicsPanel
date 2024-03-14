"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";

const Sidebar = () => {
  const router = useRouter();

  const [prescriptionSubmenuOpen, setPrescriptionSubMenuOpen] = useState(false);
  const [prescFavsSubmenuOpen, setPrescFavsSubmenuOpen] = useState(false);
  const [formBuilderSubMenuOpen, setFormBuilderSubMenuOpen] = useState(false);
  const [settingsSubMenuOpen, setSettingsSubMenuOpen] = useState(false);

  useEffect(() => {
    const prescriptionSubRoutes = [
      "/taminPrescription",
      "/taminPrescRecords",
      "/salamatPrescription",
      "/salamatPrescRecords",
    ];

    const prescFavSubRoutes = ["/favPrescItems", "/favPrescTemplates"];

    const formBuildersRoutes = ["/formBuilder", "/forms"];

    const settingsSubRoutes = [
      "/insuranceSettings",
      "/departments",
      "/discounts",
      "/measurements",
      "/karts",
      "reciptSettings",
      "/patientInquiryQRCode",
    ];

    if (prescriptionSubRoutes.includes(router.pathname)) {
      setPrescriptionSubMenuOpen(true);
    } else {
      setPrescriptionSubMenuOpen(false);
    }

    if (prescFavSubRoutes.includes(router.pathname)) {
      setPrescFavsSubmenuOpen(true);
    } else {
      setPrescFavsSubmenuOpen(false);
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

  const handlesidebarmobilemenu = () => {
    document.body.classList.toggle("slide-nav");
    $(".sidebar-overlay").attr(
      "style",
      "background-color: transparent !important"
    );

    $(".sidebar-overlay").attr("style", "display: contents !important");
  };

  return (
    <>
      <div className="sidebar shadow" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li className="menu-title">
                <span>اصلی</span>
              </li>
              <li
                className={router.pathname == "/dashboard" ? "active" : ""}
                onClick={handlesidebarmobilemenu}
              >
                <Link href="/dashboard">
                  <FeatherIcon icon="home" />
                  <span>داشبورد</span>
                </Link>
              </li>

              <li
                className={
                  router.pathname == "/patientsArchives" ? "active" : ""
                }
                onClick={handlesidebarmobilemenu}
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
                <Link href="/reception" onClick={handlesidebarmobilemenu}>
                  <FeatherIcon
                    icon="clipboard"
                    style={{ width: "17px", height: "17px" }}
                  />
                  <span>پذیرش</span>
                </Link>
              </li>

              <li
                className={router.pathname == "/receptionsList" ? "active" : ""}
                onClick={handlesidebarmobilemenu}
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

              <li
                className={router.pathname == "/cashDesk" ? "active" : ""}
                onClick={handlesidebarmobilemenu}
              >
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

                  {/* <svg
                    height="64"
                    viewBox="0 0 64 64"
                    width="64"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    style={{ width: "18px", height: "18px" }}
                  >
                    <defs></defs>
                    <title />
                    <g data-name="24-Cash Register" id="_24-Cash_Register">
                      <path
                        className="cls-1"
                        d="M63,45V61a2,2,0,0,1-2,2H3a2,2,0,0,1-2-2V45Z"
                      />
                      <polyline
                        className="cls-1"
                        points="3 45 3 39 5 37 59 37 61 39 61 45"
                      />
                      <path
                        className="cls-1"
                        d="M59,37V14a1.959,1.959,0,0,0-2-2H54"
                      />
                      <path
                        className="cls-1"
                        d="M5,37V14a1.959,1.959,0,0,1,2-2h3"
                      />
                      <rect
                        className="cls-1"
                        height="14"
                        rx="1"
                        ry="1"
                        width="28"
                        x="26"
                        y="1"
                      />
                      <rect className="cls-1" height="6" width="20" x="30" y="5" />
                      <polyline
                        className="cls-1"
                        points="1 49 25 49 26 53 38 53 39 49 63 49"
                      />
                      <line className="cls-1" x1="28" x2="36" y1="49" y2="49" />
                      <polyline
                        className="cls-1"
                        points="26 24 30 24 30 20 26 20"
                      />
                      <rect className="cls-1" height="4" width="4" x="34" y="20" />
                      <rect className="cls-1" height="4" width="4" x="42" y="20" />
                      <rect className="cls-1" height="4" width="4" x="42" y="28" />
                      <rect className="cls-1" height="4" width="4" x="34" y="28" />
                      <rect className="cls-1" height="4" width="4" x="26" y="28" />
                      <line className="cls-1" x1="6" x2="8" y1="41" y2="41" />
                      <line className="cls-1" x1="56" x2="58" y1="41" y2="41" />
                      <line className="cls-1" x1="10" x2="54" y1="41" y2="41" />
                      <rect className="cls-1" height="15" width="12" x="10" y="5" />
                      <line className="cls-1" x1="22" x2="26" y1="12" y2="12" />
                      <rect className="cls-1" height="8" width="12" x="10" y="24" />
                      <rect className="cls-1" height="13" width="4" x="50" y="19" />
                      <line className="cls-1" x1="8" x2="24" y1="20" y2="20" />
                      <line className="cls-1" x1="10" x2="22" y1="28" y2="28" />
                      <line className="cls-1" x1="13" x2="19" y1="9" y2="9" />
                      <line className="cls-1" x1="13" x2="15" y1="13" y2="13" />
                      <line className="cls-1" x1="17" x2="19" y1="13" y2="13" />
                      <path className="cls-1" d="M5,55v3a.979.979,0,0,0,1,1H9" />
                    </g>

                    
                  </svg> */}

                  <span>صندوق</span>
                </Link>
              </li>

              <li
                className={router.pathname == "/appointment" ? "active" : ""}
                onClick={handlesidebarmobilemenu}
              >
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
                    onClick={handlesidebarmobilemenu}
                  >
                    <Link href="/taminPrescription" className="font-12">
                      تامین اجتماعی
                    </Link>
                  </li>
                  <li
                    className={
                      router.pathname == "/taminPrescRecords" ? "active" : ""
                    }
                    onClick={handlesidebarmobilemenu}
                  >
                    <Link href="/taminPrescRecords" className="font-12">
                      نسخ تامین اجتماعی
                    </Link>
                  </li>

                  <li
                    className={
                      router.pathname == "/salamatPrescription" ? "active" : ""
                    }
                    onClick={handlesidebarmobilemenu}
                  >
                    <Link href="/salamatPrescription" className="font-12">
                      خدمات درمانی
                    </Link>
                  </li>
                  <li
                    className={
                      router.pathname == "/salamatPrescRecords" ? "active" : ""
                    }
                    onClick={handlesidebarmobilemenu}
                  >
                    <Link href="/salamatPrescRecords" className="font-12">
                      نسخ خدمات درمانی
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="menu-title font-12"></li>

              <li className={router.pathname == "/chat" ? "active" : ""}>
                <Link href="/chat" onClick={handlesidebarmobilemenu}>
                  <FeatherIcon
                    icon="message-circle"
                    style={{ width: "17px", height: "17px" }}
                  />
                  <span>سامانه گفتگو</span>
                </Link>
              </li>

              <li
                className={
                  router.pathname == "/callLogsHistory" ? "active" : ""
                }
                onClick={handlesidebarmobilemenu}
              >
                <Link href="/callLogsHistory">
                  <FeatherIcon
                    icon="phone-call"
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span>سوابق تماس ها</span>
                </Link>
              </li>

              <li className="menu-title font-12"></li>

              <li className={router.pathname == "/warehouse" ? "active" : ""}>
                <Link href="/warehouse" onClick={handlesidebarmobilemenu}>
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.75px"
                    style={{ width: "19px", height: "19px" }}
                  >
                    <defs></defs>
                    <title />
                    <path
                      className="a"
                      d="M.749,16.5H16.707a1.5,1.5,0,0,0,1.484-1.277L20.058,2.777A1.5,1.5,0,0,1,21.541,1.5h1.708"
                    />
                    <rect
                      className="a"
                      height="6"
                      rx="0.75"
                      ry="0.75"
                      width="6"
                      x="2.249"
                      y="7.5"
                    />
                    <rect
                      className="a"
                      height="9"
                      rx="0.75"
                      ry="0.75"
                      width="7.5"
                      x="8.249"
                      y="4.5"
                    />
                    <circle className="a" cx="4.124" cy="20.625" r="1.875" />
                    <circle className="a" cx="14.624" cy="20.625" r="1.875" />
                  </svg>
                  <span>انبار</span>
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
                    className="w-19"
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
                    onClick={handlesidebarmobilemenu}
                  >
                    <Link href="/formBuilder" className="font-12">
                      فرم جدید
                    </Link>
                  </li>
                  <li
                    className={router.pathname == "/forms" ? "active" : ""}
                    onClick={handlesidebarmobilemenu}
                  >
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
                    onClick={handlesidebarmobilemenu}
                  >
                    <Link href="/insuranceSettings" className="font-12">
                      بیمه ها
                    </Link>
                  </li>
                  <li
                    className={
                      router.pathname == "/departments" ? "active" : ""
                    }
                    onClick={handlesidebarmobilemenu}
                  >
                    <Link href="/departments" className="font-12">
                      بخش ها
                    </Link>
                  </li>
                  <li
                    className={router.pathname == "/discounts" ? "active" : ""}
                    onClick={handlesidebarmobilemenu}
                  >
                    <Link href="/discounts" className="font-12">
                      تخفیفات
                    </Link>
                  </li>
                  <li
                    className={
                      router.pathname == "/measurements" ? "active" : ""
                    }
                    onClick={handlesidebarmobilemenu}
                  >
                    <Link href="/measurements" className="font-12">
                      پارامترهای اندازه گیری
                    </Link>
                  </li>
                  <li
                    className={router.pathname == "/karts" ? "active" : ""}
                    onClick={handlesidebarmobilemenu}
                  >
                    <Link href="/karts" className="font-12">
                      کارت ها
                    </Link>
                  </li>
                  <li
                    className={
                      router.pathname == "/reciptSettings" ? "active" : ""
                    }
                    onClick={handlesidebarmobilemenu}
                  >
                    <Link href="/reciptSettings" className="font-12">
                      تنظیمات چاپ قبض
                    </Link>
                  </li>
                  <li
                    className={
                      router.pathname == "/patientInquiryQRCode" ? "active" : ""
                    }
                    onClick={handlesidebarmobilemenu}
                  >
                    <Link href="/patientInquiryQRCode" className="font-12">
                      کیوسک آنلاین
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

