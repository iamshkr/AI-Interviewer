"use client";
import React from 'react';
import planData from '@/utils/planData';
import { useUser } from '@clerk/nextjs';

function Upgrade() {
  const { user } = useUser();

  return (
    <div className="p-10">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {planData.map((item, index) => (
            <div
              key={index}
              className="w-full max-w-sm rounded-2xl border border-indigo-600 p-6 shadow-sm ring-1 ring-indigo-600 sm:px-8 lg:p-10 mx-auto"
            >
              <div className="text-center">
                <h2 className="text-lg font-medium text-gray-900">
                  {item.duration}
                  <span className="sr-only"> Plan</span>
                </h2>

                <p className="mt-2 sm:mt-4">
                  <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                    ${item.price}
                  </strong>
                  <span className="text-sm font-medium text-gray-700 ml-1">{item.duration}</span>
                </p>
              </div>

              <ul className="mt-6 space-y-2">
                {[
                  "20 users included",
                  "5GB of storage",
                  "Email support",
                  "Help center access",
                  "Phone support",
                  "Community access",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 text-indigo-700"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {user?.primaryEmailAddress?.emailAddress ? (
                <a
                  href={`${item.link}?prefill_email=${user.primaryEmailAddress.emailAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 block w-full rounded-full border border-indigo-600 bg-indigo-600 px-6 py-3 text-center text-base font-medium text-white hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring-2"
                >
                  Get Started
                </a>
              ) : (
                <div className="mt-8 text-center text-sm text-red-600">
                  Please sign in to proceed
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Upgrade;
