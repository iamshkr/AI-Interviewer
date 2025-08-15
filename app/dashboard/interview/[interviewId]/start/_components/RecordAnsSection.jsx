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
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, StopCircle, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { eq, and } from "drizzle-orm";
import useSpeechToText from "react-hook-speech-to-text";

function RecordAnsSection({ mockInterviewQuestion, activeQuestionIndex, interviewData, onTimeUp }) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timer, setTimer] = useState(60);

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

  // ✨ This useEffect handles the timer's countdown.
  // It runs once when the component mounts (due to the key change).
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        }
        return 0;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []); // Runs once on mount, cleans up on unmount.

  // ✨ This useEffect safely reacts when the timer hits zero.
  useEffect(() => {
    if (timer === 0) {
      if (isRecording) {
        stopSpeechToText();
      }
      onTimeUp();
    }
  }, [timer]); // Depends only on the timer state.


  // Update answer with final transcript segment
  useEffect(() => {
    if (results.length > 0) {
      const latestTranscript = results[results.length - 1]?.transcript;
      if (latestTranscript) {
        setUserAnswer((prev) => (prev ? prev + " " + latestTranscript : latestTranscript).trim());
      }
    }
  }, [results]);

  // Submit answer automatically when recording stops
  useEffect(() => {
    if (!isRecording && userAnswer.length > 10 && !hasSubmitted) {
      UpdateUserAnswer();
    }
  }, [isRecording, userAnswer, hasSubmitted]);


  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      if (timer > 0) {
        startSpeechToText();
      }
    }
  };

  const handleRetake = () => {
    setHasSubmitted(false);
    setUserAnswer("");
    setResults([]);
  };

  const UpdateUserAnswer = async () => {
    const finalAnswer = (userAnswer + " " + (interimResult || "")).trim();
    if (finalAnswer.length < 10) return;

    setLoading(true);
    try {
      const feedbackPrompt =
        `Question: "${mockInterviewQuestion[activeQuestionIndex]?.question}", User Answer: "${finalAnswer}". ` +
        "Based on this mock interview question and answer, please provide a rating for the answer from 1 to 10 and concise feedback for improvement in 3 to 5 lines. " +
        "Format your response as a JSON object with two fields: 'rating' (a number) and 'feedback' (a string).";

      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = (await result.response.text()).replace("```json", "").replace("```", "");
      const JsonFeedbackResp = JSON.parse(mockJsonResp);

      const currentQuestion = mockInterviewQuestion[activeQuestionIndex]?.question;
      const existingAnswer = await db.select().from(UserAnswer).where(and(eq(UserAnswer.mockIdRef, interviewData.mockId), eq(UserAnswer.question, currentQuestion)));

      if (existingAnswer.length > 0) {
        await db.update(UserAnswer).set({ userAns: finalAnswer, feedback: JsonFeedbackResp?.feedback, rating: JsonFeedbackResp?.rating }).where(eq(UserAnswer.id, existingAnswer[0].id));
        toast.success("Answer updated successfully!");
      } else {
        await db.insert(UserAnswer).values({ mockIdRef: interviewData?.mockId, question: currentQuestion, correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer, userAns: finalAnswer, feedback: JsonFeedbackResp?.feedback, rating: JsonFeedbackResp?.rating, userEmail: user?.primaryEmailAddress?.emailAddress, created: moment().format("DD-MM-YYYY") });
        toast.success("Answer recorded successfully!");
      }
      
      setHasSubmitted(true);
    } catch (err) {
      toast.error("Error submitting answer. Please try again.");
      console.error("Error updating answer:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="relative flex flex-col mt-10 justify-center items-center bg-black rounded-lg p-5">
        <Image src={"/webcam.png"} width={200} height={200} className="absolute" alt="webcam" />
        <Webcam mirrored style={{ height: 300, width: "100%", zIndex: 10 }} />
      </div>

      <div 
        className={`my-6 flex flex-col items-center justify-center p-4 rounded-full border-4 transition-colors duration-300 ${timer <= 10 && timer > 0 ? 'border-red-500 text-red-500 animate-pulse' : 'border-primary text-primary'}`} 
        style={{width: 130, height: 130}}
      >
        <h2 className="text-5xl font-bold">{timer}</h2>
        <p className="text-xs tracking-widest">SECONDS</p>
      </div>

      <div className="flex justify-center items-center gap-4 w-full">
        <Button disabled={loading || hasSubmitted || timer === 0} onClick={StartStopRecording}>
          {isRecording ? (
            <h2 className="flex gap-2 items-center">
              <StopCircle /> Stop Recording
            </h2>
          ) : (
            <h2 className="flex gap-2 items-center">
              <Mic /> Record Answer
            </h2>
          )}
        </Button>

        {hasSubmitted && timer > 0 && (
          <Button onClick={handleRetake} variant="outline" disabled={loading}>
            <RefreshCcw className="h-5 w-5 mr-2" /> Retake
          </Button>
        )}
      </div>

      {timer === 0 && <p className="text-red-500 font-semibold mt-4">Time's up! Moving to the next question...</p>}

      <div className="w-full max-w-2xl p-4 border rounded-lg bg-gray-50 mt-6">
        <h3 className="font-semibold mb-2">Your Answer:</h3>
        <Textarea className="w-full h-32" readOnly value={isRecording || userAnswer ? `${userAnswer}${userAnswer ? ' ' : ''}${interimResult || ''}` : "Your answer will appear here..."} />
        {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
      </div>
    </div>
  );
}

export default RecordAnsSection;