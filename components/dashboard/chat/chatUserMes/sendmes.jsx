export default function SendMessage({
  sendmes,
  ImageGalleryRender,
  imageCunter,
  messageStatus,
}) {
  let Type = sendmes.Type;
  let content = null;
  let status = null;

  if (messageStatus === null) {
    status = " در حال ارسال ";
  } else {
    status = messageStatus[sendmes.Status];
  }

  if (Type === "Image") {
    content = (
      <>
        <img
          src={"https://irannobat.ir/images/" + sendmes.Text}
          className="img-message"
          onClick={() => ImageGalleryRender(imageCunter)}
        />
        <img
          src={"https://irannobat.ir/images/" + sendmes.Text}
          className="img-message  hiden-image"
          id={"imageMessage" + sendmes._id}
        />
      </>
    );
  } else if (Type === "Voice") {
    content = (
      <audio controls>
        <source
          src={"https://irannobat.ir/voice/" + sendmes.Text}
          type="audio/mp3"
        />
      </audio>
    );
  } else if (Type === "") {
    let text = sendmes.Text;
    content = <div dangerouslySetInnerHTML={{ __html: text }}></div>;
  } else if (Type === "Deleted") {
    return null;
  } else {
    let str = urlify(sendmes?.Text);
    content = <div dangerouslySetInnerHTML={{ __html: str }}></div>;
  }

  function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '">' + url + "</a>";
    });
  }

  return (
    <>
      <li className="media sent d-flex">
        <div className="media-body flex-grow-1">
          <div className="msg-box">
            <div>
              {content}
              <ul className="chat-msg-info justify-content-start ">
                <li>
                  <div className="chat-time">
                    <span>{sendmes.Time} | </span>
                    {status}
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
