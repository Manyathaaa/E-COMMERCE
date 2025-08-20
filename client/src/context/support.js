import { useState, useContext, createContext, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const SupportContext = createContext();

const SupportProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  // Create new support ticket
  const createSupportTicket = useCallback(async (ticketData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/support/create`,
        ticketData
      );

      if (data?.success) {
        toast.success("Support ticket created successfully!");
        setCurrentTicket(data.ticket);
        // Add to tickets list
        setTickets((prev) => [data.ticket, ...prev]);
        return { success: true, ticket: data.ticket };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message || "Error creating support ticket";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user support tickets
  const getUserSupportTickets = useCallback(
    async (page = 1, status = "all", category = "all") => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ page });
        if (status !== "all") params.append("status", status);
        if (category !== "all") params.append("category", category);

        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/support/user-tickets?${params}`
        );

        if (data?.success) {
          setTickets(data.tickets);
          return {
            success: true,
            tickets: data.tickets,
            pagination: data.pagination,
          };
        }
        return { success: false, message: data.message };
      } catch (error) {
        console.log(error);
        const message =
          error.response?.data?.message || "Error fetching support tickets";
        toast.error(message);
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get single support ticket
  const getSupportTicket = useCallback(async (ticketId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/support/${ticketId}`
      );

      if (data?.success) {
        setCurrentTicket(data.ticket);
        return { success: true, ticket: data.ticket };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message || "Error fetching support ticket";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Add message to support ticket
  const addMessageToTicket = useCallback(async (ticketId, message) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/support/${ticketId}/message`,
        { message }
      );

      if (data?.success) {
        toast.success("Message sent successfully!");
        setCurrentTicket(data.ticket);
        // Update tickets list
        setTickets((prev) =>
          prev.map((ticket) => (ticket._id === ticketId ? data.ticket : ticket))
        );
        return { success: true, ticket: data.ticket };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message || "Error sending message";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Close support ticket
  const closeSupportTicket = useCallback(async (ticketId, rating, feedback) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/support/${ticketId}/close`,
        { rating, feedback }
      );

      if (data?.success) {
        toast.success("Support ticket closed successfully!");
        setCurrentTicket(data.ticket);
        // Update tickets list
        setTickets((prev) =>
          prev.map((ticket) => (ticket._id === ticketId ? data.ticket : ticket))
        );
        return { success: true, ticket: data.ticket };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message || "Error closing support ticket";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get ticket statistics
  const getTicketStats = useCallback(() => {
    const stats = {
      total: tickets.length,
      open: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
    };

    tickets.forEach((ticket) => {
      switch (ticket.status) {
        case "open":
          stats.open++;
          break;
        case "in-progress":
          stats.inProgress++;
          break;
        case "resolved":
          stats.resolved++;
          break;
        case "closed":
          stats.closed++;
          break;
        default:
          break;
      }
    });

    return stats;
  }, [tickets]);

  // Clear support data on logout
  const clearSupportData = useCallback(() => {
    setTickets([]);
    setCurrentTicket(null);
  }, []);

  // Get priority color
  const getPriorityColor = useCallback((priority) => {
    const colors = {
      low: "success",
      medium: "warning",
      high: "danger",
      urgent: "danger",
    };
    return colors[priority] || "secondary";
  }, []);

  // Get status color
  const getStatusColor = useCallback((status) => {
    const colors = {
      open: "primary",
      "in-progress": "info",
      "waiting-response": "warning",
      resolved: "success",
      closed: "secondary",
    };
    return colors[status] || "secondary";
  }, []);

  // Get category display name
  const getCategoryDisplayName = useCallback((category) => {
    const names = {
      "order-issue": "Order Issue",
      "payment-issue": "Payment Issue",
      "product-inquiry": "Product Inquiry",
      "shipping-issue": "Shipping Issue",
      "return-refund": "Return/Refund",
      "account-issue": "Account Issue",
      "technical-support": "Technical Support",
      "general-inquiry": "General Inquiry",
      complaint: "Complaint",
      suggestion: "Suggestion",
    };
    return names[category] || category;
  }, []);

  return (
    <SupportContext.Provider
      value={{
        tickets,
        currentTicket,
        loading,
        createSupportTicket,
        getUserSupportTickets,
        getSupportTicket,
        addMessageToTicket,
        closeSupportTicket,
        getTicketStats,
        clearSupportData,
        getPriorityColor,
        getStatusColor,
        getCategoryDisplayName,
        setCurrentTicket,
      }}
    >
      {children}
    </SupportContext.Provider>
  );
};

// Custom hook
const useSupport = () => useContext(SupportContext);

export { useSupport, SupportProvider };
