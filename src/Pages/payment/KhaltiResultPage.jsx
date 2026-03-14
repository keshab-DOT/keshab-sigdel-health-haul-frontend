// KhaltiResultPage.jsx
// Route: /payment/result
// Khalti redirects here with ?pidx=...&status=Completed&...
// Place at: src/Pages/payment/KhaltiResultPage.jsx

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function KhaltiResultPage() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();

  const pidx      = searchParams.get("pidx");
  const urlStatus = searchParams.get("status"); // Khalti passes "Completed" etc.

  const [state,   setState]   = useState("verifying"); // verifying | success | failed | noToken
  const [order,   setOrder]   = useState(null);
  const [txnId,   setTxnId]   = useState("");
  const [error,   setError]   = useState("");

  const verify = useCallback(async () => {
    if (!pidx) { setState("noToken"); return; }
    setState("verifying");
    try {
      const { data } = await api.post("/payment/khalti/verify", { pidx });
      setOrder(data.order);
      setTxnId(data.transactionId || "");
      setState(data.status === "Completed" ? "success" : "failed");
    } catch (err) {
      setError(err?.response?.data?.message || "Verification failed. Please contact support.");
      setState("failed");
    }
  }, [pidx]);

  useEffect(() => { verify(); }, [verify]);

  const iconBg = { verifying: "bg-gray-100", success: "bg-green-100", failed: "bg-red-100", noToken: "bg-amber-100" }[state];
  const icon   = { verifying: null, success: "✓", failed: "✕", noToken: "⚠️" }[state];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden">

        {/* Top section */}
        <div className={`px-8 pt-10 pb-6 text-center ${state === "success" ? "bg-gradient-to-br from-green-50 to-emerald-50" : state === "failed" ? "bg-red-50" : "bg-gray-50"}`}>

          {/* Icon / spinner */}
          <div className={`w-16 h-16 rounded-full ${iconBg} flex items-center justify-center mx-auto mb-4`}>
            {state === "verifying"
              ? <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" style={{borderWidth: "3px"}}/>
              : <span className="text-2xl font-black">{icon}</span>
            }
          </div>

          {state === "verifying" && (
            <>
              <h2 className="text-[20px] font-black text-gray-900">Verifying Payment…</h2>
              <p className="text-[13px] text-gray-400 mt-1">Confirming your payment with Khalti.</p>
            </>
          )}
          {state === "success" && (
            <>
              <h2 className="text-[22px] font-black text-gray-900">Payment Successful! 🎉</h2>
              <p className="text-[13px] text-gray-500 mt-1">Your order has been confirmed and is now pending.</p>
            </>
          )}
          {state === "failed" && (
            <>
              <h2 className="text-[22px] font-black text-gray-900">Payment Failed</h2>
              <p className="text-[13px] text-gray-400 mt-1">{error || "Your payment could not be verified."}</p>
            </>
          )}
          {state === "noToken" && (
            <>
              <h2 className="text-[20px] font-black text-gray-900">Invalid Link</h2>
              <p className="text-[13px] text-gray-400 mt-1">No payment token found in the URL.</p>
            </>
          )}
        </div>

        {/* Order summary */}
        {order && state === "success" && (
          <div className="px-8 py-5 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-400 font-medium">Order ID</span>
              <span className="font-mono font-bold text-gray-700">#{String(order._id).slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-400 font-medium">Amount Paid</span>
              <span className="font-black text-green-600">Rs. {Number(order.totalAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-400 font-medium">Payment Method</span>
              <span className="font-bold text-[#5C2D8B]">Khalti </span>
            </div>
            {txnId && (
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-400 font-medium">Transaction ID</span>
                <span className="font-mono text-[12px] text-gray-600">{txnId}</span>
              </div>
            )}
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-400 font-medium">Delivery to</span>
              <span className="font-semibold text-gray-700 text-right max-w-[200px]">{order.shippingAddress}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-400 font-medium">Status</span>
              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                ⏳ Pending Delivery
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-8 pb-8 pt-3 flex flex-col gap-2.5">
          {state === "success" && (
            <button
              onClick={() => navigate("/user/orders")}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-[14px] py-3.5 rounded-2xl transition shadow-sm">
              View My Orders →
            </button>
          )}
          {state === "failed" && (
            <button onClick={verify}
              className="w-full bg-[#5C2D8B] hover:bg-[#4a2470] text-white font-black text-[14px] py-3.5 rounded-2xl transition">
              Retry Verification
            </button>
          )}
          <button onClick={() => navigate("/user/cart")}
            className="w-full border border-gray-200 text-gray-500 hover:bg-gray-50 font-bold text-[13px] py-3 rounded-2xl transition">
            Back to Cart
          </button>
        </div>

      </div>
    </div>
  );
}