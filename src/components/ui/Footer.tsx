import logo from '../../../public/images/logo.png';
const FooterLinks = [
    {
        id: 1,
        title: 'Product',
        links: ['Features', 'Solutions', 'Releases']
    },
    {
        id: 2,
        title: 'Company',
        links: ['About us', 'Careers', 'News', 'Support', 'Contact']
    },
    {
        id: 3,
        title: 'Social',
        links: ['Facebook', 'Twitter', 'Instagram', 'LinkedIn']
    },
    {
        id: 4,
        title: 'Resources',
        links: ['Blog', 'Help Center', 'Privacy Policy', 'Terms of Service']
    }
];
const Footer: React.FC = () => (
<footer>
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row  justify-between items-start px-4 w-full md:w-[90%]">
    <div className="max-md:w-full flex flex-col items-center md:items-start mb-6 md:mb-0 md:mr-20">
        <img src={logo} alt="XGO Car Rental" className="w-32 mb-2" />
        <p className="text-center text-black text-lg font-normal md:text-left max-w-xs">Stay Connected with us to get new update information</p>
    </div>
    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-center md:text-left">
        {FooterLinks.map((section) => (
            <div key={section.id} className="flex flex-col">
                <h3 className="font-normal text-base text-[#7B7B7B] mb-2">{section.title}</h3>
                <ul className="space-y-1">
                    {section.links.map((link, index) => (
                        <li key={index} className="text-black text-lg font-normal hover:text-orange-500 transition-colors cursor-pointer">
                            {link}
                        </li>
                    ))}
                </ul>
            </div>
        ))}
    </div>
    </div>
    <div className="text-center text-gray-400 text-xs mt-8 mb-8">&copy; {new Date().getFullYear()} Car App. All rights reserved.</div>
</footer>
)

export default Footer 