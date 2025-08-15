// "use client"
// import { db } from '@/utils/db'
// import { UserAnswer } from '@/utils/schema'
// import { eq } from 'drizzle-orm'
// import React, { useEffect, useState } from 'react'
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible"
// import { ChevronsUpDown } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'

// function Feedback({params}) {
// const[feedbackList,setFeedbackList]=useState([]);
// const router=useRouter()
//   useEffect(()=>{
//     GetFeedback();
//   },[])

//     const GetFeedback=async()=>{
//         const result=await db.select()
//         .from(UserAnswer)
//         .where(eq(UserAnswer.mockIdRef,params.interviewId))
//         .orderBy(UserAnswer.id);

//         console.log(result);
//         setFeedbackList(result);
//     }
//   return (
//     <div className='p-10'>
       
//         {feedbackList?.length==0?
//         <h2 className='font-bold text-xl text-gray-500'>No Interview Feedback Record Found</h2>
      
//       :
//        <>
//         <h2 className='text-2xl font-bold text-green-500'>Congratulations</h2>
//         <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>

//         <h2 className='text-primary text-lg my-3'>Your overall interview rating 7/10</h2>
//         <h2 className='text-sm text-gray-500'>find below interview question with correct answer,Your answer and feedback for improvement</h2>
//       {feedbackList&&feedbackList.map((item,index)=>(
//            <Collapsible key={index} className='mt-7'>
//            <CollapsibleTrigger className='p-2 bg-secondary rounded flex my-2 text-left gap-7 w-full'>
//            {item.question}  <ChevronsUpDown className='h-5 w-5'/>
//            </CollapsibleTrigger>
//            <CollapsibleContent>
//             <div className='flex flex-col gap-2'>
//               <h2  className='text-red-500 p-2 border rounded-lg' ><strong>Rating:</strong>{item.rating}</h2>
//               <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer</strong>{item.userAns}</h2>
//               <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer</strong>{item.correctAns}</h2>
//               <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'><strong>Feedback: </strong>{item.feedback}</h2>
                
                 
//             </div>
            
//            </CollapsibleContent>
//          </Collapsible>
         
//       ))}

//        </>}
//       <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>
//     </div>

//   )
// }

// export default Feedback

"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

function Feedback({params}) {
  const [feedbackList, setFeedbackList] = useState([]);
  // State to hold the calculated average rating
  const [overallRating, setOverallRating] = useState(0); 
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  // This useEffect calculates the average rating whenever the feedbackList is updated.
  useEffect(() => {
    if (feedbackList && feedbackList.length > 0) {
      // 1. Sum all the ratings from the list.
      const totalRating = feedbackList.reduce((acc, item) => acc + Number(item.rating || 0), 0);
      
      // 2. Calculate the average rating out of 10.
      const averageRating = totalRating / feedbackList.length;

      // 3. Update the state with the final calculated rating.
      setOverallRating(averageRating);
    }
  }, [feedbackList]); // This dependency ensures the calculation runs when data is ready.

  const GetFeedback = async () => {
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    console.log(result);
    setFeedbackList(result);
  };

  return (
    <div className='p-10'>
      {feedbackList?.length === 0 ? (
        <h2 className='font-bold text-xl text-gray-500'>No Interview Feedback Record Found</h2>
      ) : (
        <>
          <h2 className='text-3xl font-bold text-green-500'>Congratulations!</h2>
          <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>

          {/* This line is now dynamic and displays the average rating out of 10 */}
          <h2 className='text-primary text-lg my-3 font-bold'>
            Your Overall Interview Rating: {overallRating.toFixed(1)} / 10
          </h2>

          <p className='text-sm text-gray-500'>Find below each question with the correct answer, your answer, and specific feedback for improvement.</p>
          
          {feedbackList.map((item, index) => (
            <Collapsible key={index} className='mt-7'>
              <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex my-2 text-left justify-between gap-7 w-full'>
                {item.question}
                <ChevronsUpDown className='h-5 w-5' />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='flex flex-col gap-2 p-2'>
                  <h2 className='text-red-500 p-2 border rounded-lg'>
                    <strong>Rating: </strong>{item.rating} / 10
                  </h2>
                  <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'>
                    <strong>Your Answer: </strong>{item.userAns}
                  </h2>
                  <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'>
                    <strong>Correct Answer: </strong>{item.correctAns}
                  </h2>
                  <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'>
                    <strong>Feedback: </strong>{item.feedback}
                  </h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}
      <Button onClick={() => router.replace('/dashboard')} className='mt-10'>Go Home</Button>
    </div>
  );
}

export default Feedback;