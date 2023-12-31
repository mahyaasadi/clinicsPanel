import { useEffect, useState } from "react";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import Loading from "components/commonComponents/loading/loading";
import selectfieldColourStyles from "class/selectfieldStyle";
import SelectField from "components/commonComponents/selectfield";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import "/public/assets/css/formBuilder.css";
import ModalitiesNavLink from "@/components/dashboard/forms/modalitiesNavLink";

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
  ActiveFormID, ModalityID = null;

const FormBuilder = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;
  UserID = ClinicUser._id;

  var fb = null;
  let formData = null;

  const router = useRouter();

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editFormData, setEditFormData] = useState([]);
  const [frmIsLoading, setFrmIsLoading] = useState(false);

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

  // console.log({ modalityOptions });

  // const FUSelectDepartment = (departmentValue) => {
  //   setSelectedDepartment(departmentValue);
  //   $("#ModaltyIDHide").val(departmentValue);
  // };

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
          // setModalityDefValue(response.data.Modality);
        }, 500);

        setFrmIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setFrmIsLoading(false);
      });
  };

  // const [selectedModalityType, setSelectedModalityType] = useState(null);
  // const setModalityDefValue = (value) => {
  //   // console.log({ modalityOptions });
  //   // console.log({ value });
  //   const defModalityType = modalityOptions?.find((x) => x.value == value);
  //   setSelectedModalityType(defModalityType);
  //   console.log({ defModalityType });
  // };

  const handleDepClick = (value) => {
    // console.log({ value });
    // setSelectedModalityType(value)
    ModalityID = value
  }

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
                  نام فرم<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="FormName"
                  defaultValue={editFormData ? editFormData.Name : ""}
                  required
                />
              </div>

              <div className="col-md-9">
                {/* <label className="lblDrugIns font-12">
                انتخاب بخش <span className="text-danger">*</span>
              </label>

              <SelectField
                styles={selectfieldColourStyles}
                options={modalityOptions}
                label={true}
                name="selectedDepartment"
                className="text-center font-12"
                onChange={(value) => FUSelectDepartment(value?.value)}
                // defaultValue={selectedModalityType}
                placeholder={"انتخاب کنید"}
                isClearable
                required
              /> */}

                <ul className="nav nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-tabs-scroll font-14 flex-nowrap paddingb-0">
                  {modalityOptions?.map((modality, index) => {
                    return (
                      <ModalitiesNavLink
                        key={index}
                        data={modality}
                        activeClass={modality.value === editFormData.Modality ? "active" : ""}
                        handleDepClick={handleDepClick}
                      />
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="d-flex justify-end">
              <button id="getJSON" className="btn btn-primary font-14">
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
          </div>


          <div id="fb-editor"></div>
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
            fb = $(document.getElementById("fb-editor")).formBuilder({
              disabledActionButtons: ["data", "save", "clear"],
              editOnAdd: true,
            });
            fb.actions.setLang("fa-IR");
            document
              .getElementById("getJSON")
              .addEventListener("click", function () {
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
                  $.ajax(url, {
                    method: ActiveFormID ? "PUT" : "POST",
                    dataType: "json",
                    data: data,
                    timeout: 5000,
                  })
                    .then((responseJSON) => {
                      console.log(responseJSON);
                    })
                    .catch((err) => {
                      console.log("Caught an error:" + err.statusText);
                    });
                }
              });
            document
              ?.getElementById("setData")
              .addEventListener("click", function () {
                fb.actions.setData(formData);
              });
          });
        }}
      />
    </>
  );
};

export default FormBuilder;
