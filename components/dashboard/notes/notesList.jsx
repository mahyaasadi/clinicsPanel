import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";
import { QuestionAlert } from "class/AlertManage";
import { axiosClient } from "class/axiosConfig";

const NotesList = ({
  ActivePatientID,
  openNoteCreatorModal,
  patientNotesData,
  ClinicID,
  RemoveNote,
}) => {
  const router = useRouter();

  const _removeNote = async (id) => {
    let result = await QuestionAlert(
      "حذف یادداشت!",
      "آیا از حذف اطمینان دارید؟"
    );

    if (result) {
      let url = "Patient/deleteNote";
      let data = {
        NoteID: id,
      };

      console.log({ data });

      axiosClient
        .delete(url, { data })
        .then((response) => {
          console.log(response.data);
          RemoveNote(id);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <div className="card border-gray mb-2">
        <div className="card-body">
          <div className="row align-items-center p-2 pt-0 mb-2">
            <div className="col">
              <p className="card-title font-14 text-secondary">یادداشت ها</p>
            </div>

            <div className="col d-flex justify-content-end">
              <div className="col d-flex justify-content-end">
                <button
                  onClick={openNoteCreatorModal}
                  className="btn text-secondary font-12 d-flex align-items-center gap-1 fw-bold p-0 formBtns"
                >
                  <FeatherIcon icon="plus" />
                  یادداشت جدید
                </button>
              </div>
            </div>
          </div>

          <hr className="mt-0 mb-1" />

          <div className="d-flex gap-2 notesContainer flex-wrap">
            {patientNotesData.map((item, index) => (
              <div
                key={index}
                className="border-gray articleCurrentImg card mb-1 mt-3 d-flex alifn-items-center justify-center"
              >
                <img
                  src={"https://irannobat.ir/images/PatientNote/" + item.Note}
                  alt="patientNote"
                  style={{ width: "130px", height: "130px" }}
                />
                <button
                  className="btn removeNoteBtn tooltip-button"
                  type="button"
                  data-pr-position="top"
                  onClick={() => _removeNote(item._id)}
                >
                  <FeatherIcon className="removeLogoBtnIcon" icon="x-circle" />
                  <Tooltip target=".removeNoteBtn">حذف</Tooltip>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotesList;
