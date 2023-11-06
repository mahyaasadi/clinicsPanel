const ReceptionList = ({ data }) => {
  console.log({ data });

  return (
    <>
      <div className="row p-4">
        {data.map((item, index) => (
          <div className="col-sm-6 col-xxl-4 receptionRecordCard" key={index}>
            <div className="card marginb-sm">
              <div className="card-body text-secondary">
                <div className="font-12">شناسه پذیرش : {item.ReceptionID}</div>
                <hr />
                <div className="d-flex gap-4 align-items-center">
                  <div className="">
                    <img
                      src={"https://irannobat.ir/images/" + item.Patient.Avatar}
                      alt="patientAvatar"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "10px",
                      }}
                      onError={({ currentTarget }) => {
                        currentTarget.src = "assets/img/NoAvatar.jpg";
                      }}
                    />
                  </div>
                  <div className="">
                    <p className="mb-1 font-12">
                      نام بیمار : {item.Patient.Name}
                    </p>
                    <p className="font-11">
                      کد ملی : {item.Patient.NationalID}
                    </p>
                  </div>
                </div>
                <hr />
                <div className="d-flex gap-4 align-items-center">
                  <div className="">
                    <img
                      src={item.Modality.Icon}
                      alt="modalityIcon"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                  <div className="font-12">
                    بخش انتخابی : {item.Modality.Name}
                  </div>
                </div>

                <hr />

                {/* services */}
                <div className=""></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default ReceptionList;
