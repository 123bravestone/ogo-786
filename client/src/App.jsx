import './App.css'
import Authentication from './pages/Authentication.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import PrivateRout from './components/PrivateRout.jsx'
import Profile from './pages/Profile.jsx'
import CreateListing from './pages/CreateListing.jsx'
import UpdateListing from './pages/UpdateListing.jsx'
import Listing from './pages/Listing.jsx'
import Coupons from './pages/Coupons.jsx'
import About from './pages/About.jsx'
import ReviewPage from './pages/ReviewPage.jsx'
import SearchResult from './pages/SearchResult.jsx'
import AdminDetails from './pages/AdminDetails.jsx'
import UsersDetail from './pages/UsersDetail.jsx'
import PricingPage from './pages/PricingPage.jsx'
import PriceRequest from './pages/PriceRequest.jsx'
import EducationPage from './pages/EducationPage.jsx'
import Header from './components/Header.jsx'
import AddToHomeScreen from './components/AddToHomeScreen.jsx'


function App() {

  return (
    <>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}

      <BrowserRouter >


        <AddToHomeScreen />

        <Header></Header>

        {/* <ShopBox /> */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/price-user" element={<PricingPage />} />

          <Route path="/auth-user" element={<Authentication />} />

          <Route path="/listing/:listingId" element={<Listing />} />
          <Route path="/listing/review&rate/:listingId" element={<ReviewPage />} />
          <Route path="/search" element={<SearchResult />} />

          {/* after signOut, can't access profile by using "/profile" */}
          <Route element={<PrivateRout />}>

            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/update-listing/:listingId" element={<UpdateListing />} />
            <Route path="/user-coupons" element={<Coupons />} />

            <Route path='/admins-details' element={<AdminDetails />} />
            <Route path='/learn-earn' element={<EducationPage />} />
            <Route path='/users-details/:userId' element={<UsersDetail />} />
            <Route path='/users-request/:userId' element={<PriceRequest />} />


          </Route>

        </Routes>



      </BrowserRouter>
    </>
  )
}

export default App
