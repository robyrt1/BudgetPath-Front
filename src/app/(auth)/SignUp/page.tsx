"use client";
import LoginView from "@/Views/auth/Login/LoginView";
import './signUp.css';
export default function SignUpPage() {
  return (
    <div className="signup-container h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:bg-gradient-to-r dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 flex items-center justify-center">
      <LoginView />
    </div>
  );
}
