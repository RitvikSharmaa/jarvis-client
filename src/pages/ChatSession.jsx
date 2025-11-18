import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ChatSession() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatInfo, setChatInfo] = useState(null);

  useEffect(() => {
    if (!id) {
      toast.error("Invalid chat session ID");
      return;
    }
    loadChat();
    loadChatInfo();
  }, [id]);

  const loadChat = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading chat session:", error);
      toast.error("Failed to load chat messages");
    } else {
      setMessages(data || []);
    }

    setLoading(false);
  };

  const loadChatInfo = async () => {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setChatInfo(data);
    }
  };

  const getChatTitle = () => {
    return `Mission ${id.slice(-8).toUpperCase()}`;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="jarvis-glass rounded-2xl p-6 mb-6 border border-cyan-500/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/history">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20 hover:border-cyan-400/50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-cyan-400" />
                </motion.button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold jarvis-gradient-text">
                  {getChatTitle()}
                </h1>
                <div className="flex items-center gap-4 text-cyan-300/60 text-sm mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {chatInfo ? new Date(chatInfo.created_at).toLocaleDateString() : 'Loading...'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {chatInfo ? new Date(chatInfo.created_at).toLocaleTimeString() : 'Loading...'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{messages.length} messages</span>
                  </div>
                </div>
              </div>
            </div>
            
            {chatInfo && (
              <div className="text-right">
                <div className="text-cyan-300/60 text-sm">Completed</div>
                <div className="text-cyan-400 text-sm font-medium">
                  {getTimeAgo(chatInfo.created_at)}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {loading ? (
            // Loading Skeleton
            [...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="jarvis-glass rounded-2xl p-4 border border-cyan-500/20 animate-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-400/20 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-cyan-400/20 rounded w-1/4"></div>
                    <div className="h-3 bg-cyan-400/10 rounded w-3/4"></div>
                    <div className="h-3 bg-cyan-400/10 rounded w-1/2"></div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : messages.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="jarvis-glass rounded-2xl p-12 text-center border border-cyan-500/20"
            >
              <MessageSquare className="w-16 h-16 text-cyan-400/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-cyan-100 mb-2">
                No messages found
              </h3>
              <p className="text-cyan-300/60">
                This chat session doesn't contain any messages.
              </p>
            </motion.div>
          ) : (
            // Messages List
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-none'
                      : 'jarvis-glass border border-cyan-500/20 text-cyan-100 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-cyan-100/70' : 'text-cyan-400/60'
                      }`}>
                        {new Date(message.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold">U</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Footer */}
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-cyan-300/60 text-sm">
              This is a read-only view of a completed chat session
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}