import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/prices";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false); // FIX: Added loading state

  // Load all categories
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
      if (data?.success) {
        setCategories(data.category || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Load all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/get-products`
      );
      setProducts(data.products || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);
    }
  };

  // Get total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/product-count`
      );
      setTotal(data?.total || 0);
    } catch (error) {
      console.error("Error fetching total count:", error);
    }
  };
  useEffect(() => {
    if (page === 1) return;
    loadmore();
  }, [page]);
  //loadmore
  const loadmore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Run on first load
  useEffect(() => {
    getAllCategory();
    getAllProducts();
    getTotal();
  }, []);

  // Handle category checkbox toggle
  const handleFilter = (checkedValue, id) => {
    const all = [...checked];
    if (checkedValue) {
      all.push(id);
    } else {
      const index = all.indexOf(id);
      if (index > -1) all.splice(index, 1);
    }
    setChecked(all);
  };

  // Filter products when filters change
  useEffect(() => {
    if (checked.length || selectedPrice !== null) {
      filterProducts();
    }
  }, [checked, selectedPrice]);

  // Fetch filtered products
  const filterProducts = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/products/product-filters`,
        {
          checked,
          selectedPrice,
        }
      );
      setProducts(data?.products || []);
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  };

  return (
    <Layout title="All Products - Best Offer">
      <div className="row mt-3">
        {/* FILTER SIDEBAR */}
        <div className="col-md-2">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>

          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group
              onChange={(e) => setSelectedPrice(e.target.value)}
              value={selectedPrice}
            >
              {Prices?.map((p) => (
                <Radio key={p._id} value={p.array}>
                  {p.name}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </div>

        {/* PRODUCT LISTING */}
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products.map((p) => (
              <div key={p._id} className="card m-2" style={{ width: "18rem" }}>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${p._id}`}
                  alt={p.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/no-image.png";
                  }}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description}</p>
                  <p className="card-text fw-bold">₹ {p.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-3">
            <strong>Total Products: {total}</strong>
          </div>

          <div className="m-2 p-3 text-center">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
