import { useState, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Send, Brain, FileText, HelpCircle, GraduationCap, Sparkles, Loader2, Bot, User, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-2 h-2 rounded-full bg-primary/60"
        style={{
          animation: `typing-dot 1.4s ${i * 0.2}s ease-in-out infinite`,
        }}
      />
    ))}
  </div>
);

const ChatMessage = ({ message, index }: { message: Message; index: number }) => {
  const isUser = message.role === "user";
  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} animate-slide-up`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? "gradient-hero" : "bg-accent"
      }`}>
        {isUser ? <User className="w-4 h-4 text-primary-foreground" /> : <Bot className="w-4 h-4 text-primary" />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "gradient-chat-user text-primary-foreground rounded-br-md"
            : "gradient-chat-ai text-foreground rounded-bl-md border border-border/50"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

const AIAssistant = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "chat";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { toast } = useToast();

  // Chat state
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! 👋 I'm EduBloom AI, your study assistant. Ask me anything about your courses, concepts, or academic topics. I'm here to help!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Summarizer state
  const [summaryInput, setSummaryInput] = useState("");
  const [summaryOutput, setSummaryOutput] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Questions state
  const [questionTopic, setQuestionTopic] = useState("");
  const [questionsOutput, setQuestionsOutput] = useState("");
  const [questionsLoading, setQuestionsLoading] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  const callAI = async (messages: Message[], mode: string) => {
    const { data, error } = await supabase.functions.invoke("edubloom-ai", {
      body: { messages, mode },
    });
    if (error) throw error;
    if (data?.error) {
      if (data.loading) throw new Error("Model is loading, please wait a moment and try again.");
      throw new Error(data.error);
    }
    return data.response;
  };

  const handleChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: Message = { role: "user", content: chatInput.trim() };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput("");
    setChatLoading(true);
    try {
      const response = await callAI(newMessages, "chat");
      setChatMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to get response", variant: "destructive" });
    } finally {
      setChatLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!summaryInput.trim() || summaryLoading) return;
    setSummaryLoading(true);
    setSummaryOutput("");
    try {
      const response = await callAI([{ role: "user", content: summaryInput }], "summarize");
      setSummaryOutput(response);
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to summarize", variant: "destructive" });
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!questionTopic.trim() || questionsLoading) return;
    setQuestionsLoading(true);
    setQuestionsOutput("");
    try {
      const response = await callAI([{ role: "user", content: questionTopic }], "questions");
      setQuestionsOutput(response);
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to generate questions", variant: "destructive" });
    } finally {
      setQuestionsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Back</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center animate-pulse-glow">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display font-bold text-foreground">AI Study Assistant</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-hero flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm text-foreground hidden sm:inline">EDUBLOOM</span>
          </Link>
        </div>
      </nav>

      <div className="pt-20 pb-8 container mx-auto px-4 max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 glass-card rounded-xl p-1 mb-6">
            <TabsTrigger value="chat" className="flex items-center gap-2 font-medium data-[state=active]:gradient-hero data-[state=active]:text-primary-foreground rounded-lg transition-all">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="summarizer" className="flex items-center gap-2 font-medium data-[state=active]:gradient-hero data-[state=active]:text-primary-foreground rounded-lg transition-all">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Summarizer</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2 font-medium data-[state=active]:gradient-hero data-[state=active]:text-primary-foreground rounded-lg transition-all">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Questions</span>
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="mt-0">
            <div className="glass-card rounded-2xl overflow-hidden flex flex-col" style={{ height: "calc(100vh - 200px)" }}>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, i) => (
                  <ChatMessage key={i} message={msg} index={i} />
                ))}
                {chatLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="gradient-chat-ai rounded-2xl rounded-bl-md border border-border/50">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
                <form onSubmit={(e) => { e.preventDefault(); handleChat(); }} className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask me anything about your studies..."
                    className="flex-1 bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    disabled={chatLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={chatLoading || !chatInput.trim()}
                    className="gradient-hero text-primary-foreground border-0 rounded-xl w-12 h-12 hover:opacity-90 transition-all hover:scale-105 shadow-soft"
                  >
                    {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>

          {/* Summarizer Tab */}
          <TabsContent value="summarizer" className="mt-0">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-foreground">Notes Summarizer</h2>
                  <p className="text-xs text-muted-foreground">Paste your notes and get a concise summary</p>
                </div>
              </div>
              <textarea
                value={summaryInput}
                onChange={(e) => setSummaryInput(e.target.value)}
                placeholder="Paste your study notes, article, or any long text here..."
                rows={8}
                className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all"
              />
              <Button
                onClick={handleSummarize}
                disabled={summaryLoading || !summaryInput.trim()}
                className="gradient-hero text-primary-foreground border-0 shadow-soft hover:opacity-90 transition-all gap-2"
              >
                {summaryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {summaryLoading ? "Summarizing..." : "Summarize"}
              </Button>
              {summaryOutput && (
                <div className="animate-slide-up gradient-chat-ai rounded-xl p-5 border border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">Summary</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{summaryOutput}</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="mt-0">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-foreground">Question Generator</h2>
                  <p className="text-xs text-muted-foreground">Enter a topic to generate practice questions</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  value={questionTopic}
                  onChange={(e) => setQuestionTopic(e.target.value)}
                  placeholder="Enter a topic (e.g., Photosynthesis, Python loops, World War II)..."
                  className="flex-1 bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerateQuestions()}
                />
                <Button
                  onClick={handleGenerateQuestions}
                  disabled={questionsLoading || !questionTopic.trim()}
                  className="gradient-hero text-primary-foreground border-0 shadow-soft hover:opacity-90 transition-all gap-2"
                >
                  {questionsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  {questionsLoading ? "Generating..." : "Generate"}
                </Button>
              </div>
              {questionsOutput && (
                <div className="animate-slide-up gradient-chat-ai rounded-xl p-5 border border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">Practice Questions</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{questionsOutput}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIAssistant;
