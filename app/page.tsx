'use client';

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function BanglaVoiceApp() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.lang = "bn-BD";
      recog.interimResults = false;
      recog.continuous = false;

      recog.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          navigator.clipboard.writeText(finalTranscript);
        }
      };

      recog.onend = () => {
        setListening(false);
      };

      setRecognition(recog);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setTranscript("");
      setListening(true);
      recognition.start();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardContent className="p-6">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-center text-blue-700 mb-4"
          >
            Yusuf Voice Typing (Bangla)
          </motion.h1>

          <div className="bg-gray-100 h-32 p-4 rounded-xl text-lg font-medium text-gray-800 whitespace-pre-wrap">
            {transcript || "এখানে আপনার কণ্ঠস্বরের বাংলা রূপ দেখানো হবে..."}
          </div>

          <div className="flex justify-center mt-6">
            <Button
              onClick={startListening}
              className="gap-2 px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700 rounded-full"
            >
              {listening ? <Loader2 className="animate-spin" /> : <Mic />} Speak
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            আপনার কণ্ঠস্বর কপি হয়ে গেছে। এখন যেকোনো জায়গায় পেস্ট করুন।
          </p>
        </CardContent>

        <p className="text-center text-xs text-gray-400 mb-3">
          © 2025 Yusuf Adnan — Made with ❤️
        </p>
      </Card>
    </div>
  );
}
