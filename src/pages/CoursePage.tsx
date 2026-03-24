import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap, BookOpen, Clock, BarChart, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEnrollments } from "@/hooks/useEnrollments";

interface Quiz {
  id: string;
  title: string;
  topic: string;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  image: string;
  duration: string;
  level: string;
  lessons: number;
  price: string | null;
  category: string;
  premium: boolean;
}

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { enrolledCourseIds, enrollingId, enroll } = useEnrollments();
  const [course, setCourse] = useState<Course | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const isEnrolled = courseId ? enrolledCourseIds.has(courseId) : false;

  useEffect(() => {
    if (!courseId) return;
    const fetchData = async () => {
      const [courseRes, quizRes] = await Promise.all([
        supabase.from("courses").select("*").eq("id", courseId).single(),
        supabase.from("quizzes").select("*").eq("course_id", courseId),
      ]);
      if (courseRes.data) setCourse(courseRes.data);
      if (quizRes.data) setQuizzes(quizRes.data);
      setLoading(false);
    };
    fetchData();
  }, [courseId]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (courseId) await enroll(courseId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Course not found</p>
        <Link to="/"><Button variant="outline">Go Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Courses</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-hero flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">EDUBLOOM</span>
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-12 container mx-auto px-6 max-w-4xl">
        {/* Course Header */}
        <div className="glass-card rounded-2xl overflow-hidden mb-8">
          <img src={course.image} alt={course.title} className="w-full h-64 object-cover" />
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.premium ? 'gradient-hero text-primary-foreground' : 'bg-green-500/90 text-primary-foreground'}`}>
                {course.premium ? "PREMIUM" : "FREE"}
              </span>
              <span className="text-xs font-medium text-primary">{course.category}</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">{course.title}</h1>
            <p className="text-muted-foreground mb-4">by {course.instructor}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration}</span>
              <span className="flex items-center gap-1"><BarChart className="w-4 h-4" />{course.level}</span>
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{course.lessons} Lessons</span>
            </div>

            {isEnrolled ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Enrolled</span>
              </div>
            ) : (
              <Button
                onClick={handleEnroll}
                disabled={enrollingId === courseId}
                className="gradient-hero text-primary-foreground border-0 shadow-soft hover:opacity-90 transition-all gap-2"
              >
                {enrollingId === courseId ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {course.price ? `Enroll - ${course.price}` : "Enroll Free"}
              </Button>
            )}
          </div>
        </div>

        {/* Quizzes */}
        {isEnrolled && quizzes.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Course Quizzes</h2>
            <div className="grid gap-4">
              {quizzes.map((quiz) => (
                <Link key={quiz.id} to={`/quiz/${quiz.id}`} className="glass-card rounded-xl p-5 flex items-center justify-between hover:shadow-soft transition-all group">
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{quiz.title}</h3>
                    <p className="text-sm text-muted-foreground">{quiz.topic}</p>
                  </div>
                  <Button size="sm" variant="outline" className="group-hover:gradient-hero group-hover:text-primary-foreground group-hover:border-0 transition-all">
                    Take Quiz
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!isEnrolled && quizzes.length > 0 && (
          <div className="glass-card rounded-xl p-6 text-center">
            <p className="text-muted-foreground">Enroll in this course to access {quizzes.length} quizzes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
