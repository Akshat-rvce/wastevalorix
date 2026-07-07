import React from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, Minimize, BrainCircuit, Braces, Zap, 
  IndianRupee, Database, Handshake, FileText,
  Layout
} from 'lucide-react';
import ThreeGlobe from '../components/methodology/ThreeGlobe';

const pipelineData = [
  {
    id: 1, title: "Waste Capture", icon: Camera, tech: "Browser · getUserMedia", 
    desc: "User photographs waste via live camera or uploads image file", out: "→ JPEG/PNG · base64", color: "#00BCD4"
  },
  {
    id: 2, title: "Image Compression", icon: Minimize, tech: "Canvas API", 
    desc: "Image resized to 800px max, compressed to JPEG 80% to reduce API payload", out: "→ ~150KB optimized", color: "#8BC34A"
  },
  {
    id: 3, title: "AI Vision Analysis", icon: BrainCircuit, tech: "Gemini 2.5 Flash API", 
    desc: "Vision model receives image. Identifies waste type, quality score, and generates market data", out: "→ JSON · ~1200 tokens", color: "#00E676", isLarge: true
  },
  {
    id: 4, title: "Response Processing", icon: Braces, tech: "JS · Regex Extraction", 
    desc: "AI response parsed with regex to extract clean JSON. Validated for all required fields", out: "→ Structured Object", color: "#CE93D8"
  },
  {
    id: 5, title: "Energy Computation", icon: Zap, tech: "Calorific Value Engine", 
    desc: "kWh output = mass × coefficient. CO₂ savings calculated using validated data", out: "→ kWh · CO₂ · Revenue", color: "#FFC107"
  },
  {
    id: 6, title: "Price Analysis", icon: IndianRupee, tech: "Gemini Market Knowledge", 
    desc: "AI quality score cross-referenced with Indian commodity rates. Price range generated", out: "→ ₹Min/kg — ₹Max/kg", color: "#FF9800"
  },
  {
    id: 7, title: "Data Persistence", icon: Database, tech: "SQLite · Node.js", 
    desc: "Analysis results stored in local SQLite database via REST API. Includes image thumbnail", out: "→ Saved · ID assigned", color: "#1565C0"
  },
  {
    id: 8, title: "Marketplace Matching", icon: Handshake, tech: "Match Score Algorithm", 
    desc: "15 Indian waste buyers scored against waste type, quality, and location. Match % calculated", out: "→ Ranked Buyer List", color: "#00E676"
  },
  {
    id: 9, title: "Complete Report", icon: FileText, tech: "React · Recharts", 
    desc: "Full results page with energy metrics, market pricing, CO₂ impact, and buyer marketplace", out: "→ Actionable Insights", color: "#00BCD4"
  }
];

const RightArrow = ({ color }) => (
  <svg className="absolute top-1/2 left-[100%] w-[calc(100%-200px)] lg:w-[calc(100%-180px)] xl:w-24 h-8 -translate-y-1/2 z-0 hidden md:block overflow-visible" viewBox="0 0 48 32" preserveAspectRatio="none">
    <path id="r-arrow" d="M 0,16 L 48,16" stroke={color} strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.4" vectorEffect="non-scaling-stroke" />
    {[0, 0.5, 1].map(offset => (
      <circle key={offset} r="3" fill={color} filter="drop-shadow(0 0 4px currentColor)">
        <animateMotion dur="1.5s" repeatCount="indefinite" begin={`${offset * 1.5}s`} path="M 0,16 L 48,16" />
      </circle>
    ))}
  </svg>
);

const LeftArrow = ({ color }) => (
  <svg className="absolute top-1/2 right-[100%] w-[calc(100%-200px)] lg:w-[calc(100%-180px)] xl:w-24 h-8 -translate-y-1/2 z-0 hidden md:block overflow-visible" viewBox="0 0 48 32" preserveAspectRatio="none">
    <path d="M 48,16 L 0,16" stroke={color} strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.4" vectorEffect="non-scaling-stroke" />
    {[0, 0.5, 1].map(offset => (
      <circle key={offset} r="3" fill={color} filter="drop-shadow(0 0 4px currentColor)">
        <animateMotion dur="1.5s" repeatCount="indefinite" begin={`${offset * 1.5}s`} path="M 48,16 L 0,16" />
      </circle>
    ))}
  </svg>
);

const UTurnRight = ({ color }) => (
  <svg className="absolute top-1/2 left-[100%] w-24 h-[240px] z-0 hidden md:block overflow-visible" viewBox="0 0 96 240">
    <path d="M 0,0 C 96,0 96,240 0,240" stroke={color} strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.4" />
    {[0, 0.5, 1].map(offset => (
      <circle key={offset} r="3" fill={color} filter="drop-shadow(0 0 4px currentColor)">
        <animateMotion dur="2.5s" repeatCount="indefinite" begin={`${offset * 2.5}s`} path="M 0,0 C 96,0 96,240 0,240" />
      </circle>
    ))}
  </svg>
);

