import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
// import { FaSearch } from "react-icons/fa"
import { useSelector } from 'react-redux';
import Logo from '../assets/store.png';
import UserProfile from "../assets/Profile.png";
import { FaBookOpen } from 'react-icons/fa6';
import { FaSignInAlt } from 'react-icons/fa';
import { IoPricetags, IoTicket } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";
import { BiSolidDetail } from 'react-icons/bi';

export default function Header() {

    const { currentUser } = useSelector((state) => state.user)
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle the sidebar
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Function to close sidebar
    const closeSidebar = () => {
        setIsOpen(false);
    };

    // Close sidebar when clicking outside the sidebar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest(".sidebar")) {
                closeSidebar();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);



    return (
        <header className='relative bg-blue-600 shadow-md p-4 z-50 '>
            <div className='flex justify-between items-center max-w-6xl mx-auto '>
                <Link to='/' className='flex items-center justify-center gap-1'>
                    <img src={Logo} className='w-8 sm:w-10' alt="Logo" />
                    <h1 className='font-bold text-sm sm:text-xl flex mt-2'>

                        <span className='text-blue-600 bg-white px-2 rounded-2xl'>OfflineGO</span>
                        {/* <span className='text-blue-500 bg-white px-2 rounded-2xl'>Zuper</span> */}

                    </h1>
                </Link>

                {/* {locations ? " " : (
                <form onSubmit={handleSearchSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
                    <input 
                    type="text" 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
                    <button type="submit">
                    <FaSearch  className='text-slate-600 cursor-pointer' />
                    </button>
                </form>
                )} */}

                <ul className='hidden md:flex items-center text-white font-semibold transition gap-4'>
                    <Link to="/"><li>
                        Home
                    </li></Link>
                    <Link to="/price-user"><li >
                        Pricing
                    </li></Link>
                    <Link to="/"><li> About</li></Link>

                    {currentUser && currentUser.isAdmin && <Link to="/learn-earn"><li > Learn</li></Link>}
                    <Link to="/user-coupons"><li > Coupens</li></Link>


                    <Link to='/profile'>
                        {currentUser && currentUser._id ? (


                            currentUser.imageUrl ? <img className='rounded-full border-2 border-white h-8 w-8 object-cover' src={currentUser.imageUrl} alt='profile_img' /> : (<img className='rounded-full  border-2 border-white h-8 w-8 object-cover' src={UserProfile} alt='profile_img' />)
                        ) : (<li >Sign In</li>)}
                    </Link>
                </ul>

                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden bg-gray-800 text-white px-3 py-2 rounded"
                >
                    ☰
                </button>

                {/* Sidebar */}
                <div
                    className={`md:hidden fixed top-0 right-0 w-3/5 md:w-2/5 h-full bg-gray-900 opacity-95 text-white p-5 transition-transform duration-300 ease-in-out sidebar ${isOpen ? "translate-x-0" : "translate-x-full "
                        }`}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeSidebar}
                        className="absolute top-3 right-3 text-2xl"
                    >
                        ✖
                    </button>

                    {/* Sidebar Links */}
                    <nav className="mt-8 flex flex-col gap-4">
                        <a href="/" onClick={closeSidebar} className="hover:text-gray-400 border-b-2 border-white py-2 flex items-center gap-2"><IoMdHome />Home</a>
                        <a href="/price-user" onClick={closeSidebar} className="hover:text-gray-400  border-b-2 border-white py-2 flex items-center gap-2"><IoPricetags />Pricing</a>
                        <a href="/" onClick={closeSidebar} className="hover:text-gray-400 border-b-2 border-white py-2 flex items-center gap-2 "><BiSolidDetail />About</a>
                        {currentUser && currentUser.isAdmin && <a href="/learn-earn" onClick={closeSidebar} className="hover:text-gray-400 border-b-2 border-white py-2 flex items-center gap-2"><FaBookOpen />Learn</a>}

                        <a href="/user-coupons" onClick={closeSidebar} className="hover:text-gray-400 border-b-2 border-white py-2 flex items-center gap-2"><IoTicket />Coupens</a>

                        <a href="/profile" onClick={closeSidebar} className="hover:text-gray-400">
                            {currentUser ? (


                                <div className='flex items-center gap-2 bg-blue-600 px-3 py-2 rounded '>
                                    {
                                        currentUser.imageUrl ? <img className='rounded-full border-2 border-white h-8 w-8 object-cover' src={currentUser.imageUrl} alt='profile_img' /> : (<img className='rounded-full  border-2 border-white h-8 w-8 object-cover' src={UserProfile} alt='profile_img' />)
                                    }
                                    <p>Profile</p>

                                </div>
                            ) : (<li className='flex items-center border-b-2 border-white py-3 gap-2' ><FaSignInAlt />Sign In</li>)}</a>
                    </nav>
                </div>
            </div>
        </header>
    )
}
