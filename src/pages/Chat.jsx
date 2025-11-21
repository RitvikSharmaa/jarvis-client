import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useChatStore } from "../store/chatStore";
import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import TicketPrompt from "../components/TicketPrompt";
import SurveyPopup from "../components/SurveyPopup";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Sparkles, 
  Orbit,
  Satellite,
  Binary,
  Clock,
  RefreshCw
} from "lucide-react";

export default function Chat() {
  const navigate = useNavigate();
  const { user, updateActivity } = useAuth();
  const { messages, setMessages, addMessage } = useChatStore();

  const [chatId, setChatId] = useState(null);
  const [aiMessageCount, setAiMessageCount] = useState(0);
  const [showAutoTicketPrompt, setShowAutoTicketPrompt] = useState(false);
  const [showTicketPrompt, setShowTicketPrompt] = useState(false);
  const [chatLocked, setChatLocked] = useState(false);
  const [surveyVisible, setSurveyVisible] = useState(false);
  const [waitingForAI, setWaitingForAI] = useState(false);
  const [preventAutoCreation, setPreventAutoCreation] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  // 🔥 Initialize chat with session timeout check
  useEffect(() => {
    console.log("🔍 CHAT COMPONENT MOUNTED");
    
    const initializeChat = async () => {
      const storedChatId = localStorage.getItem("chat_id");
      const lastActivity = localStorage.getItem("lastActivity");
      
      // Check if session expired (10 minutes = 600000 ms)
      if (lastActivity && Date.now() - parseInt(lastActivity) > 600000) {
        console.log("🕒 Session expired - starting new chat");
        setSessionExpired(true);
        
        // Close the expired chat
        if (storedChatId) {
          await closeChat(storedChatId);
        }
        
        setChatId(null);
        setPreventAutoCreation(true);
      } else {
        // Session is still valid, continue with existing chat
        if (storedChatId) {
          console.log("🔄 Continuing existing chat:", storedChatId);
          setChatId(storedChatId);
          await checkChatValidity(storedChatId);
        } else {
          console.log("🆕 No existing chat found");
          setPreventAutoCreation(true);
        }
        
        // Update activity timestamp
        updateActivity();
      }
    };

    initializeChat();
  }, []);

  // 🔥 Check if chat is still valid and active
  const checkChatValidity = async (chatIdToCheck) => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .select("status, created_at")
        .eq("id", chatIdToCheck)
        .single();

      if (error || !data || data.status !== "active") {
        console.log("❌ Chat is no longer valid - starting new one");
        localStorage.removeItem("chat_id");
        setChatId(null);
        setPreventAutoCreation(true);
        return false;
      }
      
      console.log("✅ Chat is valid and active");
      return true;
    } catch (error) {
      console.error("Error checking chat validity:", error);
      return false;
    }
  };

  // Safety check useEffect
  useEffect(() => {
    if (!chatId && !preventAutoCreation) {
      console.log("🛑 Safety: No chatId but preventAutoCreation is false - setting prevention");
      setPreventAutoCreation(true);
    }
  }, [chatId, preventAutoCreation]);

  // 🔥 Update activity on user interactions
  useEffect(() => {
    const updateUserActivity = () => {
      if (user) {
        updateActivity();
      }
    };

    // Update activity on various user interactions
    window.addEventListener('click', updateUserActivity);
    window.addEventListener('keypress', updateUserActivity);
    window.addEventListener('mousemove', updateUserActivity);

    return () => {
      window.removeEventListener('click', updateUserActivity);
      window.removeEventListener('keypress', updateUserActivity);
      window.removeEventListener('mousemove', updateUserActivity);
    };
  }, [user, updateActivity]);

  // ------------------------------------------------
  // CREATE NEW CHAT (with automatic previous chat closure)
  // ------------------------------------------------
  const createNewChat = async () => {
    console.log("🆕 CREATE NEW CHAT CALLED");
    
    // 🔥 Close any existing active chat first
    const currentChatId = localStorage.getItem("chat_id");
    if (currentChatId) {
      console.log("🔒 Closing previous chat before creating new one:", currentChatId);
      await closeChat(currentChatId);
    }

    const newId = crypto.randomUUID();

    const { error } = await supabase.from("chats").insert({
      id: newId,
      user_id: user.username,
      status: "active",
    });

    if (!error) {
      localStorage.setItem("chat_id", newId);
      localStorage.setItem("lastActivity", Date.now().toString());
      setChatId(newId);
      setMessages([]);
      setChatLocked(false);
      setPreventAutoCreation(false);
      setAiMessageCount(0);
      setShowAutoTicketPrompt(false);
      setShowTicketPrompt(false);
      setSessionExpired(false);
      
      toast.success("New chat started");
      return newId;
    } else {
      toast.error("Failed to start chat");
      return null;
    }
  };

  // 🔥 Generic chat closure function
  const closeChat = async (chatIdToClose) => {
    if (!chatIdToClose) return;
    
    try {
      const { error } = await supabase
        .from("chats")
        .update({ status: "closed" })
        .eq("id", chatIdToClose);

      if (error) {
        console.error("Failed to close chat:", error);
        return false;
      }
      
      console.log("✅ Chat closed successfully:", chatIdToClose);
      return true;
    } catch (error) {
      console.error("Error closing chat:", error);
      return false;
    }
  };

  // ------------------------------------------------
  // LOAD MESSAGES ONLY FOR EXISTING ACTIVE CHATS
  // ------------------------------------------------
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    
    fetchMessages();
  }, [chatId]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  };

  // ------------------------------------------------
  // REALTIME LISTENER
  // ------------------------------------------------
  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMessage = payload.new;
          setMessages((prev) => [...prev, newMessage]);
          
          if (newMessage.role === 'assistant' && 
              newMessage.content.includes('ticket has been created successfully') &&
              newMessage.content.includes('chat has been closed')) {
            
            console.log("Detected ticket creation message - closing chat");
            setTimeout(() => {
              triggerChatClosed();
            }, 2000);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [chatId]);

  // ------------------------------------------------
  // CLOSE CHAT AND UPDATE DATABASE
  // ------------------------------------------------
  const triggerChatClosed = async () => {
    if (chatLocked) return;
    
    setChatLocked(true);
    
    if (chatId) {
      await closeChat(chatId);
    }
    
    localStorage.removeItem("chat_id");
    setChatId(null);
    
    toast.success("Chat closed ✔");
    
    setTimeout(() => {
      setSurveyVisible(true);
    }, 2000);
  };

  // ------------------------------------------------
  // SEND MESSAGE
  // ------------------------------------------------
  const sendMessage = async (content) => {
    if (chatLocked || waitingForAI) return;

    if (!chatId) {
      toast.error("Please click 'Start New Chat' before sending a message.");
      return;
    }

    // Update activity timestamp
    updateActivity();

    addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content,
    });

    setWaitingForAI(true);

    try {
      const res = await api.post(ENDPOINTS.CHAT, {
        message: content,
        username: user.username,
        name: user.name,
        chat_id: chatId,
      });

      const raw = Array.isArray(res.data) ? res.data[0] : res.data;
      const response = raw.response;

      if (raw.chat_id) {
        localStorage.setItem("chat_id", raw.chat_id);
        setChatId(raw.chat_id);
      }

      if (raw.ticket_id) {
        localStorage.setItem("ticket_id", raw.ticket_id);
      }

      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
      });

      if (raw.ticket_created === true || 
          (response && response.includes('ticket has been created successfully') &&
           response.includes('chat has been closed'))) {
        
        console.log("Ticket created via API response - closing chat");
        setTimeout(() => {
          triggerChatClosed();
        }, 2500);
        return;
      }

      setAiMessageCount((count) => {
        const updated = count + 1;
        if (updated >= 5) setShowAutoTicketPrompt(true);
        return updated;
      });

      if (raw.escalation === true) {
        setShowTicketPrompt(true);
      }

    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message.");
    } finally {
      setWaitingForAI(false);
    }
  };

  // ------------------------------------------------
  // SATISFACTION HANDLING
  // ------------------------------------------------
  const handleSatisfaction = async (reply) => {
    if (reply === "yes") {
      await sendMessage("Yes, I am satisfied with the response.");
    } else {
      await sendMessage("No, I am not satisfied. I need more assistance with my issue.");
    }
  };

  // ------------------------------------------------
  // MANUAL TICKET CREATION
  // ------------------------------------------------
  const handleRaiseTicket = () => {
    sendMessage("create a ticket");
    setShowTicketPrompt(false);
  };

  // ------------------------------------------------
  // START NEW CHAT MANUALLY
  // ------------------------------------------------
  const startNewChat = async () => {
    console.log("🔄 Manual chat start initiated");
    const newId = await createNewChat();
    if (newId) {
      setChatLocked(false);
      setSurveyVisible(false);
      setPreventAutoCreation(false);
    }
  };

  // 🔥 CONTINUE EXISTING CHAT
  const continueExistingChat = async () => {
    console.log("🔄 Continuing existing chat session");
    setSessionExpired(false);
    setPreventAutoCreation(false);
    updateActivity();
  };

  // Find the latest AI message index
  const getLatestAiMessageIndex = (messages) => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') {
        return i;
      }
    }
    return -1;
  };

  // Floating particles background
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: 20 + Math.random() * 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-screen relative">
      {/* Animated Background Elements */}
      <FloatingParticles />
      
      {/* Holographic Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto p-4">
          <AnimatePresence>
            {/* Session Expired State */}
            {sessionExpired ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center mt-20 space-y-6"
              >
                <motion.div
                  animate={{ 
                    rotateY: 360,
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Clock className="w-20 h-20 text-amber-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Session Expired
                </h3>
                <p className="text-amber-300/60 text-lg">Your previous chat session has expired due to inactivity.</p>
                <div className="flex gap-4 justify-center">
                  <motion.button
                    onClick={startNewChat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                  >
                    <span className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Start New Chat</span>
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            ) : !chatId && preventAutoCreation ? (
              // Completed State
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center mt-20 space-y-6"
              >
                <motion.div
                  animate={{ 
                    rotateY: 360,
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Orbit className="w-20 h-20 text-cyan-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {`Welcome ${user.name.toUpperCase()}`}
                </h3>
                <p className="text-cyan-300/60 text-lg">Mission accomplished. Ready for next deployment.</p>
                <motion.button
                  onClick={startNewChat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                >
                  <span className="flex items-center space-x-2">
                    <Satellite className="w-5 h-5" />
                    <span>New Mission</span>
                  </span>
                </motion.button>
              </motion.div>
            ) : !chatId ? (
              // Initial Empty State
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center mt-20 space-y-6"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity
                  }}
                >
                  <Binary className="w-24 h-24 text-cyan-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  JARVIS System Online
                </h3>
                <p className="text-cyan-300/60 text-lg max-w-md mx-auto">
                  Advanced AI assistant ready for deployment. Initialize chat sequence to begin.
                </p>
                <motion.button
                  onClick={startNewChat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300"
                >
                  <span className="flex items-center space-x-3">
                    <Sparkles className="w-6 h-6" />
                    <span>Initialize Chat Sequence</span>
                    <Sparkles className="w-6 h-6" />
                  </span>
                </motion.button>
              </motion.div>
            ) : messages.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-cyan-300/60 mt-10 text-lg"
              >
                Awaiting transmission... Ready for input
              </motion.p>
            ) : (
              <div className="space-y-4 max-w-4xl mx-auto">
                <AnimatePresence>
                  {messages.map((m, index) => {
                    const latestAiIndex = getLatestAiMessageIndex(messages);
                    const isLatestAiMessage = index === latestAiIndex;
                    
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ChatMessage
                          message={m}
                          chatLocked={chatLocked}
                          onSatisfaction={handleSatisfaction}
                          showFeedback={true}
                          isLatestAiMessage={isLatestAiMessage}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>

          {/* AI Loading Animation */}
          <AnimatePresence>
            {waitingForAI && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex justify-start mb-4 max-w-4xl mx-auto"
              >
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/30">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
                    </motion.div>
                    <div className="space-y-2">
                      <p className="text-cyan-300 font-medium">JARVIS Processing</p>
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-cyan-400 rounded-full"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Auto Ticket Prompt */}
          <AnimatePresence>
            {showAutoTicketPrompt && !chatLocked && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-lg rounded-2xl border border-cyan-500/30 max-w-4xl mx-auto"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <p className="text-cyan-100">Initiate ticket creation protocol?</p>
                  </div>
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => {
                        sendMessage("create a ticket");
                        setShowAutoTicketPrompt(false);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium"
                    >
                      Confirm
                    </motion.button>
                    <motion.button
                      onClick={() => setShowAutoTicketPrompt(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-medium"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ticket Prompt */}
          <AnimatePresence>
            {showTicketPrompt && !chatLocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <TicketPrompt onRaiseTicket={handleRaiseTicket} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Input */}
      <AnimatePresence>
        {chatId && !chatLocked && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="p-4 bg-gradient-to-t from-gray-900/80 via-blue-900/50 to-transparent backdrop-blur-lg border-t border-cyan-500/20"
          >
            <div className="max-w-4xl mx-auto">
              <ChatInput onSend={sendMessage} disabled={chatLocked || waitingForAI} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Survey Popup */}
      <AnimatePresence>
        {surveyVisible && (
          <SurveyPopup onSkip={() => navigate("/history")} />
        )}
      </AnimatePresence>
    </div>
  );
}