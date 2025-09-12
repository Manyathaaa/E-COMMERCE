import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import { toast } from "react-toastify";
import { Select } from "antd";
const { Option } = Select;

const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState(false);
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleCreate = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !name.trim() ||
      !description.trim() ||
      !price ||
      !quantity ||
      !category
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    if (name.length > 100) {
      toast.error("Product name must be under 100 characters");
      return;
    }
    if (description.length > 1000) {
      toast.error("Description must be under 1000 characters");
      return;
    }
    if (isNaN(price) || Number(price) <= 0) {
      toast.error("Price must be a positive number");
      return;
    }
    if (isNaN(quantity) || Number(quantity) < 0) {
      toast.error("Quantity must be zero or positive");
      return;
    }
    if (!photo) {
      toast.error("Please select a product image");
      return;
    }

    try {
      setLoading(true);
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("category", category);
      productData.append("shipping", shipping);
      productData.append("photo", photo);

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/products/create-product`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.success) {
        toast.success("Product created successfully! 🎉");
        // Reset form
        setName("");
        setDescription("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setShipping(false);
        setPhoto("");
        document.getElementById("photoInput").value = "";
      } else {
        toast.error(data?.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error in product creation:", error);
      toast.error("Something went wrong creating the product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Create Product - Admin">
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
                  <h1>Create New Product</h1>
                  <p>Add a new product to your store inventory</p>
                </div>

                {/* Product Form */}
                <div className="create-product-card">
                  <form onSubmit={handleCreate} className="product-form">
                    {/* Image Upload */}
                    <div className="form-section">
                      <h3>Product Image</h3>
                      <div className="image-upload-area">
                        {photo ? (
                          <div className="image-preview">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt="Product preview"
                              className="preview-image"
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger remove-image"
                              onClick={() => {
                                setPhoto("");
                                document.getElementById("photoInput").value =
                                  "";
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : null}
                        <input
                          type="file"
                          id="photoInput"
                          name="photo"
                          accept="image/*"
                          onChange={(e) => setPhoto(e.target.files[0])}
                          className="file-input"
                          hidden
                        />
                        <label htmlFor="photoInput" className="upload-label">
                          {photo ? "Change Image" : "Upload Image"}
                        </label>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="form-section">
                      <h3>Basic Information</h3>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="productName">Product Name *</label>
                            <input
                              type="text"
                              id="productName"
                              className="form-control"
                              placeholder="Enter product name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <Select
                              id="category"
                              placeholder="Select a category"
                              size="large"
                              showSearch
                              className="form-select"
                              onChange={(value) => setCategory(value)}
                              value={category}
                            >
                              {categories?.map((c) => (
                                <Option key={c._id} value={c._id}>
                                  {c.name}
                                </Option>
                              ))}
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                          id="description"
                          className="form-control"
                          rows="4"
                          placeholder="Enter product description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="form-section">
                      <h3>Pricing & Inventory</h3>
                      <div className="row">
                        <div className="col-md-4">
                          <div className="form-group">
                            <label htmlFor="price">Price (₹) *</label>
                            <input
                              type="number"
                              id="price"
                              className="form-control"
                              placeholder="0.00"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label htmlFor="quantity">Quantity *</label>
                            <input
                              type="number"
                              id="quantity"
                              className="form-control"
                              placeholder="0"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              min="0"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label htmlFor="shipping">Shipping Available</label>
                            <Select
                              id="shipping"
                              placeholder="Select shipping option"
                              size="large"
                              className="form-select"
                              onChange={(value) => setShipping(value === "1")}
                              value={shipping ? "1" : "0"}
                            >
                              <Option value="0">No</Option>
                              <Option value="1">Yes</Option>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setName("");
                          setDescription("");
                          setPrice("");
                          setQuantity("");
                          setCategory("");
                          setShipping(false);
                          setPhoto("");
                          document.getElementById("photoInput").value = "";
                        }}
                      >
                        Reset Form
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Creating Product...
                          </>
                        ) : (
                          "✓ Create Product"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="form-group mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              aria-disabled={loading}
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
