import { useState } from "react";
import FeatherIcon from "feather-icons-react";
import { resetServerContext } from "react-beautiful-dnd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Skeleton } from "primereact/skeleton";
import { Tooltip } from "primereact/tooltip";

const PatientCategories = ({
  patientsInfo,
  setPatientsInfo,
  openActionModal,
  isLoading,
  openNewAppointmentModal,
}) => {
  resetServerContext();

  const [categories, setCategories] = useState([
    { id: "6550ab29aaffd91260889560", name: "در انتظار" },
    { id: "6550add52e94fa6da0b485bc", name: "پرداخت کامل" },
    { id: "6550af412e94fa6da0b487fc", name: "بدهکار" },
    { id: "6550af7a2e94fa6da0b48870", name: "عودت وجه" },
  ]);

  const rearangeArr = (arr, sourceIndex, destIndex) => {
    const arrCopy = [...arr];
    const [removed] = arrCopy.splice(sourceIndex, 1);
    arrCopy.splice(destIndex, 0, removed);
    return arrCopy;
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    if (destination.droppableId === "Categories") {
      setCategories(rearangeArr(categories, source.index, destination.index));
    } else if (destination.droppableId !== source.droppableId) {
      const draggedPatient = patientsInfo.find(
        (patient) => patient.id.toString() === result.draggableId
      );

      if (draggedPatient) openActionModal(draggedPatient.id, draggedPatient.item);

      setPatientsInfo((patientsInfo) =>
        patientsInfo.map((item) =>
          item.id === result.draggableId
            ? {
              ...item,
              category: result.destination.droppableId,
            }
            : item
        )
      );
    } else {
      setPatientsInfo(
        rearangeArr(patientsInfo, source.index, destination.index)
      );
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="Categories" type="droppableItem">
          {(provided) => (
            <div ref={provided.innerRef} className="row">
              {categories.map((category, index) => (
                <div key={index} className="col-12 col-lg-6 col-xxl-3">
                  <Droppable droppableId={category.id.toString()}>
                    {(provided) => (
                      <div ref={provided.innerRef}>
                        <ul
                          className="list-unstyled mb-3"
                          id="dropzone"
                          dir="rtl"
                        >
                          <p className="mb-1 mt-3 text-secondary font-14 fw-bold text-center">
                            {category.name}
                          </p>
                          <hr className="mb-4" />

                          <div className="patientListContainer">
                            {patientsInfo
                              .filter((item) => item.category === category.id)
                              .map((item, index) => (
                                <Draggable
                                  draggableId={item.id.toString()}
                                  id={item.id.toString()}
                                  key={item.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      {!isLoading ? (
                                        <div className="checkbox permissionCheckbox">
                                          <div className="checkbox-wrapper checkbox-wrapper-per w-100">
                                            <div
                                              className="patientInfoCheckboxTile permissionItem"
                                              onDoubleClick={() =>
                                                openActionModal(
                                                  item.id,
                                                  item.item
                                                )
                                              }
                                            >
                                              <div className="">
                                                <button
                                                  data-pr-position="left"
                                                  onClick={() =>
                                                    openNewAppointmentModal(
                                                      item.item.Patient,
                                                      item.item.Modality,
                                                      item
                                                    )
                                                  }
                                                  className="btn p-0 editButton newAppointBtn"
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-21"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                                                    />
                                                  </svg>
                                                  <Tooltip target=".newAppointBtn">
                                                    نوبت جدید
                                                  </Tooltip>
                                                </button>
                                              </div>
                                              <div
                                                className="d-flex align-items-center flex-col"
                                                key={index}
                                              >
                                                <div className="p-2 d-flex gap-4 align-items-center font-12">
                                                  <div dir="rtl">
                                                    <div className="d-flex align-items-center gap-1">
                                                      <FeatherIcon
                                                        icon="calendar"
                                                        className="prescItembtns"
                                                      />
                                                      {item.item.Date},{" "}
                                                      {item.item.Time}
                                                    </div>

                                                    <div className="d-flex align-items-center gap-1">
                                                      <FeatherIcon
                                                        icon="user"
                                                        className="prescItembtns"
                                                      />
                                                      {item.name}
                                                    </div>

                                                    <div className="d-flex align-items-center gap-2">
                                                      <div className="w-16 m-0 d-flex">
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          fill="none"
                                                          viewBox="0 0 24 24"
                                                          strokeWidth="1.5"
                                                          stroke="currentColor"
                                                          className="w-100 m-0"
                                                        >
                                                          <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                                                          />
                                                        </svg>
                                                      </div>
                                                      {item.nationalID}
                                                    </div>
                                                    <p
                                                      dir="rtl"
                                                      className="d-flex justify-start"
                                                    >
                                                      سهم بیمار :{" "}
                                                      {item.item?.Calculated?.TotalPC?.toLocaleString()}{" "}
                                                      ریال
                                                    </p>
                                                  </div>

                                                  <div className="patientAvatar">
                                                    <div className="d-flex flex-col gap-2">
                                                      <img
                                                        src={
                                                          "https://irannobat.ir/images/" +
                                                          item.avatar
                                                        }
                                                        alt="patientAvatar"
                                                        onError={({
                                                          currentTarget,
                                                        }) => {
                                                          item?.item?.Patient?.Gender === "M" || item?.item?.Patient?.Gender === "F"
                                                            ? (currentTarget.src = `assets/img/avatar-${item?.item?.Patient?.Gender}-pic.png`)
                                                            : (currentTarget.src = `assets/img/avatar-O-pic.png`);
                                                        }}
                                                        style={{
                                                          width: "30px",
                                                          height: "30px",
                                                          borderRadius: "10px",
                                                        }}
                                                      />
                                                      <p className="fw-bold font-13">
                                                        {item.item.ReceptionID}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="cashDeskSkeleton">
                                          <Skeleton>
                                            <div className="checkbox permissionCheckbox">
                                              <div className="checkbox-wrapper checkbox-wrapper-per w-100">
                                                <div className=""></div>
                                              </div>
                                            </div>
                                          </Skeleton>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                          </div>
                          {provided.placeholder}
                        </ul>
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default PatientCategories;
