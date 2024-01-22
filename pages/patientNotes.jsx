import Head from "next/head";
import { useState, useEffect } from "react";
import { getSession } from "lib/session";
import NoteCreator from "components/dashboard/patientFile/notes/noteCreator";

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
const note = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-flui">
          <NoteCreator />
        </div>
      </div>
    </>
  );
};

export default note;
