"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import FeatherIcon from "feather-icons-react";
import { setSession } from "lib/SessionMange";
import { avatar01, headerLogo } from "components/commonComponents/imagepath";

const Header = ({ ClinicUser }) => {
  console.log({ ClinicUser });
  let router = useRouter();

  const [task, settask] = useState(true);
  const [task1, settask1] = useState(true);

  const handletheme = () => {
    document.body.classList.toggle("darkmode");
    settask(!task);
    settask1(!task1);
  };

  const handlesidebar = () => document.body.classList.toggle("mini-sidebar");
  const handlesidebarmobilemenu = () =>
    document.body.classList.toggle("slide-nav");

  const fetchUserToken = async (data) => {
    document.getElementById("userName").innerHTML = data.FullName;

    document.getElementById("avatar").setAttribute("src", data.Avatar);
    document.getElementById("avatar").setAttribute("srcSet", data.Avatar);
    document.getElementById("dropdownAvatar").setAttribute("src", data.Avatar);
    document
      .getElementById("dropdownAvatar")
      .setAttribute("srcSet", data.Avatar);
  };

  const handleLogout = async (ClinicUser) => {
    let clinicSession = await setSession(ClinicUser);
    Cookies.set("clinicSession", " ", { expires: 1 });
    router.push("/");
  };

  useEffect(() => {
    fetchUserToken(ClinicUser);
  }, [ClinicUser]);

  return (
    <>
      <div className="content-header">
        {/* Logo */}
        <div className="header-left">
          <Link href="/dashboard" className="logo">
            <Image
              src={headerLogo}
              alt="Logo"
              unoptimized={true}
              priority={true}
            />
          </Link>
          <Link href="#" id="toggle_btn" onClick={handlesidebar}>
            <FeatherIcon icon="chevrons-left" />
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
                {/* <ul className="results">
                  <li>
                    <h6>
                      <i className="me-1"> <FeatherIcon icon="user" /></i> Doctors
                    </h6>
                    <p>
                      No matched Appointment found.{" "}
                      <Link href="/admin/doctor-list">
                        <span>View all</span>
                      </Link>
                    </p>
                  </li>
                  <li>
                    <h6>
                      <i className="me-1"> <FeatherIcon icon="user" /></i>Patients
                    </h6>
                    <p>
                      No matched Appointment found.{" "}
                      <Link href="/admin/patient-list">
                        <span>View all</span>
                      </Link>
                    </p>
                  </li>
                </ul> */}
              </form>
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <Link
          href="#"
          className="mobile_btn"
          id="mobile_btn"
          onClick={() => handlesidebarmobilemenu()}
        >
          <i className="fas fa-bars" />
        </Link>

        {/* Header Menu */}
        <ul className="nav nav-tabs user-menu">
          <li className="nav-item">
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
              className="dropdown-toggle nav-link"
              data-bs-toggle="dropdown"
            >
              <span className="user-img">
                <img
                  id="avatar"
                  src={avatar01}
                  className="rounded-circle"
                  width="30"
                  height="30"
                  alt="Admin"
                  // currentTarget.src = "public/assets/img/NotFoundAvatar.jpeg";
                  // onError={(e) => {
                  //   const currentTarget = e.currentTarget;
                  //   if (
                  //     currentTarget.src !== "assets/img/NotFoundAvatar.jpeg"
                  //   ) {
                  //     currentTarget.src = "assets/img/NotFoundAvatar.jpeg";
                  //   }
                  // }}
                  // onError={(e) => {
                  //   const currentTarget = e.currentTarget;
                  //   const defaultImageSrc = "assets/img/NotFoundAvatar.jpeg";

                  //   if (currentTarget.src !== defaultImageSrc) {
                  //     currentTarget.src = defaultImageSrc;
                  //   } else {
                  //     // If setting the default image still causes an error,
                  //     // set an empty image source to prevent further attempts
                  //     currentTarget.src = "";
                  //   }
                  // }}
                />
              </span>
            </a>

            <div className="dropdown-menu">
              <div className="user-header">
                <div className="avatar avatar-sm">
                  <Image
                    id="dropdownAvatar"
                    src={avatar01}
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

