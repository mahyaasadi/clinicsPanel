// import Head from "next/head";
// import { useRouter } from "next/router";
// import { useState, useEffect } from "react";
// import { getSession } from "lib/session";
// import NoteCreator from "components/dashboard/notes/noteCreator";

// export const getServerSideProps = async ({ req, res }) => {
//   const result = await getSession(req, res);

//   if (result) {
//     const { ClinicUser } = result;
//     return { props: { ClinicUser } };
//   } else {
//     return {
//       redirect: {
//         permanent: false,
//         destination: `/`,
//       },
//     };
//   }
// };

// let ClinicID,
//   ActivePatientID = null;
// const PatientNotes = ({ ClinicUser }) => {
//   ClinicID = ClinicUser.ClinicID;
//   const router = useRouter();

//   const addNote = (noteFile) => {
//     let url = "Patient/addNote";
//     let data = {
//       CenterID: ClinicID,
//       PatientID: ActivePatientID,
//       Note: noteFile,
//       private: true,
//     };

//     console.log({ data });
//   };

//   useEffect(() => {
//     if (router.query.PID) {
//       ActivePatientID = router.query.PID;
//     }
//   }, [router.isReady]);

//   return (
//     <>
//       <div className="page-wrapper">
//         <div className="content content-fluid">
//           <NoteCreator addNote={addNote} />
//         </div>
//       </div>
//     </>
//   );
// };

// export default PatientNotes;
