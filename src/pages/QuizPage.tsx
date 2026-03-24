import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap, CheckCircle2, XCircle, Loader2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Option {
  id: string;
  option_text: string;
  is_correct: boolean;
}

interface Question {
  id: string;
  question_text: string;
  type: string;
  question_options: Option[];
}

interface Quiz {
  id: string;
  title: string;
  topic: string;
  course_id: string;
}

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!quizId) return;

    const fetchQuiz = async () => {
      const [quizRes, questionsRes] = await Promise.all([
        supabase.from("quizzes").select("*").eq("id", quizId).single(),
        supabase.from("questions").select("*, question_options(*)").eq("quiz_id", quizId),
      ]);
      if (quizRes.data) setQuiz(quizRes.data);
      if (questionsRes.data) setQuestions(questionsRes.data as Question[]);
      setLoading(false);
    };
    fetchQuiz();
  }, [quizId, user, navigate]);

  const handleSelect = (questionId: string, optionId: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!user || !quiz) return;
    setSubmitting(true);

    let correct = 0;
    questions.forEach((q) => {
      const selectedOptionId = selectedAnswers[q.id];
      const correctOption = q.question_options.find((o) => o.is_correct);
      if (correctOption && selectedOptionId === correctOption.id) correct++;
    });

    setScore(correct);
    setSubmitted(true);

    await supabase.from("quiz_submissions").insert({
      user_id: user.id,
      quiz_id: quiz.id,
      score: correct,
      total: questions.length,
    });

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Quiz not found</p>
        <Link to="/"><Button variant="outline">Go Home</Button></Link>
      </div>
    );
  }

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to={`/course/${quiz.course_id}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Course</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-hero flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">EDUBLOOM</span>
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-12 container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{quiz.title}</h1>
          <p className="text-muted-foreground mt-1">{quiz.topic} · {questions.length} Questions</p>
        </div>

        {/* Score Card */}
        {submitted && (
          <div className="glass-card rounded-2xl p-8 text-center mb-8 animate-slide-up">
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${percentage >= 70 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
            <h2 className="font-display text-4xl font-bold text-foreground">{percentage}%</h2>
            <p className="text-muted-foreground mt-1">
              {score} / {questions.length} correct
            </p>
            <p className={`mt-2 font-semibold ${percentage >= 70 ? 'text-green-600' : 'text-destructive'}`}>
              {percentage >= 70 ? "Great job! 🎉" : "Keep practicing! 💪"}
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <Link to={`/course/${quiz.course_id}`}>
                <Button variant="outline">Back to Course</Button>
              </Link>
              <Link to="/quizzes">
                <Button className="gradient-hero text-primary-foreground border-0">All Quizzes</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((q, i) => {
            const selectedOptionId = selectedAnswers[q.id];
            const correctOption = q.question_options.find((o) => o.is_correct);
            const isCorrect = submitted && selectedOptionId === correctOption?.id;
            const isWrong = submitted && selectedOptionId && selectedOptionId !== correctOption?.id;

            return (
              <div key={q.id} className="glass-card rounded-xl p-6 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="font-medium text-foreground pt-1">{q.question_text}</p>
                  {submitted && (
                    <span className="ml-auto flex-shrink-0">
                      {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : isWrong ? <XCircle className="w-5 h-5 text-destructive" /> : null}
                    </span>
                  )}
                </div>
                <div className="grid gap-2 ml-11">
                  {q.question_options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    let optClass = "border border-border/50 rounded-lg px-4 py-3 text-sm cursor-pointer transition-all ";
                    if (submitted) {
                      if (opt.is_correct) optClass += "bg-green-500/10 border-green-500 text-green-700";
                      else if (isSelected && !opt.is_correct) optClass += "bg-destructive/10 border-destructive text-destructive";
                      else optClass += "opacity-50";
                    } else {
                      optClass += isSelected
                        ? "gradient-hero text-primary-foreground border-transparent shadow-soft"
                        : "hover:border-primary/50 hover:bg-accent/50";
                    }
                    return (
                      <button key={opt.id} className={optClass} onClick={() => handleSelect(q.id, opt.id)} disabled={submitted}>
                        {opt.option_text}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit */}
        {!submitted && questions.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length < questions.length || submitting}
              className="gradient-hero text-primary-foreground border-0 shadow-soft hover:opacity-90 transition-all px-10 py-6 text-lg"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Submit Quiz
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {Object.keys(selectedAnswers).length} / {questions.length} answered
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
