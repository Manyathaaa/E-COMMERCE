import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import { toast } from "react-toastify";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState(false);
  const [photo, setPhoto] = useState("");
  const [productId, setProductId] = useState("");

  const getSingleProduct = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/get-product/${params.slug}`
      );
      console.log(data);
      const p = data?.product;
      setName(p.name);
      setDescription(p.description);
      setPrice(p.price);
      setQuantity(p.quantity);
      setCategory(p.category?._id);
      setShipping(p.shipping);
      setProductId(p._id);
    } catch (error) {
      toast.error("Failed to fetch product");
    }
  }, [params.slug]);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getSingleProduct();
    getAllCategory();
  }, [getSingleProduct]);

  const handleUpdate = async () => {
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      photo && productData.append("photo", photo);
      productData.append("category", category);
      productData.append("shipping", shipping);

      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/products/update-product/${productId}`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.success) {
        toast.success("Product updated successfully");
        navigate("/admin/product");
      } else {
        toast.error(data?.message || "Failed to update product");
      }
    } catch (error) {
      toast.error("Something went wrong while updating product");
    }
  };

  return (
    <Layout title={"Dashboard - Update Product"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>
            <div className="m-1 w-75">
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                value={category}
                onChange={(value) => setCategory(value)}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "upload photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>

              <div className="mb-3">
                {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${productId}`}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>

              <input
                type="text"
                value={name}
                placeholder="write a name"
                className="form-control mb-3"
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                value={description}
                placeholder="write a description"
                className="form-control mb-3"
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="number"
                value={price}
                placeholder="write a price"
                className="form-control mb-3"
                onChange={(e) => setPrice(e.target.value)}
              />

              <input
                type="number"
                value={quantity}
                placeholder="write a quantity"
                className="form-control mb-3"
                onChange={(e) => setQuantity(e.target.value)}
              />

              <Select
                bordered={false}
                placeholder="Select Shipping"
                size="large"
                className="form-select mb-3"
                value={shipping ? "1" : "0"}
                onChange={(value) => setShipping(value === "1")}
              >
                <Option value="false">No</Option>
                <Option value="true">Yes</Option>
              </Select>

              <button className="btn btn-primary" onClick={handleUpdate}>
                Update Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
