import React from "react";
import { useLocation } from "react-router-dom";
import type { CarItem } from "../../context/Data/DataUser";

interface BookingDetails {
  start_date: string;
  end_date: string;
  extras: string[];
  totalPrice: number;
}

const BookingDetails: React.FC = () => {
  const location = useLocation();
  const { carDetails, bookingDetails } = location.state as {
    carDetails: CarItem;
    bookingDetails: BookingDetails;
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="booking-details-container">
      <h2>Your Booking Details</h2>
      
      <div className="car-info">
        <h3>{carDetails.name}</h3>
        <img 
          src={carDetails.image} 
          alt={carDetails.name} 
          className="car-image"
        />
        <p>Brand: {carDetails.brand}</p>
        <p>Type: {carDetails.type}</p>
      </div>

      <div className="booking-info">
        <h3>Booking Information</h3>
        <p>
          <strong>Pick-Up:</strong> {formatDateTime(bookingDetails.start_date)}
        </p>
        <p>
          <strong>Drop-Off:</strong> {formatDateTime(bookingDetails.end_date)}
        </p>
        <p>
          <strong>Location:</strong> Cairo Airport
        </p>
        
        {bookingDetails.extras.length > 0 && (
          <div className="extras-info">
            <h4>Extras:</h4>
            <ul>
              {bookingDetails.extras.includes("driver") && (
                <li>Additional Driver (+$55)</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="price-summary">
        <h3>Price Summary</h3>
        <p>
          <strong>Total Price:</strong> ${bookingDetails.totalPrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default BookingDetails;