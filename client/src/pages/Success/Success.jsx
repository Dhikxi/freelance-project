import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosFetch } from "../../utils";
import { useRecoilValue } from "recoil";
import { userState } from "../../atoms";
import "./Success.scss";

const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");
  const user = useRecoilValue(userState);

  useEffect(() => {
    if (!payment_intent) return;

    (async () => {
      try {
        await axiosFetch.post("/orders/confirm-payment", { payment_intent });

        setTimeout(() => {
          navigate("/orders");
        }, 3000); // Faster redirect
      } catch (err) {
        console.error(err?.response?.data?.message || "Payment confirmation failed");
      }
    })();
  }, [payment_intent, navigate]);

  return (
    <div className="pay-message">
      Payment successful. You are being redirected to the orders page. Please do
      not close the page.
    </div>
  );
};

export default Success;
