"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  initialCustomers,
  initialJobs,
  initialNotes,
  inventory,
  products,
  users,
  type Customer,
  type InternalNote,
  type InternalNoteType,
  type Job,
  type JobStatus
} from "@/lib/mock-data";

const navigation = ["Dashboard", "Customers", "Catalog", "Stock", "Access"] as const;
type View = (typeof navigation)[number];

const dashboardStatuses: Array<JobStatus | "all"> = [
  "all",
  "new",
  "current",
  "pending",
  "ended"
];

const noteTypes: InternalNoteType[] = [
  "task",
  "reminder",
  "idea",
  "improvement",
  "purchase"
];

const newJobSeed = {
  title: "",
  customerId: "",
  productDetails: "",
  deliveryDate: "",
  price: "",
  deposit: "",
  requirements: "",
  status: "new" as JobStatus
};

const newCustomerSeed = {
  name: "",
  phone: "",
  instagram: "",
  address: "",
  deliveryInfo: "",
  preferences: ""
};

const newNoteSeed = {
  title: "",
  detail: "",
  type: "task" as InternalNoteType,
  customerId: ""
};

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getStatusLabel(status: JobStatus | "all") {
  if (status === "all") {
    return "All jobs";
  }

  return `${status} jobs`;
}

function statusBadge(status: JobStatus) {
  if (status === "new") {
    return "bg-[#e4f3ea] text-[#0f6a3b]";
  }

  if (status === "current") {
    return "bg-[#eef5ff] text-[#2b5c9a]";
  }

  if (status === "pending") {
    return "bg-[#fff1d9] text-[#9a6b12]";
  }

  return "bg-[#f1f1f1] text-[#555]";
}

function noteBadge(type: InternalNoteType) {
  if (type === "reminder") {
    return "bg-[#eef5ff] text-[#2b5c9a]";
  }

  if (type === "purchase") {
    return "bg-[#fff1d9] text-[#9a6b12]";
  }

  if (type === "improvement") {
    return "bg-[#efe9ff] text-[#6544a8]";
  }

  if (type === "idea") {
    return "bg-[#e4f3ea] text-[#0f6a3b]";
  }

  return "bg-[#f2f4f7] text-[#555]";
}

