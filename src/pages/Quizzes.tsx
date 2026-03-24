import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, ArrowLeft, Trophy, CheckCircle2, Clock, Filter, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface QuizWithCourse {
  id: string;
  title: string;
  topic: string;
  course_id: string;
  courses: { title: string } | null;
}

interface Submission {
  quiz_id: string;
  score: number;
  total: number;
  submitted_at: string;
}

const Quizzes = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizWithCourse[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, Submission>>({});
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      const [quizRes, subRes, enrollRes] = await Promise.all([
        supabase.from("quizzes").select("*, courses(title)"),
        supabase.from("quiz_submissions").select("*").eq("user_id", user.id),
        supabase.from("enrollments").select("course_id").eq("user_id", user.id),
      ]);
      if (quizRes.data) setQuizzes(quizRes.data as QuizWithCourse[]);
      if (subRes.data) {
        const map: Record<string, Submission> = {};
        subRes.data.forEach((s) => {
          if (!map[s.quiz_id] || new Date(s.submitted_at) > new Date(map[s.quiz_id].submitted_at)) {
            map[s.quiz_id] = s;
          }
        });
        setSubmissions(map);
      }
      if (enrollRes.data) {
        setEnrolledCourseIds(new Set(enrollRes.data.map((e) => e.course_id)));
      }
      setLoading(false);
    };
    fetchData();
  }, [user, navigate]);

  const accessibleQuizzes = quizzes.filter((q) => enrolledCourseIds.has(q.course_id));

  const filteredQuizzes = accessibleQuizzes.filter((q) => {
    if (filter === "completed") return !!submissions[q.id];
    if (filter === "pending") return !submissions[q.id];
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">EDUBLOOM</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/ai-assistant" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">AI Assistant</Link>
            <Link to="/quizzes" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Quizzes</Link>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1" onClick={signOut}>
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            My <span className="text-gradient">Quizzes</span>
          </h1>
          <p className="text-muted-foreground mt-2">Test your knowledge across all enrolled courses</p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(["all", "completed", "pending"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              className={filter === f ? "gradient-hero text-primary-foreground border-0" : ""}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {filteredQuizzes.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-muted-foreground">
              {accessibleQuizzes.length === 0
                ? "Enroll in courses to access quizzes"
                : "No quizzes match your filter"}
            </p>
            {accessibleQuizzes.length === 0 && (
              <Link to="/#courses"><Button className="mt-4 gradient-hero text-primary-foreground border-0">Browse Courses</Button></Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredQuizzes.map((quiz) => {
              const sub = submissions[quiz.id];
              const percentage = sub ? Math.round((sub.score / sub.total) * 100) : null;
              return (
                <Link key={quiz.id} to={`/quiz/${quiz.id}`} className="glass-card rounded-xl p-5 flex items-center gap-4 hover:shadow-soft transition-all group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${sub ? (percentage! >= 70 ? 'bg-green-500/10' : 'bg-destructive/10') : 'bg-accent'}`}>
                    {sub ? (
                      percentage! >= 70 ? <Trophy className="w-6 h-6 text-yellow-500" /> : <CheckCircle2 className="w-6 h-6 text-destructive" />
                    ) : (
                      <Clock className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-foreground truncate">{quiz.title}</h3>
                    <p className="text-sm text-muted-foreground">{quiz.courses?.title} · {quiz.topic}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {sub && (
                      <span className={`text-sm font-bold ${percentage! >= 70 ? 'text-green-600' : 'text-destructive'}`}>
                        {percentage}%
                      </span>
                    )}
                    <Button size="sm" variant="outline" className="group-hover:gradient-hero group-hover:text-primary-foreground group-hover:border-0 transition-all">
                      {sub ? "Retry" : "Start"}
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
