import { useRouter } from "next/router";
import { Tooltip } from "primereact/tooltip";
import FeatherIcon from "feather-icons-react";
import List from "components/dashboard/chat/chatUserMes/list";
import VoiceRecorder from "components/commonComponents/voiceRecorder";

export default function ChatPage({
  ChatHeader,
  chatRoomBody,
  ImageGalleryRender,
  users,
  BackToChatList,
  sendTextToChatBox,
  messageStatus,
  ClinicUserID,
  SendFile,
  sendBackToChatSms,
  openAppointmentModal,
  SendAudioMessage
}) {
  const router = useRouter();

  const handlePrescBtn = () => {
    if (ChatHeader.Insurance === "2" || ChatHeader.InsuranceType === "2") {
      router.push({
        pathname: "/taminPrescription",
        query: { pid: ChatHeader.NationalID, directPresc: true },
      });
    } else {
      router.push({
        pathname: "/salamatPrescription",
        query: { PID: ChatHeader.NationalID, directPresc: true },
      });
    }
  };

  return (
    <>
      <div className="chat-cont-right">
        {/* Chat Header */}
        <div className="chat-header">
          <a
            id="back_user_list"
            href="#"
            onClick={BackToChatList}
            className="back-user-list"
          >
            <i className="material-icons">chevron_left</i>
          </a>

          {ChatHeader ? (
            <div className="media d-flex  ">
              <div className="media-img-wrap flex-shrink-0">
                <div className="avatar avatar-online" id="headerStatus">
                  <img
                    src={
                      ChatHeader?.Avatar
                        ? "https://irannobat.ir/images/Avatar/" +
                          ChatHeader.Avatar?.replace("Avatar/", "")
                        : "https://irannobat.ir/admin/assets/img/profiles/NoAvatar.png"
                    }
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src =
                        "https://irannobat.ir/admin/assets/img/profiles/NoAvatar.png";
                    }}
                    alt="Logo "
                    className="avatar-img rounded-circle"
                  />
                </div>
              </div>

              <div className="media-body flex-grow-1">
                <div className="user-name ">{ChatHeader?.Name}</div>
                <div className="user-name text-secondary font-13 fw-bold">
                  {ChatHeader?.Tel && ChatHeader.Tel + " , "}
                  {ChatHeader?.NationalID &&
                    "کد ملی  : " + ChatHeader.NationalID}{" "}
                </div>
                <div className="user-status"></div>
              </div>
            </div>
          ) : (
            ""
          )}

          {ChatHeader.length !== 0 && (
            <div className="chat-options d-flex align-items-center">
              <button
                onClick={() => openAppointmentModal(ChatHeader?._id)}
                className="btn chatBtn px-2 d-flex align-items-center appointBtn"
                data-pr-position="right"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-25 h-23"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                  />
                </svg>
                <Tooltip target=".appointBtn">نوبت دهی</Tooltip>
              </button>

              <button
                onClick={handlePrescBtn}
                className="btn chatBtn px-2 d-flex align-items-center prescBtn"
                data-pr-position="bottom"
              >
                <Tooltip target=".prescBtn">نسخه نویسی</Tooltip>

                {ChatHeader.Insurance === "2" ||
                ChatHeader.InsuranceType == "2" ? (
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 436.000000 512.000000"
                    preserveAspectRatio="xMidYMid meet"
                    className="chatInsBtn"
                  >
                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
                      <path
                        d="M2080 5063 c-25 -2 -49 -8 -54 -14 -6 -5 -20 -9 -32 -9 -12 0 -32 -8
                          -45 -18 -13 -10 -35 -23 -49 -29 -14 -6 -72 -51 -130 -100 -265 -223 -1337
                          -1127 -1440 -1214 -63 -53 -127 -110 -142 -125 -34 -37 -128 -220 -128 -250 0
                          -13 -4 -25 -10 -29 -6 -3 -9 -265 -10 -694 0 -672 4 -773 32 -807 5 -7 8 -16
                          6 -20 -1 -5 3 -19 10 -32 7 -12 10 -22 8 -22 -8 0 34 -80 61 -117 12 -17 23
                          -36 23 -40 0 -13 85 -94 156 -150 85 -66 244 -195 338 -273 43 -36 108 -90
                          144 -120 37 -31 123 -101 191 -155 144 -116 270 -218 402 -327 405 -332 517
                          -419 564 -435 17 -6 39 -14 50 -18 37 -14 60 -16 170 -19 61 -2 126 1 145 6
                          19 5 43 10 52 13 38 9 157 87 239 157 30 25 104 88 165 140 61 51 190 161 288
                          243 97 83 209 176 249 209 40 32 104 86 142 120 84 74 232 199 286 242 21 18
                          85 72 142 120 56 48 134 115 172 147 78 67 164 157 165 172 0 6 8 22 18 35 9
                          14 23 41 30 60 42 112 42 105 42 867 0 415 -4 734 -9 737 -5 3 -12 23 -16 43
                          -4 21 -16 50 -27 66 -11 15 -18 31 -15 34 6 5 -57 101 -95 144 -24 27 -89 82
                          -228 195 -47 37 -129 104 -184 149 -54 44 -151 123 -215 175 -65 52 -239 194
                          -387 315 -148 120 -321 261 -384 312 -63 52 -145 118 -182 148 -87 73 -164
                          125 -172 118 -3 -3 -11 -1 -18 5 -42 34 -201 57 -318 45z m197 -609 c26 -8 57
                          -19 68 -24 11 -5 31 -14 45 -20 26 -10 125 -81 221 -158 30 -23 141 -111 247
                          -195 107 -84 278 -219 380 -300 103 -82 225 -179 272 -215 46 -37 118 -94 160
                          -127 41 -33 98 -77 125 -97 108 -79 244 -256 278 -363 26 -79 40 -445 25 -630
                          -9 -103 -12 -116 -58 -210 -54 -109 -125 -202 -217 -282 -87 -75 -1194 -977
                          -1302 -1061 -51 -40 -127 -89 -169 -109 -69 -35 -83 -38 -157 -37 -69 0 -90 5
                          -145 31 -36 17 -96 56 -135 86 -105 84 -151 119 -255 199 -52 40 -97 75 -100
                          79 -6 8 -64 55 -105 84 -15 11 -53 42 -84 69 -31 27 -67 56 -81 65 -14 9 -79
                          59 -145 112 -66 53 -163 129 -216 170 -401 310 -492 393 -557 506 -50 87 -69
                          140 -83 231 -12 82 -16 453 -6 548 18 158 115 332 260 464 33 30 239 198 456
                          373 218 175 483 389 589 475 319 259 366 295 389 298 10 2 19 8 21 13 2 6 12
                          11 22 11 10 0 33 7 51 15 45 19 146 19 206 -1z"
                      />
                      <path
                        d="M2065 4033 c-536 -49 -1010 -396 -1217 -891 -89 -212 -129 -467 -108
                          -688 19 -208 65 -367 162 -555 172 -336 467 -587 837 -713 l102 -34 -3 572 -3
                          572 -26 49 c-37 73 -101 110 -189 110 -56 0 -73 -4 -108 -28 -23 -15 -54 -46
                          -69 -69 -28 -41 -28 -44 -33 -237 l-5 -196 -48 66 c-80 112 -142 265 -167 415
                          -20 113 -8 339 23 447 51 177 131 312 261 443 131 131 273 213 456 265 75 21
                          105 24 260 24 139 0 189 -4 245 -19 214 -57 375 -158 541 -340 31 -34 110
                          -158 134 -211 28 -62 59 -154 79 -238 14 -61 14 -343 0 -404 -41 -171 -107
                          -312 -201 -429 l-63 -79 -5 225 c-6 249 -8 260 -74 318 -105 92 -259 58 -329
                          -73 -22 -39 -22 -48 -25 -612 -3 -570 -3 -573 17 -573 33 0 209 59 298 101
                          141 64 366 225 437 311 11 13 41 48 67 78 151 176 269 432 316 683 26 136 23
                          399 -5 533 -120 566 -524 995 -1066 1134 -164 41 -338 57 -491 43z"
                      />
                      <path d="M2051 3289 c-161 -81 -201 -286 -81 -422 110 -125 305 -123 414 4150 176 24 449 -209 449 -49 0 -75 -6 -124 -31z" />
                      <path d="M1558 2966 c-171 -47 -226 -270 -97 -393 134 -127 366 -49 393 13226 168 -131 306 -296 261z" />
                      <path d="M2627 2966 c-142 -39 -209 -197 -142 -333 57 -113 195 -156 313 -97206 102 151 408 -78 437 -25 3 -66 0 -93 -7z" />
                      <path
                        d="M2128 2626 c-79 -21 -131 -70 -157 -145 -8 -24 -11 -227 -11 -692 l0
                          -658 58 -8 c73 -10 283 -10 345 0 l47 8 0 648 c0 723 1 716 -67 786 -59 61
                          -135 82 -215 61z"
                      />
                    </g>
                  </svg>
                ) : (
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 512.000000 512.000000"
                    preserveAspectRatio="xMidYMid meet"
                    className="chatInsBtn"
                  >
                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
                      <path
                        d="M30 4044 l0 -1051 206 -189 c113 -104 209 -190 214 -192 6 -2 192
                          191 290 301 l24 28 -132 132 -132 132 0 708 0 707 709 0 709 0 532 -550 531
                          -550 285 0 284 0 0 -288 0 -288 175 -174 176 -174 28 30 c15 16 90 93 166 172
                          l138 143 -102 103 -102 102 -2 424 -2 425 -425 5 -425 5 -520 540 -519 540
                          -1053 5 -1053 5 0 -1051z"
                      />
                      <path
                        d="M2818 4881 c-109 -118 -195 -218 -191 -221 5 -4 79 -73 165 -153 87
                          -81 161 -147 165 -147 5 0 67 59 138 130 l130 130 702 0 703 0 0 -713 0 -713
                          -545 -524 -544 -525 -3 -285 -3 -285 -291 -5 -292 -5 -166 -172 c-91 -94 -166
                          -173 -166 -175 0 -2 77 -78 171 -168 l171 -163 106 106 107 107 418 0 417 0 0
                          418 0 417 550 529 550 528 0 1049 0 1049 -1047 2 -1047 3 -198 -214z"
                      />
                      <path
                        d="M2075 4115 l-97 -105 -429 0 -429 0 0 -424 0 -424 -545 -523 -545
                          -523 0 -1053 0 -1053 1048 1 1047 0 193 209 c105 115 192 213 192 217 0 5 -75
                          78 -166 162 l-166 154 -137 -137 -136 -136 -700 2 -700 3 -3 710 -2 709 64 61
                          c35 33 283 271 550 529 l486 470 0 283 0 283 288 0 287 -1 172 178 172 178
                          -27 28 c-15 16 -93 92 -173 168 l-147 139 -97 -105z"
                      />
                      <path d="M2735 3321 c-95 -43 -149 -133 -150 -248 0 -39 3 -75 7 -78 12 -12112 42 153 82 43 42 70 98 80 165 14 97 -8 116 -90 79z" />
                      <path
                        d="M2313 3016 c-93 -30 -157 -92 -199 -194 -19 -47 -24 -75 -24 -162 0
                          -187 64 -355 175 -459 85 -79 117 -89 237 -72 74 11 109 11 184 0 84 -11 97
                          -11 141 6 66 25 151 113 190 196 59 125 78 202 78 329 0 103 -3 121 -26 171
                          -49 104 -124 170 -218 190 -49 10 -60 9 -153 -22 -109 -35 -118 -35 -240 10
                          -66 24 -86 25 -145 7z"
                      />
                      <path
                        d="M1960 2575 c0 -9 -11 -20 -24 -24 -22 -9 -23 -14 -28 -156 l-6 -147
                          48 -102 c41 -88 57 -111 115 -164 93 -85 158 -126 264 -167 169 -65 343 -65
                          514 1 109 42 172 81 263 166 57 54 74 78 115 165 l48 102 -6 150 c-6 141 -7
                          151 -25 151 -11 0 -22 9 -25 20 -7 25 -29 26 -41 3 -5 -10 -15 -58 -21 -108
                          -7 -49 -15 -102 -17 -117 -5 -25 -3 -28 21 -28 106 0 80 -83 -84 -267 -49 -56
                          -95 -104 -101 -108 -25 -15 26 64 95 150 116 144 138 195 85 195 -38 0 -78
                          -29 -125 -90 -60 -78 -103 -110 -146 -110 -55 0 -150 -29 -185 -55 -18 -13
                          -49 -48 -70 -76 l-38 -52 -21 29 c-11 16 -40 50 -65 75 -49 51 -86 66 -188 76
                          -58 6 -66 10 -110 53 -26 26 -65 68 -87 94 -31 36 -49 48 -77 53 -58 9 -59
                          -15 -4 -95 25 -37 67 -92 92 -122 25 -30 54 -73 65 -95 19 -38 17 -37 -42 25
                          -126 133 -199 235 -199 279 0 24 28 41 65 41 25 0 27 2 21 33 -3 17 -10 73
                          -17 122 -6 50 -16 96 -21 103 -14 17 -38 15 -38 -3z"
                      />
                      <path
                        d="M1100 2368 c-68 -71 -140 -147 -159 -170 l-34 -40 102 -102 101 -101
                          0 -423 0 -422 423 0 422 0 528 -550 528 -550 1050 0 1049 0 0 1049 0 1049
                          -187 173 c-104 95 -200 183 -214 196 l-26 24 -156 -168 -157 -168 135 -135
                          135 -135 0 -703 0 -702 -713 0 -713 0 -525 545 -524 544 -287 1 -288 0 0 291
                          0 291 -171 166 c-94 92 -177 168 -183 169 -6 1 -67 -57 -136 -129z"
                      />
                    </g>
                  </svg>
                )}
              </button>

              <button
                onClick={() =>
                  router.push({
                    pathname: "/reception",
                    query: { PNID: ChatHeader.NationalID },
                  })
                }
                className="btn chatBtn px-2 d-flex align-items-center receptionBtn"
                data-pr-position="bottom"
              >
                <FeatherIcon
                  icon="clipboard"
                  style={{ width: "22px", height: "22px" }}
                />
                <Tooltip target=".receptionBtn">پذیرش</Tooltip>
              </button>

              <button
                className="btn chatBtn px-2 d-flex align-items-center"
                onClick={() =>
                  sendBackToChatSms(
                    ChatHeader?._id,
                    ChatHeader?.Tel,
                    ChatHeader?.Name
                  )
                }
              >
                <i
                  className="material-icons"
                  style={{ width: "22px", height: "21px" }}
                >
                  sms
                </i>
              </button>

              <button className="btn chatBtn px-2 d-flex align-items-center">
                <i className="material-icons">more_vert</i>
              </button>
            </div>
          )}
        </div>

        {/* Chat Body */}
        <div className="chat-scroll" id="chat-body">
          <div className="chat-body">
            <ul className="list-unstyled" id="AddChat">
              <List
                messageStatus={messageStatus}
                chatRoomBody={chatRoomBody}
                Patient={ChatHeader}
                ImageGalleryRender={ImageGalleryRender}
                users={users}
                ClinicUserID={ClinicUserID}
              />
            </ul>
          </div>
        </div>

        {/* Chat Footer */}
        <form onSubmit={sendTextToChatBox}>
          <div className="chat-footer">
            <div className="input-group">
            <VoiceRecorder SendAudioMessage={SendAudioMessage}/>
              <div className="btn-file btn chatBtn">
                <i className="fa fa-paperclip"></i>
                <input
                  type="file"
                  onChange={(e) => SendFile(e.target.files[0])}
                />
              </div>

              <input
                id="TextInput"
                type="text"
                className="input-msg-send form-control rounded-pill"
                placeholder="متن خود را اینجا بنویسید "
              />

              <button
                type="submit"
                className="btn msg-send-btn rounded-pill ms-2  bg-tel"
              >
                <i className="fab fa-telegram-plane tel-icon"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
