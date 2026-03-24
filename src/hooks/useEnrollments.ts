import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useEnrollments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setEnrolledCourseIds(new Set());
      setLoading(false);
      return;
    }
    fetchEnrollments();
  }, [user]);

  const fetchEnrollments = async () => {
    const { data, error } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("user_id", user!.id);
    if (!error && data) {
      setEnrolledCourseIds(new Set(data.map((e) => e.course_id)));
    }
    setLoading(false);
  };

  const enroll = async (courseId: string) => {
    if (!user) return false;
    setEnrollingId(courseId);
    const { error } = await supabase
      .from("enrollments")
      .insert({ user_id: user.id, course_id: courseId });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already enrolled", description: "You are already enrolled in this course." });
      } else {
        toast({ title: "Error", description: "Failed to enroll. Please try again.", variant: "destructive" });
      }
      setEnrollingId(null);
      return false;
    }

    setEnrolledCourseIds((prev) => new Set(prev).add(courseId));
    toast({ title: "Enrolled!", description: "You have been enrolled successfully." });
    setEnrollingId(null);
    return true;
  };

  return { enrolledCourseIds, loading, enrollingId, enroll };
};
