import cookie from "cookie";
import jwt from "jsonwebtoken";

const secret = "WD%^)(satardavoodiirannobat$#123";

export function setSession(res, session) {
  const token = jwt.sign(session, secret);

  const cookieValue = cookie.serialize("clinicSession", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 7 * 24, // 1 week
    sameSite: "strict",
    path: "/",
  });

  res.setHeader("Set-Cookie", cookieValue);
}

export function getSession(req) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.clinicSession;

  if (!token) return null;

  try {
    let ClinicUser = jwt.verify(token, secret);

    return {
      ClinicUser,
    };
  } catch (err) {
    return null;
  }
}

export function destroySession(res) {
  console.log({ res });
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("clinicSession", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      sameSite: "strict",
      path: "/",
    })
  );
}
