// "use client"
// import React, {useState} from 'react'
// import { Button } from '@/components/ui/button'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { chatSession } from '@/utils/GeminiAIModel'
// import { LoaderCircle } from 'lucide-react'
// import { db } from '@/utils/db'
// import { MockInterview } from '@/utils/schema'
// import moment from 'moment'
// import {v4 as uuidv4} from 'uuid'
// import { useUser } from '@clerk/nextjs'
// // import { useRouter } from 'next/router'
// import { useRouter } from 'next/navigation';
// function AddNewInterview() {
//     const [openDialog,setOpenDialog]=useState(false)
//     const [jobPosition,setJobPosition]=useState();
//     const [jobDesc,setJobDesc]=useState();
//     const [jobExperience,setJobExperience]=useState();
//     const [loading,setLoading]=useState(false);
//     const [jsonResponse,setJsonResponse]=useState([]);
//     const router=useRouter();
//     const {user}= useUser();
//     const onSubmit=async(e)=>{
//       setLoading(true)
//       e.preventDefault()
//           console.log(jobPosition,jobDesc,jobExperience)
      
//       const InputPrompt="Job position:"+jobPosition+", Job Description: "+jobDesc+", Years of Experience: "+jobExperience+" : Depending on Job Position, Job Description and Years of experience give us "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+"  interview questions along with short and precise Answeer in JSON format"
     
//        const result=await chatSession.sendMessage(InputPrompt);
//        const MockJsonResp=(await result.response.text()).replace('```json','').replace('```','');
//        console.log(JSON.parse(MockJsonResp));
      
//        setJsonResponse(MockJsonResp);
       
//        if(MockJsonResp){
//        const resp=await db.insert(MockInterview)
//        .values({
//         mockId:uuidv4(),
//         jsonMockResp:MockJsonResp,
//         jobPosition:jobPosition,
//         jobDesc:jobDesc,
//         jobExperience:jobExperience,
//         createdBy:user?.primaryEmailAddress?.emailAddress,
//         createdAt:moment().format('DD-MM-YYYY')
//        }).returning({mockId:MockInterview.mockId});

//         console.log("Inserted ID:",resp)
//         if(resp){
//           setOpenDialog(false);
//           router.push('/dashboard/interview/'+resp[0]?.mockId)
//         }
//       }
//       else{
//         console.log("Error")
//       }
//        setLoading(false);
//     }
//   return (
//     <div>
//         <div className='p-10 border rounded-lg bg bg-secondary
//         hover:scale-105 hover: shadow-md cursor-pointer transition-all' 
//         onClick={()=>setOpenDialog(true)}
//         > 
//             <h2 className='font-bold text-lg text center'>+Add New</h2>
//         </div>
//                 <Dialog open={openDialog}>
        
//         <DialogContent className='max-w-2xl'>
//             <DialogHeader>
//             <DialogTitle className='font-2xl'>Tell me more about your job interviewing</DialogTitle>
//             <DialogDescription>
//                 <form onSubmit={onSubmit}>
//                 <div>
                 
//                   <h2>Add Details about your job position/role, Job description and years of experience</h2>
                  
//                    <div className='mt-7 my-2'>
//                     <label>Job Role/Job Position</label>
//                     <Input placeholder="Ex. Full Stack Developer" required
//                     onChange={(event)=>setJobPosition(event.target.value)}/>
//                    </div>

//                    <div className='my-3'>
//                     <label>Job Description/ Tech Stack (In Short)</label>
//                     <Textarea placeholder="Ex. React, Angular, NodeJs, MySql" required 
//                      onChange={(event)=>setJobDesc(event.target.value)} />
//                    </div>

//                    <div className='my-3'>
//                     <label>Years of Experience</label>
//                     <Input placeholder="Ex. 5 " type="number" max="50" required
//                      onChange={(event)=>setJobExperience(event.target.value)}/>
//                    </div>
//                 </div>
//                 <div className='flex gap-5 justify-end'>
//                   <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
//                   <Button type="submit" disabled={loading}>
//                     {loading?
//                     <>
//                     <LoaderCircle className='animate-spin'/>'Generating from AI'</>:'Start Interview'
//                     }
//                     </Button>
//                 </div>
//                 </form>
//             </DialogDescription>
//             </DialogHeader>
//         </DialogContent>
//         </Dialog>
//     </div>
//   )
// }

