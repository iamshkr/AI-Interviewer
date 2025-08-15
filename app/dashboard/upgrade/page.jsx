// "use client";
// import React from 'react';
// import planData from '@/utils/planData';
// import { useUser } from '@clerk/nextjs';

// function Upgrade() {
//   const { user } = useUser();

//   return (
//     <div className="p-10">
//       <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {planData.map((item, index) => (
//             <div
//               key={index}
//               className="w-full max-w-sm rounded-2xl border border-indigo-600 p-6 shadow-sm ring-1 ring-indigo-600 sm:px-8 lg:p-10 mx-auto"
//             >
//               <div className="text-center">
//                 <h2 className="text-lg font-medium text-gray-900">
//                   {item.duration}
//                   <span className="sr-only"> Plan</span>
//                 </h2>

//                 <p className="mt-2 sm:mt-4">
//                   <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
//                     ${item.price}
//                   </strong>
//                   <span className="text-sm font-medium text-gray-700 ml-1">{item.duration}</span>
//                 </p>
//               </div>

//               <ul className="mt-6 space-y-2">
//                 {[
//                   "20 users included",
//                   "5GB of storage",
//                   "Email support",
//                   "Help center access",
//                   "Phone support",
//                   "Community access",
//                 ].map((feature, i) => (
//                   <li key={i} className="flex items-center gap-2">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth="1.5"
//                       stroke="currentColor"
//                       className="w-5 h-5 text-indigo-700"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
//                     </svg>
//                     <span className="text-gray-700">{feature}</span>
//                   </li>
//                 ))}
//               </ul>

//               {user?.primaryEmailAddress?.emailAddress ? (
//                 <a
//                   href={`${item.link}?prefill_email=${user.primaryEmailAddress.emailAddress}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="mt-8 block w-full rounded-full border border-indigo-600 bg-indigo-600 px-6 py-3 text-center text-base font-medium text-white hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring-2"
//                 >
//                   Get Started
//                 </a>
//               ) : (
//                 <div className="mt-8 text-center text-sm text-red-600">
//                   Please sign in to proceed
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Upgrade;
"use client";
import React from 'react';
import planData from '@/utils/planData.jsx'; // Importing from the .jsx file
import { useUser } from '@clerk/nextjs';
import { CheckCircle, ArrowRight } from 'lucide-react';

function Upgrade() {
  const { user, isSignedIn } = useUser();

  return (
    <div className="bg-white text-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Find the Perfect Plan for You
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Unlock your full potential with access to more questions, unlimited interviews, and detailed reports.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 items-start">
          {planData.map((plan, index) => (
            <div
              key={index}
              // --- MODIFICATION IS HERE ---
              // This logic now applies the blue border to the current plan OR any plan on hover.
              className={`relative w-full rounded-2xl border-2 p-8 shadow-lg transition-transform transform hover:scale-105 ${
                plan.isCurrent 
                  ? 'border-indigo-600' 
                  : 'border-gray-200 hover:border-indigo-600'
              }`}
            >
              {plan.isCurrent && (
                <p className="absolute top-0 -translate-y-1/2 rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold text-white">
                  Current Plan
                </p>
              )}

              <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
              
              <p className="mt-4 text-gray-600">
                <span className="text-4xl font-extrabold tracking-tight text-gray-900">${plan.price}</span>
                {plan.name !== 'Free' && (
                  <span className="ml-1 text-base font-medium text-gray-500">/ {plan.duration}</span>
                )}
              </p>

              {plan.name === 'Free' ? (
                <button
                  disabled
                  className="mt-8 block w-full rounded-lg bg-gray-300 px-6 py-3 text-center text-base font-medium text-gray-500 cursor-not-allowed"
                >
                  Your Current Plan
                </button>
              ) : (
                <a
                  href={isSignedIn ? `${plan.link}?prefilled_email=${user?.primaryEmailAddress?.emailAddress || ''}` : '/sign-in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 block w-full rounded-lg bg-indigo-600 px-6 py-3 text-center text-base font-medium text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              )}

              <ul className="mt-8 space-y-4 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {!isSignedIn && (
            <div className="mt-12 text-center text-lg text-gray-600 p-6 bg-gray-50 rounded-lg">
                Please <a href="/sign-in" className="text-indigo-600 font-semibold underline">sign in</a> to upgrade your plan.
            </div>
        )}
      </div>
    </div>
  );
}

export default Upgrade;