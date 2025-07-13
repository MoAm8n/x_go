import CardDetailsCard from '../components/ui/CarDetailsCard';
import CarFilterSidebar from '../components/ui/CarFilterSidebar';
import carImg from '../assets/image.jpg';
import { Link } from 'react-router-dom';

const CarCollection = () => {
return (
    <section>
        <div>
            <img
                src={carImg}
                alt="Car Collection"
                className="w-full lg:h-[706px] object-cover" 
                loading='lazy'
            />
        </div>
        <div className="container px-6 py-4">
            <div className='w-full flex flex-row gap-4'>
                <div>
                    <CarFilterSidebar />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-6">
                    <Link
                        to='/car'
                    >
                    <CardDetailsCard
                        image={carImg}
                        name="Luxury Sedan"
                        brand="BMW"
                        seats={5}
                        luggage={3}
                        transmission="Automatic"
                        fuel="Petrol"
                        price={70}
                        currency="$"
                    />
                    </Link>
                </div>
            </div>
        </div>
    </section>
)
}

export default CarCollection