const UTurnLeft = ({ color }) => (
  <svg className="absolute top-1/2 right-[100%] w-24 h-[240px] z-0 hidden md:block overflow-visible" viewBox="0 0 96 240">
    <path d="M 96,0 C 0,0 0,240 96,240" stroke={color} strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.4" />
    {[0, 0.5, 1].map(offset => (
      <circle key={offset} r="3" fill={color} filter="drop-shadow(0 0 4px currentColor)">
        <animateMotion dur="2.5s" repeatCount="indefinite" begin={`${offset * 2.5}s`} path="M 96,0 C 0,0 0,240 96,240" />
      </circle>
    ))}
  </svg>
);

const DownArrow = ({ color }) => (
  <svg className="absolute top-[100%] left-1/2 w-8 h-12 -translate-x-1/2 z-0 md:hidden overflow-visible" viewBox="0 0 32 48">
    <path d="M 16,0 L 16,48" stroke={color} strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.4" />
    {[0, 0.5, 1].map(offset => (
      <circle key={offset} r="3" fill={color}>
        <animateMotion dur="1s" repeatCount="indefinite" begin={`${offset * 1}s`} path="M 16,0 L 16,48" />
      </circle>
    ))}
  </svg>
);

const PipelineCard = ({ data }) => {
  const Icon = data.icon;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`relative rounded-2xl bg-[#0A1A0D]/90 backdrop-blur-md border p-4 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-10 transition-transform duration-300 hover:scale-105 hover:-translate-y-2 shrink-0
        ${data.isLarge ? 'md:w-[260px] md:h-[180px] shadow-[0_0_30px_rgba(0,230,118,0.2)]' : 'md:w-[220px] md:h-[160px]'}
        w-full
      `}
      style={{ borderColor: `${data.color}40` }}
    >
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-lg bg-black/30 border border-white/5">
          <Icon size={20} color={data.color} />
        </div>
        <span className="text-[10px] text-white/50 font-mono bg-black/40 px-2 py-1 rounded">STG_{data.id}</span>
      </div>
      
      <div className="mt-2">
        <h3 className="text-white font-bold text-sm">{data.title}</h3>
        <p className="text-white/60 text-[10px] mt-1 leading-tight line-clamp-3">{data.desc}</p>
      </div>

      <div className="mt-3">
        <div className="text-[9px] font-mono mb-1" style={{ color: data.color }}>{data.tech}</div>
        <div className="text-[10px] font-medium bg-black/50 px-2 py-1.5 rounded text-white/80 border border-white/5 border-l-2" style={{ borderLeftColor: data.color }}>
          {data.out}
        </div>
      </div>
      
      {data.isLarge && (
        <div className="absolute inset-0 rounded-2xl border border-[#00E676] animate-pulse pointer-events-none opacity-50" />
      )}
    </motion.div>
  );
};

