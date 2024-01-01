import dynamic from "next/dynamic";
import { useState } from "react";
import { Modal } from "react-bootstrap";

const FormPreview = ({ data, show, onHide }) => {
  let arrayOfObjects = JSON.parse(data);
  let componentsArr = [];

  arrayOfObjects?.map((x, index) => {
    const MyComponent = dynamic(() =>
      import("components/dashboard/forms/formPreview/form-" + x.type)
    );

    componentsArr.push(<MyComponent data={x} />);
  });

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-0 text-secondary font-14 fw-bold">Preview</p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {componentsArr.map((component, index) => component)}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FormPreview;
