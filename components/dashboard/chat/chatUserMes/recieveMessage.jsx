export default function RecieveMessage({
  recievemes,
  ImageGalleryRender,
  imageCunter,
  Patient,
  userInfo,
}) {
  let Type = recievemes.Type;
  let content = null;
  let reciveimg = null;

  if (Type === "Image") {
    content = (
      <>
        <img
          src={"https://irannobat.ir/images/" + recievemes.Text}
          alt="Attachment"
          onClick={() => ImageGalleryRender(imageCunter)}
          className="img-message"
        />
        <img
          src={"https://irannobat.ir/images/" + recievemes.Text}
          alt="Attachment"
          className="img-message hiden-image"
          id={"imageMessage" + recievemes._id}
        />
      </>
    );
  } else if (Type === "Voice") {
    content = (
      <audio controls>
        <source
          src={"https://irannobat.ir/voice/" + recievemes.Text}
          type="audio/mp3"
        />
      </audio>
    );
  } else if (Type === "") {
    let text = recievemes.Text;
    content = <div dangerouslySetInnerHTML={{ __html: text }}></div>;
  } else if (Type === "Deleted") {
    return null;
  } else {
    let str = urlify(recievemes.Text);
    content = <div dangerouslySetInnerHTML={{ __html: str }}></div>;
  }

  function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '">' + url + "</a>";
    });
  }

  if (Type === "") {
    Patient = null;
    reciveimg = (
      <img
        src="https://irannobat.ir/assets/img/200PX.png"
        Title="ایجاد شده توسط ایران نوبت"
        alt="User "
        className="avatar-img rounded-circle"
      />
    );
  } else if (Type === "Robot") {
    Patient = null;
    reciveimg = (
      <img
        src={"https://irannobat.ir/images/Robot.jpg"}
        alt="User "
        Title="ایجاد شده توسط ایران نوبت"
        className="avatar-img rounded-circle"
      />
    );
  } else
    reciveimg = (
      <img
        src={
          Patient?.Avatar
            ? "https://irannobat.ir/images/Avatar/" +
              Patient.Avatar?.replace("Avatar/", "")
            : "https://irannobat.ir/admin/assets/img/profiles/NoAvatar.png"
        }
        alt="User "
        Title={userInfo?.NickName ? userInfo.NickName : Patient?.Name}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src =
            "https://irannobat.ir/admin/assets/img/profiles/NoAvatar.png";
        }}
        className="avatar-img rounded-circle"
      />
    );
  return (
    <>
      <li className="media received d-flex " id="msg-box">
        <div className="avatar">{reciveimg}</div>
        <div className="media-body flex-grow-1">
          <div className="msg-box">
            <div>
              <div id="messageText">
                <span className="nickname">
                  {userInfo?.NickName ? userInfo.NickName : Patient?.Name}
                </span>
                {content}
              </div>

              <ul className="chat-msg-info justify-content-end ">
                <li>
                  <div className="chat-time">
                    <span className="align-items-center">
                      {recievemes.Time}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    </>
  );
}