const techStack = ['React.js', 'Gemini AI', 'Node.js', 'SQLite', 'Express', 'Recharts', 'Canvas API', 'Three.js'];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-[#030A05] text-white w-full overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden border-b border-white/5 pt-16">
        <ThreeGlobe />
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-6 backdrop-blur-md">
            <Zap size={14} /> RVCE WasteValorix Project
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white tracking-tight mb-4 max-w-4xl">
            WasteValorix — <span className="text-gradient">System Architecture</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl font-light">
            AI-Powered Waste Valorization Pipeline
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030A05] to-transparent z-10 pointer-events-none" />
      </section>

      {/* Tech Stack Floating Pills */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-2xl mx-auto -mt-6 relative z-20 px-4">
        {techStack.map((tech, i) => (
          <motion.div
            key={tech}
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
            className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-white/70 shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-default hover:bg-white/10 hover:text-white transition-colors hover:scale-110"
          >
            {tech}
          </motion.div>
        ))}
      </div>

      {/* Main 3D Pipeline */}
      <section className="max-w-6xl mx-auto py-24 px-6 relative [perspective:1200px]">
        
        <div className="relative md:[transform-style:preserve-3d] md:[transform:rotateX(8deg)] space-y-12 md:space-y-0">
          
          {/* Row 1 */}
          <div className="flex flex-col md:flex-row justify-between w-full gap-12 md:gap-8 relative z-30 md:mb-20">
            <div className="relative w-full md:w-auto flex justify-center"><PipelineCard data={pipelineData[0]} /><RightArrow color={pipelineData[0].color} /><DownArrow color={pipelineData[0].color}/></div>
            <div className="relative w-full md:w-auto flex justify-center"><PipelineCard data={pipelineData[1]} /><RightArrow color={pipelineData[1].color} /><DownArrow color={pipelineData[1].color}/></div>
            <div className="relative w-full md:w-auto flex justify-center"><PipelineCard data={pipelineData[2]} /><UTurnRight color={pipelineData[2].color} /><DownArrow color={pipelineData[2].color}/></div>
          </div>
          
          {/* Row 2 (flex-row-reverse visual flow) */}
          <div className="flex flex-col md:flex-row-reverse justify-between w-full gap-12 md:gap-8 relative z-20 md:mb-20">
            <div className="relative w-full md:w-auto flex justify-center"><PipelineCard data={pipelineData[3]} /><LeftArrow color={pipelineData[3].color} /><DownArrow color={pipelineData[3].color}/></div>
            <div className="relative w-full md:w-auto flex justify-center"><PipelineCard data={pipelineData[4]} /><LeftArrow color={pipelineData[4].color} /><DownArrow color={pipelineData[4].color}/></div>
            <div className="relative w-full md:w-auto flex justify-center"><PipelineCard data={pipelineData[5]} /><UTurnLeft color={pipelineData[5].color} /><DownArrow color={pipelineData[5].color}/></div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col md:flex-row justify-between w-full gap-12 md:gap-8 relative z-10">
            <div className="relative w-full md:w-auto flex justify-center"><PipelineCard data={pipelineData[6]} /><RightArrow color={pipelineData[6].color} /><DownArrow color={pipelineData[6].color}/></div>
            <div className="relative w-full md:w-auto flex justify-center"><PipelineCard data={pipelineData[7]} /><RightArrow color={pipelineData[7].color} /><DownArrow color={pipelineData[7].color}/></div>
            <div className="relative w-full md:w-auto flex justify-center"><PipelineCard data={pipelineData[8]} /></div>
          </div>

        </div>
      </section>

      {/* Metrics Strip */}
      <section className="bg-card/30 border-y border-white/5 py-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-6">
          {[
            { value: "~3 sec", label: "Analysis time" },
            { value: "24+", label: "Data points extracted" },
            { value: "15+", label: "Active buyers matched" },
            { value: "9", label: "Processing stages" },
          ].map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-black/40 backdrop-blur-sm border border-border rounded-xl p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
            >
              <div className="text-2xl md:text-3xl font-bold text-gradient mb-2">{m.value}</div>
              <div className="text-[10px] md:text-xs text-text-soft font-medium uppercase tracking-widest">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Architecture layers */}
      <section className="py-24 px-6 overflow-hidden relative z-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">System Architecture</h2>
          <p className="text-text-soft max-w-lg mx-auto">A robust three-tier architecture ensuring scalable, real-time AI processing and seamless user experience.</p>
        </div>

        <div className="max-w-3xl mx-auto [perspective:1000px] h-auto flex flex-col items-center">
          <div className="w-full relative [transform-style:preserve-3d] md:[transform:rotateX(15deg)_rotateY(-5deg)] space-y-12">
            
            {/* Top Layer */}
            <motion.div 
              initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="relative w-full p-8 rounded-2xl bg-gradient-to-r from-blue-900/40 to-blue-800/10 border border-blue-500/30 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-md md:[transform:translateZ(80px)]"
            >
              <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2 tracking-wide"><Layout size={18} /> FRONTEND PRESENTATION</h3>
              <p className="text-white/70 text-sm font-medium">React.js · Vite · Tailwind CSS · Three.js · Framer Motion</p>
              <div className="mt-4 flex gap-2">
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded">User Interface</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Camera API</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded">3D Visuals</span>
              </div>
            </motion.div>

            {/* Middle Layer */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="relative w-full p-8 rounded-2xl bg-gradient-to-r from-[#00E676]/20 to-[#00E676]/5 border border-[#00E676]/30 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-md"
            >
              <div className="absolute top-0 bottom-0 left-12 w-px border-l-2 border-dashed border-white/20 -translate-y-12 h-[calc(100%+3rem)] -z-10" />
              <h3 className="text-[#00E676] font-bold mb-3 flex items-center gap-2 tracking-wide"><BrainCircuit size={18} /> AI & PROCESSING</h3>
              <p className="text-white/70 text-sm font-medium">Google Gemini 2.5 Flash Vision API · Custom Validation Engine</p>
              <div className="mt-4 flex gap-2">
                <span className="text-[10px] bg-[#00E676]/20 text-[#00E676] px-2 py-1 rounded">Vision Model</span>
                <span className="text-[10px] bg-[#00E676]/20 text-[#00E676] px-2 py-1 rounded">Price Intelligence</span>
                <span className="text-[10px] bg-[#00E676]/20 text-[#00E676] px-2 py-1 rounded">Regex Parser</span>
              </div>
            </motion.div>

            {/* Bottom Layer */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="relative w-full p-8 rounded-2xl bg-gradient-to-r from-purple-900/40 to-purple-800/10 border border-purple-500/30 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-md md:[transform:translateZ(-80px)]"
            >
              <div className="absolute top-0 bottom-0 left-12 w-px border-l-2 border-dashed border-white/20 -translate-y-12 h-[calc(100%+3rem)] -z-10" />
              <h3 className="text-purple-400 font-bold mb-3 flex items-center gap-2 tracking-wide"><Database size={18} /> BACKEND PERSISTENCE</h3>
              <p className="text-white/70 text-sm font-medium">Node.js · Express.js REST API · SQLite Database</p>
              <div className="mt-4 flex gap-2">
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Local Storage</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Buyer Match Algo</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded">REST Endpoints</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
}