function IconBox({
  tone,
  children
}: {
  tone: "green" | "blue" | "amber" | "dark";
  children: ReactNode;
}) {
  const toneClass =
    tone === "green"
      ? "bg-[#dff3e7] text-[#0d6d3f]"
      : tone === "blue"
        ? "bg-[#eaf2ff] text-[#26548b]"
        : tone === "amber"
          ? "bg-[#fff0d1] text-[#99630c]"
          : "bg-[#16221c] text-white";

  return (
    <div className={classNames("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-11 sm:w-11", toneClass)}>
      {children}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
      <path d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
      <path d="M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z" />
      <path d="M4 12h16" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <circle cx="12" cy="12" r="8" />
      <path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <circle cx="12" cy="12" r="8" />
      <path d="M10 9v6M14 9v6" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M5 20a7 7 0 0 1 14 0" strokeLinecap="round" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <path d="M7 4h10a2 2 0 0 1 2 2v12l-4-3-4 3-4-3-2 1V6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <path d="M4 7h16" strokeLinecap="round" />
      <path d="M9 7V5h6v2" />
      <path d="M8 10v7M12 10v7M16 10v7" strokeLinecap="round" />
      <path d="M6 7l1 12h10l1-12" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin fill-none stroke-current stroke-[2]">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}

function ConfirmModal({
  type,
  name,
  onConfirm,
  onCancel,
  isDeleting
}: {
  type: "job" | "customer" | "note";
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  const typeLabels = { job: "job", customer: "customer", note: "note" };
  const typeColors = { job: "text-[#a64141]", customer: "text-[#a64141]", note: "text-[#a64141]" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-[0_30px_80px_rgba(16,23,21,0.25)]">
        <h3 className="text-lg font-semibold text-[#101715]">Confirm deletion</h3>
        <p className="mt-3 text-sm text-[#66736d]">
          Are you sure you want to delete this {typeLabels[type]}?
          <span className={classNames("mt-2 block font-medium", typeColors[type])}>
            "{name}"
          </span>
          {type === "customer" && (
            <span className="mt-2 block text-xs text-[#9a6b12]">
              This will also delete all related jobs and notes.
            </span>
          )}
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-full bg-[#b24545] px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            {isDeleting ? (
              <span className="flex items-center justify-center gap-2">
                <SpinnerIcon />
                Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-full bg-[#f2f4f1] px-4 py-3 text-sm disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={classNames(
        "h-4 w-4 fill-none stroke-current stroke-[1.8] transition",
        open && "rotate-180"
      )}
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MetricCard({
  label,
  value,
  detail,
  tone,
  active,
  icon,
  onClick
}: {
  label: string;
  value: number;
  detail: string;
  tone: "green" | "blue" | "amber" | "dark";
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "rounded-[28px] border p-3 text-left transition sm:p-5",
        active
          ? "border-transparent bg-[#0f6a3b] text-white shadow-[0_20px_50px_rgba(15,106,59,0.22)]"
          : "border-[rgba(11,24,19,0.08)] bg-white hover:border-[rgba(15,106,59,0.22)]"
      )}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div>
          <p className={classNames("text-xs sm:text-sm", active ? "text-white/78" : "text-[#728077]")}>
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold sm:mt-3 sm:text-4xl">{value}</p>
        </div>
        <IconBox tone={active ? "dark" : tone}>{icon}</IconBox>
      </div>
      <p className={classNames("mt-2 text-xs sm:mt-4 sm:text-sm", active ? "text-white/78" : "text-[#7b877f]")}>
        {detail}
      </p>
    </button>
  );
}

function Panel({
  title,
  subtitle,
  action,
  children
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[30px] border border-[rgba(16,24,20,0.08)] bg-white p-3 shadow-[0_18px_50px_rgba(15,23,18,0.06)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#101715] sm:text-lg">{title}</h2>
          <p className="mt-1 text-xs text-[#7d877f] sm:text-sm">{subtitle}</p>
        </div>
        {action}
      </div>
      <div className="mt-4 sm:mt-5">{children}</div>
    </section>
  );
}

export function AppShell() {
  const [storageMode, setStorageMode] = useState<"database" | "mock">("mock");
  const [view, setView] = useState<View>("Dashboard");
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [notes, setNotes] = useState<InternalNote[]>(initialNotes);
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | "all">("all");
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobs[0]?.id ?? "");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    initialCustomers[0]?.id ?? ""
  );
  const [search, setSearch] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [jobDraft, setJobDraft] = useState(newJobSeed);
  const [customerDraft, setCustomerDraft] = useState(newCustomerSeed);
  const [noteDraft, setNoteDraft] = useState(newNoteSeed);
  const [isHydrating, setIsHydrating] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSavingJob, setIsSavingJob] = useState(false);
  const [isSavingCustomer, setIsSavingCustomer] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isDeletingJob, setIsDeletingJob] = useState<string | null>(null);
  const [isDeletingCustomer, setIsDeletingCustomer] = useState<string | null>(null);
  const [isDeletingNote, setIsDeletingNote] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "job" | "customer" | "note";
    id: string;
    name: string;
  } | null>(null);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? jobs[0] ?? null;
  const focusedCustomerId = selectedJob?.customerId ?? selectedCustomerId;
  const selectedCustomer =
    customers.find((customer) => customer.id === focusedCustomerId) ?? customers[0] ?? null;

  useEffect(() => {
    if (!selectedJob && jobs[0]) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJob]);

  useEffect(() => {
    if (selectedCustomer) {
      setSelectedCustomerId(selectedCustomer.id);
    }
  }, [selectedCustomer]);

  const statusCounts = {
    new: jobs.filter((job) => job.status === "new").length,
    current: jobs.filter((job) => job.status === "current").length,
    pending: jobs.filter((job) => job.status === "pending").length,
    ended: jobs.filter((job) => job.status === "ended").length
  };

  const filteredJobs = jobs.filter((job) => {
    const customer = customers.find((item) => item.id === job.customerId);
    const query = search.trim().toLowerCase();
    const matchesSearch =
      query.length === 0 ||
      job.title.toLowerCase().includes(query) ||
      job.id.toLowerCase().includes(query) ||
      job.productDetails.toLowerCase().includes(query) ||
      customer?.name.toLowerCase().includes(query);

    const matchesStatus = selectedStatus === "all" || job.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredCustomers = customers.filter((customer) => {
    const query = search.trim().toLowerCase();

    if (query.length === 0) {
      return true;
    }

    return (
      customer.name.toLowerCase().includes(query) ||
      customer.id.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query) ||
      customer.instagram.toLowerCase().includes(query) ||
      customer.address.toLowerCase().includes(query)
    );
  });

  const linkedNotes = notes.filter((note) => !note.customerId || note.customerId === focusedCustomerId);
  const selectedCustomerJobs = jobs.filter((job) => job.customerId === focusedCustomerId);
  const searchPlaceholder =
    view === "Customers"
      ? "Search customers by name, phone, or Instagram"
      : "Search jobs, customer, or order id";

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch("/api/bootstrap", { cache: "no-store" });
        const data = (await response.json()) as {
          customers: Customer[];
          jobs: Job[];
          notes: InternalNote[];
          storageMode: "database" | "mock";
        };

        setCustomers(data.customers);
        setJobs(data.jobs);
        setNotes(data.notes);
        setStorageMode(data.storageMode);
        setErrorMessage("");
      } catch {
        setErrorMessage("Using local mock data because the data layer could not be loaded.");
      } finally {
        setIsHydrating(false);
      }
    }

    void loadDashboard();
  }, []);

  async function requestJson<T>(url: string, init?: RequestInit) {
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      }
    });
    const payload = (await response.json().catch(() => null)) as
      | T
      | { message?: string }
      | null;

    if (!response.ok) {
      throw new Error(
        (payload as { message?: string } | null)?.message ?? "Request failed."
      );
    }

    return payload as T;
  }

  function customerPayload(customer: Customer) {
    return {
      name: customer.name,
      phone: customer.phone,
      instagram: customer.instagram,
      address: customer.address,
      deliveryInfo: customer.deliveryInfo,
      preferences: customer.preferences
    };
  }

  async function updateJobStatus(jobId: string, status: JobStatus) {
    if (storageMode === "mock") {
      setJobs((current) =>
        current.map((job) => (job.id === jobId ? { ...job, status } : job))
      );
      return;
    }

    try {
      const job = await requestJson<Job>(`/api/jobs/${jobId}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });

      setJobs((current) => current.map((item) => (item.id === jobId ? job : item)));
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update the job."
      );
    }
  }

  function updateCustomerField<K extends keyof Customer>(field: K, value: Customer[K]) {
    if (!selectedCustomer) {
      return;
    }

    setCustomers((current) =>
      current.map((customer) =>
        customer.id === selectedCustomer.id ? { ...customer, [field]: value } : customer
      )
    );
  }

  async function addJob() {
    if (!jobDraft.title || !jobDraft.customerId || !jobDraft.deliveryDate) {
      return;
    }

    setIsSavingJob(true);

    if (storageMode === "database") {
      try {
        const nextJob = await requestJson<Job>("/api/jobs", {
          method: "POST",
          body: JSON.stringify(jobDraft)
        });

        setJobs((current) => [nextJob, ...current]);
        setSelectedJobId(nextJob.id);
        setSelectedStatus("all");
        setShowJobForm(false);
        setJobDraft(newJobSeed);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to create the job."
        );
      } finally {
        setIsSavingJob(false);
      }
      return;
    }

    const nextJob: Job = {
      id: `JOB-${Date.now().toString().slice(-4)}`,
      customerId: jobDraft.customerId,
      title: jobDraft.title,
      productDetails: jobDraft.productDetails || "Custom details pending",
      quantity: 1,
      price: jobDraft.price || "$0",
      deposit: jobDraft.deposit || "$0",
      remaining: jobDraft.price || "$0",
      deliveryDate: jobDraft.deliveryDate,
      status: jobDraft.status,
      timelineNote: "Recently added from the dashboard.",
      requirements: jobDraft.requirements || "No additional requirements yet.",
      createdAt: "Today"
    };

    setJobs((current) => [nextJob, ...current]);
    setSelectedJobId(nextJob.id);
    setSelectedStatus("all");
    setShowJobForm(false);
    setJobDraft(newJobSeed);
    setIsSavingJob(false);
  }

  function requestDeleteJob(jobId: string, jobTitle: string) {
    setDeleteConfirm({ type: "job", id: jobId, name: jobTitle });
  }

  async function confirmDeleteJob() {
    if (!deleteConfirm || deleteConfirm.type !== "job") return;
    const jobId = deleteConfirm.id;
    setIsDeletingJob(jobId);
    setDeleteConfirm(null);

    if (storageMode === "database") {
      try {
        await requestJson<{ ok: true }>(`/api/jobs/${jobId}`, {
          method: "DELETE"
        });
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to delete the job."
        );
        setIsDeletingJob(null);
        return;
      }
    }

setJobs((current) => current.filter((job) => job.id !== jobId));
    setIsDeletingJob(null);
  }

  async function addCustomer() {
    if (!customerDraft.name || !customerDraft.phone) {
      return;
    }

    setIsSavingCustomer(true);

    if (storageMode === "database") {
      try {
        const nextCustomer = await requestJson<Customer>("/api/customers", {
          method: "POST",
          body: JSON.stringify(customerDraft)
        });

        setCustomers((current) => [nextCustomer, ...current]);
        setSelectedJobId("");
        setSelectedCustomerId(nextCustomer.id);
        setShowCustomerForm(false);
        setCustomerDraft(newCustomerSeed);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to create the customer."
        );
      } finally {
        setIsSavingCustomer(false);
      }
      return;
    }

    const nextCustomer: Customer = {
      id: `CUS-${Date.now().toString().slice(-3)}`,
      name: customerDraft.name,
      phone: customerDraft.phone,
      instagram: customerDraft.instagram || "@new.client",
      address: customerDraft.address || "Address pending",
      deliveryInfo: customerDraft.deliveryInfo || "Delivery info pending",
      preferences: customerDraft.preferences || "No preferences saved yet.",
      lastOrder: "No orders yet",
      lifetimeValue: "$0"
    };

    setCustomers((current) => [nextCustomer, ...current]);
    setSelectedJobId("");
    setSelectedCustomerId(nextCustomer.id);
    setShowCustomerForm(false);
    setCustomerDraft(newCustomerSeed);
    setIsSavingCustomer(false);
  }

  async function persistCustomer(customerId: string) {
    if (storageMode !== "database") {
      return;
    }

    const customer = customers.find((item) => item.id === customerId);

    if (!customer) {
      return;
    }

    try {
      const savedCustomer = await requestJson<Customer>(`/api/customers/${customerId}`, {
        method: "PATCH",
        body: JSON.stringify(customerPayload(customer))
      });

      setCustomers((current) =>
        current.map((item) => (item.id === customerId ? savedCustomer : item))
      );
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save customer changes."
      );
    }
  }

  function requestDeleteCustomer(customerId: string, customerName: string) {
    setDeleteConfirm({ type: "customer", id: customerId, name: customerName });
  }

  async function confirmDeleteCustomer() {
    if (!deleteConfirm || deleteConfirm.type !== "customer") return;
    const customerId = deleteConfirm.id;
    setIsDeletingCustomer(customerId);
    setDeleteConfirm(null);

    if (storageMode === "database") {
      try {
        await requestJson<{ ok: true }>(`/api/customers/${customerId}`, {
          method: "DELETE"
        });
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to delete the customer."
        );
        setIsDeletingCustomer(null);
        return;
      }
    }

    setCustomers((current) => current.filter((customer) => customer.id !== customerId));
    setJobs((current) => current.filter((job) => job.customerId !== customerId));
    setNotes((current) => current.filter((note) => note.customerId !== customerId));
    setIsDeletingCustomer(null);
  }

  function toggleNoteForm() {
    setShowNoteForm((current) => {
      const nextOpen = !current;

      if (nextOpen) {
        setNoteDraft((draft) => ({
          ...draft,
          customerId: selectedCustomer?.id ?? ""
        }));
      }

      return nextOpen;
    });
  }

  async function addNote() {
    if (!noteDraft.title || !noteDraft.detail) {
      return;
    }

    setIsSavingNote(true);

    if (storageMode === "database") {
      try {
        const nextNote = await requestJson<InternalNote>("/api/notes", {
          method: "POST",
          body: JSON.stringify(noteDraft)
        });

        setNotes((current) => [nextNote, ...current]);
        setShowNoteForm(false);
        setNoteDraft(newNoteSeed);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to create the note."
        );
      } finally {
        setIsSavingNote(false);
      }
      return;
    }

    const nextNote: InternalNote = {
      id: `NOTE-${Date.now().toString().slice(-3)}`,
      title: noteDraft.title,
      detail: noteDraft.detail,
      type: noteDraft.type,
      customerId: noteDraft.customerId || undefined
    };

    setNotes((current) => [nextNote, ...current]);
    setShowNoteForm(false);
    setNoteDraft(newNoteSeed);
    setIsSavingNote(false);
  }

  function requestDeleteNote(noteId: string, noteTitle: string) {
    setDeleteConfirm({ type: "note", id: noteId, name: noteTitle });
  }

  async function confirmDeleteNote() {
    if (!deleteConfirm || deleteConfirm.type !== "note") return;
    const noteId = deleteConfirm.id;
    setIsDeletingNote(noteId);
    setDeleteConfirm(null);

    if (storageMode === "database") {
      try {
        await requestJson<{ ok: true }>(`/api/notes/${noteId}`, {
          method: "DELETE"
        });
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to delete the note."
        );
        setIsDeletingNote(null);
        return;
      }
    }

    setNotes((current) => current.filter((note) => note.id !== noteId));
    setIsDeletingNote(null);
  }

  return (
    <main className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,rgba(18,123,73,0.10),transparent_28%),linear-gradient(180deg,#f4f5f1_0%,#eef1ec_100%)] p-2 text-[#101715] sm:px-4 sm:py-4 xl:p-3">
      {deleteConfirm && (
        <ConfirmModal
          type={deleteConfirm.type}
          name={deleteConfirm.name}
          onConfirm={
            deleteConfirm.type === "job"
              ? confirmDeleteJob
              : deleteConfirm.type === "customer"
                ? confirmDeleteCustomer
                : confirmDeleteNote
          }
          onCancel={() => setDeleteConfirm(null)}
          isDeleting={
            deleteConfirm.type === "job"
              ? isDeletingJob !== null
              : deleteConfirm.type === "customer"
                ? isDeletingCustomer !== null
                : isDeletingNote !== null
          }
        />
      )}
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-3 rounded-[36px] border border-white/70 bg-[rgba(255,255,255,0.56)] p-2 shadow-[0_30px_80px_rgba(16,23,21,0.09)] backdrop-blur sm:p-3 xl:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="rounded-[30px] bg-[#f7f8f5] p-3 sm:p-4 xl:min-h-[calc(100vh-48px)]">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0f6a3b] text-white sm:h-12 sm:w-12">
              <BriefcaseIcon />
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold sm:text-lg xl:text-xl">Atelier Flow</p>
              <p className="text-xs text-[#7b877f] sm:text-sm">Business dashboard</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto px-1 pb-2 text-nowrap sm:mt-6 xl:mt-6 xl:block xl:space-y-2 xl:overflow-visible xl:px-0 xl:text-wrap">
            {navigation.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setView(item)}
                className={classNames(
                  "flex min-w-fit items-center gap-2 rounded-2xl px-3 py-2 text-xs transition sm:gap-3 sm:px-4 sm:py-3 sm:text-sm xl:w-full",
                  view === item
                    ? "bg-[#0f6a3b] text-white shadow-[0_16px_30px_rgba(15,106,59,0.18)]"
                    : "bg-white text-[#516057] hover:bg-[#edf4ef]"
                )}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-black/5 sm:h-8 sm:w-8">
                  {item === "Dashboard" && <BriefcaseIcon />}
                  {item === "Customers" && <UserIcon />}
                  {item === "Catalog" && <CheckIcon />}
                  {item === "Stock" && <PauseIcon />}
                  {item === "Access" && <NoteIcon />}
                </span>
                <span className="sm:hidden">{item.charAt(0)}</span>
                <span className="hidden sm:inline">{item}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-[28px] bg-[linear-gradient(135deg,#0f6a3b_0%,#173924_100%)] p-3 text-white sm:mt-5 sm:p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/65 sm:text-sm">Today</p>
            <h3 className="mt-1 text-sm font-semibold sm:mt-2 sm:text-lg">Focus on clear next actions.</h3>
            <p className="hidden text-xs leading-5 text-white/72 sm:mt-2 sm:block sm:text-sm">
              The dashboard now keeps the active work in front and hides secondary details until needed.
            </p>
          </div>
        </aside>

        <section className="space-y-3">
          <header className="rounded-[30px] bg-white p-3 shadow-[0_18px_45px_rgba(16,23,21,0.06)] sm:p-5">
            <div className="flex flex-col gap-3 sm:gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-1 items-center gap-2 rounded-[24px] border border-[rgba(16,24,20,0.08)] bg-[#f7f8f5] px-3 py-3 sm:px-4 sm:py-4">
                <SearchIcon />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#8b948d] sm:text-base"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowJobForm((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0f6a3b] px-4 py-3 text-sm font-medium text-white sm:px-6 sm:py-4 sm:text-base"
                >
                  <PlusIcon />
                  Add job
                </button>
                <button
                  type="button"
                  onClick={toggleNoteForm}
                  className="rounded-full border border-[rgba(16,24,20,0.12)] px-4 py-3 text-sm font-medium text-[#101715] sm:px-6 sm:py-4 sm:text-base"
                >
                  Add note
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:mt-4 sm:text-sm">
              <span
                className={classNames(
                  "rounded-full px-3 py-1 font-medium sm:px-4 sm:py-2",
                  storageMode === "database"
                    ? "bg-[#e4f3ea] text-[#0f6a3b]"
                    : "bg-[#fff1d9] text-[#9a6b12]"
                )}
              >
                {isHydrating
                  ? "Loading data"
                  : storageMode === "database"
                    ? "Database mode"
                    : "Mock mode"}
              </span>
              {errorMessage && <span className="text-[#8c4a4a]">{errorMessage}</span>}
            </div>
          </header>

          {(showJobForm || showNoteForm) && (
            <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              {showJobForm && (
                <Panel
                  title="Quick add job"
                  subtitle="Create work fast, then refine details from the selected module."
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      value={jobDraft.title}
                      onChange={(event) =>
                        setJobDraft((current) => ({ ...current, title: event.target.value }))
                      }
                      placeholder="Job title"
                      className="rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:px-4 sm:py-4"
                    />
                    <select
                      value={jobDraft.customerId}
                      onChange={(event) =>
                        setJobDraft((current) => ({
                          ...current,
                          customerId: event.target.value
                        }))
                      }
                      className="rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:px-4 sm:py-4"
                    >
                      <option value="">Choose customer</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                    <input
                      value={jobDraft.productDetails}
                      onChange={(event) =>
                        setJobDraft((current) => ({
                          ...current,
                          productDetails: event.target.value
                        }))
                      }
                      placeholder="Product details"
                      className="rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:px-4 sm:py-4"
                    />
                    <input
                      type="date"
                      value={jobDraft.deliveryDate}
                      onChange={(event) =>
                        setJobDraft((current) => ({
                          ...current,
                          deliveryDate: event.target.value
                        }))
                      }
                      className="rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:px-4 sm:py-4"
                    />
                    <input
                      value={jobDraft.price}
                      onChange={(event) =>
                        setJobDraft((current) => ({ ...current, price: event.target.value }))
                      }
                      placeholder="Price"
                      className="rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:px-4 sm:py-4"
                    />
                    <input
                      value={jobDraft.deposit}
                      onChange={(event) =>
                        setJobDraft((current) => ({ ...current, deposit: event.target.value }))
                      }
                      placeholder="Deposit"
                      className="rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:px-4 sm:py-4"
                    />
                    <textarea
                      value={jobDraft.requirements}
                      onChange={(event) =>
                        setJobDraft((current) => ({
                          ...current,
                          requirements: event.target.value
                        }))
                      }
                      placeholder="Requirements"
                      className="sm:col-span-2 min-h-24 rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:min-h-28 sm:px-4 sm:py-4"
                    />
                  </div>
                  <div className="mt-3 flex gap-2 sm:mt-4">
                    <button
                      type="button"
                      onClick={() => void addJob()}
                      disabled={isSavingJob}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0f6a3b] px-4 py-3 text-sm font-medium text-white disabled:opacity-50 sm:px-6 sm:py-3"
                    >
                      {isSavingJob ? (
                        <>
                          <SpinnerIcon />
                          Saving...
                        </>
                      ) : (
                        "Save job"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowJobForm(false)}
                      disabled={isSavingJob}
                      className="rounded-full bg-[#f2f4f1] px-4 py-3 text-sm disabled:opacity-50 sm:px-6 sm:py-3"
                    >
                      Cancel
                    </button>
                  </div>
                </Panel>
              )}

              {showNoteForm && (
                <Panel
                  title="Quick add note"
                  subtitle="Notes can stay general or attach to the selected client automatically."
                >
<div className="grid gap-3">
                    <input
                      value={noteDraft.title}
                      onChange={(event) =>
                        setNoteDraft((current) => ({ ...current, title: event.target.value }))
                      }
                      placeholder="Note title"
                      className="rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:px-4 sm:py-4"
                    />
                    <select
                      value={noteDraft.type}
                      onChange={(event) =>
                        setNoteDraft((current) => ({
                          ...current,
                          type: event.target.value as InternalNoteType
                        }))
                      }
                      className="rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:px-4 sm:py-4"
                      >
                      {noteTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <select
                      value={noteDraft.customerId}
                      onChange={(event) =>
                        setNoteDraft((current) => ({
                          ...current,
                          customerId: event.target.value
                        }))
                      }
                      className="rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:px-4 sm:py-4"
                    >
                      <option value="">General note</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={noteDraft.detail}
                      onChange={(event) =>
                        setNoteDraft((current) => ({ ...current, detail: event.target.value }))
                      }
                      placeholder="What should be remembered?"
                      className="min-h-24 rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:min-h-28 sm:px-4 sm:py-4"
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#7b877f] sm:mt-3 sm:text-sm">
                    Linked to:{" "}
                    {customers.find((customer) => customer.id === noteDraft.customerId)?.name ??
                      "General note"}
                  </p>
                  <div className="mt-3 flex gap-2 sm:mt-4">
                    <button
                      type="button"
                      onClick={() => void addNote()}
                      disabled={isSavingNote}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0f6a3b] px-4 py-3 text-sm font-medium text-white disabled:opacity-50 sm:px-6 sm:py-3"
                    >
                      {isSavingNote ? (
                        <>
                          <SpinnerIcon />
                          Saving...
                        </>
                      ) : (
                        "Save note"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNoteForm(false)}
                      disabled={isSavingNote}
                      className="rounded-full bg-[#f2f4f1] px-4 py-3 text-sm disabled:opacity-50 sm:px-6 sm:py-3"
                    >
                      Cancel
                    </button>
                  </div>
                </Panel>
              )}
            </section>
          )}

          {view === "Dashboard" && (
            <div className="space-y-3">
              <section className="rounded-[30px] bg-white p-3 shadow-[0_18px_45px_rgba(16,23,21,0.06)] sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#799183] sm:text-sm">Dashboard</p>
                    <h1 className="mt-2 text-xl font-semibold tracking-tight text-[#101715] sm:text-3xl sm:text-4xl">
                      Know what needs attention in seconds.
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7b877f]">
                      Jobs stay first. Client details, notes, low stock, and approvals are visible only where they support the next action.
                    </p>
                  </div>
                  <div className="rounded-[26px] border border-[rgba(16,24,20,0.08)] bg-[#f7f8f5] px-4 py-4">
                    <p className="text-sm text-[#7b877f]">Visible list</p>
                    <p className="mt-1 text-xl font-semibold sm:text-2xl">{filteredJobs.length} jobs</p>
                    <p className="text-sm text-[#7b877f]">{getStatusLabel(selectedStatus)}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3 md:grid-cols-4">
                  <MetricCard
                    label="New jobs"
                    value={statusCounts.new}
                    detail="Fresh requests that need confirmation."
                    tone="green"
                    active={selectedStatus === "new"}
                    icon={<PlusIcon />}
                    onClick={() => setSelectedStatus("new")}
                  />
                  <MetricCard
                    label="Current jobs"
                    value={statusCounts.current}
                    detail="Work already moving through production."
                    tone="blue"
                    active={selectedStatus === "current"}
                    icon={<PlayIcon />}
                    onClick={() => setSelectedStatus("current")}
                  />
                  <MetricCard
                    label="Pending jobs"
                    value={statusCounts.pending}
                    detail="Blocked jobs waiting on client input."
                    tone="amber"
                    active={selectedStatus === "pending"}
                    icon={<PauseIcon />}
                    onClick={() => setSelectedStatus("pending")}
                  />
                  <MetricCard
                    label="Ended jobs"
                    value={statusCounts.ended}
                    detail="Finished work ready to archive or repeat."
                    tone="dark"
                    active={selectedStatus === "ended"}
                    icon={<CheckIcon />}
                    onClick={() => setSelectedStatus("ended")}
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                  {dashboardStatuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setSelectedStatus(status)}
                      className={classNames(
                        "rounded-full px-3 py-2 text-xs transition sm:px-4 sm:py-3 sm:text-sm",
                        selectedStatus === status
                          ? "bg-[#101715] text-white"
                          : "bg-[#f2f4f1] text-[#56635c]"
                      )}
                    >
                      {status === "all" ? "All" : status}
                    </button>
                  ))}
                </div>
              </section>

              <div className="grid gap-3 2xl:grid-cols-[minmax(0,1.45fr)_390px]">
                <Panel
                  title="Jobs"
                  subtitle="Tap a row to focus it. Extra details stay hidden until the item matters."
                  action={
                    <button
                      type="button"
                      onClick={() => setSelectedStatus("all")}
                      className="rounded-full bg-[#f2f4f1] px-3 py-2 text-xs font-medium text-[#4e5a54] sm:px-4 sm:py-3 sm:text-base"
                    >
                      Clear filter
                    </button>
                  }
                >
                  <div className="space-y-3">
                    {filteredJobs.map((job) => {
                      const customer = customers.find((item) => item.id === job.customerId);
                      const open = selectedJobId === job.id;

                      return (
                        <article
                          key={job.id}
                          className={classNames(
                            "rounded-[26px] border transition",
                            open
                              ? "border-[#0f6a3b] bg-[#f8fcf9]"
                              : "border-[rgba(16,24,20,0.08)] bg-[#fafbf9]"
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedJobId(job.id)}
                            className="w-full px-4 py-4 text-left sm:px-5"
                          >
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between sm:gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-base font-semibold text-[#101715] sm:text-lg">
                                    {job.title}
                                  </h3>
                                  <span
                                    className={classNames(
                                      "rounded-full px-2 py-1 text-xs font-medium capitalize sm:px-3 sm:py-1",
                                      statusBadge(job.status)
                                    )}
                                  >
                                    {job.status}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-[#5f6a64] sm:mt-2 sm:text-sm">
                                  {job.id} - {customer?.name ?? "Unknown customer"} - {job.productDetails}
                                </p>
                                <p className="mt-1 text-xs text-[#7b877f] sm:text-sm">{job.timelineNote}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs text-[#50605a] sm:min-w-[240px] sm:gap-3 sm:text-sm">
                                <div>
                                  <p className="text-xs uppercase tracking-[0.18em] text-[#8a938d] sm:text-xs">
                                    Delivery
                                  </p>
                                  <p className="mt-1">{job.deliveryDate}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-[0.18em] text-[#8a938d] sm:text-xs">
                                    Remaining
                                  </p>
                                  <p className="mt-1">{job.remaining}</p>
                                </div>
                              </div>
                            </div>
                          </button>

                          {open && (
                            <div className="border-t border-[rgba(16,24,20,0.08)] px-4 py-3 sm:px-5 sm:py-4">
                              <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-start">
                                <div>
                                  <p className="text-sm leading-6 text-[#5f6a64]">
                                    {job.requirements}
                                  </p>
                                  <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                                    {(["new", "current", "pending", "ended"] as JobStatus[]).map(
                                      (status) => (
                                        <button
                                          key={status}
                                          type="button"
                                          onClick={() => void updateJobStatus(job.id, status)}
                                          className={classNames(
                                            "rounded-full px-3 py-2 text-xs capitalize sm:px-4 sm:py-3 sm:text-sm",
                                            job.status === status
                                              ? "bg-[#101715] text-white"
                                              : "bg-white text-[#53615a]"
                                          )}
                                        >
                                          {status}
                                        </button>
                                      )
                                    )}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => requestDeleteJob(job.id, job.title)}
                                  disabled={isDeletingJob !== null}
                                  className="inline-flex items-center gap-2 rounded-full bg-[#fff2f2] px-3 py-2 text-sm text-[#a64141] disabled:opacity-50 sm:px-4 sm:py-3"
                                >
                                  <TrashIcon />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })}
                    {filteredJobs.length === 0 && (
                      <div className="rounded-[24px] border border-dashed border-[rgba(16,24,20,0.12)] px-4 py-10 text-center text-sm text-[#7b877f]">
                        No jobs match this filter yet.
                      </div>
                    )}
                  </div>
                </Panel>

                <div className="space-y-3">
                  <Panel
                    title="Selected client"
                    subtitle="Edit details directly here while reviewing the related job."
                    action={
                      <button
                        type="button"
                        onClick={() => setShowCustomerForm((current) => !current)}
                        className="rounded-full bg-[#f2f4f1] px-3 py-2 text-xs font-medium text-[#4e5a54] sm:px-4 sm:py-3 sm:text-sm"
                      >
                        {showCustomerForm ? "Close" : "New client"}
                      </button>
                    }
                  >
                    {showCustomerForm && (
                      <div className="mb-3 rounded-[24px] bg-[#f7f8f5] p-3 sm:mb-4 sm:p-4">
                        <div className="grid gap-3">
                          <input
                            value={customerDraft.name}
                            onChange={(event) =>
                              setCustomerDraft((current) => ({
                                ...current,
                                name: event.target.value
                              }))
                            }
                            placeholder="Client name"
                            className="rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:px-4 sm:py-4"
                          />
                          <input
                            value={customerDraft.phone}
                            onChange={(event) =>
                              setCustomerDraft((current) => ({
                                ...current,
                                phone: event.target.value
                              }))
                            }
                            placeholder="Phone / WhatsApp"
                            className="rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:px-4 sm:py-4"
                          />
                          <input
                            value={customerDraft.instagram}
                            onChange={(event) =>
                              setCustomerDraft((current) => ({
                                ...current,
                                instagram: event.target.value
                              }))
                            }
                            placeholder="Instagram"
                            className="rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:px-4 sm:py-4"
                          />
                          <input
                            value={customerDraft.address}
                            onChange={(event) =>
                              setCustomerDraft((current) => ({
                                ...current,
                                address: event.target.value
                              }))
                            }
                            placeholder="Address"
                            className="rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:px-4 sm:py-4"
                          />
                        </div>
                        <div className="mt-3 flex gap-2 sm:mt-4">
                          <button
                            type="button"
                            onClick={() => void addCustomer()}
                            disabled={isSavingCustomer}
                            className="inline-flex items-center gap-2 rounded-full bg-[#0f6a3b] px-4 py-3 text-sm font-medium text-white disabled:opacity-50 sm:px-6 sm:py-3"
                          >
                            {isSavingCustomer ? (
                              <>
                                <SpinnerIcon />
                                Saving...
                              </>
                            ) : (
                              "Save client"
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCustomerForm(false)}
                            disabled={isSavingCustomer}
                            className="rounded-full bg-white px-4 py-3 text-sm disabled:opacity-50 sm:px-6 sm:py-3"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedCustomer ? (
                      <div className="space-y-3">
                        <div className="rounded-[24px] bg-[#f7f8f5] p-3 sm:p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-lg font-semibold sm:text-xl">{selectedCustomer.name}</p>
                              <p className="mt-1 text-sm text-[#7b877f]">{selectedCustomer.id}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => requestDeleteCustomer(selectedCustomer.id, selectedCustomer.name)}
                              disabled={isDeletingCustomer !== null}
                              className="rounded-full bg-[#fff2f2] px-3 py-2 text-xs font-medium text-[#a64141] disabled:opacity-50 sm:px-4 sm:py-3 sm:text-sm"
                            >
                              Delete client
                            </button>
                          </div>
                          <div className="mt-3 grid gap-3 sm:mt-4">
                            <input
                              value={selectedCustomer.phone}
                              onChange={(event) =>
                                updateCustomerField("phone", event.target.value)
                              }
                              onBlur={() => void persistCustomer(selectedCustomer.id)}
                              className="rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:px-4 sm:py-4"
                            />
                            <input
                              value={selectedCustomer.instagram}
                              onChange={(event) =>
                                updateCustomerField("instagram", event.target.value)
                              }
                              onBlur={() => void persistCustomer(selectedCustomer.id)}
                              className="rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:px-4 sm:py-4"
                            />
                            <input
                              value={selectedCustomer.address}
                              onChange={(event) =>
                                updateCustomerField("address", event.target.value)
                              }
                              onBlur={() => void persistCustomer(selectedCustomer.id)}
                              className="rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:px-4 sm:py-4"
                            />
                            <textarea
                              value={selectedCustomer.deliveryInfo}
                              onChange={(event) =>
                                updateCustomerField("deliveryInfo", event.target.value)
                              }
                              onBlur={() => void persistCustomer(selectedCustomer.id)}
                              className="min-h-20 rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:min-h-24 sm:px-4 sm:py-4"
                            />
                            <textarea
                              value={selectedCustomer.preferences}
                              onChange={(event) =>
                                updateCustomerField("preferences", event.target.value)
                              }
                              onBlur={() => void persistCustomer(selectedCustomer.id)}
                              className="min-h-20 rounded-2xl border border-[rgba(16,24,20,0.10)] px-3 py-3 text-sm outline-none sm:min-h-24 sm:px-4 sm:py-4"
                            />
                          </div>
                        </div>

                        <div className="rounded-[24px] bg-[#fafbf9] p-3 sm:p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold sm:text-base">Client jobs</p>
                            <span className="rounded-full bg-white px-3 py-1 text-xs text-[#68766f] sm:px-4 sm:py-2 sm:text-sm">
                              {selectedCustomerJobs.length} linked
                            </span>
                          </div>
                          <div className="mt-3 space-y-2 sm:mt-4">
                            {selectedCustomerJobs.map((job) => (
                              <button
                                key={job.id}
                                type="button"
                                onClick={() => setSelectedJobId(job.id)}
                                className="flex w-full items-center justify-between rounded-2xl bg-white px-3 py-3 text-left sm:px-4 sm:py-4"
                              >
                                <div>
                                  <p className="text-sm font-medium">{job.title}</p>
                                  <p className="text-xs text-[#7b877f] sm:text-sm">{job.deliveryDate}</p>
                                </div>
                                <span
                                  className={classNames(
                                    "rounded-full px-2 py-1 text-xs capitalize sm:px-3 sm:py-1 sm:text-sm",
                                    statusBadge(job.status)
                                  )}
                                >
                                  {job.status}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-[#7b877f]">Select a job to edit its client details.</p>
                    )}
                  </Panel>

                  <Panel
                    title="Notes"
                    subtitle="Keep the list tight. Delete fast when the note is no longer useful."
                  >
                    <div className="space-y-3">
                      {linkedNotes.map((note) => (
                        <article key={note.id} className="rounded-[22px] bg-[#f7f8f5] p-3 sm:p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold sm:text-base">{note.title}</p>
                                <span
                                  className={classNames(
                                    "rounded-full px-2 py-1 text-xs capitalize sm:px-3 sm:py-1",
                                    noteBadge(note.type)
                                  )}
                                >
                                  {note.type}
                                </span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-[#66736d]">{note.detail}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => requestDeleteNote(note.id, note.title)}
                              disabled={isDeletingNote !== null}
                              className="rounded-full bg-white px-3 py-2 text-[#a64141] disabled:opacity-50 sm:px-4 sm:py-3"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </Panel>

                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-1">
                    <Panel
                      title="Low stock"
                      subtitle="Compact alerts only, so urgency stands out."
                    >
                      <div className="space-y-2">
                        {inventory
                          .filter((item) => item.low)
                          .map((item) => (
                            <div
                              key={item.id}
                              className="rounded-[20px] bg-[#fff8ef] px-4 py-3 text-sm"
                            >
                              <p className="font-medium text-[#7b4d00]">
                                {item.material} / {item.color}
                              </p>
                              <p className="mt-1 text-[#946a1f]">
                                {item.quantity} left, minimum {item.minimum}
                              </p>
                            </div>
                          ))}
                      </div>
                    </Panel>

                    <Panel
                      title="Pending approvals"
                      subtitle="Future multi-user access stays visible without taking over the screen."
                    >
                      <div className="space-y-2">
                        {users
                          .filter((user) => user.status === "Pending approval")
                          .map((user) => (
                            <div key={user.id} className="rounded-[20px] bg-[#f7f8f5] px-4 py-3">
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="mt-1 text-sm text-[#7b877f]">{user.role}</p>
                            </div>
                          ))}
                      </div>
                    </Panel>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "Customers" && (
            <Panel
              title="Customers"
              subtitle="A simple list with quick context, ready for deeper dedicated profiles later."
            >
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
                {filteredCustomers.map((customer) => (
                  <article key={customer.id} className="rounded-[26px] bg-[#f7f8f5] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold sm:text-lg">{customer.name}</h3>
                        <p className="mt-1 text-sm text-[#7b877f]">{customer.phone}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs text-[#607068] sm:px-4 sm:py-2 sm:text-sm">
                        {customer.lifetimeValue}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-[#607068] sm:mt-4">{customer.address}</p>
                    <p className="mt-2 text-sm text-[#607068]">{customer.preferences}</p>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const linkedJob = jobs.find((job) => job.customerId === customer.id);
                          setView("Dashboard");
                          setSelectedCustomerId(customer.id);
                          setSelectedJobId(linkedJob?.id ?? "");
                        }}
                        className="rounded-full bg-white px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm"
                      >
                        Open in dashboard
                      </button>
                      <button
                        type="button"
                        onClick={() => requestDeleteCustomer(customer.id, customer.name)}
                        disabled={isDeletingCustomer !== null}
                        className="rounded-full bg-[#fff2f2] px-3 py-2 text-xs text-[#a64141] disabled:opacity-50 sm:px-4 sm:py-3 sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              {filteredCustomers.length === 0 && (
                <div className="mt-3 rounded-[24px] border border-dashed border-[rgba(16,24,20,0.12)] px-4 py-10 text-center text-sm text-[#7b877f]">
                  No customers match this search yet.
                </div>
              )}
            </Panel>
          )}

          {view === "Catalog" && (
            <Panel
              title="Catalog"
              subtitle="Products stay visually light, with expandable detail saved for later CRUD screens."
            >
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <article key={product.id} className="rounded-[26px] bg-[#f7f8f5] p-4">
                    <div className="h-24 rounded-[20px] bg-[linear-gradient(135deg,#e9f0dd_0%,#f7f4e8_45%,#d8ece3_100%)] sm:h-32" />
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#7b877f] sm:mt-4 sm:text-sm">
                      {product.category ?? "General"}
                    </p>
                    <h3 className="mt-1 text-base font-semibold sm:mt-2 sm:text-lg">{product.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#66736d]">{product.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#66736d] sm:mt-4 sm:text-sm">
                      <span className="rounded-full bg-white px-3 py-1 sm:px-4 sm:py-2">{product.price}</span>
                      <span className="rounded-full bg-white px-3 py-1 sm:px-4 sm:py-2">{product.productionTime}</span>
                      <span className="rounded-full bg-white px-3 py-1 capitalize sm:px-4 sm:py-2">
                        {product.availability}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
          )}

          {view === "Stock" && (
            <Panel
              title="Stock"
              subtitle="Material tracking stays clear, with low-stock items already emphasized."
            >
              <div className="space-y-3">
                {inventory.map((item) => (
                  <article key={item.id} className="rounded-[24px] bg-[#f7f8f5] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold sm:text-base">
                          {item.material} / {item.color}
                        </h3>
                        <p className="mt-1 text-sm text-[#66736d]">{item.notes}</p>
                      </div>
                      <span
                        className={classNames(
                          "rounded-full px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm",
                          item.low
                            ? "bg-[#fff1d9] text-[#9a6b12]"
                            : "bg-[#e4f3ea] text-[#0f6a3b]"
                        )}
                      >
                        {item.low ? "Low stock" : "Healthy"}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-[#57655e] sm:mt-4 sm:grid-cols-2">
                      <p>Available {item.quantity}</p>
                      <p>Minimum {item.minimum}</p>
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
          )}

          {view === "Access" && (
            <Panel
              title="Access"
              subtitle="Admin approval is visible now, while role-based permissions can expand later."
            >
              <div className="space-y-3">
                {users.map((user) => (
                  <article key={user.id} className="rounded-[24px] bg-[#f7f8f5] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold sm:text-base">{user.name}</h3>
                        <p className="mt-1 text-sm text-[#66736d]">{user.email}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm">{user.role}</span>
                        <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs text-[#2b5c9a] sm:px-4 sm:py-2 sm:text-sm">
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
          )}
        </section>
      </div>
    </main>
  );
}
