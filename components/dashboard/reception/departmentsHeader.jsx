const DepartmentsHeader = ({
  department,
  activeClass,
  setDepartmentsServices,
}) => {
  //   console.log({ department });
  return (
    <>
      <li className="nav-item">
        <a
          className={"nav-link media-nav-link font-13 " + activeClass}
          href={"#bottom-tab" + department._id}
          id={"department " + department._id}
          data-bs-toggle="tab"
          onClick={() => setDepartmentsServices(department.Services)}
        >
          {/* <Image src={img} alt="prescTypeIcon" height="20" width="20" /> &nbsp; */}
          {department.Name}
          {/* <span
            className="badge badge-primary"
            id={"srvItemCountId" + id}
          ></span> */}
        </a>
      </li>
    </>
  );
};

export default DepartmentsHeader;
