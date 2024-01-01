import { useEffect, useState } from "react";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { Skeleton } from "primereact/skeleton";
import { ErrorAlert, SuccessAlert } from "class/AlertManage";
import selectfieldColourStyles from "class/selectfieldStyle";
import SelectField from "components/commonComponents/selectfield";
import Loading from "components/commonComponents/loading/loading";
import ModalitiesNavLink from "components/dashboard/forms/modalitiesNavLink";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import FormPreview from "components/dashboard/forms/formPreview/formPreview";
import "/public/assets/css/formBuilder.css";

export const getServerSideProps = async ({ req, res }) => {
  const result = await getSession(req, res);

  if (result) {
    const { ClinicUser } = result;
    return { props: { ClinicUser } };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }
};

let ClinicID,
  UserID,
  ActiveFormID,
  ModalityID = null;

let formData = null;
const FormBuilder = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;
  UserID = ClinicUser._id;

  var fb = null;

  const router = useRouter();

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editFormData, setEditFormData] = useState([]);
  const [frmIsLoading, setFrmIsLoading] = useState(false);

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const openPreviewModal = () => setShowPreviewModal(true);
  const onHide = () => setShowPreviewModal(false);

  const { data: clinicDepartments, isLoading } =
    useGetAllClinicDepartmentsQuery(ClinicID);

  let modalityOptions = [];
  for (let i = 0; i < clinicDepartments?.length; i++) {
    const item = clinicDepartments[i];
    let obj = {
      value: item._id,
      label: item.Name,
    };
    modalityOptions.push(obj);
  }

  const getOneFormData = () => {
    setFrmIsLoading(true);
    let url = `Form/getOne/${ActiveFormID}`;

    axiosClient
      .get(url)
      .then((response) => {
        console.log(response.data);
        setEditFormData(response.data);
        formData = response.data.formData[0];

        setTimeout(() => {
          document.getElementById("setData").click();
        }, 500);

        setFrmIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setFrmIsLoading(false);
      });
  };

  const handleDepClick = (value) => (ModalityID = value);

  useEffect(() => {
    ActiveFormID = router.query.id;
    if (ActiveFormID) getOneFormData();
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>فرم ساز</title>
      </Head>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="d-flex flex-col gap-2 marginb-3">
            <div className="row align-items-center">
              <div className="col-md-3 d-flex">
                <br />
                <input
                  type="hidden"
                  className="form-control"
                  id="ModaltyIDHide"
                />

                <label className="lblAbs font-12">
                  نام فرم <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="FormName"
                  defaultValue={editFormData ? editFormData.Name : ""}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="col-md-9">
                {isLoading ? (
                  <div className="formBuilderSkeleton">
                    <Skeleton>
                      <ul className="nav nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-tabs-scroll font-14 flex-nowrap paddingb-0"></ul>
                    </Skeleton>
                  </div>
                ) : (
                  <ul className="nav nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-tabs-scroll font-14 flex-nowrap paddingb-0">
                    {modalityOptions?.map((modality, index) => {
                      return (
                        <ModalitiesNavLink
                          key={index}
                          data={modality}
                          activeClass={
                            modality.value === editFormData.Modality
                              ? "active"
                              : ""
                          }
                          handleDepClick={handleDepClick}
                        />
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div className="d-flex justify-end gap-2 marginb-3 mt-2">
              <button
                onClick={() => openPreviewModal()}
                className="btn btn-outline-primary font-14"
              >
                پیش نمایش
              </button>
              <button
                type="submit"
                id="getJSON"
                className="btn btn-primary font-14"
              >
                {ActiveFormID ? "ذخیره تغییرات" : "ذخیره اطلاعات"}
              </button>

              <button
                id="setData"
                style={{
                  height: "0",
                  width: "0",
                  padding: "0",
                  position: "absolute",
                  top: "-100px",
                }}
                className="btn btn-primary"
              ></button>
            </div>
            <div id="fb-editor"></div>
          </div>
        </div>
      </div>

      <Script
        src="../assets/js/jquery-3.2.1.min.js"
        strategy="afterInteractive"
      />
      <Script src="../assets/js/jquery-ui.min.js" strategy="afterInteractive" />
      <Script
        src="../assets/js/form-builder.min.js"
        strategy="afterInteractive"
        onReady={() => {
          jQuery(function ($) {
            fb = $(document?.getElementById("fb-editor"))?.formBuilder({
              disabledActionButtons: ["data", "save", "clear"],
              editOnAdd: true,
            });

            fb?.actions?.setLang("fa-IR");

            document
              ?.getElementById("getJSON")
              ?.addEventListener("click", function () {
                let jsonData = fb.actions.getData("json", true);
                if (jsonData.length > 2) {
                  formData = jsonData;
                  let data = {
                    ClinicID,
                    formData,
                    Name: $("#FormName").val(),
                    ModalityID: ModalityID,
                    UserID,
                  };

                  let url = ActiveFormID
                    ? `https://api.irannobat.ir/Form/Edit/${ActiveFormID}`
                    : "https://api.irannobat.ir/Form/add";

                  console.log({ url, data });

                  if ($("#FormName").val() === "") {
                    ErrorAlert("خطا", "فیلد نام فرم را تکمیل نمایید!");
                  } else if (!ModalityID) {
                    ErrorAlert("خطا", "بخش مورد نظر را انتخاب نمایید!");
                  } else {
                    $.ajax(url, {
                      method: ActiveFormID ? "PUT" : "POST",
                      dataType: "json",
                      data: data,
                      timeout: 5000,
                    })
                      .then((responseJSON) => {
                        console.log(responseJSON);
                        SuccessAlert(
                          "موفق",
                          "اطلاعات فرم با موفقیت ثبت گردید!"
                        );
                        router.push("/forms");
                      })
                      .catch((err) => {
                        console.log("Caught an error:" + err.statusText);
                        ErorrAlert(
                          "خطا",
                          "ذخیره اطلاعات فرم با خطا مواجه گردید!"
                        );
                      });
                  }
                }
              });

            document
              ?.getElementById("setData")
              ?.addEventListener("click", function () {
                fb?.actions?.setData(formData);
              });
          });
        }}
      />

      <FormPreview data={formData} show={showPreviewModal} onHide={onHide} />
    </>
  );
};

export default FormBuilder;
