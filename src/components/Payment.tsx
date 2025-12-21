import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { CreditCard, Lock, CheckCircle, ArrowLeft } from "lucide-react";

interface PaymentDetails {
  rentalId: string;
  carMake: string;
  carModel: string;
  carYear: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  dailyRate: number;
  days: number;
}

export function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Dummy form data
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  useEffect(() => {
    const rentalId = searchParams.get("rental");
    if (rentalId) {
      fetchRentalDetails(rentalId);
    } else {
      navigate("/my-rentals");
    }
  }, [searchParams, navigate]);

  async function fetchRentalDetails(rentalId: string) {
    try {
      const { data, error } = await supabase
        .from("rentals")
        .select(
          `
          id,
          start_date,
          end_date,
          total_price,
          cars (
            make,
            model,
            year,
            daily_rate
          )
        `
        )
        .eq("id", rentalId)
        .single();

      if (error) throw error;

      if (data && data.cars) {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        const days = Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        setPaymentDetails({
          rentalId: data.id,
          carMake: data.cars.make,
          carModel: data.cars.model,
          carYear: data.cars.year,
          startDate: data.start_date,
          endDate: data.end_date,
          totalPrice: data.total_price,
          dailyRate: data.cars.daily_rate,
          days: days,
        });
      }
    } catch (error) {
      console.error("Error fetching rental details:", error);
      navigate("/my-rentals");
    } finally {
      setLoading(false);
    }
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    if (!paymentDetails) return;

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update rental status to "approved" (simulating successful payment)
      const { error } = await supabase
        .from("rentals")
        .update({ status: "approved" })
        .eq("id", paymentDetails.rentalId);

      if (error) throw error;

      // Redirect to success page
      navigate(`/payment-success?rental=${paymentDetails.rentalId}`);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-indigo-600 font-medium">
          Loading payment details...
        </p>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900">
          Payment details not found
        </h2>
        <button
          type="button"
          onClick={() => navigate("/my-rentals")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to My Rentals
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/my-rentals")}
          className="flex items-center text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Rentals
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Lock className="h-6 w-6 text-green-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <CreditCard className="h-4 w-4 mr-2" />
                  Credit/Debit Card
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  UPI Payment
                </label>
              </div>
            </div>

            {paymentMethod === "card" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </>
            )}

            {paymentMethod === "upi" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  placeholder="yourname@paytm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {processing ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </span>
              ) : (
                `Pay ₹${paymentDetails.totalPrice}`
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Booking Summary
          </h3>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900">
                {paymentDetails.carYear} {paymentDetails.carMake}{" "}
                {paymentDetails.carModel}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(paymentDetails.startDate).toLocaleDateString()} -{" "}
                {new Date(paymentDetails.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                {paymentDetails.days} day{paymentDetails.days !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Daily Rate</span>
                <span>₹{paymentDetails.dailyRate}</span>
              </div>
              <div className="flex justify-between">
                <span>Number of Days</span>
                <span>{paymentDetails.days}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{paymentDetails.dailyRate * paymentDetails.days}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>₹0</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{paymentDetails.totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-green-700">
                Free cancellation up to 24 hours before pickup
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
