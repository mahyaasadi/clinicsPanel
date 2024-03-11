import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";

export const getServerSideProps = async ({ req, res }) => {
  const result = await getSession(req, res);

  if (result) {
    const { ClinicUser } = result;
    return {
      props: {
        ClinicUser,
      },
    };
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
const Storage = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;
  return (
    <>
      <Head>
        <title>انبار</title>
      </Head>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row dir-rtl">ooo</div>
        </div>
      </div>
    </>
  );
};

export default Storage;
