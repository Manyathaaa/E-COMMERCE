import { useState, useContext, createContext, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const OrderContext = createContext();

const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderStats, setOrderStats] = useState(null);

  // Create new order
  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/orders/create`,
        orderData
      );

      if (data?.success) {
        toast.success("Order placed successfully!");
        setCurrentOrder(data.order);
        // Clear cart after successful order
        localStorage.removeItem("cart");
        return { success: true, order: data.order };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message || "Error creating order";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Get user orders
  const getUserOrders = useCallback(async (page = 1, status = "all") => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/orders/user-orders?page=${page}&status=${status}`
      );

      if (data?.success) {
        setOrders(data.orders);
        return {
          success: true,
          orders: data.orders,
          pagination: data.pagination,
        };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message || "Error fetching orders";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single order
  const getOrder = useCallback(async (orderId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/orders/${orderId}`
      );

      if (data?.success) {
        setCurrentOrder(data.order);
        return { success: true, order: data.order };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message || "Error fetching order";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel order
  const cancelOrder = useCallback(async (orderId, reason) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/orders/${orderId}/cancel`,
        { reason }
      );

      if (data?.success) {
        toast.success("Order cancelled successfully!");
        // Update orders list
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? data.order : order
          )
        );
        // Update current order if it's the same
        if (currentOrder?._id === orderId) {
          setCurrentOrder(data.order);
        }
        return { success: true, order: data.order };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message || "Error cancelling order";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [currentOrder]);

  // Track order status
  const trackOrder = (orderId) => {
    const order = orders.find((o) => o._id === orderId) || currentOrder;
    if (!order) return null;

    const statusSteps = [
      { key: "pending", label: "Order Placed", icon: "📋" },
      { key: "confirmed", label: "Order Confirmed", icon: "✅" },
      { key: "processing", label: "Processing", icon: "📦" },
      { key: "shipped", label: "Shipped", icon: "🚚" },
      { key: "out-for-delivery", label: "Out for Delivery", icon: "🏃" },
      { key: "delivered", label: "Delivered", icon: "🎉" },
    ];

    const currentStatusIndex = statusSteps.findIndex(
      (step) => step.key === order.status
    );

    return {
      order,
      statusSteps: statusSteps.map((step, index) => ({
        ...step,
        completed: index <= currentStatusIndex,
        current: index === currentStatusIndex,
      })),
      trackingInfo: order.tracking,
      statusHistory: order.statusHistory,
    };
  };

  // Get order summary for user dashboard
  const getOrderSummary = () => {
    const summary = {
      total: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalSpent: 0,
    };

    orders.forEach((order) => {
      summary[order.status] = (summary[order.status] || 0) + 1;
      if (order.status !== "cancelled") {
        summary.totalSpent += order.orderSummary.total;
      }
    });

    return summary;
  };

  // Admin functions
  const getAllOrders = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        ...filters,
      });

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/orders/admin/all-orders?${queryParams}`
      );

      if (data?.success) {
        return {
          success: true,
          orders: data.orders,
          pagination: data.pagination,
          stats: data.stats,
        };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message || "Error fetching orders";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, statusData) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/orders/admin/${orderId}/status`,
        statusData
      );

      if (data?.success) {
        toast.success("Order status updated successfully!");
        return { success: true, order: data.order };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message || "Error updating order status";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const getOrderStats = async (period = "week") => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/orders/admin/stats?period=${period}`
      );

      if (data?.success) {
        setOrderStats(data.stats);
        return {
          success: true,
          stats: data.stats,
          topProducts: data.topProducts,
        };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message || "Error fetching order statistics";
      return { success: false, message };
    }
  };

  // Clear orders on logout
  const clearOrders = () => {
    setOrders([]);
    setCurrentOrder(null);
    setOrderStats(null);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        orderStats,
        createOrder,
        getUserOrders,
        getOrder,
        cancelOrder,
        trackOrder,
        getOrderSummary,
        getAllOrders,
        updateOrderStatus,
        getOrderStats,
        clearOrders,
        setCurrentOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook
const useOrder = () => useContext(OrderContext);

export { useOrder, OrderProvider };
