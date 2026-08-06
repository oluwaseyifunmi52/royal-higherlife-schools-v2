import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SchoolNavbar from './components/SchoolNavbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Programs from './pages/Programs'
import Events from './pages/Events'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Login from './pages/public/Login'
import AdmissionForm from './pages/public/AdmissionForm'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

import StudentDashboard from './pages/student/Dashboard'
import ClassView from './pages/student/ClassView'
import LessonView from './pages/student/LessonView'
import QuizPage from './pages/student/QuizPage'
import MyAssignments from './pages/student/MyAssignments'
import UpcomingMeetings from './pages/student/UpcomingMeetings'
import MyBadges from './pages/student/MyBadges'
import Resources from './pages/student/Resources'
import MyReportCard from './pages/student/MyReportCard'
import Library from './pages/student/Library'
import BookDetails from './pages/student/BookDetails'
import ReadBook from './pages/student/ReadBook'
import VideoLessons from './pages/student/VideoLessons'
import MyDownloads from './pages/student/MyDownloads'
import StudentPayments from './pages/student/Payments'
import StudentPaymentHistory from './pages/student/PaymentHistory'

import TeacherDashboard from './pages/teacher/Dashboard'
import CreateClass from './pages/teacher/CreateClass'
import BursarDashboard from './pages/bursar/Dashboard'
import ManageLessons from './pages/teacher/ManageLessons'
import CreateQuiz from './pages/teacher/CreateQuiz'
import CreateAssignment from './pages/teacher/CreateAssignment'
import ReviewSubmissions from './pages/teacher/ReviewSubmissions'
import ScheduleMeeting from './pages/teacher/ScheduleMeeting'
import ClassAnalytics from './pages/teacher/ClassAnalytics'
import ResourceLibrary from './pages/teacher/ResourceLibrary'
import EnterReportCardScores from './pages/teacher/EnterReportCardScores'

import ParentDashboard from './pages/parent/Dashboard'
import ParentPayments from './pages/parent/Payments'
import ParentPaymentHistory from './pages/parent/PaymentHistory'
import ChildProgress from './pages/parent/ChildProgress'
import ChildReportCard from './pages/parent/ChildReportCard'

import AdminDashboard from './pages/admin/AdminDashboard'
import PaymentDashboard from './pages/admin/PaymentDashboard'
import SchoolSettings from './pages/admin/SchoolSettings'
import ReviewAdmissions from './pages/admin/ReviewAdmissions'
import AdmissionDetails from './pages/admin/AdmissionDetails'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <Navbar />
        <SchoolNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admission" element={<AdmissionForm />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/classes" element={<ClassView />} />
            <Route path="/student/lessons" element={<LessonView />} />
            <Route path="/student/quizzes" element={<QuizPage />} />
            <Route path="/student/assignments" element={<MyAssignments />} />
            <Route path="/student/meetings" element={<UpcomingMeetings />} />
            <Route path="/student/badges" element={<MyBadges />} />
            <Route path="/student/resources" element={<Resources />} />
            <Route path="/student/report" element={<MyReportCard />} />
            <Route path="/student/library" element={<Library />} />
            <Route path="/student/library/book/:slug" element={<BookDetails />} />
            <Route path="/student/library/read" element={<ReadBook />} />
            <Route path="/student/library/videos" element={<VideoLessons />} />
            <Route path="/student/library/downloads" element={<MyDownloads />} />
            <Route path="/student/payments" element={<StudentPayments />} />
            <Route path="/student/payment-history" element={<StudentPaymentHistory />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/classes" element={<CreateClass />} />
            <Route path="/teacher/lessons" element={<ManageLessons />} />
            <Route path="/teacher/quizzes" element={<CreateQuiz />} />
            <Route path="/teacher/assignments" element={<CreateAssignment />} />
            <Route path="/teacher/submissions" element={<ReviewSubmissions />} />
            <Route path="/teacher/meetings" element={<ScheduleMeeting />} />
            <Route path="/teacher/analytics" element={<ClassAnalytics />} />
            <Route path="/teacher/resources" element={<ResourceLibrary />} />
            <Route path="/teacher/report-scores" element={<EnterReportCardScores />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
            <Route path="/parent/dashboard" element={<ParentDashboard />} />
            <Route path="/parent/payments" element={<ParentPayments />} />
            <Route path="/parent/payment-history" element={<ParentPaymentHistory />} />
            <Route path="/parent/progress" element={<ChildProgress />} />
            <Route path="/parent/report" element={<ChildReportCard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['bursar']} />}>
            <Route path="/bursar/dashboard" element={<BursarDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/payments" element={<PaymentDashboard />} />
            <Route path="/admin/settings" element={<SchoolSettings />} />
            <Route path="/admin/admissions" element={<ReviewAdmissions />} />
            <Route path="/admin/admission-details" element={<AdmissionDetails />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App

