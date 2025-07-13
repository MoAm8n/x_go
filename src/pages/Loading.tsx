import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import AutoCarousel from '../components/AutoCarousel';
import WhyChooseCard from '../components/ui/CardLoading';
import { getBrands, getCars } from '../context/Data/DataUser';
import { Loader2, CarFront, Calendar, School, Headset } from 'lucide-react';
import {HowItWork } from '../components/ui';
import appStoreImg from '../../public/images/and app store.png';
import playStoreImg from '../../public/images/app store.png';
const Home = () => {
    const [cars, setCars] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBrand, setSelectedBrand] = useState<number | null>(null);

    useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
        const [brandsData, carsData] = await Promise.all([
            getBrands(),
            getCars(selectedBrand || undefined)
        ]);
            setBrands(brandsData);
            setCars(carsData);
        } catch (err) {
            setError('حدث خطأ أثناء جلب البيانات' + (err ? `: ${String(err)}` : ''));
        } finally {
            setLoading(false);
        }
    };

    fetchData();
    }, [selectedBrand]);

    const handleBrandFilter = (brandId: number | null) => {
    setSelectedBrand(brandId);
    };

    if (loading) {
        return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            <span className="ml-2">جاري تحميل البيانات...</span>
        </div>
        );
    }
    if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
    }
    const dataNeeds = [
        {id: 1, icon: <Calendar size={40} />, title: 'Flexible Dates', description: 'Lorem ipsum dolor sit amet consectetur. Nulla dignissim donec vehicula elit senectus id. Et ultricies diam justo amet purus pharetra amet sit viverra.'},
        {id: 2, icon: <School size={40} />, title: 'Plan Your Trip', description: 'Lorem ipsum dolor sit amet consectetur. Nulla dignissim donec vehicula elit senectus id. Et ultricies diam justo amet purus pharetra amet sit viverra.'},
        {id: 3, icon: <CarFront size={40} />, title: 'Flexible Dates', description: 'Lorem ipsum dolor sit amet consectetur. Nulla dignissim donec vehicula elit senectus id. Et ultricies diam justo amet purus pharetra amet sit viverra.'},
        {id: 4, icon: <Headset size={40} />, title: 'Plan Your Trip', description: 'Lorem ipsum dolor sit amet consectetur. Nulla dignissim donec vehicula elit senectus id. Et ultricies diam justo amet purus pharetra amet sit viverra.'},
    ]
    const AppLinks = [
        {
            id: 1,
            icon: appStoreImg,
            path: 'https://apps.apple.com/app/id1234567890',
            alt: 'Download on the App Store'
        },
        {
            id: 2,
            icon: playStoreImg,
            path: 'https://play.google.com/store/apps/details?id=com.example.app',
            alt: 'Download on Google Play'
        }
    ]
    return (
    <>
        <section>
            <AutoCarousel />
        </section>
        <section>
        <div className="container mx-auto px-6 md:px-12 py-8">
            <div className="text-center mb-8">
                <h1 className="text-[#E6911E] font-semibold text-xl md:text-4xl pb-2 md:pb-4">Collection</h1>
                <h1 className="font-semibold text-xl md:text-4xl">Explore Our Collection Cars</h1>
            </div>
            <div className="flex flex-wrap justify-center md:gap-4 gap-2 items-center">
                <button
                onClick={() => handleBrandFilter(null)}
                className={`flex items-center gap-2 md:p-4 p-2 rounded-lg ${
                    selectedBrand === null 
                        ? 'bg-orange-500 text-white' 
                        : 'border-2 rounded-md'
                }`}
                >
                <span>All Type</span>
                </button>
                {brands.map(brand => (
                <button
                    key={brand.id}
                    onClick={() => handleBrandFilter(brand.id)}
                    className={`flex items-center gap-1 md:p-2 p-2 rounded-lg ${
                    selectedBrand === brand.id 
                        ? 'bg-orange-500 text-white' 
                        : 'border-2 rounded-md'
                    }`}
                >
                    {brand.logo && (
                    <img 
                        src={brand.logo} 
                        alt={brand.name}
                        className="w-4 h-4 md:w-12 md:h-9 object-contain"
                    />
                    )}
                    <span>{brand.name}</span>
                </button>
                ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-2 md:px-10 py-8">
            {cars.length > 0 ? (
                cars.slice(1, 7).map(car => (
                    <>
                    <div key={car.id} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <img 
                    src={car.image || '/placeholder-car.jpg'} 
                    alt={car.name}
                    className="w-full h-44 md:h-48 md:object-cover mb-4 rounded-t-lg"
                    />
                        <div className="p-4">
                            <div className='flex justify-between items-center mb-2 max-md:flex-col'>
                                <h3 className="font-bold text-lg">{car.brand_name} {car.name}</h3>
                                <p className="text-lg">${car.price.toLocaleString()}
                                    <span className="text-sm text-gray-600"> / Day</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </>
                ))
            ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                لا توجد سيارات متاحة للعرض
                </div>
            )}
                <div className="col-span-full flex justify-center">
                    <Link
                        to={'/cartCollection'}
                    >
                        <button
                            className="col-span-fit bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors mt-4"
                            >
                            See All Collection
                        </button>
                    </Link>
                </div>
        </div>
        </div>
        </section>
        <section>
            <div className="container mx-auto px-14 py-8">
                <div className=" flex flex-col mb-8">
                    <h4 className="text-[#E6911E] mb-2 mt-2 tracking-wide text-center font-semibold text-xl md:text-4xl">WHY CHOOSE US</h4>
                    <h2 className="text-center font-semibold text-xl md:text-4xl">
                        Unmatched Quality & Service
                        <br /> For Your Needs
                    </h2>
                </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {dataNeeds.map((item) => (
                    <WhyChooseCard
                        key={item.id}
                        icon={item.icon}
                        title={item.title}
                        description={item.description}
                    />
                ))}
            </div>
            </div>
        </section>
        <section>
            <div className="container mx-auto px-6 md:px-14 py-8">
                <HowItWork />
            </div>
        </section>
        <section>
            <div className='container mx-auto px-6 py-8 flex flex-col items-center justify-center'>
                <div className="sm:w-[90%] md:w-[80%] bg-gradient-to-t from-[#e69220] via-[#f7c26c] to-[#fff8ff] py-8 md:py-12 text-center rounded-3xl px-2 sm:px-6 md:px-12">
                <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center ">
                Download the app. Drive the thrill!                
                </h2>
                <p className="mb-6 md:mb-8 text-center max-w-md mx-auto text-sm md:text-base">
                Lorem ipsum dolor sit amet consectetur. Dictum id faucibus mattis malesuada egestas potenti dui felis mattis. Varius amet ac aliquet quis. Quis a risus sed 
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-xs md:max-w-md m-auto justify-items-center items-center">
                    {AppLinks.map((link) => (
                        <a
                            key={link.id}
                            href={link.path}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={link.icon}
                                alt={link.alt}
                                className="w-48 h-24 object-contain"
                            />
                        </a>
                    ))}
                </div>
            </div>
            </div>
        </section>
    </>
    );
};

export default Home;