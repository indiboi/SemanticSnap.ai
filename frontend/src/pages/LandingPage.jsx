import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Search,
  ArrowRight,
  Database,
  Image as ImageIcon,
  Layers,
  ShieldCheck,
  Zap,
  Cpu,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Eye,
  Lock,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  // Interactive Live Demo State
  const sampleQueries = [
    {
      query: "Golden hour sunset over rolling ocean waves",
      tag: "Nature & Landscape",
      similarity: "98.7%",
      vectorScore: "0.987",
      color: "from-amber-500/20 to-orange-500/10",
      accent: "text-amber-400",
      mockTitle: "sunset_coastal_golden_hour.jpg",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #431407 100%)",
    },
    {
      query: "Cyberpunk street in rain with vibrant neon signs",
      tag: "Urban & Night",
      similarity: "97.4%",
      vectorScore: "0.974",
      color: "from-cyan-500/20 to-fuchsia-500/10",
      accent: "text-cyan-400",
      mockTitle: "neo_tokyo_rainy_night.webp",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #a855f7 50%, #0f172a 100%)",
    },
    {
      query: "Cozy coffee shop interior with wooden shelves and latte art",
      tag: "Lifestyle",
      similarity: "96.9%",
      vectorScore: "0.969",
      color: "from-emerald-500/20 to-teal-500/10",
      accent: "text-emerald-400",
      mockTitle: "artisan_cafe_morning.png",
      gradient: "linear-gradient(135deg, #10b981 0%, #0d9488 50%, #1e293b 100%)",
    },
    {
      query: "Fluffy golden retriever puppy playing with a tennis ball",
      tag: "Animals",
      similarity: "99.2%",
      vectorScore: "0.992",
      color: "from-violet-500/20 to-purple-500/10",
      accent: "text-violet-400",
      mockTitle: "retriever_pup_meadow.jpg",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #1e1b4b 100%)",
    },
  ];

  const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const activeDemo = sampleQueries[activeQueryIndex];

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100 selection:bg-accent-500/30 selection:text-accent-300 relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-accent-600/10 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute top-[40%] -left-40 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[160px]" />
        <div className="absolute top-[65%] -right-40 w-[700px] h-[700px] bg-accent-700/10 rounded-full blur-[180px]" />
        <div className="absolute inset-0 radial-grid opacity-30" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-dark-950/75 backdrop-blur-xl border-b border-white/[0.06] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to={isAuthenticated ? "/gallery" : "/"} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-600 to-accent-400 p-[1px] shadow-lg shadow-accent-500/20 group-hover:shadow-accent-500/40 transition-shadow">
              <div className="w-full h-full bg-dark-900 rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-400 transition-transform group-hover:scale-110 duration-300" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                SemanticSnap<span className="text-accent-400">.ai</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-300 ml-1">
                  v2.0
                </span>
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-dark-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#demo" className="hover:text-white transition-colors">Live Simulation</a>
            <a href="#tech" className="hover:text-white transition-colors">Architecture</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-dark-900/80 hover:bg-dark-800 border border-white/[0.08] flex items-center justify-center text-dark-300 hover:text-white transition-colors cursor-pointer"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-accent-400" />
              )}
            </button>

            {isAuthenticated ? (
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-medium text-sm shadow-lg shadow-accent-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Go to Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-dark-200 hover:text-white hover:bg-white/[0.05] border border-white/[0.08] transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 shadow-md shadow-accent-600/30 transition-all hover:shadow-accent-500/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4 hidden sm:inline-block" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md shadow-inner"
          >
            <Sparkles className="w-4 h-4 text-accent-400 animate-pulse" />
            <span>Next-Gen Multimodal Vector Search</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
            <span className="text-dark-300">No Manual Tagging Needed</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6"
          >
            Search your media by <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-accent-300 via-purple-300 to-accent-500 bg-clip-text text-transparent">
              what's actually inside
            </span>
            , not file names.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            SemanticSnap transforms your personal photos and videos into a 3,072-dimensional vector space. Search with natural concepts, feelings, and objects like you speak.
          </motion.p>

          {/* 2 Primary CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16"
          >
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-600 via-accent-500 to-purple-600 hover:from-accent-500 hover:to-purple-500 text-white font-semibold text-base shadow-xl shadow-accent-600/30 hover:shadow-accent-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-dark-900/90 hover:bg-dark-800 text-dark-100 hover:text-white font-semibold text-base border border-white/[0.12] hover:border-white/20 shadow-lg backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Lock className="w-4 h-4 text-accent-400" />
              <span>Sign In to Vault</span>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-4 rounded-2xl bg-dark-900/50 border border-white/[0.06] backdrop-blur-md"
          >
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">3,072 D</div>
              <div className="text-xs text-dark-400 mt-1 uppercase font-medium tracking-wider">Vector Space</div>
            </div>
            <div className="p-3 text-center border-l border-white/[0.06]">
              <div className="text-2xl sm:text-3xl font-bold text-accent-400 tracking-tight">&lt; 40 ms</div>
              <div className="text-xs text-dark-400 mt-1 uppercase font-medium tracking-wider">Query Latency</div>
            </div>
            <div className="p-3 text-center border-l border-white/[0.06]">
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Zero</div>
              <div className="text-xs text-dark-400 mt-1 uppercase font-medium tracking-wider">Manual Tagging</div>
            </div>
            <div className="p-3 text-center border-l border-white/[0.06]">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">100%</div>
              <div className="text-xs text-dark-400 mt-1 uppercase font-medium tracking-wider">User Isolation</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Simulation Section */}
      <section id="demo" className="py-16 bg-dark-900/40 border-y border-white/[0.05] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-accent-400 mb-2">Live Vector Preview</h2>
            <p className="text-2xl sm:text-3xl font-bold text-white">Try asking in plain natural English</p>
            <p className="text-dark-400 text-sm mt-2">Click an example prompt below to see how cosine similarity matches concepts.</p>
          </div>

          {/* Query Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
            {sampleQueries.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveQueryIndex(index)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                  activeQueryIndex === index
                    ? 'bg-accent-600 text-white shadow-lg shadow-accent-600/30 scale-105'
                    : 'bg-dark-850 hover:bg-dark-800 text-dark-300 hover:text-white border border-white/[0.06]'
                }`}
              >
                <Search className="w-3.5 h-3.5 opacity-70" />
                <span>"{item.query.slice(0, 32)}..."</span>
              </button>
            ))}
          </div>

          {/* Interactive Result Card */}
          <div className="max-w-3xl mx-auto bg-dark-900 rounded-3xl border border-white/[0.1] shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Simulated Search Bar */}
            <div className="flex items-center gap-3 p-3.5 bg-dark-950/80 rounded-2xl border border-white/[0.08] mb-6">
              <Search className="w-5 h-5 text-accent-400 shrink-0" />
              <div className="flex-1 text-sm sm:text-base text-white font-medium truncate">
                {activeDemo.query}
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-accent-500/10 text-accent-300 border border-accent-500/20">
                Vector Query
              </span>
            </div>

            {/* Result Simulation Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Graphic Simulation Card */}
              <div
                className="h-56 sm:h-64 rounded-2xl relative overflow-hidden shadow-inner flex flex-col justify-between p-4 group"
                style={{ background: activeDemo.gradient }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90">
                    {activeDemo.tag}
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{activeDemo.similarity} Match</span>
                  </div>
                </div>

                <div className="p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-left">
                  <div className="text-xs font-mono text-white/90 truncate font-semibold">
                    {activeDemo.mockTitle}
                  </div>
                  <div className="text-[11px] text-dark-300 flex items-center justify-between mt-1">
                    <span>Cosine Similarity</span>
                    <span className="font-mono text-emerald-400 font-bold">{activeDemo.vectorScore}</span>
                  </div>
                </div>
              </div>

              {/* Explanatory Breakdown */}
              <div className="space-y-4 text-left">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-dark-400 mb-1">
                    Semantic Vector Decomposition
                  </h4>
                  <p className="text-white font-medium text-sm sm:text-base">
                    Gemini 3,072D Embedding matched visual attributes directly from pixels.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-dark-300">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-dark-950/60 border border-white/[0.04]">
                    <span className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-accent-400" /> Embedding Engine
                    </span>
                    <span className="text-white font-mono">gemini-embedding-2</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-dark-950/60 border border-white/[0.04]">
                    <span className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-purple-400" /> Vector Database
                    </span>
                    <span className="text-white font-mono">Qdrant HNSW Collection</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-dark-950/60 border border-white/[0.04]">
                    <span className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-400" /> Distance Metric
                    </span>
                    <span className="text-emerald-400 font-mono">Cosine Distance</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent-400 hover:text-accent-300 transition-colors"
                  >
                    <span>Test with your own pictures</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-accent-400 mb-2">Engineered For Precision</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Next generation media management
          </p>
          <p className="text-dark-300 text-base mt-3">
            Say goodbye to forgotten folders, disorganized filenames, and manual tag entry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Multimodal Embeddings */}
          <div className="p-8 rounded-3xl bg-dark-900 border border-white/[0.08] relative group hover:border-accent-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-accent-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Multimodal Embeddings</h3>
            <p className="text-dark-300 text-sm leading-relaxed">
              Every image uploaded is analyzed by Google's multimodal embedding engine, distilling visual essence, lighting, context, and elements into numeric coordinates.
            </p>
          </div>

          {/* Card 2: Qdrant Vector Engine */}
          <div className="p-8 rounded-3xl bg-dark-900 border border-white/[0.08] relative group hover:border-purple-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Qdrant Vector Engine</h3>
            <p className="text-dark-300 text-sm leading-relaxed">
              State-of-the-art vector similarity indexing via Qdrant. Fast approximate nearest neighbor search ensures instantaneous query returns even at massive scale.
            </p>
          </div>

          {/* Card 3: Encrypted User Vaults */}
          <div className="p-8 rounded-3xl bg-dark-900 border border-white/[0.08] relative group hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Strict Vault Isolation</h3>
            <p className="text-dark-300 text-sm leading-relaxed">
              Your media stays exclusively yours. Vector payload indexing and database schemas strictly isolate your embeddings with cryptographic JWT session validation.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-dark-900/30 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-accent-400 mb-2">Workflow</h2>
            <p className="text-3xl font-extrabold text-white">How SemanticSnap Works</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-dark-900/60 border border-white/[0.06]">
              <div className="w-14 h-14 rounded-2xl bg-accent-600/20 border border-accent-500/30 text-accent-400 font-bold text-lg flex items-center justify-center mb-4">
                01
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Upload Files</h4>
              <p className="text-sm text-dark-300 leading-relaxed">
                Drag and drop your images or videos. Securely processed and saved to your storage vault.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-dark-900/60 border border-white/[0.06]">
              <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 font-bold text-lg flex items-center justify-center mb-4">
                02
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Background Vectorization</h4>
              <p className="text-sm text-dark-300 leading-relaxed">
                Asynchronous worker generates 3,072-dimensional embeddings and inserts points into Qdrant.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-dark-900/60 border border-white/[0.06]">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-bold text-lg flex items-center justify-center mb-4">
                03
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Instant Recall</h4>
              <p className="text-sm text-dark-300 leading-relaxed">
                Type any thought or visual descriptor. Receive high-relevance matches ranked by cosine similarity score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-dark-900 to-dark-950 border border-white/[0.1] p-10 sm:p-14 text-center shadow-2xl">
            {/* Ambient glow behind CTA */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent-600/15 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Ready to search your media intelligently?
              </h2>
              <p className="text-dark-300 text-base sm:text-lg mb-8">
                Create an account in seconds or sign into your existing gallery vault to start exploring.
              </p>

              {/* Both Buttons prominently visible */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-semibold text-sm shadow-xl shadow-accent-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Sign Up Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-dark-100 hover:text-white font-semibold text-sm border border-white/[0.1] transition-all"
                >
                  <Lock className="w-4 h-4 text-accent-400" />
                  <span>Log In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-10 border-t border-white/[0.06] text-center text-xs text-dark-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-dark-300">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span className="font-semibold text-white">SemanticSnap.ai</span>
            <span>— AI-Powered Multimodal Media Vault</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Vector Engine: Online
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
