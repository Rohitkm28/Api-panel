import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./App.css";
import { EmployeeData } from "./EmployeeData";

function App() {
  const [data, setData] = useState([]);
  const [id, setId] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setData(EmployeeData);
  }, []);

  const handleEdit = (id) => {
    const dt = data.filter((item) => item.id === id);
    if (dt.length > 0) {
      setIsUpdate(true);
      setId(id);
      formik.setValues({
        firstName: dt[0].firstName,
        lastName: dt[0].lastName,
        age: dt[0].age,
      });
    }
  };

  const handleDelete = (id) => {
    if (id > 0) {
      if (window.confirm("Are you sure to delete this item?")) {
        const dt = data.filter((item) => item.id !== id);
        setData(dt);
      }
    }
  };

  const handleUpdate = () => {
    const index = data
      .map((item) => item.id)
      .indexOf(id);
    const dt = [...data];
    dt[index].firstName = formik.values.firstName;
    dt[index].lastName = formik.values.lastName;
    dt[index].age = formik.values.age;
    setData(dt);
    handleClear();
  };

  const handleClear = () => {
    setId(0);
    formik.resetForm();
    setIsUpdate(false);
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      age: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, "First Name must be at least 2 characters")
        .required("First Name is required"),
      lastName: Yup.string()
        .min(2, "Last Name must be at least 2 characters")
        .required("Last Name is required"),
      age: Yup.number()
        .min(18, "Age must be at least 18")
        .required("Age is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      if (!isUpdate) {
        const newObject = {
          id: data.length + 1,
          firstName: values.firstName,
          lastName: values.lastName,
          age: values.age,
        };
        setData([...data, newObject]);
        resetForm();
      } else {
        handleUpdate();
      }
    },
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="App">
      <form onSubmit={formik.handleSubmit}>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", marginBottom: "10px" }}>
          <div>
            <label>
              First Name :
              <input
                type="text"
                placeholder="Enter First Name"
                name="firstName"
                onChange={formik.handleChange}
                value={formik.values.firstName}
                onBlur={formik.handleBlur}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="error">{formik.errors.firstName}</div>
              ) : null}
            </label>
          </div>
          <div>
            <label>
              Last Name :
              <input
                type="text"
                placeholder="Enter Last Name"
                name="lastName"
                onChange={formik.handleChange}
                value={formik.values.lastName}
                onBlur={formik.handleBlur}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="error">{formik.errors.lastName}</div>
              ) : null}
            </label>
          </div>
          <div>
            <label>
              Age :
              <input
                type="text"
                placeholder="Enter Age"
                name="age"
                onChange={formik.handleChange}
                value={formik.values.age}
                onBlur={formik.handleBlur}
              />
              {formik.touched.age && formik.errors.age ? (
                <div className="error">{formik.errors.age}</div>
              ) : null}
            </label>
          </div>

          <div>
            {!isUpdate ? (
              <button className="btn btn-primary" type="submit">
                Save
              </button>
            ) : (
              <button className="btn btn-danger" type="submit">
                Update
              </button>
            )}
            <button className="btn btn-danger" type="button" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      </form>

      <table className="table table-hover">
        <thead>
          <tr>
            <td>Sr.No</td>
            <td>Id</td>
            <td>First Name</td>
            <td>Last Name</td>
            <td>Age</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => {
            return (
              <tr key={index}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{item.id}</td>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.age}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>
                    Edit
                  </button>
                  &nbsp;
                  <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
        <button
          className="btn btn-secondary"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>Page {currentPage} of {totalPages}</span>
        <button
          className="btn btn-secondary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
