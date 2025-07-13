import * as Tabs from "@radix-ui/react-tabs";

const CarDetailsTabs = () => {
  return (
    <Tabs.Root
      defaultValue="description"
      className="w-[90%] max-w-3xl min-w-[350px] rounded-xl border p-6 shadow-sm bg-white transition-all duration-300 mx-auto"
      style={{ borderColor: '#cdcac5', minHeight: '350px' }}
    >
      <Tabs.List className="grid w-full grid-cols-4 bg-transparent border-b mb-6 pb-6" style={{ borderColor: '#cdcac5' }}>
        <Tabs.Trigger value="description" className="tab-trigger">Description</Tabs.Trigger>
        <Tabs.Trigger value="specs" className="tab-trigger">Specifications</Tabs.Trigger>
        <Tabs.Trigger value="gallery" className="tab-trigger">Image Gallery</Tabs.Trigger>
        <Tabs.Trigger value="reviews" className="tab-trigger">Reviews</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="description">
        <div className="w-full">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Lorem ipsum dolor sit amet consectetur. Nec duis dictum vulputate velit ipsum sed. Lectus varius volutpat elit id mauris sollicitudin scelerisque nulla. Quis nulli vulputate duis ante. Quis eget consequat dictum magna ullamcorper tortor ut donec sed. Elit varius nulla senectus tortor donec tellus morbi. Suspendisse ut egestas feugiat justo vulputate.
          </p>
          <h3 className="text-base font-bold mb-2">Overview</h3>
          <p className="text-gray-700 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Congue duis eu tortor libero. Nunc vestibulum neque mi enim eu vestibulum. Tempor sit pellentesque lobortis fermentum magna. Senectus purus enim scelerisque viverra sit vitae semper adipiscing. Faucibus mi varius potenti et sit. Morbi erat gravida lectus ultricies ac sit. Nisi euismod cursus tellus adipiscing pharetra libero cursus. Tortor nullam porttitor egestas consectetur. A nunc neque malesuada sagittis eget egestas sagittis egestas. Sed urna quam venenatis tristique scelerisque morbi gravida morbi vulputate. Feugiat fringilla vestibulum sagittis fermentum ac. Vestibulum egestas nunc in aenean justo in fermentum enim eu. Accumsan tincidunt facilisis sit amet amet placerat eros. Volutpat viverra hac sit nisl ridiculus lorem scelerisque risus.
          </p>
        </div>
      </Tabs.Content>

      <Tabs.Content value="specs">
        <div className="text-gray-500 w-full">No specifications available.</div>
      </Tabs.Content>

      <Tabs.Content value="gallery">
        <div className="text-gray-500 w-full">No images in the gallery.</div>
      </Tabs.Content>

      <Tabs.Content value="reviews">
        <div className="text-gray-500 w-full">No reviews yet.</div>
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default CarDetailsTabs; 