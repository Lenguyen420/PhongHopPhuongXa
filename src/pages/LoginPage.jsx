import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CalendarClock, LogIn } from 'lucide-react'
import { setCredentials } from '@/app/authSlice'
import { useLoginMutation } from '@/services/meetingApi'

function LoginPage() {
  const session = useSelector((state) => state.auth)
  const [form, setForm] = useState({ username: 'admin', password: '123456' })
  const [error, setError] = useState('')
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  if (session?.accessToken) return <Navigate replace to="/" />

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const credentials = await login(form).unwrap()
      dispatch(setCredentials(credentials))
      navigate(location.state?.from || '/', { replace: true })
    } catch (requestError) {
      setError(requestError?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng')
    }
  }

  return (
    <main className="grid min-h-svh place-items-center bg-slate-950 p-4">
      <form
        className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl sm:p-8"
        onSubmit={submit}
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#2563EB] text-white">
          <CalendarClock />
        </span>
        <h1 className="mt-5 text-3xl font-bold text-slate-950">Đăng nhập quản trị</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">Hệ thống phòng họp Phường/Xã</p>
        <label className="mt-6 grid gap-2 text-sm font-bold text-slate-700">
          Tên đăng nhập
          <input
            className={inputClass}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            autoComplete="username"
          />
        </label>
        <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
          Mật khẩu
          <input
            className={inputClass}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}
        <button
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] font-bold text-white disabled:opacity-60"
          disabled={isLoading}
        >
          <LogIn size={18} />
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </main>
  )
}

const inputClass =
  'h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
export default LoginPage
