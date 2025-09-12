import React from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";

export const dummyOrders = [
  {
    id: 101,
    customer: "Amit Sharma",
    product: "Nike Air Max",
    amount: 5999,
    status: "Shipped",
    date: "2025-09-10",
  },
  {
    id: 102,
    customer: "Priya Singh",
    product: "Apple Watch",
    amount: 24999,
    status: "Processing",
    date: "2025-09-11",
  },
  {
    id: 103,
    customer: "Rahul Verma",
    product: "Levi's Jeans",
    amount: 1999,
    status: "Delivered",
    date: "2025-09-09",
  },
  {
    id: 104,
    customer: "Sneha Patel",
    product: "Samsung Galaxy S21",
    amount: 69999,
    status: "Cancelled",
    date: "2025-09-08",
  },
  {
    id: 105,
    customer: "Vikas Gupta",
    product: "Adidas T-shirt",
    amount: 999,
    status: "Processing",
    date: "2025-09-12",
  },
  {
    id: 106,
    customer: "Meera Joshi",
    product: "Sony Headphones",
    amount: 4999,
    status: "Delivered",
    date: "2025-09-12",
  },
  {
    id: 107,
    customer: "Rohan Mehta",
    product: "HP Laptop",
    amount: 54999,
    status: "Shipped",
    date: "2025-09-11",
  },
  {
    id: 108,
    customer: "Kavita Rao",
    product: "Canon DSLR",
    amount: 39999,
    status: "Processing",
    date: "2025-09-10",
  },
  {
    id: 109,
    customer: "Suresh Kumar",
    product: "Puma Shoes",
    amount: 2999,
    status: "Delivered",
    date: "2025-09-09",
  },
  {
    id: 110,
    customer: "Anjali Jain",
    product: "JBL Speaker",
    amount: 3499,
    status: "Cancelled",
    date: "2025-09-08",
  },
  {
    id: 111,
    customer: "Deepak Yadav",
    product: "Samsung TV",
    amount: 29999,
    status: "Processing",
    date: "2025-09-12",
  },
  {
    id: 112,
    customer: "Neha Agarwal",
    product: "Apple iPad",
    amount: 34999,
    status: "Shipped",
    date: "2025-09-11",
  },
  {
    id: 113,
    customer: "Manish Tiwari",
    product: "Ray-Ban Sunglasses",
    amount: 7999,
    status: "Delivered",
    date: "2025-09-10",
  },
  {
    id: 114,
    customer: "Pooja Desai",
    product: "Mi Smart Band",
    amount: 1999,
    status: "Processing",
    date: "2025-09-09",
  },
  {
    id: 115,
    customer: "Arjun Kapoor",
    product: "Dell Monitor",
    amount: 10999,
    status: "Delivered",
    date: "2025-09-08",
  },
];

const AdminOrders = () => {
  return (
    <Layout title={"Admin - Orders"}>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="mb-4">All Orders</h1>
          <div className="table-responsive">
            <table className="table table-bordered table-hover bg-white">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount (₹)</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dummyOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.product}</td>
                    <td>{order.amount}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          order.status === "Delivered"
                            ? "success"
                            : order.status === "Cancelled"
                            ? "danger"
                            : "warning"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
