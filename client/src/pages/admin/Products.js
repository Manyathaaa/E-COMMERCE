import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2 } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  //getall products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <AdminLayout title={"All Products - Admin"}>
      <div className="ent-card">
        <div className="chart-header">
          <h3 className="chart-title">Products Management</h3>
          <Link to="/admin/create-product" className="ent-btn">
            <Plus size={18} /> Add Product
          </Link>
        </div>

        {loading ? (
          <div className="text-center p-5">
            <i className="fas fa-spinner fa-spin fa-2x"></i>
            <p className="mt-2">Loading Products...</p>
          </div>
        ) : (
          <div className="ent-table-container">
            <table className="ent-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price & Discount</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={p.images?.[0] || p.photoUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"}
                          alt={p.name} 
                          style={{ width: 48, height: 48, borderRadius: '8px', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop" }}
                        />
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--admin-text-main)' }}>
                            {p.name.length > 40 ? p.name.substring(0, 40) + "..." : p.name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                            {p.description.substring(0, 30)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge status-info">
                        {p.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td>
                      {p.discount > 0 ? (
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--status-danger-text)' }}>
                            ₹{(p.price - (p.price * p.discount / 100)).toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '12px', textDecoration: 'line-through', color: 'var(--admin-text-secondary)' }}>
                            ₹{p.price.toLocaleString('en-IN')} ({p.discount}% OFF)
                          </div>
                        </div>
                      ) : (
                        <div style={{ fontWeight: '600' }}>
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td>
                      {p.quantity > 0 ? (
                        <span style={{ color: 'var(--status-success-text)', fontWeight: '600' }}>{p.quantity} in stock</span>
                      ) : (
                        <span style={{ color: 'var(--status-danger-text)', fontWeight: '600' }}>Out of stock</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/admin/product/${p.slug}`} className="action-btn">
                          <Edit2 size={16} />
                        </Link>
                        {/* Delete would normally be a separate handler, visually mimicking here */}
                        <button className="action-btn delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Products;
