import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig";
import { QuestionAlert } from "class/AlertManage";
import ImageViewer from "components/commonComponents/imageViewer";

const NotesList = ({ openNoteCreatorModal, patientNotesData, RemoveNote }) => {
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

      axiosClient
        .delete(url, { data })
        .then((response) => {
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
              <p className="card-title font-14 text-secondary">
                یادداشت های دستی
              </p>
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

          <ImageViewer images={patientNotesData} removeFunc={_removeNote} />
        </div>
      </div>
    </>
  );
};

export default NotesList;
