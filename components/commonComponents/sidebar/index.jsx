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

                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
