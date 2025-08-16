import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout/Layout";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/category/get-category`
        );
        console.log(data);
        setCategories(data.category || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Layout>
      <div className="container py-4">
        <h2 className="text-center mb-4">Categories</h2>
        <div className="row justify-content-center">
          {categories.length === 0 ? (
            <p>No categories found.</p>
          ) : (
            categories.map((cat) => (
              <div key={cat._id} className="col-md-3 mb-3">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <h5 className="card-title">{cat.name}</h5>
                    <p className="card-text">{cat.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
