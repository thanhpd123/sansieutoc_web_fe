import { useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';

// Pages
import { Home } from './pages';

// Auth Components
import { Login } from './components/auth';

// Field Components (loại sân)
import {
  Football as Bongda,
  Basketball as Bongro,
  Tennis,
  Badminton as Caulong,
  Volleyball as Bongchuyen,
  Pickleball
} from './components/fields';

// Booking Components  
import {
  Booking,
  BookingHistory,
  BookingSchedule
} from './components/booking';

// Coach Components
import {
  Coaches,
  CoachBooking,
  CoachBookingHistory
} from './components/coach';

// Owner Components
import {
  OwnerFields,
  OwnerSchedule,
  CreateField,
  EditField
} from './components/owner';

// Revenue Components
import {
  RevenueReport,
  CompareRevenue
} from './components/revenue';

// Admin Components
import {
  AdminDashboard,
  AdminFieldList,
  CreateFieldAdmin,
  OwnerManager,
  UserManager
} from './components/admin';

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
