import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SchoolNavbar from './components/SchoolNavbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Programs from './pages/Programs'
import Academics from './pages/Academics'
import Events from './pages/Events'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Login from './pages/public/Login'
import AdmissionForm from './pages/public/AdmissionForm'
import Register from './pages/Register'
import TeacherRegister from './pages/public/TeacherRegister'
import BursarRegister from './pages/public/BursarRegister'
import AdminRegister from './pages/public/AdminRegister'
import NotFound from './pages/NotFound'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import StudentChangePassword from './pages/student/ChangePassword'
import StudentVideos from './pages/student/StudentVideos'
import StudentQuizAttempts from './pages/student/StudentQuizAttempts'
import StudentQuizzes from './pages/student/StudentQuizzes'
import StudentQuizTaking from './pages/student/StudentQuizTaking'
import StudentQuizResult from './pages/student/StudentQuizResult'

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
import TeacherProfile from './pages/teacher/TeacherProfile'
import TeacherEditProfile from './pages/teacher/TeacherEditProfile'
import TeacherClassManagement from './pages/teacher/CreateClass'
import TeacherAttendance from './pages/teacher/TeacherAttendance'
import TeacherResults from './pages/teacher/TeacherResults'
import CreateAssignment from './pages/teacher/CreateAssignment'
import ReviewSubmissions from './pages/teacher/ReviewSubmissions'
import ScheduleMeeting from './pages/teacher/ScheduleMeeting'
import ClassAnalytics from './pages/teacher/ClassAnalytics'
import ResourceLibrary from './pages/teacher/ResourceLibrary'
import ManageLessons from './pages/teacher/ManageLessons'
import TeacherVideos from './pages/teacher/TeacherVideos'
import TeacherQuestions from './pages/teacher/TeacherQuestions'
import TeacherQuizList from './pages/teacher/TeacherQuizList'
import QuizResults from './pages/teacher/QuizResults'
import TeacherQuizDetail from './pages/teacher/TeacherQuizDetail'

import ParentDashboard from './pages/parent/Dashboard'
import ParentPayments from './pages/parent/Payments'
import ParentPaymentHistory from './pages/parent/PaymentHistory'
import ChildProgress from './pages/parent/ChildProgress'
import ChildReportCard from './pages/parent/ChildReportCard'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminStudents from './pages/admin/AdminStudents'
import AdminTeachers from './pages/admin/AdminTeachers'
import AdminStaff from './pages/admin/AdminStaff'
import AdminClasses from './pages/admin/AdminClasses'
import AdminSubjects from './pages/admin/AdminSubjects'
import AdminResults from './pages/admin/AdminResults'
import AdminAttendance from './pages/admin/AdminAttendance'
import AdminAwards from './pages/admin/AdminAwards'
import AdminCertificates from './pages/admin/AdminCertificates'
import AdminGallery from './pages/admin/AdminGallery'
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import PaymentDashboard from './pages/admin/PaymentDashboard'
import RecordPayment from './pages/admin/RecordPayment'
import PaymentDetails from './pages/admin/PaymentDetails'
import PaymentReports from './pages/admin/PaymentReports'
import SchoolSettings from './pages/admin/SchoolSettings'
import ReviewAdmissions from './pages/admin/ReviewAdmissions'
import AdmissionDetails from './pages/admin/AdmissionDetails'
import AdminAcademics from './pages/admin/AdminAcademics'
import AdminVideos from './pages/admin/AdminVideos'
import AdminQuestions from './pages/admin/AdminQuestions'
import AdminQuizzes from './pages/admin/AdminQuizzes'

