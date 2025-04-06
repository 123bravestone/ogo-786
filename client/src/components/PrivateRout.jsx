import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";


// when you access to the profile after signOut by using "/profile" you can't access it that is called privateRout
export default function PrivateRout() {
  // const {currentUser} = useSelector(state => state.user);
  const { loginUser } = useSelector(state => state.user2);


  return (
    <>
      {loginUser ? <Outlet /> : <Navigate to='/auth-user' />}
    </>
  )
}
