import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-900 dark:text-white">Create Account</h1>
        <SignUp appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
            card: 'bg-transparent shadow-none',
          }
        }} />
      </div>
    </div>
  );
}