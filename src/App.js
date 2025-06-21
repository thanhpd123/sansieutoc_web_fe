import { useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import Home from './component/Home';
import Bongda from "./component/Bongda";
import Bongro from "./component/Bongro";
import Tennis from "./component/Tennis";
import Caulong from "./component/Caulong";
import Bongchuyen from "./component/Bongchuyen";
import Pickleball  from "./component/Pickleball";
import Login from "./component/Login";
import Booking from "./component/Booking"
import BookingHistory from './component/BookingHistory';
import Coaches from './component/Coaches';
import CoachBooking from './component/CoachBooking';
import CoachBookingHistory from './component/CoachBookingHistory';
import OwnerFields from './component/OwnerFields';
import CreateField from './component/CreateField';
import EditField from './component/EditField';
import OwnerSchedule from './component/OwnerSchedule';
import RevenueReport from './component/RevenueReport';
import CompareRevenue from './component/CompareRevenue';
import AdminDashboard from './component/AdminDashboard';
import AdminFieldList from './component/AdminFieldList';
import CreateFieldAdmin from './component/CreateFieldAdmin';
import OwnerManager from './component/OwnerManager';
import UserManager from './component/UserManager';
import BookingSchedule from './component/BookingSchedule';

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) setUser(storedUser);
  }, []);


  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/loaisan/6836d3231f7f6d0deb0f98d0" element={<Bongda />} />
      <Route path="/loaisan/6836d3231f7f6d0deb0f98d1" element={<Bongro />} />
      <Route path="/loaisan/6836d3231f7f6d0deb0f98d2" element={<Tennis />} />
      <Route path="/loaisan/6836d3231f7f6d0deb0f98d4" element={<Caulong />} />
       <Route path="/loaisan/6836d3231f7f6d0deb0f98d5" element={<Bongchuyen />} />
        <Route path="/loaisan/6836d3231f7f6d0deb0f98d3" element={<Pickleball />} />
      <Route path="/register" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route path="/manager/fields" element={<OwnerFields user={user} />} />
      <Route path="/manager/fields/create" element={<CreateField user={user} />} />
      <Route path="/manager/fields/:id/edit" element={<EditField user={user} />} />
      <Route path="/manager/bookings" element={<OwnerSchedule user={user} />} />
      <Route path="/manager/revenue" element={<RevenueReport user={user} />} />
      <Route path="/manager/compare" element={<CompareRevenue user={user} />} />

      <Route path="/admin" element={<AdminDashboard user={user} />} />
      <Route path="/admin/fields" element={<AdminFieldList user={user} />} />
      <Route path="/admin/fields/create" element={<CreateFieldAdmin user={user} />} />
      <Route path="/admin/owners" element={<OwnerManager user={user} setUser={setUser} />} />
      <Route path="/admin/users" element={<UserManager user={user} />} />
      <Route path="/admin/bookings" element={<BookingSchedule user={user} />} />



      <Route path="/booking/:id" element={<Booking />} />
      <Route path="/lichsu-datsan" element={<BookingHistory />} />
      <Route path="/coach" element={<Coaches />} />
      <Route path="/coach/:coachId/booking" element={<CoachBooking />} />
      <Route path="/coachbookinghistory" element={<CoachBookingHistory />} />

    </Routes>
  );
}

export default App;
