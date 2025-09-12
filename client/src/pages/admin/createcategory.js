import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { toast } from "react-toastify";
import axios from "axios";
import { Modal } from "antd";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [loading, setLoading] = useState(false);

  // Create Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Category name is required");
      return;
    }
    if (trimmedName.length > 50) {
      toast.error("Category name must be under 50 characters");
      return;
    }
    if (
      categories.some(
        (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      toast.error("Category name already exists");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/category/create-category`,
        { name }
      );
      if (data.success) {
        toast.success(`${name} category created successfully!`);
        setName("");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong creating the category");
    } finally {
      setLoading(false);
    }
  };

  // Get All Categories
  const getAllCategory = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setCategories(data.categories || data.category || []);
      } else {
        toast.error(data.message || "Failed to load categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Something went wrong in getting categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Update Category
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!updatedName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Delete Category
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/category/delete-category/${id}`
      );
      if (data.success) {
        toast.success("Category deleted successfully");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Manage Categories - Admin">
      <div className="admin-dashboard">
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3 col-md-4">
              <AdminMenu />
            </div>

            {/* Main Content */}
            <div className="col-lg-9 col-md-8">
              <div className="admin-content">
                {/* Page Header */}
                <div className="page-header">
                  <h1>Manage Categories</h1>
                  <p>Create and manage product categories for your store</p>
                </div>

                {/* Create Category Form */}
                <div className="create-category-card">
                  <h3>Create New Category</h3>
                  <form onSubmit={handleSubmit} className="category-form">
                    <div className="form-group">
                      <label htmlFor="categoryName">Category Name</label>
                      <input
                        type="text"
                        id="categoryName"
                        className="form-control"
                        placeholder="Enter category name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                      aria-disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Category"}
                    </button>
                  </form>
                  <h3>All Categories</h3>
                  <span className="category-count">
                    {categories.length} categories
                  </span>

                  {categories.length > 0 ? (
                    <div className="categories-grid">
                      {categories.map((category) => (
                        <div key={category._id} className="category-item">
                          <div className="category-info">
                            <div className="category-icon">🏷️</div>
                            <div className="category-details">
                              <h4>{category.name}</h4>
                              <p>Category ID: {category._id?.slice(-6)}</p>
                            </div>
                          </div>
                          <div className="category-actions">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                setVisible(true);
                                setUpdatedName(category.name);
                                setSelected(category);
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to delete "${category.name}" category?`
                                  )
                                ) {
                                  handleDelete(category._id);
                                }
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📂</div>
                      <h4>No Categories Found</h4>
                      <p>Create your first category to get started!</p>
                    </div>
                  )}
                </div>

                {/* Edit Modal */}
                <Modal
                  title="Edit Category"
                  open={visible}
                  onCancel={() => setVisible(false)}
                  footer={null}
                  className="category-modal"
                >
                  <form onSubmit={handleUpdate} className="edit-category-form">
                    <div className="form-group">
                      <label htmlFor="editCategoryName">Category Name</label>
                      <input
                        type="text"
                        id="editCategoryName"
                        className="form-control"
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="modal-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setVisible(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Update Category
                      </button>
                    </div>
                  </form>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
