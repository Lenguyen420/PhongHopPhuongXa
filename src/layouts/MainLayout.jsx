import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'

function MainLayout() {
  return (
    <div className="min-h-svh bg-[#F8FAFC] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <Sidebar />

      <main className="min-w-0 px-3 py-4 min-[420px]:px-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
