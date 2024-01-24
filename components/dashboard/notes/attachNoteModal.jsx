import { useState } from "react";
import { Modal } from "react-bootstrap";
import { axiosClient } from "class/axiosConfig";
import NoteCreator from "components/dashboard/notes/noteCreator";

const AttachNoteModal = ({
  show,
  onHide,
  ClinicID,
  ActivePatientID,
  AddNote,
}) => {
  const _addNote = (noteFile) => {
    let url = "Patient/addNote";
    let data = {
      CenterID: ClinicID,
      PatientID: ActivePatientID,
      Note: noteFile,
      private: true,
    };

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        AddNote(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Modal show={show} onHide={onHide} centered fullscreen={true}>
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="mb-0 text-secondary font-14 fw-bold">
            افزودن یادداشت به پرونده بیمار
          </p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <NoteCreator ClinicID={ClinicID} addNote={_addNote} />
      </Modal.Body>
    </Modal>
  );
};

export default AttachNoteModal;
