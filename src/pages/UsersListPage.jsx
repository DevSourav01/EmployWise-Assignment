import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UsersListPage = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [editedData, setEditedData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUsers(page);
  }, [page, token, navigate]);

  const fetchUsers = async (pageNumber) => {
    try {
      const response = await axios.get(
        `https://reqres.in/api/users?page=${pageNumber}`
      );
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setEditedData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://reqres.in/api/users/${editingUser}`, editedData);
      setUsers(
        users.map((user) =>
          user.id === editingUser ? { ...user, ...editedData } : user
        )
      );
      setEditingUser(null);
      alert("User updated successfully!");
    } catch (error) {
      alert("Error updating user.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      alert("User deleted successfully!");
    } catch (error) {
      alert("Error deleting user.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Users List</h2>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition cursor-pointer"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition"
          >
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar}
                alt={user.first_name}
                className="w-16 h-16 rounded-full border border-gray-300"
              />
              <div>
                {editingUser === user.id ? (
                  <>
                    <input
                      type="text"
                      value={editedData.first_name}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          first_name: e.target.value,
                        })
                      }
                      className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={editedData.last_name}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          last_name: e.target.value,
                        })
                      }
                      className="border p-2 w-full mt-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      value={editedData.email}
                      onChange={(e) =>
                        setEditedData({ ...editedData, email: e.target.value })
                      }
                      className="border p-2 w-full mt-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={handleUpdate}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition cursor-pointer disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-lg font-semibold text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition cursor-pointer disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersListPage;
