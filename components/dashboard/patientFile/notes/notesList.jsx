import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";

const NotesList = ({ ActivePatientID }) => {
  const router = useRouter();

  // a new ui
  return (
    <>
      <div className="card border-gray mb-2">
        <div className="card-body">
          <div className="card-header p-2 pt-0 mb-2">
            <div className="row align-items-center">
              <div className="col">
                <p className="fw-bold text-secondary font-13">یادداشت ها</p>
              </div>

              <div className="col d-flex justify-content-end">
                <button
                  onClick={() =>
                    router.push({
                      query: { PID: ActivePatientID },
                      pathname: "/patientNotes",
                    })
                  }
                  className="btn text-secondary font-12 d-flex align-items-center gap-1 fw-bold p-0 formBtns"
                >
                  <FeatherIcon icon="plus" />
                  یادداشت جدید
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotesList;
