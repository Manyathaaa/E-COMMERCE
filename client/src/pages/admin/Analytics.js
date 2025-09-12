import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { dummyOrders } from "./orders";
import { dummyUsers } from "./user";
import { dummyProducts } from "./createproduct";

const Analytics = () => {
  const totalRevenue = dummyOrders.reduce((sum, o) => sum + o.amount, 0);

  // Prepare order status data for bar chart
  const statusCounts = dummyOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  const orderStatusData = Object.keys(statusCounts).map((status) => ({
    status,
    count: statusCounts[status],
  }));

  // Prepare product category data for pie chart
  const categoryCounts = dummyProducts.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});
  const productCategoryData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: categoryCounts[cat],
  }));
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28CFE",
    "#FEA8C4",
  ];

  return (
    <Layout title="Admin - Analytics">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="mb-4">Analytics Overview</h1>
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Total Orders</h5>
                  <p className="display-6 fw-bold text-primary">
                    {dummyOrders.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Total Revenue</h5>
                  <p className="display-6 fw-bold text-success">
                    ₹{totalRevenue}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Total Products</h5>
                  <p className="display-6 fw-bold text-info">
                    {dummyProducts.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Total Users</h5>
                  <p className="display-6 fw-bold text-warning">
                    {dummyUsers.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status Bar Chart */}
          <div className="mb-5">
            <h4>Order Status Overview</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={orderStatusData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Product Category Pie Chart */}
          <div className="mb-5">
            <h4>Product Category Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productCategoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {productCategoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
