import { useState } from "react";
import { 
  Activity, 
  BrainCircuit, 
  MessageSquare, 
  Fingerprint, 
  ShieldCheck, 
  Send,
  AlertTriangle,
  FileText,
  Network
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Import generated assets
import drPonzIcon from "@/assets/images/dr-ponz-icon.png";
import heroBg from "@/assets/images/hero-bg.png"; // Bringing back the Synapse theme bg

export default function Dashboard() {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    // Simulate analysis delay
    setTimeout(() => setIsAnalyzing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-fuchsia-500/30 overflow-hidden relative">
      {/* Abstract Cyberpunk Synapse background */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Top Navigation / Header - Cyberpunk / Synapse Theme */}
      <header className="border-b border-fuchsia-500/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10 shadow-[0_4px_30px_rgba(217,70,239,0.05)]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-lg border-2 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.4)] relative">
              <AvatarImage src={drPonzIcon} alt="Dr. Ponz" />
              <AvatarFallback className="rounded-lg bg-slate-900 text-cyan-400 font-mono text-xs">DP</AvatarFallback>
              {/* Glowing dot indicator */}
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-fuchsia-500 rounded-full border-2 border-slate-900 shadow-[0_0_10px_rgba(217,70,239,0.8)]"></div>
            </Avatar>
            <div>
              <h1 className="text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                PROJECT SYNAPSE
              </h1>
              <div className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase flex items-center gap-2">
                <Network className="h-3 w-3" /> Dr. Ponz Behavioral Analysis Core
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1 rounded-full border border-fuchsia-500/30">
              <ShieldCheck className="h-4 w-4" />
              <span>NEURAL_LINK_SECURE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
              </span>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">Synapse Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Input & History */}
          <div className="lg:col-span-5 space-y-6">
            {/* Glow wrapper for Cyberpunk aesthetic */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur-sm"></div>
              <Card className="relative border-slate-800/60 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
                <CardHeader className="pb-4 border-b border-white/5">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-cyan-400 tracking-wide drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">
                    <MessageSquare className="h-5 w-5" />
                    Subject Data Stream
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs font-mono">
                    Awaiting dialogue intercept or behavioral logs for Synapse processing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <Textarea 
                    placeholder="Initialize data feed..."
                    className="min-h-[220px] bg-slate-950/80 border-cyan-900/50 text-cyan-100 placeholder:text-cyan-800/50 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-400/50 font-mono text-sm resize-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    data-testid="input-subject-text"
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] font-mono text-fuchsia-400/70 tracking-widest">
                      STREAM_SIZE: {inputText.length}B
                    </div>
                    <Button 
                      onClick={handleAnalyze} 
                      disabled={isAnalyzing || !inputText.trim()}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)] border border-cyan-400/50 transition-all font-bold tracking-wide"
                      data-testid="button-analyze"
                    >
                      {isAnalyzing ? (
                        <span className="flex items-center gap-2">
                          <Activity className="h-4 w-4 animate-spin" /> Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" /> Initialize Scan
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-slate-800/60 bg-slate-900/80 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              {/* Techy accents */}
              <div className="absolute top-0 right-0 w-16 h-1 bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.8)]"></div>
              <CardHeader className="py-4 border-b border-white/5 bg-slate-950/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-300 font-mono tracking-wider">
                  <FileText className="h-4 w-4 text-fuchsia-400" />
                  MEMORY_BANKS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[200px]">
                  <div className="divide-y divide-white/5">
                    {[
                      { id: "LOG-094", subject: "Subject 04", preview: "Evasion detected regarding timeline...", time: "10:42 AM", highlight: "border-l-fuchsia-500" },
                      { id: "LOG-093", subject: "Subject 12", preview: "High cognitive load during questioning...", time: "09:15 AM", highlight: "border-l-amber-500" },
                      { id: "LOG-092", subject: "Subject 04", preview: "Baseline established. Normal variations.", time: "Yesterday", highlight: "border-l-cyan-500" }
                    ].map((item) => (
                      <div key={item.id} className={`p-4 hover:bg-slate-800/50 transition-colors cursor-pointer group border-l-2 border-transparent hover:${item.highlight} bg-gradient-to-r from-transparent hover:from-white/5`} data-testid={`history-item-${item.id}`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-mono text-cyan-400 group-hover:text-cyan-300">{item.id}</span>
                          <span className="text-[10px] font-mono text-slate-500">{item.time}</span>
                        </div>
                        <div className="text-sm font-medium text-slate-200 mb-1">{item.subject}</div>
                        <div className="text-xs text-slate-400 truncate font-mono opacity-70">{item.preview}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Analysis Output */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Psychometric Profiling */}
              <div className="relative group col-span-1 md:col-span-2">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-fuchsia-500/50 to-purple-600/50 rounded-xl opacity-20 group-hover:opacity-30 transition duration-500 blur-sm"></div>
                <Card className="relative border-slate-800/60 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
                  <CardHeader className="pb-4 bg-gradient-to-r from-fuchsia-950/30 to-transparent border-b border-fuchsia-500/20">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold flex items-center gap-2 text-fuchsia-400 tracking-wide drop-shadow-[0_0_5px_rgba(217,70,239,0.4)]">
                        <BrainCircuit className="h-5 w-5" />
                        Neural Psychometric Profiling
                      </CardTitle>
                      <Badge variant="outline" className="bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/50 font-mono rounded-sm shadow-[0_0_10px_rgba(217,70,239,0.2)]">
                        CONFIDENCE: 94.2%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-300">Cognitive Dissonance</span>
                            <span className="text-fuchsia-400 font-bold drop-shadow-[0_0_3px_rgba(217,70,239,0.5)]">78%</span>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 bg-fuchsia-500/20 blur-[2px] rounded-full"></div>
                            <Progress value={78} className="h-1.5 bg-slate-800 relative z-10" indicatorClassName="bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-300">Emotional Volatility</span>
                            <span className="text-rose-400 font-bold drop-shadow-[0_0_3px_rgba(244,63,94,0.5)]">62%</span>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 bg-rose-500/20 blur-[2px] rounded-full"></div>
                            <Progress value={62} className="h-1.5 bg-slate-800 relative z-10" indicatorClassName="bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-300">Deceptive Indicators</span>
                            <span className="text-cyan-400 font-bold drop-shadow-[0_0_3px_rgba(34,211,238,0.5)]">24%</span>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500/20 blur-[2px] rounded-full"></div>
                            <Progress value={24} className="h-1.5 bg-slate-800 relative z-10" indicatorClassName="bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-300">Cooperation Index</span>
                            <span className="text-emerald-400 font-bold drop-shadow-[0_0_3px_rgba(52,211,153,0.5)]">88%</span>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-[2px] rounded-full"></div>
                            <Progress value={88} className="h-1.5 bg-slate-800 relative z-10" indicatorClassName="bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Inferred Intentions */}
              <Card className="border-slate-800/60 bg-slate-900/80 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-cyan-400 tracking-wide font-mono">
                    <Fingerprint className="h-4 w-4" />
                    INFERRED_VECTORS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 border border-cyan-500/30 px-2.5 py-1 rounded-sm text-xs font-mono shadow-[0_0_10px_rgba(34,211,238,0.1)]">Info_Seeking</Badge>
                    <Badge className="bg-fuchsia-950/40 text-fuchsia-300 hover:bg-fuchsia-900/60 border border-fuchsia-500/30 px-2.5 py-1 rounded-sm text-xs font-mono shadow-[0_0_10px_rgba(217,70,239,0.1)]">Defensive_State</Badge>
                    <Badge className="bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 border border-rose-500/50 px-2.5 py-1 rounded-sm text-xs font-mono shadow-[0_0_10px_rgba(244,63,94,0.2)] animate-pulse">Withholding</Badge>
                    <Badge className="bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600 px-2.5 py-1 rounded-sm text-xs font-mono">Authority_Test</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Communication Patterns */}
              <Card className="border-slate-800/60 bg-slate-900/80 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-fuchsia-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-fuchsia-400 tracking-wide font-mono">
                    <Activity className="h-4 w-4" />
                    SYNAPTIC_PATTERNS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-slate-300 p-2 bg-white/5 rounded border border-white/5">
                      <div className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 mt-1.5 shrink-0 shadow-[0_0_5px_rgba(217,70,239,0.8)]" />
                      <span className="font-mono text-xs opacity-90">Distancing language detected around trigger events.</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-300 p-2 bg-white/5 rounded border border-white/5">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0 shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                      <span className="font-mono text-xs opacity-90">Syntactic complexity drops 40% during stress points.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Clinical Recommendations */}
              <Card className="border-rose-900/50 bg-slate-900/80 shadow-[0_0_30px_rgba(244,63,94,0.1)] backdrop-blur-xl md:col-span-2 relative overflow-hidden">
                {/* Danger strip */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600"></div>
                <CardHeader className="pb-4 bg-rose-950/20">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-rose-400 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]">
                    <AlertTriangle className="h-4 w-4" />
                    Tactical Recommendations
                  </CardTitle>
                </CardHeader>
                <Separator className="bg-rose-900/30" />
                <CardContent className="pt-5">
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-950/80 rounded-lg border border-rose-900/50 shadow-[inset_0_0_15px_rgba(244,63,94,0.05)] relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-1 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"></div>
                      <p className="text-sm text-slate-300 leading-relaxed font-mono">
                        <span className="text-rose-400 font-bold mr-2 drop-shadow-[0_0_3px_rgba(244,63,94,0.5)]">ACTION_REQUIRED:</span>
                        Pivot questioning strategy. Direct confrontation is triggering firewall routines. Recommend indirect approach via peripheral details to lower cognitive defenses.
                      </p>
                    </div>
                    <div className="p-4 bg-slate-950/80 rounded-lg border border-cyan-900/50 shadow-[inset_0_0_15px_rgba(34,211,238,0.05)] relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-1 bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                      <p className="text-sm text-slate-300 leading-relaxed font-mono">
                        <span className="text-cyan-400 font-bold mr-2 drop-shadow-[0_0_3px_rgba(34,211,238,0.5)]">CONTINUE_MONITORING:</span>
                        Track micro-hesitations around topic "Project Synthesis". Detected 78% probability of underlying cognitive dissonance related to this specific node.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
