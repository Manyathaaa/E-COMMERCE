import { Layout } from "antd";
import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const Products = () => {
  const [products, setProducts] = useState([]);

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/products/get-products"
      );
      console.log("API response:", data);
      setProducts(data.products); // Ensure this matches your backend key (likely "products")
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching products.");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9 d-flex">
          <h1 className="text-center">ALL PRODUCT LIST</h1>

          {products.length === 0 ? (
            <p className="text-center">No products found.</p>
          ) : (
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              {products.map((p) => (
                <Link key={p._id} to={`/dashboard/admin/product/${p.slug}`}>
                  <div className="card" style={{ width: "18rem" }}>
                    <img
                      src={`http://localhost:5000/api/v1/products/product-photo/${p._id}`}
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = "/no-image.png"; // Path to your fallback image
                      }}
                      className="card-img-top"
                      alt={p.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />

                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.description}</p>
                      <p className="card-text fw-bold">₹ {p.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
