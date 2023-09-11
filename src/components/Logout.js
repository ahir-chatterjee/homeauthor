import { Link } from "react-router-dom";
import { useListings } from "../contexts/Listings";
import { useUser } from '../contexts/User';

const Logout = () => {

    const { setUser } = useUser();
    const { setListings, setShouldStoreInLocalStorage } = useListings();
    const handleLogout = async () => {
        await setUser(null);
        await setListings(null);
        await localStorage.removeItem('user');
        await localStorage.removeItem('listings');
        console.log("logged out!");
      };

    return (
        <Link to="/login" onClick={handleLogout} className="logout-link">Logout</Link>
    );
}

export default Logout;