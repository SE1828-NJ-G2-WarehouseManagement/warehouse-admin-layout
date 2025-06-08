import React from 'react'
import { Link } from 'react-router-dom'

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-800 p-6">
      <h1 className="text-4xl font-bold mb-4">🚫 Không có quyền truy cập</h1>
      <p className="text-lg mb-6 text-center max-w-md">
        Bạn không được phép truy cập trang này. Vui lòng kiểm tra lại tài khoản hoặc quay về trang đăng nhập.
      </p>
      <Link
        to="/login"
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Về trang đăng nhập
      </Link>
    </div>
  )
}

export default Unauthorized
