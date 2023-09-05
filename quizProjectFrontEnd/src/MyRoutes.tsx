import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Sidebar } from "./components/Sidebar";

import { Exams } from "./pages/Exams";
import { Exam } from "./pages/Exam";
import { Tags } from "./pages/Tags";
import { Questions } from "./pages/Questions";

export function MyRoutes() {
  const pathname = window.location.pathname;

  const showSidebar = !pathname.includes("/exams/");

  return (
    <BrowserRouter>
      {showSidebar && <Sidebar />}

      <Routes>
        <Route path="/" element={<Exams />} />
        <Route path="/exams/:examId" element={<Exam />} />
        <Route path="tags" element={<Tags />} />
        <Route path="questions" element={<Questions />} />
      </Routes>
    </BrowserRouter>
  );
}
