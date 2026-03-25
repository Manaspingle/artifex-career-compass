import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const mockAnalysis = {
  score: 72,
  suggestions: [
    { type: "warning" as const, text: "Add more measurable achievements (e.g., 'Increased efficiency by 25%')" },
    { type: "warning" as const, text: "Include relevant keywords from job descriptions to pass ATS screening" },
    { type: "success" as const, text: "Good use of action verbs in experience section" },
    { type: "warning" as const, text: "Consider adding a 'Skills' section with technologies relevant to your target role" },
    { type: "success" as const, text: "Contact information is clearly visible" },
    { type: "warning" as const, text: "Remove 'References available upon request' — it's outdated" },
  ],
};

const mockCoverLetter = `Dear Hiring Manager,

I am writing to express my interest in the Software Engineer position at your organization. As a recent graduate with a strong foundation in computer science and hands-on project experience, I am eager to contribute to your team.

During my academic journey, I developed multiple projects including a full-stack e-commerce platform and a machine learning-based recommendation system. These experiences honed my skills in React, Node.js, Python, and cloud technologies.

I am particularly drawn to your company's innovative approach to solving real-world problems with technology. I am confident that my technical skills, combined with my eagerness to learn and collaborate, make me a strong candidate for this role.

I look forward to the opportunity to discuss how I can contribute to your team's success.

Best regards,
[Your Name]`;

const ResumePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [showCover, setShowCover] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && (f.type === "application/pdf" || f.name.endsWith(".doc") || f.name.endsWith(".docx"))) {
      setFile(f);
      setAnalyzed(false);
      setShowCover(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setAnalyzed(false); setShowCover(false); }
  };

  const analyze = () => {
    setAnalyzed(true);
  };

  return (
    <div className="container max-w-3xl py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-foreground">Resume AI Analysis</h1>
      <p className="mt-1 text-sm text-muted-foreground">Upload your resume and get AI-powered feedback to improve it</p>

      {/* Upload Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-12 transition-colors hover:border-primary/40 hover:bg-accent/30"
      >
        <input ref={fileRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFile} />
        {file ? (
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        ) : (
          <>
            <Upload className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="font-medium text-foreground">Drop your resume here or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">Supports PDF, DOC, DOCX</p>
          </>
        )}
      </div>

      {file && !analyzed && (
        <Button className="mt-4 w-full" onClick={analyze}>
          <Sparkles className="mr-2 h-4 w-4" /> Analyze Resume with AI
        </Button>
      )}

      {/* Analysis Results */}
      <AnimatePresence>
        {analyzed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-8 space-y-6"
          >
            {/* Score */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-semibold text-foreground">Resume Score</h2>
              <div className="mt-4 flex items-end gap-4">
                <span className="text-5xl font-black text-primary">{mockAnalysis.score}</span>
                <span className="mb-1 text-lg text-muted-foreground">/ 100</span>
              </div>
              <Progress value={mockAnalysis.score} className="mt-3 h-2" />
              <p className="mt-2 text-sm text-muted-foreground">
                {mockAnalysis.score >= 80 ? "Great resume!" : mockAnalysis.score >= 60 ? "Good, but there's room to improve." : "Needs significant improvements."}
              </p>
            </div>

            {/* Suggestions */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-semibold text-foreground">AI Suggestions</h2>
              <div className="mt-4 space-y-3">
                {mockAnalysis.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-background p-3">
                    {s.type === "success" ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    )}
                    <p className="text-sm text-foreground">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cover Letter */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">AI Cover Letter</h2>
                <Button variant={showCover ? "outline" : "default"} size="sm" onClick={() => setShowCover(!showCover)}>
                  {showCover ? "Hide" : "Generate"}
                </Button>
              </div>
              <AnimatePresence>
                {showCover && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <Textarea
                      className="mt-4 min-h-[300px] resize-none text-sm"
                      value={mockCoverLetter}
                      readOnly
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      💡 Tip: Customize this letter for each application by adding specific details about the company.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumePage;
