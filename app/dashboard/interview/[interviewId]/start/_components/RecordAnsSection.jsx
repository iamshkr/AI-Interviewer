// "use client"
// import useSpeechToText from 'react-hook-speech-to-text';
// import React, { useState ,useEffect } from 'react'
// import Image from 'next/image'
// import Webcam from 'react-webcam'
// import { Button } from '@/components/ui/button'
// import { Mic, StopCircle } from 'lucide-react';
// import { toast } from 'sonner';
// import { chatSession } from '@/utils/GeminiAIModel';
// import { db } from '@/utils/db';
// import { UserAnswer } from '@/utils/schema';
// import { useUser } from '@clerk/nextjs';
// import moment from 'moment/moment';

// function RecordAnsSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {
//     const [userAnswer,setUserAnswer]=useState("");
//     const {user}=useUser();
//     const [Loading, setLoading]=useState(false);
//     const {
//         error,
//         interimResult,
//         isRecording,
//         results,
//         startSpeechToText,
//         stopSpeechToText,

//         setResults
//       } = useSpeechToText({
//         continuous: true,
//         useLegacyResults: false
//       });
//     useEffect(()=>{
//    results.map((result)=>(
//     setUserAnswer(prevAns=>prevAns+result?.transcript)
//    ))
//     },[results]);


   
//     useEffect(()=>{
//       if(isRecording&&userAnswer.length>10){
//        UpdateUserAnswer();
//       }
//     }, //need ot update
//     [userAnswer])
 
//   const StartStopRecording=async()=>{
//     if(isRecording){

      
//       stopSpeechToText()
     

     
//     }
//     else{
//       startSpeechToText()
//     }
//   }

//   const UpdateUserAnswer=async()=>{
//     console.log(userAnswer)
//     setLoading(true)
//     const feedbackPrompt="Question"+mockInterviewQuestion[activeQuestionIndex]?.question+
//       ", UserAnswer :" +userAnswer+",Depends on question and user answer for given interview question"+
//       " Please give use rating for answer and feedback as area of improvement if any "+
//       "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

//      const result=await chatSession.sendMessage(feedbackPrompt);
//      const mockJsonResp=(result.response.text()).replace('```json','').replace('```','');
//      console.log(mockJsonResp);
//      const JsonFeedbackResp=JSON.parse(mockJsonResp);
     
//     const resp=await db.insert(UserAnswer)
//     .values({
//       mockIdRef:interviewData?.mockId,
//       question:mockInterviewQuestion[activeQuestionIndex]?.question,
//       correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
//       userAns:userAnswer,
//       feedback:JsonFeedbackResp?.feedback,
//       rating:JsonFeedbackResp?.rating,
//       userEmail:user?.primaryEmailAddress?.emailAddress,
//       created:moment().format('DD-MM-YYYY')
//     })
//     if(resp){
//       toast('User Answer recorded successfully')
//       setUserAnswer('');
//       setResults([]);
//     }
//     setResults([])
//     setLoading(false);
//   }


//   return (
//    <div className='flex items-center justify-center flex-col'>

//             <div className='flex flex-col mt-20 justify-center items-center bg-black rounded lg-5 p-5'>
//             <Image src={'/webcam.png'} width={200} height={200}
//             className='absolute'/>
//             <Webcam
//             mirrored={true}
//             style={{
//                 height:300,
//                 width:'100%',
//                 zIndex:10,
            
//             }}/>
//             </div>
//         <Button 
//         disabled={Loading}
//         variant='outline' className="my-10"
//             onClick={StartStopRecording}
//             >
//        {isRecording?
//        <h2 className='text-red-600 animate-pulse flex gap-2 items-center'>
//         <StopCircle/> Stop Recording
//        </h2>
//        :
//        <h2 className='text-primary  flex gap-2 items-center'>
//         <Mic/>  Record Answer
//        </h2>}</Button>  
      
      
        
//      </div>
//   )
// }

// export default RecordAnsSection

"use client";
import useSpeechToText from "react-hook-speech-to-text";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";

function RecordAnsSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const timeoutRef = useRef(null);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  // Append new speech text to answer
  useEffect(() => {
    if (results.length > 0) {
      const latest = results[results.length - 1];
      if (latest?.transcript) {
        setUserAnswer((prev) => prev + " " + latest.transcript);
      }
    }
  }, [results]);

  // Debounced submit after speech stops
  useEffect(() => {
    if (!isRecording && userAnswer.length > 10 && !hasSubmitted) {
      timeoutRef.current = setTimeout(() => {
        UpdateUserAnswer();
      }, 1000);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [isRecording, userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      setUserAnswer("");
      setResults([]);
      setHasSubmitted(false);
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    try {
      setLoading(true);
      const feedbackPrompt =
        "Question: " +
        mockInterviewQuestion[activeQuestionIndex]?.question +
        ", UserAnswer: " +
        userAnswer +
        ". Based on the question and user answer for this mock interview, " +
        "please give a rating and feedback (area of improvement, if any) in just 3 to 5 lines, " +
        "in JSON format with fields: rating and feedback.";

      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = (await result.response.text()).replace("```json", "").replace("```", "");
      const JsonFeedbackResp = JSON.parse(mockJsonResp);

      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        created: moment().format("DD-MM-YYYY")
      });

      toast.success("User answer recorded successfully");
      setUserAnswer("");
      setResults([]);
      setHasSubmitted(true);
    } catch (err) {
      toast.error("Failed to record answer or parse feedback");
      console.error("Error updating answer:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded lg-5 p-5 relative">
        <Image src={"/webcam.png"} width={200} height={200} className="absolute" alt="webcam" />
        <Webcam
          mirrored
          style={{
            height: 300,
            width: "100%",
            zIndex: 10
          }}
        />
      </div>

      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-600 animate-pulse flex gap-2 items-center">
            <StopCircle /> Stop Recording
          </h2>
        ) : (
          <h2 className="text-primary flex gap-2 items-center">
            <Mic /> Record Answer
          </h2>
        )}
      </Button>
    </div>
  );
}

export default RecordAnsSection;
