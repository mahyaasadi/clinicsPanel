import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "@/class/axiosConfig";
import Loading from "components/commonComponents/loading/loading";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
// import { userSlice } from "@/redux/slices/userSlice";
// import { postsSlice } from "@/redux/slices/postsSlice";
import { setUser } from '../redux/slices/userSlice';
import { addPost } from '../redux/slices/postsSlice';

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
const Dashboard = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const posts = useSelector(state => state.posts);

  const getDepartmentsData = () => {
    let url = `ClinicDepartment/getAll/${ClinicID}`

    axiosClient.get(url)
      .then((response) => {
        console.log(response.data);
        dispatch(setUser(response.data));
      })
      .catch((err) => {
        console.log(err);
      })
  }

  useEffect(() => {
    getDepartmentsData()
    console.log({ user });
  }, [])

  return (
    <>
      <Head>
        <title>داشبورد من</title>
      </Head>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid pb-0">oooooo</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

