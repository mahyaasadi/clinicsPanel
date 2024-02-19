"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { axiosClient } from "class/axiosConfig";
import { useRouter } from "next/navigation";
import { setSession } from "lib/SessionMange";
import FeatherIcon from "feather-icons-react";
import { imgNotFound, headerLogo } from "components/commonComponents/imagepath";

const Header = ({ ClinicUser }) => {
  let router = useRouter();

  const [task, settask] = useState(true);
  const [task1, settask1] = useState(true);
  const [ClinicData, setClinicData] = useState("");

  const handletheme = () => {
    document.body.classList.toggle("darkmode");
    settask(!task);
    settask1(!task1);
  };

  const getOneClinic = () => {
    let url = `Clinic/getOne/${ClinicUser.ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setClinicData(response.data);
      })
      .catch((err) => console.log(err));
  };

  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
    $(".hiddenSidebar").removeClass("d-block");
    $(".hiddenSidebar").attr("style", "display: none");
  };

  const handlesidebarmobilemenu = () =>
    document.body.classList.toggle("slide-nav");

  const fetchUserToken = async (data) => {
    document.getElementById("userName").innerHTML = data.FullName;

    if (data.Avatar) {
      document.getElementById("avatar").setAttribute("src", data.Avatar);
      document.getElementById("avatar").setAttribute("srcSet", data.Avatar);
      document
        .getElementById("dropdownAvatar")
        .setAttribute("src", data.Avatar);
      document
        .getElementById("dropdownAvatar")
        .setAttribute("srcSet", data.Avatar);
    }
  };

  const handleLogout = async (ClinicUser) => {
    let clinicSession = await setSession(ClinicUser);
    Cookies.set("clinicSession", " ", { expires: 1 });
    router.push("/");
  };

  useEffect(() => {
    fetchUserToken(ClinicUser);
    getOneClinic();
  }, [ClinicUser]);

  return (
    <>
      <div className="content-header shadow-sm">
        <div className="header-left">
          <Link href="/dashboard" className="logo">
            ایران نوبت {/* اینو <span className="powerClinic">کلینیک</span> */}
            {/* <Image
              src={headerLogo}
              alt="Logo"
              unoptimized={true}
              priority={true}
            /> */}
          </Link>
          <Link
            href="#"
            id="toggle_btn"
            onClick={handlesidebar}
            className="toggle_btn"
          >
            <FeatherIcon icon="chevrons-left" />
          </Link>

          {/* Mobile Menu Toggle */}
          <Link
            href="#"
            className="mobile_btn"
            id="mobile_btn"
            onClick={() => handlesidebarmobilemenu()}
          >
            <i className="fas fa-bars" />
          </Link>

          {/* Search */}
          <div className="top-nav-search">
            <div className="main">
              <form className="search" method="post" action="/admin">
                <div className="s-icon">
                  <i className="fas fa-search" />
                </div>
                <input
                  type="text"
                  className="form-control font-13"
                  placeholder="جستجو ..."
                />
              </form>
            </div>
          </div>
        </div>

        {/* Header Menu */}
        <ul className="nav nav-tabs user-menu">
          <li className="nav-item d-flex gap-2">
            <div className="clinic-menu-container px-3 text-secondary fw-bold d-flex gap-2 align-items-center">
              {" "}
              {ClinicData.Logo && (
                <img
                  src={ClinicData.Logo}
                  style={{ width: "22px", height: "22px", borderRadius: "4px" }}
                />
              )}
              {ClinicData.Name}{" "}
            </div>

            <Link href="#" id="dark-mode-toggle" className="dark-mode-toggle">
              <i
                onClick={handletheme}
                className={` light-mode ${task ? "active" : ""}`}
              >
                {" "}
                <FeatherIcon icon="sun" />
              </i>
              <i
                onClick={handletheme}
                className={`dark-mode ${task1 ? "" : "active"}`}
              >
                {" "}
                <FeatherIcon icon="moon" />
              </i>
            </Link>
          </li>

          {/* User Menu */}
          <li className="nav-item dropdown has-arrow">
            <a
              href="#"
              className="dropdown-toggle headerUserNav nav-link"
              data-bs-toggle="dropdown"
            >
              <span className="user-img">
                <Image
                  id="avatar"
                  src={imgNotFound}
                  className="rounded-circle"
                  width="30"
                  height="30"
                  alt="Admin"
                />
              </span>
            </a>

            <div className="dropdown-menu">
              <div className="user-header">
                <div className="avatar avatar-sm">
                  <Image
                    id="dropdownAvatar"
                    src={imgNotFound}
                    alt="User Image"
                    className="avatar-img rounded-circle"
                    width="30"
                    height="30"
                  />
                </div>
                <div className="user-text">
                  <p className="mb-1" id="userName"></p>
                  <p id="role" className="text-muted mb-0"></p>
                </div>
              </div>
              <Link className="dropdown-item" href="/profile">
                پروفایل من
              </Link>
              <Link className="dropdown-item" href="/profileSettings">
                تنظیمات
              </Link>
              <button
                className="dropdown-item"
                onClick={() => handleLogout(ClinicUser)}
              >
                خروج
              </button>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Header;

