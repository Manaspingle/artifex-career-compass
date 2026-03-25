import { useState, useMemo } from "react";
import { Bookmark, BookmarkCheck, ExternalLink, MapPin, Briefcase, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

type Job = {
  id: string;
  company: string;
  role: string;
  location: string;
  type: string;
  experience: string;
  link: string;
};

const sampleJobs: Job[] = [
  { id: "1", company: "Infosys", role: "Software Engineer Trainee", location: "Bangalore", type: "Full-time", experience: "Fresher", link: "#" },
  { id: "2", company: "TCS", role: "Assistant System Engineer", location: "Mumbai", type: "Full-time", experience: "Fresher", link: "#" },
  { id: "3", company: "Wipro", role: "Project Engineer", location: "Hyderabad", type: "Full-time", experience: "Fresher", link: "#" },
  { id: "4", company: "Flipkart", role: "SDE Intern", location: "Bangalore", type: "Internship", experience: "Fresher", link: "#" },
  { id: "5", company: "Razorpay", role: "Frontend Developer", location: "Bangalore", type: "Full-time", experience: "1-2 yrs", link: "#" },
  { id: "6", company: "Zoho", role: "Member Technical Staff", location: "Chennai", type: "Full-time", experience: "Fresher", link: "#" },
  { id: "7", company: "PhonePe", role: "Backend Intern", location: "Pune", type: "Internship", experience: "Fresher", link: "#" },
  { id: "8", company: "Swiggy", role: "Data Analyst", location: "Bangalore", type: "Full-time", experience: "1-2 yrs", link: "#" },
  { id: "9", company: "CRED", role: "Product Design Intern", location: "Bangalore", type: "Internship", experience: "Fresher", link: "#" },
  { id: "10", company: "Paytm", role: "QA Engineer", location: "Noida", type: "Full-time", experience: "Fresher", link: "#" },
  { id: "11", company: "Meesho", role: "Full Stack Developer", location: "Bangalore", type: "Full-time", experience: "1-2 yrs", link: "#" },
  { id: "12", company: "Accenture", role: "Associate Software Engineer", location: "Pune", type: "Full-time", experience: "Fresher", link: "#" },
];

const cities = ["All", "Bangalore", "Mumbai", "Hyderabad", "Pune", "Chennai", "Noida", "Delhi"];
const jobTypes = ["All", "Full-time", "Internship"];
const expLevels = ["All", "Fresher", "1-2 yrs"];

const SAVED_KEY = "artifex-saved-jobs";

const JobsPage = () => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All");
  const [type, setType] = useState("All");
  const [exp, setExp] = useState("All");
  const [saved, setSaved] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch { return []; }
  });

  const toggleSave = (id: string) => {
    const next = saved.includes(id) ? saved.filter((s) => s !== id) : [...saved, id];
    setSaved(next);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  };

  const filtered = useMemo(() => {
    return sampleJobs.filter((j) => {
      if (search && !j.company.toLowerCase().includes(search.toLowerCase()) && !j.role.toLowerCase().includes(search.toLowerCase())) return false;
      if (city !== "All" && j.location !== city) return false;
      if (type !== "All" && j.type !== type) return false;
      if (exp !== "All" && j.experience !== exp) return false;
      return true;
    });
  }, [search, city, type, exp]);

  return (
    <div className="container py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-foreground">Job Opportunities</h1>
      <p className="mt-1 text-sm text-muted-foreground">Curated openings for Indian freshers & graduates</p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="h-4 w-4" />
        </div>
        <Input className="max-w-xs" placeholder="Search company or role..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {cities.map((c) => <SelectItem key={c} value={c}>{c === "All" ? "All Cities" : c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {jobTypes.map((t) => <SelectItem key={t} value={t}>{t === "All" ? "All Types" : t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={exp} onValueChange={setExp}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {expLevels.map((e) => <SelectItem key={e} value={e}>{e === "All" ? "All Levels" : e}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{filtered.length} jobs found</p>

      {/* Jobs Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{job.role}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{job.company}</p>
              </div>
              <button onClick={() => toggleSave(job.id)} className="text-muted-foreground transition-colors hover:text-secondary">
                {saved.includes(job.id) ? <BookmarkCheck className="h-5 w-5 text-secondary" /> : <Bookmark className="h-5 w-5" />}
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-accent-foreground">
                <MapPin className="h-3 w-3" /> {job.location}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1 text-secondary">
                <Briefcase className="h-3 w-3" /> {job.type}
              </span>
              <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">{job.experience}</span>
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <a href={job.link} target="_blank" rel="noopener noreferrer">
                Apply Now <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