import BursarDashboard from './pages/bursar/Dashboard'
import BursarFees from './pages/bursar/BursarFees'
import BursarRecordPayment from './pages/bursar/BursarRecordPayment'
import BursarPaymentHistory from './pages/bursar/BursarPaymentHistory'
import BursarCashReport from './pages/bursar/BursarCashReport'
import BursarReports from './pages/bursar/BursarReports'
import BursarProfile from './pages/bursar/BursarProfile'
import BursarStudents from './pages/bursar/BursarStudents'
import BursarReceipt from './pages/bursar/BursarReceipt'

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
          <Route path="/academics" element={<Academics />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/forgot" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admission" element={<AdmissionForm />} />
          <Route path="/register" element={<Register />} />

          {/* Public role registration pages */}
          <Route path="/teacher/register" element={<TeacherRegister />} />
          <Route path="/bursar/register" element={<BursarRegister />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/change-password" element={<StudentChangePassword />} />
            <Route path="/student/classes" element={<ClassView />} />
            <Route path="/student/lessons" element={<LessonView />} />
            <Route path="/student/quizzes" element={<StudentQuizzes />} />
            <Route path="/student/quizzes/:id" element={<StudentQuizTaking />} />
            <Route path="/student/quizzes/:id/result" element={<StudentQuizResult />} />
            <Route path="/student/quiz-results" element={<StudentQuizAttempts />} />
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
            <Route path="/student/videos" element={<StudentVideos />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/profile" element={<TeacherProfile />} />
            <Route path="/teacher/profile/edit" element={<TeacherEditProfile />} />
            <Route path="/teacher/classes" element={<TeacherClassManagement />} />
            <Route path="/teacher/lessons" element={<ManageLessons />} />
            <Route path="/teacher/attendance" element={<TeacherAttendance />} />
            <Route path="/teacher/report-scores" element={<TeacherResults />} />
            <Route path="/teacher/assignments" element={<CreateAssignment />} />
            <Route path="/teacher/quizzes" element={<TeacherQuizList />} />
            <Route path="/teacher/submissions" element={<ReviewSubmissions />} />
            <Route path="/teacher/meetings" element={<ScheduleMeeting />} />
            <Route path="/teacher/analytics" element={<ClassAnalytics />} />
            <Route path="/teacher/resources" element={<ResourceLibrary />} />
            <Route path="/teacher/videos" element={<TeacherVideos />} />
            <Route path="/teacher/questions" element={<TeacherQuestions />} />
            <Route path="/teacher/quizzes/:id" element={<TeacherQuizDetail />} />
            <Route path="/teacher/quizzes/:id/results" element={<QuizResults />} />
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
            <Route path="/bursar/fees" element={<BursarFees />} />
            <Route path="/bursar/record-payment" element={<BursarRecordPayment />} />
            <Route path="/bursar/payment-history" element={<BursarPaymentHistory />} />
            <Route path="/bursar/cash-report" element={<BursarCashReport />} />
            <Route path="/bursar/reports" element={<BursarReports />} />
            <Route path="/bursar/students" element={<BursarStudents />} />
            <Route path="/bursar/profile" element={<BursarProfile />} />
            <Route path="/bursar/receipt/:id" element={<BursarReceipt />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/teachers" element={<AdminTeachers />} />
            <Route path="/admin/classes" element={<AdminClasses />} />
            <Route path="/admin/subjects" element={<AdminSubjects />} />
            <Route path="/admin/results" element={<AdminResults />} />
            <Route path="/admin/attendance" element={<AdminAttendance />} />
            <Route path="/admin/awards" element={<AdminAwards />} />
            <Route path="/admin/certificates" element={<AdminCertificates />} />
            <Route path="/admin/gallery" element={<AdminGallery />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
            <Route path="/admin/payments" element={<PaymentDashboard />} />
            <Route path="/admin/payments/record" element={<RecordPayment />} />
            <Route path="/admin/payments/reports" element={<PaymentReports />} />
            <Route path="/admin/payments/:id" element={<PaymentDetails />} />
            <Route path="/admin/settings" element={<SchoolSettings />} />
            <Route path="/admin/admissions" element={<ReviewAdmissions />} />
            <Route path="/admin/admission-details" element={<AdmissionDetails />} />
            <Route path="/admin/staff" element={<AdminStaff />} />
            <Route path="/admin/academics" element={<AdminAcademics />} />
            <Route path="/admin/academics/videos" element={<AdminVideos />} />
            <Route path="/admin/academics/questions" element={<AdminQuestions />} />
            <Route path="/admin/academics/quizzes" element={<AdminQuizzes />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
