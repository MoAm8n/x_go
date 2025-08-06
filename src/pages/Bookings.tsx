import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getBookingList } from '../context/Data/DataUser';
import { BookingStepper, BookingCard, BookingDetails } from '../components/uiUser';
import { FaMoneyBillAlt } from 'react-icons/fa';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface Rating {
  average_rating: string;
  ratings_count: number;
}

export interface Brand {
  brand_id: number;
  brand_name: string;
}

export interface ModelName {
  model_name_id: string;
  model_name: string;
}

export interface Type {
  type_id: string;
  type_name: string;
}

export interface CarAttributes {
  year: string;
  price: string;
  engine_type: string;
  transmission_type: string;
  seat_type: string;
  seats_count: number;
  acceleration: string;
  image?: string;
}

export interface CarRelationships {
  "Model Names": ModelName;
  Types: Type;
  Brand: Brand;
  Ratings: Rating;
}

export interface CarModel {
  id: string;
  attributes: CarAttributes;
  relationship: CarRelationships;
}

export interface BookingItem {
  id: number;
  start_date: string;
  end_date: string;
  final_price: string;
  status: string;
  additional_driver: number;
  car_model: CarModel;
  user?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        if (parsedUser?.id) {
          const loadData = async () => {
            try {
              setLoading(true);
              const bookingData = await getBookingList();
              setBookings(bookingData);
              
              if (id) {
                const foundBooking = bookingData.find(b => b.id === parseInt(id));
                if (foundBooking) {
                  setSelectedBooking(foundBooking);
                } else {
                  navigate('/bookings', { replace: true });
                }
              }
            } catch (err) {
              console.error('Error:', err);
              setError('You have no bookings');
            } finally {
              setLoading(false);
            }
          };
          
          loadData();
        }
      } catch (err) {
        console.error('Failed to parse user data', err);
        navigate('/signin');
      }
    } else {
      navigate('/signin');
    }
  }, [navigate, id]);

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toLocaleDateString('ar-SA', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'تاريخ غير محدد';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewDetails = (booking: BookingItem) => {
    setSelectedBooking(booking);
    navigate(`/bookings/${booking.id}`);
  };

  const handleBackToList = () => {
    setSelectedBooking(null);
    navigate('/bookings');
  };

  const handlePayment = (bookingId: number) => {
    navigate(`/bookings/${bookingId}/payment`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E6911E] mb-4"></div>
      </div>
    );
  }

return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="container mx-auto px-4 py-10">
        {!id ? (
          <>
            {bookings.length === 0 ? (
              <div className="text-center py-32">
                <div className="p-4 text-center text-red-500">
                  {error}
                  <div className="mt-4 flex gap-4 justify-center">
                    <button 
                      onClick={() => window.location.reload()}
                      className="bg-[#929292] text-white px-4 py-2 rounded-lg"
                    >
                      Reload
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="bg-[#E6911E] text-white px-6 py-2 rounded-lg"
                      aria-label="تصفح السيارات"
                    >
                      Browse cars
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <BookingStepper currentStep={2} />
                <h1 className="text-2xl font-bold my-6">My Bookings</h1>
              <div className='flex flex-col lg:flex-row gap-8'>
                <div className="grid gap-6 w-full lg:w-1/2">
                  {bookings.map((booking) => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      onViewDetails={handleViewDetails}
                      onPayment={handlePayment}
                    />
                  ))}
                </div>
                <div className="w-full lg:w-1/2">
                  <div className="bg-white shadow-md hover:shadow-lg transition-shadow p-6 rounded-lg">
                    {user ? (
                      <>
                        <h1 className='text-2xl text-gray-800 mb-5 text-center'>Welcome {user.name}</h1>
                        <div className='my-4'>
                            <button 
                                onClick={() => handlePayment(bookings[0].id)}  
                                className='bg-[#E6911E] hover:bg-[#D58217] text-white w-full h-10 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-70'
                            >
                              <FaMoneyBillAlt /> 
                              Pay for booking
                            </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h1>Booking requires an account — log in or create one to continue</h1>
                        <div className='flex flex-col gap-4 my-4'>
                          <Link to={'/signUp'}>
                            <button className='bg-[#E6911E] text-white w-full h-10'>
                              Sign Up
                            </button>
                          </Link>
                          <Link to={'/signIn'}>
                            <button className='bg-[#E6911E] text-white w-full h-10'>
                              Sign In
                            </button>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="terms-conditions my-4 p-4 bg-white rounded-lg shadow-lg">
                    <h1 className="text-xl font-bold mb-4">Terms and Conditions</h1>
                      <div className="payment-terms">
                        <h3 className="font-semibold mb-2">Payments</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li className="text-gray-700">
                            Lorem ipsum dolor sit amet consectetur. Mattis vestibulum nunc mattis aliquam arcu sed. 
                            Diam in nisl maecenas sed lacus sit ligula. Id nulla felis pulvinar sed eu vel proin ultricies elementum. 
                            Id odio ultrices sed arcu velit condimentum at purus duis. Morbi arcu sed mauris.
                          </li>
                          <li className="text-gray-700">
                            Lorem ipsum dolor sit amet consectetur. Mattis vestibulum nunc mattis aliquam arcu sed. 
                            Diam in nisl maecenas sed lacus sit ligula. Id nulla felis pulvinar sed eu vel proin ultricies elementum. 
                            Id odio ultrices sed arcu velit condimentum at purus duis. Morbi arcu sed mauris.
                          </li>
                        </ul>
                        <h3 className="font-semibold mb-2">Contact Us</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li className="text-gray-700">
                            Lorem ipsum dolor sit amet consectetur. Mattis vestibulum nunc mattis aliquam arcu sed. 
                            Diam in nisl maecenas sed lacus sit ligula. Id nulla felis pulvinar sed eu vel proin ultricies elementum. 
                            Id odio ultrices sed arcu velit condimentum at purus duis. Morbi arcu sed mauris.
                          </li>
                        </ul>
                     </div>                   
                  </div>
                </div>
              </div>
              </>
            )}
          </>
        ) : (
          selectedBooking && <BookingDetails 
            booking={selectedBooking} 
            onBack={handleBackToList} 
          />
        )}
      </main>
    </div>
  );
};

export default BookingsPage;