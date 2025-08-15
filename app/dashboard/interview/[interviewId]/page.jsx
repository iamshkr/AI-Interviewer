// "use client"
// import { Button } from '@/components/ui/button'
// import { db } from '@/utils/db'
// import { MockInterview } from '@/utils/schema'
// import {eq} from 'drizzle-orm'
// import Webcam from "react-webcam";
// import {  Lightbulb, WebcamIcon } from 'lucide-react'
// import React, {useEffect, useState} from 'react'
// import Link from 'next/link'

// function Interview({params}) {
    
//    const [interviewData,setInterviewData]=useState("");
//    const [webcamEnabled,setWebCamEnabled]=useState(false);
//     useEffect(()=>{
//         console.log(params.interviewId)
//         GetInterviewDetails();
//     },[])

//     //  used to get interview details by mockId
//     const GetInterviewDetails=async()=>{
//         const result=await db.select().from(MockInterview)
//         .where(eq(MockInterview.mockId,params.interviewId))
       
//         setInterviewData(result[0]);
      
//     }
//   return (
//     <div className='my-10'>
//       <h2 className='font-bold text-2xl'>Let's Get Started</h2>
//      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
    
//     <div className='flex flex-col my-5 gap-5'>
//       <div className='flex flex-col p-5 rounded-lg border gap-5'>
      
//           <h2 className='text-lg'><strong>Job Role/Job Position:</strong>{interviewData.jobPosition}</h2>
//           <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong>{interviewData.jobDesc}</h2>    
//           <h2 className='text-lg'><strong>Years of Experience:</strong>{interviewData.jobExperience}</h2>
//       </div>   

//       <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-200'>
//         <h2 className='flex gap-2 items-center text-yellow-500'> <Lightbulb/><strong>Information</strong></h2>
//         <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
//       </div>
//     </div>

    
//     <div>
//     {webcamEnabled? <Webcam
//     onUserMedia={()=>setWebCamEnabled(true)}
//     onUserMediaError={()=>setWebCamEnabled(false)}
//     mirrored={true}
//       style={{   
//         height:300,
//         width:300
//             }     
//         }
//     />:
//     <>
//     <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border'/>
//      <Button variant='ghost' className='w-full'onClick={()=>setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
//      </>
//      }
    
//     </div>
//      </div>
   
//      <div className='flex justify-end items-end'>
//       <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>                      
//         <Button >Start Interview</Button>
//         </Link>
//      </div>
   
//     </div>
//   )
// }

// export default Interview

// Full Path: /app/dashboard/interview/[interviewId]/start/page.jsx

"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview, UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import RecordAnsSection from './start/_components/RecordAnsSection';

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db.select().from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    if (result.length > 0) {
      await db.delete(UserAnswer).where(eq(UserAnswer.mockIdRef, params.interviewId));
      toast.success("Your new interview session has started. Good luck!");
      
      const questions = JSON.parse(result[0].jsonMockResp);
      setInterviewData(result[0]);
      setMockInterviewQuestion(questions);
    }
  };
  
  const handleTimeUp = () => {
    toast.warning("Time's up for this question!");
    if (mockInterviewQuestion && activeQuestionIndex === mockInterviewQuestion.length - 1) {
      router.push(`/dashboard/interview/${interviewData?.mockId}/feedback`);
    } else {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    }
  };

  return (
    <div className='p-10'>
      {mockInterviewQuestion ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
          {/* Questions Section */}
          <div className='flex flex-col my-5 gap-5'>
            <div className='flex flex-col p-5 rounded-lg border gap-5'>
              <h2 className='text-lg'><strong>Question #{activeQuestionIndex + 1} / {mockInterviewQuestion.length}</strong></h2>
              <h2 className='my-10 text-xl text-black font-bold'>
                {mockInterviewQuestion[activeQuestionIndex]?.question}
              </h2>
            </div>
            <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
              <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong>Note:</strong></h2>
              <h2 className='mt-3 text-sm text-yellow-600'>You have 60 seconds for each question. The interview will automatically proceed to the next question when time is up.</h2>
            </div>
          </div>

          {/* Video/Audio Recording Section */}
          <RecordAnsSection
            key={activeQuestionIndex} // This key is the most important fix for the timer reset issue.
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={interviewData}
            onTimeUp={handleTimeUp}
          />
        </div>
      ) : (
        <h2 className='font-bold text-xl text-gray-500'>Loading Interview...</h2>
      )}
      
      {/* The "Previous Question" button has been removed for a cleaner, forward-only flow */}
      <div className='flex justify-end gap-6 mt-5'>
        {mockInterviewQuestion && activeQuestionIndex < mockInterviewQuestion.length - 1 && 
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>}
        {mockInterviewQuestion && activeQuestionIndex === mockInterviewQuestion.length - 1 && 
          <Button onClick={() => router.push(`/dashboard/interview/${interviewData?.mockId}/feedback`)}>Finish & View Results</Button>}
      </div>
    </div>
  );
}

export default StartInterview;