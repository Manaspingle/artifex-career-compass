import { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, GripVertical, Trash2, Building2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type JobCard = {
  id: string;
  company: string;
  role: string;
  notes: string;
  date: string;
};

type Columns = {
  applied: JobCard[];
  interview: JobCard[];
  offer: JobCard[];
  rejected: JobCard[];
};

const columnConfig = {
  applied: { title: "Applied", color: "bg-primary/10 text-primary border-primary/20" },
  interview: { title: "Interview", color: "bg-secondary/10 text-secondary border-secondary/20" },
  offer: { title: "Offer", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected: { title: "Rejected", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

const STORAGE_KEY = "artifex-jobs";

const loadJobs = (): Columns => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { applied: [], interview: [], offer: [], rejected: [] };
};

const TrackerPage = () => {
  const [columns, setColumns] = useState<Columns>(loadJobs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState({ company: "", role: "", notes: "", column: "applied" });

  const save = useCallback((cols: Columns) => {
    setColumns(cols);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cols));
  }, []);

  const addJob = () => {
    if (!newJob.company || !newJob.role) return;
    const card: JobCard = {
      id: Date.now().toString(),
      company: newJob.company,
      role: newJob.role,
      notes: newJob.notes,
      date: new Date().toLocaleDateString("en-IN"),
    };
    const col = newJob.column as keyof Columns;
    const updated = { ...columns, [col]: [...columns[col], card] };
    save(updated);
    setNewJob({ company: "", role: "", notes: "", column: "applied" });
    setDialogOpen(false);
  };

  const deleteJob = (colKey: keyof Columns, jobId: string) => {
    save({ ...columns, [colKey]: columns[colKey].filter((j) => j.id !== jobId) });
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const srcCol = source.droppableId as keyof Columns;
    const destCol = destination.droppableId as keyof Columns;
    const srcItems = [...columns[srcCol]];
    const [moved] = srcItems.splice(source.index, 1);
    if (srcCol === destCol) {
      srcItems.splice(destination.index, 0, moved);
      save({ ...columns, [srcCol]: srcItems });
    } else {
      const destItems = [...columns[destCol]];
      destItems.splice(destination.index, 0, moved);
      save({ ...columns, [srcCol]: srcItems, [destCol]: destItems });
    }
  };

  const totalJobs = Object.values(columns).reduce((a, b) => a + b.length, 0);

  return (
    <div className="container py-8 pb-24 md:pb-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Application Tracker</h1>
          <p className="text-sm text-muted-foreground">{totalJobs} application{totalJobs !== 1 ? "s" : ""} tracked</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Application</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Application</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <Input placeholder="Company Name" value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} />
              <Input placeholder="Role / Position" value={newJob.role} onChange={(e) => setNewJob({ ...newJob, role: e.target.value })} />
              <Textarea placeholder="Notes (optional)" value={newJob.notes} onChange={(e) => setNewJob({ ...newJob, notes: e.target.value })} />
              <Select value={newJob.column} onValueChange={(v) => setNewJob({ ...newJob, column: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(columnConfig).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="w-full" onClick={addJob}>Add Application</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {(Object.entries(columnConfig) as [keyof Columns, typeof columnConfig.applied][]).map(([key, config]) => (
            <div key={key} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${config.color}`}>
                  {config.title}
                </span>
                <span className="text-xs text-muted-foreground">{columns[key].length}</span>
              </div>
              <Droppable droppableId={key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[120px] space-y-3 rounded-lg p-1 transition-colors ${snapshot.isDraggingOver ? "bg-accent/50" : ""}`}
                  >
                    {columns[key].map((job, idx) => (
                      <Draggable key={job.id} draggableId={job.id} index={idx}>
                        {(prov, snap) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            className={`group rounded-lg border border-border bg-background p-3 shadow-card transition-shadow ${snap.isDragging ? "shadow-card-hover" : ""}`}
                          >
                            <div className="flex items-start gap-2">
                              <div {...prov.dragHandleProps} className="mt-1 text-muted-foreground/40">
                                <GripVertical className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                  <span className="truncate text-sm font-semibold text-foreground">{job.company}</span>
                                </div>
                                <p className="mt-0.5 truncate text-xs text-muted-foreground">{job.role}</p>
                                {job.notes && <p className="mt-2 line-clamp-2 text-xs text-muted-foreground/70">{job.notes}</p>}
                                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground/50">
                                  <Calendar className="h-3 w-3" /> {job.date}
                                </div>
                              </div>
                              <button
                                onClick={() => deleteJob(key, job.id)}
                                className="rounded p-1 text-muted-foreground/30 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TrackerPage;
