import React from 'react';
import './App.css';
import Login from './components/login';
import SignUpPage from './components/signup';
import FindBus from './components/students_components/findbus';
import ViewBus from './components/students_components/viewBus';
import BusRoute from './components/students_components/viewBusRoute';
import Checkout from './components/students_components/checkout';
import PaymentStats from './components/students_components/PaymentStats';
import MyBookings from './components/students_components/MyBookings';
import BusView from './components/staff_components/viewbus';
import ViewSingleBus from './components/staff_components/viewSingleBus'; 
import ViewAttendance from './components/students_components/ViewAttendance';
// import ViewAllStudentAttendence from './components/Administrative_components/viewAllStudentAttendence';
import ViewAllStaff from './components/Administrative_components/ViewAllStaff';
import ViewaAllBus from './components/Administrative_components/viewaAllBus';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import ViewSingleBusDetails from './components/Administrative_components/ViewSingleBusDetails';
import AddStaff from './components/Administrative_components/AddStaff';
import AddBus from './components/Administrative_components/AddBus';
import AddRoute from './components/Administrative_components/AddRoute';
import PaymentFailed from './components/students_components/paymentFailed';
import AddOffDay from './components/staff_components/addoffdays';
import ViewOffDays from './components/staff_components/viewoffdays';
import AddDayScholar from './components/Administrative_components/AddDayScholar';
import ViewDayScolar from './components/Administrative_components/ViewDayScholar';
import ViewDayScolars from './components/staff_components/ViewDayScholar';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/signup' element={<SignUpPage />} />

          {/*Student Routes */}
          <Route path='/findBus' element={<FindBus />} />
          <Route path='/viewBus' element={<ViewBus />} />
          <Route path='/viewbusroute' element={<BusRoute />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/paymentstatus' element={<PaymentStats />} />
          <Route path='/mybookings' element={<MyBookings />} />
          <Route path='/viewattendance' element={<ViewAttendance />} />
          <Route path='/paymentfailed' element={<PaymentFailed/>}/>
        
          {/*Student Routes End */}

          {/*Staff Route*/}
          <Route path='/staff/busview' element={<BusView />} />
          <Route path='/staff/viewsinglebus/:busId' element={<ViewSingleBus />} />
          <Route path='/staff/addoffdays' element={<AddOffDay />} />
          <Route path='/staff/viewoffdays' element={<ViewOffDays/>} />
          <Route path='/staff/viewdayscholar' element={<ViewDayScolars />} />
          {/*Staff Route Ended*/}

          {/*Admin Route*/}
          {/* <Route path='/admin/viewallattendence' element={<ViewAllStudentAttendence/>}/> */}
          <Route path='/admin/viewallstaff' element={< ViewAllStaff />} />
          <Route path='/admin/viewallbus' element={< ViewaAllBus />} />
          <Route path='/admin/ViewsinglebusDetails/:busId' element={<ViewSingleBusDetails />} />
          <Route path='/admin/addstaff/' element={<AddStaff />} />
          <Route path='/admin/adddayscholar' element={<AddDayScholar />} />
          <Route path='/admin/addBus/' element={<AddBus />} />
          <Route path='/admin/addroute' element={<AddRoute/>}/>
          <Route path='/admin/viewdayscholar' element={<ViewDayScolar />} />
          {/* <Route path='/admin/paymentfailed' element={<PaymentFailed/>}/> */}
          {/*Admin Route Ended*/}
          {/* add bus option needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