// export default AddNewInterview
"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModel'
import { LoaderCircle, AlertCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation';

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false)
  const [jobPosition, setJobPosition] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobExperience, setJobExperience] = useState('');
  const [loading, setLoading] = useState(false);
  // ✨ IMPROVEMENT: State to hold user-facing error messages
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // ✨ Reset previous errors

    // ✨ IMPROVEMENT: Using a try...catch...finally block for robust error handling
    try {
      console.log(jobPosition, jobDesc, jobExperience);

      const InputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Based on these details, please generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions along with concise answers. Provide the output strictly in JSON format, containing an array of objects, where each object has "question" and "answer" keys.`;
      
      const result = await chatSession.sendMessage(InputPrompt);
      const rawResponse = await result.response.text();
      
      // ✨ IMPROVEMENT: More robust parsing to find the JSON block
      const jsonMatch = rawResponse.match(/```json([\s\S]*?)```/);
      if (!jsonMatch) {
        throw new Error("AI did not return a valid JSON response.");
      }
      const mockJsonResponse = jsonMatch[1].trim();

      // ✨ Verify the parsed JSON
      const parsedResponse = JSON.parse(mockJsonResponse);
      console.log(parsedResponse);
      
      const resp = await db.insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: mockJsonResponse,
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          // ✨ IMPROVEMENT: Using ISO format for dates is a best practice
          createdAt: moment().toISOString() 
        }).returning({ mockId: MockInterview.mockId });

      console.log("Inserted ID:", resp);
      if (resp && resp.length > 0) {
        setOpenDialog(false);
        router.push('/dashboard/interview/' + resp[0]?.mockId);
      } else {
        throw new Error("Failed to save the interview to the database.");
      }
    } catch (err) {
      console.error(err);
      // ✨ Provide a user-friendly error message
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      // ✨ This block will always run, ensuring the loader is turned off
      setLoading(false);
    }
  }

  return (
    <div>
      {/* ✨ IMPROVEMENT: Using a <button> element is better for accessibility */}
      <button
        className='p-10 border rounded-lg bg-secondary
        hover:scale-105 hover:shadow-md cursor-pointer transition-all w-full h-full text-center'
        onClick={() => {
          setOpenDialog(true);
          setError(''); // Reset errors when opening dialog
        }}
      >
        <h2 className='font-bold text-lg'>+ Add New</h2>
      </button>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            {/* ✨ IMPROVEMENT: Clearer title for the dialog */}
            <DialogTitle className='text-2xl'>Create a New Mock Interview</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <form onSubmit={onSubmit}>
              <div>
                <p>Fill in the details below to start your tailored mock interview.</p>
                {/* ✨ IMPROVEMENT: Disable the entire fieldset while loading */}
                <fieldset disabled={loading}>
                  <div className='mt-7 my-2'>
                    <label>Job Role/Position</label>
                    <Input placeholder="Ex. Full Stack Developer" required
                      onChange={(event) => setJobPosition(event.target.value)} />
                  </div>
                  <div className='my-3'>
                    <label>Job Description / Tech Stack</label>
                    <Textarea placeholder="Ex. React, Angular, Node.js, MySQL" required
                      onChange={(event) => setJobDesc(event.target.value)} />
                  </div>
                  <div className='my-3'>
                    <label>Years of Experience</label>
                    <Input placeholder="Ex. 5" type="number" max="50" min="0" required
                      onChange={(event) => setJobExperience(event.target.value)} />
                  </div>
                </fieldset>
              </div>

              {/* ✨ IMPROVEMENT: Display error message to the user */}
              {error && 
                <div className='my-3 flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-md'>
                  <AlertCircle className='h-4 w-4' />
                  <p>{error}</p>
                </div>
              }

              <div className='flex gap-5 justify-end mt-4'>
                <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoaderCircle className='animate-spin mr-2' /> Generating from AI...
                    </>
                  ) : 'Start Interview'}
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewInterview;