import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { QuestionAlert, ErrorAlert } from "class/AlertManage";
import FeatherIcon from "feather-icons-react";
import Loading from "components/commonComponents/loading/loading";
import { discountPercentDataClass } from "class/staticDropdownOptions";
import DiscountModal from "components/dashboard/discounts/discountModal";
import DiscountsListTable from "components/dashboard/discounts/discountListTable";
// import {
//   useGetAllDiscountsQuery,
//   useAddDiscountMutation,
//   useEditDiscountMutation,
//   useDeleteDiscountMutation,
// } from "redux/slices/discountApiSlice";

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
const Discounts = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [modalMode, setModalMode] = useState("add");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [discountsList, setDiscountsList] = useState([]);
  const [editDiscountData, setEditDiscountData] = useState([]);

  const handleCloseModal = () => setShowModal(false);

  let SelectDiscountPercent = "";
  const FUSelectDiscountPercent = (Percent) =>
    (SelectDiscountPercent = Percent);

  // Fetching data
  // const {
  //   data: discountsList,
  //   error,
  //   isLoading,
  // } = useGetAllDiscountsQuery(ClinicID);

  // Mutations
  // const [addNewDiscount] = useAddDiscountMutation();
  // const [updateDiscount] = useEditDiscountMutation();
  // const [removeDiscount] = useDeleteDiscountMutation();

  // get discounts list
  const getDiscountsData = () => {
    setIsLoading(true);

    axiosClient
      .get(`CenterDiscount/getAll/${ClinicID}`)
      .then(function (response) {
        setDiscountsList(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(true);
        console.log(error);
      });
  };

  // Add Discount
  const openAddModal = () => {
    setModalMode("add");
    setShowModal(true);
  };

  const addDiscount = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "CenterDiscount/add";
    let data = {
      CenterID: ClinicID,
      Name: formProps.discountName,
      Des: formProps.discountDescription,
      Value: formProps.discountValue,
      Percent: parseInt(SelectDiscountPercent),
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        setDiscountsList([...discountsList, response.data]);
        setShowModal(false);
        e.target.reset();
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });

    // const newDiscount = {
    //   CenterID: ClinicID,
    //   Name: formProps.discountName,
    //   Des: formProps.discountDescription,
    //   Value: formProps.discountValue,
    //   Percent: parseInt(SelectDiscountPercent),
    // };

    // try {
    //   const response = await addNewDiscount(newDiscount).unwrap();
    //   setShowModal(false);
    // } catch (error) {
    //   console.log(error);
    //   ErrorAlert("خطا", "افزودن تخفیف با خطا مواجه گردید!");
    // }
  };

  // Edit Discount
  const updateDiscount = (data) => {
    setEditDiscountData(data);
    setModalMode("edit");
    setShowModal(true);
  };

  const editDiscount = (e) => {
    e.preventDefault();
    setIsLoading(true);
    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    let url = "CenterDiscount/update";
    let Data = {
      CenterID: ClinicID,
      DiscountID: formProps.EditDiscountID,
      Name: formProps.EditDiscountName,
      Des: formProps.EditDiscountDes,
      Value: formProps.EditDiscountValue,
      Percent: parseInt(formProps.EditDiscountPercent),
    };
    axiosClient
      .put(url, Data)
      .then((response) => {
        updateItem(formProps.EditDiscountID, response.data);
        setShowModal(false);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const updateItem = (id, newArr) => {
    let index = discountsList.findIndex((x) => x._id === id);
    let g = discountsList[index];
    g = newArr;

    if (index === -1) {
      console.log("no match");
    } else
      setDiscountsList([
        ...discountsList.slice(0, index),
        g,
        ...discountsList.slice(index + 1),
      ]);
  };

  // Delete Discount
  const deleteDiscount = async (id) => {
    let result = await QuestionAlert("حذف تخفیف!", "آیا از حذف اطمینان دارید؟");
    setIsLoading(true);

    if (result) {
      let url = `CenterDiscount/delete/${id}`;
      let data = {
        CenterID: ClinicID,
        DiscountID: id,
      };
      await axiosClient
        .delete(url, { data })
        .then(function () {
          setDiscountsList(discountsList.filter((a) => a._id !== id));
          setIsLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          setIsLoading(false);
        });
    }

    // if (result) {
    //   try {
    //     const response = await removeDiscount(data, id).unwrap();
    //   } catch (error) {
    //     console.log(error);
    //     ErrorAlert("خطا", "حذف تخفیف با خطا مواجه گردید!");
    //   }
    // }
  };

  useEffect(() => getDiscountsData(), []);

  return (
    <>
      <Head>
        <title>تخفیفات</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="dir-rtl">
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-md-12 d-flex justify-content-end">
                    <button
                      onClick={openAddModal}
                      className="btn btn-primary btn-add font-14"
                    >
                      <i className="me-1">
                        <FeatherIcon icon="plus-square" />
                      </i>{" "}
                      افزودن
                    </button>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-header border-bottom-0">
                      <div className="row align-items-center">
                        <div className="col">
                          <p className="card-title text-secondary font-14">
                            لیست تخفیفات پذیرش
                          </p>
                        </div>
                      </div>
                    </div>

                    <DiscountsListTable
                      data={discountsList}
                      updateDiscount={updateDiscount}
                      deleteDiscount={deleteDiscount}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <DiscountModal
        mode={modalMode}
        show={showModal}
        isLoading={isLoading}
        data={editDiscountData}
        onHide={handleCloseModal}
        FUSelectDiscountPercent={FUSelectDiscountPercent}
        discountPercentDataClass={discountPercentDataClass}
        onSubmit={modalMode == "edit" ? editDiscount : addDiscount}
      />
    </>
  );
};

export default Discounts;
