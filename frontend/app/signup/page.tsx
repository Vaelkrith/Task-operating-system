"use client"
import { SignupForm } from "../../components/SignupForm"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card shadow-lg">
          <div className="card-body">
            <div className="text-center mb-8">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                SmartCampus
              </div>
              <p className="text-gray-600 dark:text-gray-400">Create your account</p>
            </div>
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  )
}

