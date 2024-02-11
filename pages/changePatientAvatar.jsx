import { useRouter } from "next/router";
import { getPatientAvatarUrl } from "lib/session";

let PatientID,
  UserID = null;
const ChangePatientAvatar = () => {
  let Router = useRouter();
  //   console.log(Router.query.token);

  let IDs = getPatientAvatarUrl(Router.query.token);
  if (IDs) {
    IDs = IDs.split(";");
    PatientID = IDs[0];
    UserID = IDs[1];
  }

  return (
    <>
      <div className="avatar-upload">
        {/* <img src="https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=http://192.168.1.116:3000/changePatientAvatar?token=eyJhbGciOiJIUzI1NiJ9.NjVjNzIxNWI1NDNjODFmZDY0ZWU3ZmUwOzY1MzYzMjY1ZTQ0YjZmMTU2YjA4NGZkNQ.TNq8Si82W4g8k5WLiXzkh90xfJyKh7pp0Z6XXTvUbU4&choe=UTF-8" /> */}
      </div>
    </>
  );
};

export default ChangePatientAvatar;
