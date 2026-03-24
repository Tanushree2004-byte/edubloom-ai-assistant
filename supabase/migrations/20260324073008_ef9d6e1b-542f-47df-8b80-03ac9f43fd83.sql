
-- Courses table
CREATE TABLE public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  instructor TEXT NOT NULL,
  image TEXT NOT NULL,
  duration TEXT NOT NULL,
  level TEXT NOT NULL,
  lessons INTEGER NOT NULL DEFAULT 0,
  price TEXT,
  category TEXT NOT NULL,
  premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses" ON public.courses
  FOR SELECT TO anon, authenticated USING (true);

-- Seed courses
INSERT INTO public.courses (id, title, instructor, image, duration, level, lessons, price, category, premium) VALUES
  ('python-masterclass', 'Professional Python Masterclass', 'Shradha Khapra', 'https://img.youtube.com/vi/t2_Q2BRzeEE/maxresdefault.jpg', '16 weeks', 'Advanced', 85, '₹4,999', 'Programming', true),
  ('fullstack-web', 'Full Stack Web Development Pro', 'Apna College', 'https://img.youtube.com/vi/Vi9bxu-M-ag/maxresdefault.jpg', '20 weeks', 'Advanced', 120, '₹6,999', 'Web Development', true),
  ('data-science-ai', 'Data Science & AI Certification', 'Intellipaat', 'https://img.youtube.com/vi/KZgd2UiapE0/maxresdefault.jpg', '24 weeks', 'Advanced', 150, '₹8,999', 'Data Science', true),
  ('java-fundamentals', 'Java Programming Fundamentals', 'Telusko', 'https://img.youtube.com/vi/UmnCZ7-9yDY/maxresdefault.jpg', '10 weeks', 'Beginner', 60, NULL, 'Programming', false),
  ('ml-a-z', 'Machine Learning A-Z', 'CodeWithHarry', 'https://img.youtube.com/vi/7eh4d6sabA0/maxresdefault.jpg', '14 weeks', 'Intermediate', 90, NULL, 'Data Science', false),
  ('react-guide', 'React.js Complete Guide', 'Chai aur Code', 'https://img.youtube.com/vi/FxgM9k1rg0Q/maxresdefault.jpg', '12 weeks', 'Intermediate', 75, NULL, 'Web Development', false);

-- Enrollments table
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments" ON public.enrollments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll" ON public.enrollments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quizzes" ON public.quizzes
  FOR SELECT TO authenticated USING (true);

-- Questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'mcq',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view questions" ON public.questions
  FOR SELECT TO authenticated USING (true);

-- Question options table
CREATE TABLE public.question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view options" ON public.question_options
  FOR SELECT TO authenticated USING (true);

-- Quiz submissions table
CREATE TABLE public.quiz_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions" ON public.quiz_submissions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can submit quizzes" ON public.quiz_submissions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Seed quizzes with questions for each course
-- Python Masterclass Quiz
INSERT INTO public.quizzes (id, course_id, title, topic) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'python-masterclass', 'Python Basics', 'Variables & Data Types'),
  ('a1000000-0000-0000-0000-000000000002', 'python-masterclass', 'Python OOP', 'Classes & Objects'),
  ('a1000000-0000-0000-0000-000000000003', 'fullstack-web', 'HTML & CSS Basics', 'Web Fundamentals'),
  ('a1000000-0000-0000-0000-000000000004', 'fullstack-web', 'JavaScript Essentials', 'JS Core Concepts'),
  ('a1000000-0000-0000-0000-000000000005', 'data-science-ai', 'Data Analysis Basics', 'Pandas & NumPy'),
  ('a1000000-0000-0000-0000-000000000006', 'java-fundamentals', 'Java Basics', 'Syntax & Variables'),
  ('a1000000-0000-0000-0000-000000000007', 'ml-a-z', 'ML Fundamentals', 'Supervised Learning'),
  ('a1000000-0000-0000-0000-000000000008', 'react-guide', 'React Basics', 'Components & Props');

-- Questions for Python Basics quiz
INSERT INTO public.questions (id, quiz_id, question_text, type) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'What is the correct way to declare a variable in Python?', 'mcq'),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Which data type is immutable in Python?', 'mcq'),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'What does len() function return?', 'mcq');

INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'var x = 5', false),
  ('b1000000-0000-0000-0000-000000000001', 'x = 5', true),
  ('b1000000-0000-0000-0000-000000000001', 'int x = 5', false),
  ('b1000000-0000-0000-0000-000000000001', 'let x = 5', false),
  ('b1000000-0000-0000-0000-000000000002', 'List', false),
  ('b1000000-0000-0000-0000-000000000002', 'Dictionary', false),
  ('b1000000-0000-0000-0000-000000000002', 'Tuple', true),
  ('b1000000-0000-0000-0000-000000000002', 'Set', false),
  ('b1000000-0000-0000-0000-000000000003', 'The data type of an object', false),
  ('b1000000-0000-0000-0000-000000000003', 'The number of items in an object', true),
  ('b1000000-0000-0000-0000-000000000003', 'The memory size of an object', false),
  ('b1000000-0000-0000-0000-000000000003', 'The index of an object', false);

-- Questions for Python OOP quiz
INSERT INTO public.questions (id, quiz_id, question_text, type) VALUES
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'What keyword is used to create a class in Python?', 'mcq'),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'What is __init__ in Python?', 'mcq'),
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'Which is NOT an OOP principle?', 'mcq');

INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES
  ('b1000000-0000-0000-0000-000000000004', 'struct', false),
  ('b1000000-0000-0000-0000-000000000004', 'class', true),
  ('b1000000-0000-0000-0000-000000000004', 'def', false),
  ('b1000000-0000-0000-0000-000000000004', 'object', false),
  ('b1000000-0000-0000-0000-000000000005', 'A destructor method', false),
  ('b1000000-0000-0000-0000-000000000005', 'A constructor method', true),
  ('b1000000-0000-0000-0000-000000000005', 'A static method', false),
  ('b1000000-0000-0000-0000-000000000005', 'A class method', false),
  ('b1000000-0000-0000-0000-000000000006', 'Encapsulation', false),
  ('b1000000-0000-0000-0000-000000000006', 'Compilation', true),
  ('b1000000-0000-0000-0000-000000000006', 'Inheritance', false),
  ('b1000000-0000-0000-0000-000000000006', 'Polymorphism', false);

-- Questions for HTML & CSS quiz
INSERT INTO public.questions (id, quiz_id, question_text, type) VALUES
  ('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000003', 'What does HTML stand for?', 'mcq'),
  ('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000003', 'Which CSS property changes text color?', 'mcq'),
  ('b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000003', 'What is the correct HTML tag for a paragraph?', 'mcq');

INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES
  ('b1000000-0000-0000-0000-000000000007', 'Hyper Text Markup Language', true),
  ('b1000000-0000-0000-0000-000000000007', 'High Tech Modern Language', false),
  ('b1000000-0000-0000-0000-000000000007', 'Hyper Transfer Markup Language', false),
  ('b1000000-0000-0000-0000-000000000007', 'Home Tool Markup Language', false),
  ('b1000000-0000-0000-0000-000000000008', 'text-color', false),
  ('b1000000-0000-0000-0000-000000000008', 'font-color', false),
  ('b1000000-0000-0000-0000-000000000008', 'color', true),
  ('b1000000-0000-0000-0000-000000000008', 'text-style', false),
  ('b1000000-0000-0000-0000-000000000009', '<paragraph>', false),
  ('b1000000-0000-0000-0000-000000000009', '<p>', true),
  ('b1000000-0000-0000-0000-000000000009', '<text>', false),
  ('b1000000-0000-0000-0000-000000000009', '<para>', false);

-- Questions for JavaScript quiz
INSERT INTO public.questions (id, quiz_id, question_text, type) VALUES
  ('b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000004', 'Which keyword declares a constant in JavaScript?', 'mcq'),
  ('b1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000004', 'What is === in JavaScript?', 'mcq'),
  ('b1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000004', 'Which method adds an element to the end of an array?', 'mcq');

INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES
  ('b1000000-0000-0000-0000-000000000010', 'var', false),
  ('b1000000-0000-0000-0000-000000000010', 'let', false),
  ('b1000000-0000-0000-0000-000000000010', 'const', true),
  ('b1000000-0000-0000-0000-000000000010', 'define', false),
  ('b1000000-0000-0000-0000-000000000011', 'Assignment operator', false),
  ('b1000000-0000-0000-0000-000000000011', 'Strict equality operator', true),
  ('b1000000-0000-0000-0000-000000000011', 'Loose equality operator', false),
  ('b1000000-0000-0000-0000-000000000011', 'Comparison operator', false),
  ('b1000000-0000-0000-0000-000000000012', 'pop()', false),
  ('b1000000-0000-0000-0000-000000000012', 'push()', true),
  ('b1000000-0000-0000-0000-000000000012', 'shift()', false),
  ('b1000000-0000-0000-0000-000000000012', 'unshift()', false);

-- Questions for remaining quizzes (Data Science, Java, ML, React)
INSERT INTO public.questions (id, quiz_id, question_text, type) VALUES
  ('b1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000005', 'Which library is used for data manipulation in Python?', 'mcq'),
  ('b1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000005', 'What does df.head() return?', 'mcq'),
  ('b1000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000006', 'What is the entry point of a Java program?', 'mcq'),
  ('b1000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000006', 'Which keyword is used to inherit a class in Java?', 'mcq'),
  ('b1000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000007', 'Which is a supervised learning algorithm?', 'mcq'),
  ('b1000000-0000-0000-0000-000000000018', 'a1000000-0000-0000-0000-000000000007', 'What is overfitting?', 'mcq'),
  ('b1000000-0000-0000-0000-000000000019', 'a1000000-0000-0000-0000-000000000008', 'What is JSX?', 'mcq'),
  ('b1000000-0000-0000-0000-000000000020', 'a1000000-0000-0000-0000-000000000008', 'What hook is used for side effects in React?', 'mcq');

INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES
  ('b1000000-0000-0000-0000-000000000013', 'Pandas', true),
  ('b1000000-0000-0000-0000-000000000013', 'Flask', false),
  ('b1000000-0000-0000-0000-000000000013', 'Django', false),
  ('b1000000-0000-0000-0000-000000000013', 'Requests', false),
  ('b1000000-0000-0000-0000-000000000014', 'First 5 rows', true),
  ('b1000000-0000-0000-0000-000000000014', 'Last 5 rows', false),
  ('b1000000-0000-0000-0000-000000000014', 'All rows', false),
  ('b1000000-0000-0000-0000-000000000014', 'Column names', false),
  ('b1000000-0000-0000-0000-000000000015', 'public static void main(String[] args)', true),
  ('b1000000-0000-0000-0000-000000000015', 'def main():', false),
  ('b1000000-0000-0000-0000-000000000015', 'int main()', false),
  ('b1000000-0000-0000-0000-000000000015', 'void start()', false),
  ('b1000000-0000-0000-0000-000000000016', 'implements', false),
  ('b1000000-0000-0000-0000-000000000016', 'extends', true),
  ('b1000000-0000-0000-0000-000000000016', 'inherits', false),
  ('b1000000-0000-0000-0000-000000000016', 'super', false),
  ('b1000000-0000-0000-0000-000000000017', 'K-Means', false),
  ('b1000000-0000-0000-0000-000000000017', 'Linear Regression', true),
  ('b1000000-0000-0000-0000-000000000017', 'PCA', false),
  ('b1000000-0000-0000-0000-000000000017', 'DBSCAN', false),
  ('b1000000-0000-0000-0000-000000000018', 'Model performs well on all data', false),
  ('b1000000-0000-0000-0000-000000000018', 'Model memorizes training data but fails on new data', true),
  ('b1000000-0000-0000-0000-000000000018', 'Model is too simple', false),
  ('b1000000-0000-0000-0000-000000000018', 'Model has high bias', false),
  ('b1000000-0000-0000-0000-000000000019', 'A database query language', false),
  ('b1000000-0000-0000-0000-000000000019', 'JavaScript XML - syntax extension for JS', true),
  ('b1000000-0000-0000-0000-000000000019', 'A CSS framework', false),
  ('b1000000-0000-0000-0000-000000000019', 'A testing library', false),
  ('b1000000-0000-0000-0000-000000000020', 'useState', false),
  ('b1000000-0000-0000-0000-000000000020', 'useEffect', true),
  ('b1000000-0000-0000-0000-000000000020', 'useRef', false),
  ('b1000000-0000-0000-0000-000000000020', 'useMemo', false);
