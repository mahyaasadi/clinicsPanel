import { useState } from "react";
import { resetServerContext } from "react-beautiful-dnd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Loading from "components/commonComponents/loading/loading";

const PatientCategories = ({
  patientsInfo,
  setPatientsInfo,
  openActionModal,
  isLoading,
}) => {
  resetServerContext();

  console.log({ patientsInfo });

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

      if (draggedPatient) {
        console.log({ draggedPatient });
        openActionModal(draggedPatient.id, draggedPatient.item);
      }

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
      {isLoading ? (
        <Loading />
      ) : (
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
                            <p className="mb-1 text-secondary font-14 fw-bold text-center">
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
                                              <div
                                                className="d-flex align-items-center flex-col"
                                                key={index}
                                              >
                                                <div className="p-1 d-flex gap-4">
                                                  <div>
                                                    {/* <div className="d-flex"> */}
                                                    <p className="mb-2">
                                                      {item.item.Time},{" "}
                                                      {item.item.Date}
                                                    </p>

                                                    {/* </div> */}

                                                    <p className="text-align-end mb-2 font-13">
                                                      {item.name}
                                                    </p>

                                                    <p className="text-align-end font-12 mb-2">
                                                      کد ملی : {item.nationalID}
                                                    </p>
                                                    <p
                                                      dir="rtl"
                                                      className="font-12 d-flex justify-start"
                                                    >
                                                      سهم بیمار :{" "}
                                                      {item.item.Calculated?.TotalPC?.toLocaleString()}
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
                                                          currentTarget.src =
                                                            "assets/img/NotFoundAvatar.jpeg";
                                                        }}
                                                        style={{
                                                          width: "30px",
                                                          height: "30px",
                                                          borderRadius: "10px",
                                                        }}
                                                      />
                                                      <p className="fw-bold font-12">
                                                        {item.item.ReceptionID}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
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
      )}
    </>
  );
};

export default PatientCategories;
