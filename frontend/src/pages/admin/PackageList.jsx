import React, { useState, useEffect } from "react";
import "../../App.css";
import AdminDrawer from "../../components/AdminDrawer";
import { useNavigate } from "react-router-dom";
import AddPackage from "../../components/AddPackage";
import useAPI from "../../store/storeAPI";

export default function PackageList() {
  const { error, loading, fetchData } = useAPI();
  const [pack, setPack] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    setSearch(val.toLowerCase());
  };

  const nav = useNavigate();

  useEffect(() => {
    const link = "getpackage";
    const order = "GET";
    const getPack = async () => {
      const data = await fetchData(link, order);
      setPack(data);
    };
    getPack();
  }, [fetchData]);

  const handleDelete = (e) => {
    e.preventDefault();
    const id = e.target.value;
    const link = `deletepackage/${id}`;
    const order = "DELETE";
    fetchData(link, order);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const goEdit = (e) => {
    const pac = e.target.value;
    nav(`/packagequestions/${pac}`);
  };

  // Filtreleme işlemi: Arama kriterine göre paketleri filtreliyoruz
  const filteredPackages = pack.filter((pkg) =>
    pkg.name.toLowerCase().includes(search)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <AdminDrawer />
      <div className="adminDrawerOpen">
        <div className="package-table-container">
          <h2>Manage Question Package</h2>
          <input
            type="text"
            placeholder="Package Title..."
            className="package-title-input"
            value={search}
            onChange={handleChange}
          />
          <button className="add-button2" onClick={handleModalOpen}>
            + Add
          </button>
          <AddPackage isModalOpen={isModalOpen} onClose={handleModalClose} />
          <br />
          <table className="package-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Package Name</th>
                <th>Question Count</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg, index) => (
                  <tr key={pkg._id}>
                    <td>{index + 1}</td>
                    <td>{pkg.name}</td>
                    <td>{pkg.questionCount}</td>
                    <td>
                      <button
                        value={pkg._id}
                        className="edit-button"
                        onClick={goEdit}
                      >
                        Edit
                      </button>
                      <button
                        value={pkg._id}
                        className="delete-button"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No packages found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
