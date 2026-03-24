import { GraduationCap, BookOpen, Brain, Award, ArrowRight, Sparkles, MessageSquare, FileText, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const courses = [
  {
    title: "Professional Python Masterclass",
    instructor: "Shradha Khapra",
    image: "https://img.youtube.com/vi/t2_Q2BRzeEE/maxresdefault.jpg",
    duration: "16 weeks",
    level: "Advanced",
    lessons: 85,
    price: "₹4,999",
    category: "Programming",
    premium: true,
  },
  {
    title: "Full Stack Web Development Pro",
    instructor: "Apna College",
    image: "https://img.youtube.com/vi/Vi9bxu-M-ag/maxresdefault.jpg",
    duration: "20 weeks",
    level: "Advanced",
    lessons: 120,
    price: "₹6,999",
    category: "Web Development",
    premium: true,
  },
  {
    title: "Data Science & AI Certification",
    instructor: "Intellipaat",
    image: "https://img.youtube.com/vi/KZgd2UiapE0/maxresdefault.jpg",
    duration: "24 weeks",
    level: "Advanced",
    lessons: 150,
    price: "₹8,999",
    category: "Data Science",
    premium: true,
  },
  {
    title: "Java Programming Fundamentals",
    instructor: "Telusko",
    image: "https://img.youtube.com/vi/UmnCZ7-9yDY/maxresdefault.jpg",
    duration: "10 weeks",
    level: "Beginner",
    lessons: 60,
    category: "Programming",
    premium: false,
  },
  {
    title: "Machine Learning A-Z",
    instructor: "CodeWithHarry",
    image: "https://img.youtube.com/vi/7eh4d6sabA0/maxresdefault.jpg",
    duration: "14 weeks",
    level: "Intermediate",
    lessons: 90,
    category: "Data Science",
    premium: false,
  },
  {
    title: "React.js Complete Guide",
    instructor: "Chai aur Code",
    image: "https://img.youtube.com/vi/FxgM9k1rg0Q/maxresdefault.jpg",
    duration: "12 weeks",
    level: "Intermediate",
    lessons: 75,
    category: "Web Development",
    premium: false,
  },
];

const features = [
  { icon: GraduationCap, title: "Expert Instructors", desc: "Learn from industry professionals with years of real-world experience" },
  { icon: BookOpen, title: "Structured Learning", desc: "Follow carefully crafted curricula designed for maximum retention" },
  { icon: Brain, title: "AI Assistance", desc: "Get instant help from our AI chatbot to clarify doubts anytime" },
  { icon: Award, title: "Certification", desc: "Earn recognized certificates upon completing courses and quizzes" },
];

const aiFeatures = [
  { icon: MessageSquare, title: "AI Chatbot", desc: "Ask academic questions and get clear explanations instantly", link: "/ai-assistant" },
  { icon: FileText, title: "Notes Summarizer", desc: "Paste your notes and get concise summaries with key points", link: "/ai-assistant?tab=summarizer" },
  { icon: HelpCircle, title: "Question Generator", desc: "Generate practice questions on any topic for exam prep", link: "/ai-assistant?tab=questions" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">EDUBLOOM</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/ai-assistant" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">AI Assistant</Link>
            <a href="#courses" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Courses</a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground">Login</Button>
            <Button size="sm" className="gradient-hero text-primary-foreground border-0 shadow-soft hover:opacity-90 transition-opacity">Sign Up</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/20 blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Trusted by 100,000+ learners
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Unlock Your Potential with{" "}
              <span className="text-gradient">EDUBLOOM</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of learners mastering new skills with expert-led courses and AI-powered assistance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/ai-assistant">
                <Button size="lg" className="gradient-hero text-primary-foreground border-0 shadow-soft hover:opacity-90 transition-all hover:scale-105 gap-2 px-8">
                  <Brain className="w-5 h-5" />
                  Try AI Assistant
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-border hover:bg-accent gap-2 px-8">
                Browse Courses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              AI-Powered <span className="text-gradient">Study Tools</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Supercharge your learning with our intelligent AI assistant
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {aiFeatures.map((feature, i) => (
              <Link key={i} to={feature.link} className="group">
                <div className="glass-card rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-glow hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4 group-hover:animate-pulse-glow transition-all">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Try now <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose <span className="text-gradient">EDUBLOOM?</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-soft hover:-translate-y-1">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            Featured <span className="text-gradient">Courses</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-soft hover:-translate-y-1 group">
                <div className="relative overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.premium ? 'gradient-hero text-primary-foreground' : 'bg-green-500/90 text-primary-foreground'}`}>
                      {course.premium ? "PREMIUM" : "FREE"}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-background/80 backdrop-blur-sm text-foreground">
                      {course.lessons} Lessons
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-primary">{course.category}</span>
                  <h3 className="font-display font-semibold text-foreground mt-1 mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {course.duration} · {course.level}
                    </div>
                    <Button size="sm" variant={course.premium ? "default" : "outline"} className={course.premium ? "gradient-hero text-primary-foreground border-0 text-xs" : "text-xs"}>
                      {course.price || "Enroll Free"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">EDUBLOOM</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2024 EduBloom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
