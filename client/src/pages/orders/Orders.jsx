import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosFetch } from "../../utils";
import { useRecoilValue } from "recoil";
import { userState } from "../../atoms";
import { Loader } from "../../components";
import "./Orders.scss";

const Orders = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const res = await axiosFetch.get("/orders");
        // Ensure it's an array
        return Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.error("Order fetch failed:", err?.response?.data || err.message);
        return [];
      }
    },
  });

  const handleContact = async (order) => {
    const sellerID = order?.sellerID?._id || order?.sellerID;
    const buyerID = order?.buyerID?._id || order?.buyerID;

    try {
      const { data } = await axiosFetch.get(`/conversations/single/${sellerID}/${buyerID}`);
      navigate(`/message/${data.conversationID}`);
    } catch (err) {
      if (err?.response?.status === 404) {
        try {
          const { data } = await axiosFetch.post("/conversations", {
            to: user.isSeller ? buyerID : sellerID,
            from: user.isSeller ? sellerID : buyerID,
          });
          navigate(`/message/${data.conversationID}`);
        } catch (createErr) {
          console.error("Conversation creation failed:", createErr.message);
        }
      } else {
        console.error("Conversation fetch failed:", err.message);
      }
    }
  };

  return (
    <div className="orders">
      {isLoading ? (
        <div className="loader">
          <Loader />
        </div>
      ) : error ? (
        <div className="error">Something went wrong!</div>
      ) : (
        <div className="container">
          <div className="title">
            <h1>Orders</h1>
          </div>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>{user.isSeller ? "Buyer" : "Seller"}</th>
                <th>Title</th>
                <th>Price</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <img
                        className="img"
                        src={order.image || "/media/default.png"}
                        alt="gig"
                      />
                    </td>
                    <td>
                      {user.isSeller
                        ? order?.buyerID?.username || "Unknown"
                        : order?.sellerID?.username || "Unknown"}
                    </td>
                    <td>{order?.title?.slice(0, 30) || "Untitled"}...</td>
                    <td>
                      {order?.price
                        ? order.price.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          })
                        : "N/A"}
                    </td>
                    <td>
                      <img
                        className="message"
                        src="/media/message.png"
                        alt="message"
                        onClick={() => handleContact(order)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
