import * as Tabs from "@radix-ui/react-tabs";
import { t } from "i18next";

const CarDetailsTabs = () => {
  return (
    <Tabs.Root
      defaultValue="description"
      className="rounded-xl border py-6 lg:p-6 shadow-sm bg-white w-full"
    >
      <Tabs.List className="flex justify-center w-full bg-transparent border-b border-[#cdcac5] mb-6 pb-6 gap-2 lg:gap-4 overflow-x-auto">
        <Tabs.Trigger
          value="description"
          className="tab-trigger lg:px-4 py-2 text-xs md:text-sm font-bold data-[state=active]:text-black text-gray-500 transition-colors"
        >
          {t("Description")}
        </Tabs.Trigger>
        <Tabs.Trigger
          value="specs"
          className="tab-trigger lg:px-4 py-2 text-xs md:text-sm font-bold data-[state=active]:text-black text-gray-500 transition-colors"
        >
          {t("Specifications")}
        </Tabs.Trigger>
        <Tabs.Trigger
          value="gallery"
          className="tab-trigger lg:px-4 py-2 text-xs md:text-sm font-bold data-[state=active]:text-black text-gray-500 transition-colors"
        >
          {t("Image Gallery")}
        </Tabs.Trigger>
        <Tabs.Trigger
          value="reviews"
          className="tab-trigger lg:px-4 py-2 text-xs md:text-sm font-bold data-[state=active]:text-black text-gray-500 transition-colors"
        >
          {t("Reviews")}
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="description" className="focus-visible:outline-none">
        <div className="w-full p-2">
          <h2 className="text-lg font-semibold mb-4">{t("Description")}</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {t("Lorem ipsum dolor sit amet consectetur. Nec duis dictum vulputate velit ipsum sed. Lectus varius volutpat elit id mauris sollicitudin scelerisque nulla. Quis nulli vulputate duis ante. Quis eget consequat dictum magna ullamcorper tortor ut donec sed. Elit varius nulla senectus tortor donec tellus morbi. Suspendisse ut egestas feugiat justo vulputate.")}
          </p>
          <h3 className="text-base font-bold mb-3">{t("Overview")}</h3>
          <p className="text-gray-700 leading-relaxed">
            {t("Lorem ipsum dolor sit amet consectetur. Nec duis dictum vulputate velit ipsum sed. Lectus varius volutpat elit id mauris sollicitudin scelerisque nulla. Quis nulli vulputate duis ante. Quis eget consequat dictum magna ullamcorper tortor ut donec sed. Elit varius nulla senectus tortor donec tellus morbi. Suspendisse ut egestas feugiat justo vulputate.")}
          </p>
        </div>
      </Tabs.Content>

      <Tabs.Content value="specs" className="focus-visible:outline-none">
        <div className="w-full p-2">
          <h2 className="text-lg font-semibold mb-4">{t("Specifications")}</h2>
          <p className="text-gray-500">{t("No specifications available.")}</p>
        </div>
      </Tabs.Content>

      <Tabs.Content value="gallery" className="focus-visible:outline-none">
        <div className="w-full p-2">
          <h2 className="text-lg font-semibold mb-4">{t("Image Gallery")}</h2>
          <p className="text-gray-500">{t("No images in the gallery.")}</p>
        </div>
      </Tabs.Content>

      <Tabs.Content value="reviews" className="focus-visible:outline-none">
        <div className="w-full p-2">
          <h2 className="text-lg font-semibold mb-4">{t("Reviews")}</h2>
          <p className="text-gray-500">{t("No reviews yet.")}</p>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default CarDetailsTabs;
