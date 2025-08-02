import { Swiper, SwiperSlide } from 'swiper/react';
import '../../node_modules/swiper/swiper-bundle.css';
import { Autoplay } from 'swiper/modules';
import carCollection from "../assets/image.jpg";
import { useTranslation } from "react-i18next";

const AutoCarousel = () => {
    const { t } = useTranslation();
    const slides = [
        { id: 1, name: t("Own the Thrill - Rent the Drive"), image: carCollection },
        { id: 2, name: t("Own the Thrill - Rent the Drive"), image: carCollection },
        { id: 3, name: t("Own the Thrill - Rent the Drive"), image: carCollection },
    ]
    return (
        <>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                effect={'fade'}
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay]}
                className="mySwiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide>
                        <div key={slide.id} className="swiper-slide relative">
                            <img src={slide.image} alt={slide.name} className="w-full h-screen max-sm:h-[400px] lg:h-[580px] xl:h-[582px] object-cover" loading='lazy' />
                            <h3 className="lg:text-3xl md:text-sm text-xs font-bold text-white absolute bottom-2 left-1/2 -translate-x-1/2">{slide.name}</h3>                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
};

export default AutoCarousel;