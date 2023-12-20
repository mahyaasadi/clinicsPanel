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

  useEffect(() => {
    const body = $("body");
    const subMenus = $(".subdrop + ul");

    // remove submenus if mini-sidebar className exists
    if (body.hasClass("mini-sidebar")) {
      // body.removeClass("mini-sidebar");
      // subMenus.slideDown();
      // subMenus.removeClass("hiddenSidebar");
      // subMenus.hide();
      $("#hiddenSidebar").hide();
      console.log($("#hiddenSidebar"));
      // subMenus.hide();
      console.log("object");
    }

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

    if (receptionSubRoutes.includes(router.pathname)) {
      setReceptionSubmenuOpen(true);
    }
    if (prescriptionSubRoutes.includes(router.pathname)) {
      setPrescriptionSubMenuOpen(true);
    }
    if (settingsSubRoutes.includes(router.pathname)) {
      setSettingsSubMenuOpen(true);
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
                  id="hiddenSidebar"
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
                      router.pathname == "/receptionsList" ? "active" : ""
                    }
                  >
                    <Link href="/receptionsList" className="font-12">
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

              <li className={router.pathname == "/appointment" ? "active" : ""}>
                <Link href="/appointment">
                  <FeatherIcon
                    icon="calendar"
                    style={{ width: "15px", height: "15px" }}
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

