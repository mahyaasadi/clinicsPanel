"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { axiosClient } from "class/axiosConfig.js";
import { ErrorAlert } from "class/AlertManage.js";
import { useForm, Controller } from "react-hook-form";
import Cookies from "js-cookie";
import { setSession } from "lib/SessionMange";
import { logo } from "components/commonComponents/imagepath";
import "public/assets/css/bootstrap.min.css";
import "public/assets/css/feather.css";
import "public/assets/css/feathericon.min.css";
import "public/assets/css/font-awesome.min.css";
import "public/assets/css/select2.min.css";
import "public/assets/css/style.css";

export default function Page() {
  const { control } = useForm();
  const router = useRouter();
  const [eye, setEye] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const onEyeClick = () => setEye(!eye);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let url = "ClinicUser/loginUser";
    let data = {
      UserName: document.getElementById("UserName").value,
      Password: document.getElementById("Password").value,
    };

    await axiosClient
      .post(url, data)
      .then(async function (response) {
        const loginRes = response.data;
        let in24Hours = 24 * 60 * 60;

        let clinicSession = await setSession(loginRes);
        Cookies.set("clinicSession", clinicSession, { expires: in24Hours });
        router.push("/dashboard");

        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        err.message == "Network Error"
          ? ErrorAlert("خطا", "در حال حاضر ارتباط با سرور برقرار نیست!")
          : ErrorAlert("خطا", "اطلاعات اشتباه وارد شده است!");
      });
  };

  return (
    <>
      <div className="row loginBg p-0 d-flex align-items-center">
        <div className="col-md-6 login-bg p-0">
          <div className="login-banner">
            <Image
              src={logo}
              alt="login-banner"
              unoptimized={true}
              priority={true}
            />
          </div>
        </div>

        <div className="col-lg-6 col-12 login-wrap-bg">
          <div className="login-wrapper">
            <div className="loginbox">
              <h3 className="loginTitle stretch text-center mb-2">
                ایران نوبت
              </h3>
              <p className="account-subtitle text-center marginb-3">
                دسترسی به پنل کلینیک ها
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-group form-focus">
                  <Controller
                    control={control}
                    name="UserName"
                    render={({ field: { value, onChange } }) => (
                      <input
                        className="form-control floating font-15"
                        type="text"
                        id="UserName"
                        name="UserName"
                        autoComplete="false"
                        placeholder="نام کاربری"
                        required
                      />
                    )}
                  />
                </div>
                <div className="form-group form-focus">
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { value, onChange } }) => (
                      <div className="pass-group">
                        <input
                          className="form-control floating font-15"
                          type={eye ? "password" : "text"}
                          autoComplete="false"
                          placeholder="رمز عبور"
                          id="Password"
                          required
                        />
                        <span
                          onClick={onEyeClick}
                          className={`fa toggle-password" ${eye ? "fa-eye-slash" : "fa-eye"
                            }`}
                        />
                      </div>
                    )}
                  />
                </div>

                <div className="form-group">
                  <div className="row">
                    <div className="col-6">
                      <label className="custom_check mr-2 mb-0 d-inline-flex font-12">
                        مرا به خاطر داشته باش
                        <input type="checkbox" name="radio" />
                        <span className="checkmark" />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="d-grid">
                  {isLoading ? (
                    <button
                      className="btn btn-primary loginBtn disabled d-flex align-items-center justify-center gap-2 p-2"
                      type="submit"
                    >
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      ></span>
                    </button>
                  ) : (
                    <button className="btn btn-primary loginBtn" type="submit">
                      ورود
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

