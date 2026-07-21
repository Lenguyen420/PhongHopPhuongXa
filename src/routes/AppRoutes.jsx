import { Route, Routes } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import DashboardPage from '@/pages/DashboardPage'
import DevicesPage from '@/pages/DevicesPage'
import DocumentsPage from '@/pages/DocumentsPage'
import MeetingSchedulePage from '@/pages/MeetingSchedulePage'
import MeetingRoomPage from '@/pages/MeetingRoomPage'
import MeetingsPage from '@/pages/MeetingsPage'
import MinutesPage from '@/pages/MinutesPage'
import ReportsPage from '@/pages/ReportsPage'
import RoomsPage from '@/pages/RoomsPage'
import SettingsPage from '@/pages/SettingsPage'
import UsersPage from '@/pages/UsersPage'
import LoginPage from '@/pages/LoginPage'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="dang-nhap" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="meeting-room/:id" element={<MeetingRoomPage />} />
        <Route element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="lich-hop" element={<MeetingSchedulePage />} />
          <Route path="cuoc-hop" element={<MeetingsPage />} />
          <Route path="phong-hop" element={<RoomsPage />} />
          <Route path="thiet-bi" element={<DevicesPage />} />
          <Route path="tai-lieu" element={<DocumentsPage />} />
          <Route path="bien-ban/:meetingId?" element={<MinutesPage />} />
          <Route path="nguoi-dung" element={<UsersPage />} />
          <Route path="bao-cao" element={<ReportsPage />} />
          <Route path="cai-dat" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
