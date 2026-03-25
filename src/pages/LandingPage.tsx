import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Briefcase, FileText, Search, BarChart3, Target, Lightbulb,
  Mail, BookOpen, ArrowRight, CheckCircle2, XCircle, Clock
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  { icon: BarChart3, title: "AI Resume Analysis", desc: "Get a score out of 100 with actionable suggestions to beat ATS systems." },
  { icon: Briefcase, title: "Smart Job Tracker", desc: "Kanban-style board to track every application from Applied to Offer." },
  { icon: FileText, title: "AI Cover Letter", desc: "Generate personalized cover letters using your resume + job description." },
  { icon: Search, title: "Job Discovery", desc: "Browse curated opportunities focused on Indian freshers and graduates." },
];

const problems = [
  { icon: XCircle, problem: "Applying to 100+ jobs on Naukri & LinkedIn with no tracking", solution: "Kanban board keeps every application organized" },
  { icon: Clock, problem: "Missing interview calls and application deadlines", solution: "Status tracking with notes so nothing slips through" },
  { icon: Target, problem: "Resumes getting rejected by ATS before a human ever sees them", solution: "AI analysis scores your resume and fixes weak points" },
];

const tips = [
  { icon: BookOpen, title: "ATS-Friendly Resumes", desc: "Use standard headings, avoid tables/graphics, include keywords from the JD." },
  { icon: Mail, title: "Cold Email That Works", desc: "Subject: 'Application for [Role] – [Your Name]'. Keep it 3 paragraphs max." },
  { icon: Lightbulb, title: "Resume Optimization", desc: "Quantify achievements: 'Increased sales by 30%' beats 'Responsible for sales'." },
  { icon: Target, title: "Off-Campus Strategy", desc: "Apply on company career pages directly. Set up job alerts on LinkedIn & Naukri." },
];

const LandingPage = () => {
  return (
    <div className="pb-20 md:pb-0">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container relative py-24 md:py-32 lg:py-40">
          <motion.div
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.h1
              variants={fadeUp} custom={0}
              className="text-4xl font-black tracking-tight text-primary-foreground md:text-5xl lg:text-6xl"
            >
              Track Smarter.{" "}
              <span className="text-secondary">Apply Better.</span>{" "}
              Get Hired.
            </motion.h1>
            <motion.p
              variants={fadeUp} custom={1}
              className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/80"
            >
              The job tracker built for Indian graduates and freshers. Stop losing track of
              applications across Naukri, LinkedIn, and company portals.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/tracker">
                  Start Tracking Jobs <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/resume">Analyze Your Resume</Link>
              </Button>
            </motion.div>
            <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/60">
              <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> No signup needed</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> 100% free</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Made for Indian students</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold text-foreground">
            Everything You Need to <span className="text-primary">Land Your First Job</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="mx-auto mt-3 max-w-lg text-muted-foreground">
            From resume analysis to job tracking — ARTIFEX is your all-in-one placement companion.
          </motion.p>
        </motion.div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title} variants={fadeUp} custom={i + 2}
              className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Why ARTIFEX */}
      <section className="bg-card py-20">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold text-foreground">
              Why <span className="text-secondary">ARTIFEX</span>?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mx-auto mt-3 max-w-lg text-muted-foreground">
              We know the struggle — campus placements, off-campus drives, endless portals. Here's how we help.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mt-14 grid gap-8 md:grid-cols-3"
          >
            {problems.map((p, i) => (
              <motion.div key={i} variants={fadeUp} custom={i + 2} className="rounded-xl border border-border bg-background p-6">
                <p.icon className="mb-3 h-8 w-8 text-destructive" />
                <p className="text-sm font-medium text-destructive/80">The Problem</p>
                <p className="mt-1 text-foreground font-medium">{p.problem}</p>
                <div className="my-4 h-px bg-border" />
                <CheckCircle2 className="mb-2 h-6 w-6 text-primary" />
                <p className="text-sm font-medium text-primary/80">ARTIFEX Solution</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.solution}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Educational Tips */}
      <section className="container py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold text-foreground">
            Learn to <span className="text-primary">Apply Smart</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Quick tips to boost your chances — no fluff, just what works.
          </motion.p>
        </motion.div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mt-14 grid gap-6 sm:grid-cols-2"
        >
          {tips.map((t, i) => (
            <motion.div
              key={t.title} variants={fadeUp} custom={i + 2}
              className="flex gap-4 rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                <t.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Built with ❤️ for Indian students & freshers</p>
          <p className="mt-1">ARTIFEX © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
