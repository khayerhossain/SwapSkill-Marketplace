// app/message/[id]/page.js
"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";


export default function MessagePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id;
  const selectedDate = searchParams.get('date');
  
  const [skill, setSkill] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        if (!id) return;
        const { data } = await axiosInstance.get(`/find-skills/${id}`);
        setSkill(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [id]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert('Please write a message');
      return;
    }

    setSending(true);
    try {
      // এখানে আপনার message send API call করুন
      const response = await axiosInstance.post('/send-message', {
        skillId: id,
        selectedDate: selectedDate,
        message: message,
        recipient: skill?.userName
      });

      alert('Message sent successfully!');
      setMessage("");
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6">Connect with {skill?.userName}</h1>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              <strong>Selected Date:</strong> {new Date(selectedDate).toDateString()}
            </p>
            <p className="text-blue-600 text-sm mt-1">
              Your mock interview is scheduled for this date
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-3">
              Your Message to {skill?.userName}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Hi ${skill?.userName}, I would like to schedule a mock interview on ${new Date(selectedDate).toDateString()}. Please let me know if this works for you.`}
              className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSendMessage}
              disabled={sending}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
            
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}