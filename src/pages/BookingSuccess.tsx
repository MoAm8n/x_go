import React from "react";
import { useLocation } from "react-router-dom";
import type { CarItem } from "../context/Data/DataUser";

interface BookingDetails {
  start_date: string;
  end_date: string;
  extras: string[];
  totalPrice: number;
}

const BookingSuccess: React.FC = () => {
  const location = useLocation();
  const { carDetails, bookingDetails } = location.state as {
    carDetails: CarItem;
    bookingDetails: BookingDetails;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="booking-success">
      <div className="success-message">
        <h2>Thank you for your booking!</h2>
        <p>Your reservation has been confirmed.</p>
      </div>

      <div className="booking-summary">
        <h3>Booking Summary</h3>
        <div className="car-info">
          <img src={carDetails.image} alt={carDetails.name} loading="lazy"/>
          <h4>{carDetails.name}</h4>
          <p>{carDetails.brand} - {carDetails.type}</p>

        </div>

        <div className="timing-info">
          <div className="pickup-info">
            <h4>Pick-Up</h4>
            <p>{formatDate(bookingDetails.start_date)}</p>
            <p>{formatTime(bookingDetails.start_date)}</p>
            <p>Cairo Airport</p>
          </div>

          <div className="dropoff-info">
            <h4>Drop-Off</h4>
            <p>{formatDate(bookingDetails.end_date)}</p>
            <p>{formatTime(bookingDetails.end_date)}</p>
            <p>Cairo Airport</p>
          </div>
        </div>

        <div className="extras-info">
          <h4>Extras</h4>
          {bookingDetails.extras.length > 0 ? (
            <ul>
              {bookingDetails.extras.includes("driver") && (
                <li>Additional Driver</li>
              )}
            </ul>
          ) : (
            <p>No extras selected</p>
          )}
        </div>

        <div className="price-info">
          <h4>Total Price</h4>
          <p>${bookingDetails.totalPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="next-steps">
        <h3>Next Steps</h3>
        <p>You will receive a confirmation email with all the details.</p>
        <button onClick={() => window.print()}>Print Confirmation</button>
      </div>
    </div>
  );
};

export default BookingSuccess;