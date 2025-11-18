import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Calendar, 
  MessageSquare, 
  Clock, 
  Archive,
  Zap,
  Sparkles,
  Eye,
  Trash2,
  Download
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function History() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filter options
  const dateFilters = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
  ];

  useEffect(() => {
    if (!user || !user.username) return;
    loadChats();
  }, [user]);

  useEffect(() => {
    filterAndSortChats();
  }, [chats, searchTerm, dateFilter, sortBy]);

  const loadChats = async () => {
    setLoading(true);

    // 🔥 Only load CLOSED chats
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", user.username)
      .eq("status", "closed") // 🔥 Only show closed chats
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Failed to load mission archives");
    } else {
      setChats(data || []);
    }

    setLoading(false);
  };

  const filterAndSortChats = () => {
    let filtered = [...chats];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(chat => 
        chat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(chat.created_at).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    const now = new Date();
    switch (dateFilter) {
      case "today":
        filtered = filtered.filter(chat => {
          const chatDate = new Date(chat.created_at);
          return chatDate.toDateString() === now.toDateString();
        });
        break;
      case "week":
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        filtered = filtered.filter(chat => new Date(chat.created_at) >= weekAgo);
        break;
      case "month":
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        filtered = filtered.filter(chat => new Date(chat.created_at) >= monthAgo);
        break;
      default:
        break;
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredChats(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter("all");
    setSortBy("newest");
  };

  const exportChats = () => {
    toast.success("Export feature coming soon!");
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

  const getChatTitle = (chat) => {
    return `Mission ${chat.id.slice(-8).toUpperCase()}`;
  };

  return (
    <div className="min-h-screen   p-6">
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
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

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
          >
            <Archive className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold jarvis-gradient-text mb-2">
            Mission Archives
          </h1>
          <p className="text-cyan-300/60 text-lg">
            Review your completed AI assistance sessions
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="jarvis-glass rounded-2xl p-4 text-center border border-cyan-500/20">
            <div className="text-2xl font-bold text-cyan-400">{chats.length}</div>
            <div className="text-cyan-300/60 text-sm">Total Missions</div>
          </div>
          <div className="jarvis-glass rounded-2xl p-4 text-center border border-cyan-500/20">
            <div className="text-2xl font-bold text-green-400">
              {chats.filter(chat => new Date(chat.created_at).toDateString() === new Date().toDateString()).length}
            </div>
            <div className="text-cyan-300/60 text-sm">Today</div>
          </div>
          <div className="jarvis-glass rounded-2xl p-4 text-center border border-cyan-500/20">
            <div className="text-2xl font-bold text-purple-400">
              {chats.filter(chat => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(chat.created_at) >= weekAgo;
              }).length}
            </div>
            <div className="text-cyan-300/60 text-sm">This Week</div>
          </div>
          <div className="jarvis-glass rounded-2xl p-4 text-center border border-cyan-500/20">
            <div className="text-2xl font-bold text-yellow-400">
              {filteredChats.length}
            </div>
            <div className="text-cyan-300/60 text-sm">Filtered</div>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="jarvis-glass rounded-2xl p-6 mb-8 border border-cyan-500/20"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search mission archives..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="jarvis-input w-full pl-10 pr-4 py-3 text-cyan-100 placeholder-cyan-300/60"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div className="flex gap-4 flex-wrap">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="jarvis-input px-4 py-3 text-cyan-100"
              >
                {dateFilters.map(filter => (
                  <option key={filter.value} value={filter.value} className="bg-gray-900">
                    {filter.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="jarvis-input px-4 py-3 text-cyan-100"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-gray-900">
                    {option.label}
                  </option>
                ))}
              </select>

              <motion.button
                onClick={clearFilters}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="jarvis-btn-secondary flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Reset
              </motion.button>

             
            </div>
          </div>
        </motion.div>

        {/* Chat List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          {loading ? (
            // Loading Skeleton
            [...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="jarvis-glass rounded-2xl p-6 border border-cyan-500/20 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-cyan-400/20 rounded w-48"></div>
                    <div className="h-3 bg-cyan-400/10 rounded w-32"></div>
                  </div>
                  <div className="h-8 bg-cyan-400/20 rounded w-20"></div>
                </div>
              </motion.div>
            ))
          ) : filteredChats.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="jarvis-glass rounded-2xl p-12 text-center border border-cyan-500/20"
            >
              <MessageSquare className="w-16 h-16 text-cyan-400/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-cyan-100 mb-2">
                No missions found
              </h3>
              <p className="text-cyan-300/60 mb-6">
                {chats.length === 0 
                  ? "Complete your first chat session to see it here"
                  : "No missions match your current filters"
                }
              </p>
              {chats.length === 0 && (
                <Link to="/chat">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="jarvis-gradient-button flex items-center gap-2 mx-auto"
                  >
                    <Zap className="w-4 h-4" />
                    Start First Mission
                  </motion.button>
                </Link>
              )}
            </motion.div>
          ) : (
            // Chat Items
            <AnimatePresence>
              {filteredChats.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Link to={`/chat/${chat.id}`}>
                    <div className="jarvis-glass rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                              <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-cyan-100 group-hover:text-cyan-50 transition-colors">
                                {getChatTitle(chat)}
                              </h3>
                              <div className="flex items-center gap-2 text-cyan-300/60 text-sm">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(chat.created_at).toLocaleDateString()}</span>
                                <Clock className="w-3 h-3 ml-2" />
                                <span>{new Date(chat.created_at).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-cyan-300/60 text-sm">Completed</div>
                            <div className="text-cyan-400 text-sm font-medium">
                              {getTimeAgo(chat.created_at)}
                            </div>
                          </div>
                          
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-400/50 transition-colors"
                          >
                            <Eye className="w-4 h-4 text-cyan-400" />
                          </motion.div>
                        </div>
                      </div>
                      
                      {/* Progress bar for recent chats */}
                      {new Date(chat.created_at).toDateString() === new Date().toDateString() && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          className="mt-3 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transform origin-left"
                        />
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
}