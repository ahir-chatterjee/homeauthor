import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import Generate from "./components/Generate";
import Listing from "./components/Listing";
import { UserProvider } from "./contexts/User";
import { ListingsProvider } from './contexts/Listings';
// import OldApp from "./oldApp";

function InnerApp() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage isSignup={false} />} />
        <Route path="/login" element={<AuthPage isSignup={false} />} />
        <Route path="/signup" element={<AuthPage isSignup={true} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/listing/:databaseId/:listingId/generate" element={<Generate />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/listing/:databaseId/:listingId" element={<Listing />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <ListingsProvider>
        <InnerApp />
      </ListingsProvider>
    </UserProvider>
  );
}

export default App;