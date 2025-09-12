import React from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";

export const dummyUsers = [
  {
    id: 1,
    name: "Amit Sharma",
    email: "amit@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 3,
    name: "Rahul Verma",
    email: "rahul@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Sneha Patel",
    email: "sneha@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 5,
    name: "Vikas Gupta",
    email: "vikas@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 6,
    name: "Meera Joshi",
    email: "meera@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 7,
    name: "Arjun Rao",
    email: "arjun@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 8,
    name: "Kavita Mehta",
    email: "kavita@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 9,
    name: "Rohan Das",
    email: "rohan@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 10,
    name: "Simran Kaur",
    email: "simran@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 11,
    name: "Deepak Yadav",
    email: "deepak@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 12,
    name: "Anjali Nair",
    email: "anjali@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 13,
    name: "Mohit Sinha",
    email: "mohit@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 14,
    name: "Tanya Roy",
    email: "tanya@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 15,
    name: "Suresh Kumar",
    email: "suresh@example.com",
    role: "User",
    status: "Inactive",
  },
];

const User = () => {
  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="mb-4">All Users</h1>
          <div className="table-responsive">
            <table className="table table-bordered table-hover bg-white">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dummyUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          user.status === "Active" ? "success" : "danger"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
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

export default User;
