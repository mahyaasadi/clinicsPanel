import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import FeatherIcon from "feather-icons-react";
import { QuestionAlert, ErrorAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import {
  taminFavOptions,
  salamatFavOptions,
} from "class/staticDropdownOptions";
import FavItemsListTable from "components/dashboard/prescription/favourites/favItemsListTable";
import SelectField from "components/commonComponents/selectfield";
import selectfieldColourStyles from "class/selectfieldStyle";

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

let ClinicID = null;
const FavPrescItems = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [selectedFavItemTab, setSelectedFavItemTab] = useState("Tamin");
  const [selectedFavOption, setSelectedFavOption] = useState(1);
  const [favItems, setFavItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavItemTabChange = (tab) => setSelectedFavItemTab(tab);

  const getFavItems = (selectedFavItemTab) => {
    setIsLoading(true);

    let url = "";
    if (selectedFavItemTab == "Tamin") {
      url = `FavEprscItem/getTamin/${ClinicID}`;
    } else {
      url = `CenterFavEprsc/getSalamat/${ClinicID}`;
    }

    axiosClient
      .get(url)
      .then((response) => {
        setFavItems(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const removeFavItem = (id) => {
    let url = "CenterFavEprsc/";
    if (selectedFavItemTab == "Tamin") {
      url += `deleteTamin/${ClinicID}/${id}`;
    } else {
      url += `deleteSalamat/${ClinicID}/${id}`;
    }

    axiosClient
      .delete(url)
      .then((response) => {
        if (selectedFavItemTab == "Tamin") {
          setFavItems(favItems.filter((x) => x.SrvCode !== id));
        } else {
          setFavItems(favItems.filter((x) => x.serviceNationalNumber !== id));
        }
      })
      .catch((err) => console.log(err));
  };

  const filteredData = () => {
    if (selectedFavItemTab === "Tamin") {
      console.log("object");
      if (selectedFavOption === 1) {
        console.log("1");
        return favItems.filter((item) => item.prescId === 1);
      } else if (selectedFavOption === 2) {
        return favItems.filter((item) => item.prescId === 2);
      } else if (selectedFavOption === 5) {
        return favItems.filter((item) => item.prescId === 5);
      } else {
        return [];
      }
    } else {
      //
    }
  };

  useEffect(() => getFavItems(selectedFavItemTab), [selectedFavItemTab]);
  useEffect(() => handleFavItemTabChange("Tamin"), []);

  useEffect(() => {
    console.log(selectedFavOption, filteredData());
  }, [selectedFavItemTab, selectedFavOption]);

  //   useEffect(() => {
  //     filteredData();
  //   }, [selectedFavItemTab, selectedFavOption]);

  return (
    <>
      <Head>
        <title>خدمات پرمصرف</title>
      </Head>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="dir-rtl">
            <ul className="nav nav-tabs nav-tabs-bottom navTabBorder-b font-12">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  href="#bottom-tab-1"
                  data-bs-toggle="tab"
                  onClick={() => handleFavItemTabChange("Tamin")}
                >
                  بیمه تامین اجتماعی
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#bottom-tab-2"
                  data-bs-toggle="tab"
                  onClick={() => handleFavItemTabChange("Salamat")}
                >
                  بیمه سلامت
                </a>
              </li>
            </ul>

            <div className="page-header mt-4">
              <div className="row align-items-center justify-end flex-col-md media-md-gap">
                <div className="col-md-3 col-12">
                  <label className="lblAbs font-12"></label>
                  <div data-pr-position="top">
                    <SelectField
                      className="text-center font-12"
                      styles={selectfieldColourStyles}
                      onChange={(value) => setSelectedFavOption(value?.value)}
                      options={
                        selectedFavItemTab == "Tamin"
                          ? taminFavOptions
                          : salamatFavOptions
                      }
                      placeholder="انتخاب کنید"
                      defaultValue={
                        selectedFavItemTab == "Tamin"
                          ? taminFavOptions[0]
                          : salamatFavOptions[0]
                      }
                      isClearable
                    />
                  </div>
                </div>

                <div className="col-md-2 col-12">
                  <button
                    // onClick={openAddModal}
                    className="btn btn-primary btn-add font-14 w-100 height-40"
                  >
                    <i className="me-1">
                      <FeatherIcon icon="plus-square" />
                    </i>{" "}
                    افزودن
                  </button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <Loading />
            ) : (
              <div className="tab-content pt-4">
                <div className="card">
                  <div className="card-body">
                    <FavItemsListTable
                      data={filteredData()}
                      selectedFavItemTab={selectedFavItemTab}
                      removeFavItem={removeFavItem}
                    />
                  </div>
                </div>

                {/* <div className="tab-pane show active" id="bottom-tab-1">111</div>
                            <div className="tab-pane" id="bottom-tab-2">222</div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FavPrescItems;

