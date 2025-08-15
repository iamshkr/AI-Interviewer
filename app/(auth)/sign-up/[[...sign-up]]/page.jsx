// import { SignUp } from '@clerk/nextjs'

// export default function Page() {
//   return <SignUp />
// }

import { SignUp } from '@clerk/nextjs';
import { BrainCircuit } from 'lucide-react';

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
      
      {/* Header */}
      <div className="relative z-10 w-full max-w-md space-y-6 text-center mb-6">
        <BrainCircuit className="mx-auto h-12 w-auto text-blue-600" />
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Join AI Interviewer
        </h1>
        <p className="text-sm text-gray-600">
          Create your account to start preparing for your dream job
        </p>
      </div>

      {/* Clerk Sign-Up Component without extra white box */}
      <div className="relative z-10">
        <SignUp path="/sign-up" />
      </div>
    </div>
  );
}
