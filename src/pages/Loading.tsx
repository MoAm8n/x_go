import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AutoCarousel from "../components/AutoCarousel";
import WhyChooseCard from "../components/uiUser/CardLoading";
import { getBrands, getCars } from "../context/Data/DataUser";
import { CarFront, Calendar, School, Headset } from "lucide-react";
import { HowItWork } from "../components/uiUser";
import appStoreImg from "../../public/images/and app store.png";
import playStoreImg from "../../public/images/app store.png";
import { useTranslation } from "react-i18next";

const Home = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [brandsData, carsData] = await Promise.all([
          getBrands(),
          getCars(selectedBrand || undefined),
        ]);
        setBrands(brandsData);
        setCars(carsData);
      } catch (err) {
        setError(
          "حدث خطأ أثناء جلب البيانات" + (err ? `: ${String(err)}` : "")
        );
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E6911E]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }
  
  const dataNeeds = [
    {
      id: 1,
      icon: <Calendar size={30} />,
      title: t("Flexible Dates"),
      description:
        t("Lorem ipsum dolor sit amet consectetur. Nulla dignissim donec vehicula elit senectus id. Et ultricies diam justo amet purus pharetra amet sit viverra."),
    },
    {
      id: 2,
      icon: <School size={30} />,
      title: t("Plan Your Trip"),
      description:
        t("Lorem ipsum dolor sit amet consectetur. Nulla dignissim donec vehicula elit senectus id. Et ultricies diam justo amet purus pharetra amet sit viverra."),
    },
    {
      id: 3,
      icon: <CarFront size={30} />,
      title: t("Flexible Dates"),
      description:
        t("Lorem ipsum dolor sit amet consectetur. Nulla dignissim donec vehicula elit senectus id. Et ultricies diam justo amet purus pharetra amet sit viverra."),
    },
    {
      id: 4,
      icon: <Headset size={30} />,
      title: t("Plan Your Trip"),
      description:
        t("Lorem ipsum dolor sit amet consectetur. Nulla dignissim donec vehicula elit senectus id. Et ultricies diam justo amet purus pharetra amet sit viverra."),
    },
  ];
  const AppLinks = [
    {
      id: 1,
      icon: appStoreImg,
      path: "https://apps.apple.com/app/id1234567890",
      alt: t("Download on the App Store"),
    },
    {
      id: 2,
      icon: playStoreImg,
      path: "https://play.google.com/store/apps/details?id=com.example.app",
      alt: t("Download on Google Play"),
    },
  ];
  return (
    <>
      <section id="home">
        <AutoCarousel />
      </section>
      <section id="vehicles">
        <div className="container mx-auto px-6 md:px-12 py-10">
          <div className="text-center mb-8">
            <h1 className="text-[#E6911E] font-semibold text-xl md:text-3xl pb-2 md:pb-4">
              {t("Collection")}
            </h1>
            <h1 className="font-semibold text-xl md:text-4xl">
              {t("Explore Our Collection Cars")}
            </h1>
          </div>
          <div className="flex flex-wrap justify-center md:gap-4 gap-2 items-center">
            <button
              onClick={() => handleBrandFilter(null)}
              className={`flex items-center gap-2 md:p-4 p-2 rounded-lg ${
                selectedBrand === null
                  ? "bg-orange-500 text-white"
                  : "border-2 rounded-md"
              }`}
            >
              <span>{t("All Type")}</span>
            </button>
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => handleBrandFilter(brand.id)}
                className={`flex items-center gap-1 md:p-2 p-2 rounded-lg ${
                  selectedBrand === brand.id
                    ? "bg-orange-500 bg-red text-white"
                    : "border-2 rounded-md"
                }`}
              >
                {brand.logo && (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-4 h-4 md:w-12 md:h-9 object-contain"
                    loading="lazy"
                  />
                )}
                <span>{t(`brand.${brand.name}`)}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-2 md:px-10 py-8">
            {cars.length > 0 ? (
              cars.slice(0, 7).map((car) => (
                <Link key={car.id} to={`/car/${car.id}`}>
                  <div
                    key={car.id}
                    className="border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <img
                      src={car.image || "/placeholder-car.jpg"}
                      alt={car.name}
                      className="w-full h-44 md:h-48 object-cover mb-4 rounded-t-lg"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg">
                              {t(`brand.${car.brand}`)}
                            </h3>
                        <h3 className="font-bold text-lg">
                          {t(`name.${car.name}`)}
                        </h3>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg">
                          {t(car.year)}
                        </h3>
                        <p className="text-lg font-bold text-[#E6911E]">
                          ${t(car.price.toLocaleString())}
                          <span className="text-sm text-gray-600"> / {t("Day")}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {t("No cars available for display")}
              </div>
            )}
            <div className="col-span-full flex justify-center">
              <Link to={"/carCollection"}>
                <button className="col-span-fit bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors mt-4">
                  {t("See All Collection")}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section id="about">
        <div className="container mx-auto px-14 py-8">
          <div className=" flex flex-col mb-8">
            <h4 className="text-[#E6911E] mb-2 mt-2 tracking-wide text-center font-semibold text-xl md:text-3xl">
              {t("WHY CHOOSE US")}
            </h4>
            <h2 className="text-center font-semibold text-xl md:text-4xl">
              {t("Unmatched Quality & Service")}
              <br /> {t("For Your Needs")}
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {dataNeeds.map((item) => (
              <WhyChooseCard
                key={item.id}
                icon={item.icon}
                title={t(item.title)}
                description={t(item.description)}
              />
            ))}
          </div>
        </div>
      </section>
      <section id="how-it-work">
        <div className="container mx-auto px-6 md:px-14 py-8">
          <HowItWork />
        </div>
      </section>
      <section>
        <div className="container mx-auto px-6 py-8 flex flex-col items-center justify-center">
          <div className="sm:w-[90%] md:w-[80%] bg-gradient-to-t from-[#e69220] via-[#f7c26c] to-[#fff8ff] py-8 md:py-12 text-center rounded-3xl px-2 sm:px-6 md:px-12">
            <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center ">
              {t("Download the app. Drive the thrill!")}
            </h2>
            <p className="mb-6 md:mb-8 text-center max-w-md mx-auto text-sm md:text-base">
              {t("Lorem ipsum dolor sit amet consectetur. Dictum id faucibus mattis malesuada egestas potenti dui felis mattis. Varius amet ac aliquet quis. Quis a risus sed")}
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
                    loading="lazy"
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
