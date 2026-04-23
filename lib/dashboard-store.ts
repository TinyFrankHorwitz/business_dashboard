import { initialCustomers, initialJobs, initialNotes, type Customer, type InternalNote, type InternalNoteType, type Job, type JobStatus } from "@/lib/mock-data";
import { getPrismaClient } from "@/lib/prisma";

type StorageMode = "database" | "mock";

export type DashboardSnapshot = {
  customers: Customer[];
  jobs: Job[];
  notes: InternalNote[];
  storageMode: StorageMode;
};

type CreateCustomerInput = {
  name: string;
  phone: string;
  instagram?: string;
  address?: string;
  deliveryInfo?: string;
  preferences?: string;
};

type UpdateCustomerInput = CreateCustomerInput;

type CreateJobInput = {
  title: string;
  customerId: string;
  productDetails: string;
  deliveryDate: string;
  price: string;
  deposit: string;
  requirements?: string;
  status: JobStatus;
};

type CreateNoteInput = {
  title: string;
  detail: string;
  type: InternalNoteType;
  customerId?: string;
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
}

function formatShortDate(value?: Date | null) {
  if (!value) {
    return "No orders yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(value);
}

function parseCurrency(value: string) {
  const normalized = value.replace(/[^0-9.-]/g, "");
  const amount = Number.parseFloat(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

function mapJobStatusToUi(status: string): JobStatus {
  if (status === "NEW") return "new";
  if (status === "CURRENT") return "current";
  if (status === "PENDING") return "pending";
  if (status === "ENDED") return "ended";
  if (status === "DELIVERED") return "delivered";
  return "canceled";
}

function mapJobStatusToDb(status: JobStatus) {
  if (status === "new") return "NEW";
  if (status === "current") return "CURRENT";
  if (status === "pending") return "PENDING";
  if (status === "ended") return "ENDED";
  if (status === "delivered") return "DELIVERED";
  return "CANCELED";
}

function mapNoteTypeToUi(type: string): InternalNoteType {
  if (type === "IDEA") return "idea";
  if (type === "TASK") return "task";
  if (type === "REMINDER") return "reminder";
  if (type === "IMPROVEMENT") return "improvement";
  return "purchase";
}

function mapNoteTypeToDb(type: InternalNoteType) {
  if (type === "idea") return "IDEA";
  if (type === "task") return "TASK";
  if (type === "reminder") return "REMINDER";
  if (type === "improvement") return "IMPROVEMENT";
  return "PURCHASE";
}

async function loadCustomers() {
  const prisma = getPrismaClient();

  if (!prisma) {
    return initialCustomers;
  }

  const customers = await prisma.customer.findMany({
    include: {
      jobs: {
        orderBy: {
          createdAt: "desc"
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return customers.map((customer) => {
    const lifetimeValue = customer.jobs.reduce(
      (total, job) => total + Number(job.price),
      0
    );
    const lastOrder = customer.jobs[0]?.createdAt ?? customer.lastOrderAt;

    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      instagram: customer.instagram ?? "@new.client",
      address: customer.address ?? "Address pending",
      deliveryInfo: customer.deliveryInfo ?? "Delivery info pending",
      preferences: customer.preferences ?? "No preferences saved yet.",
      lastOrder: formatShortDate(lastOrder),
      lifetimeValue: formatMoney(lifetimeValue)
    } satisfies Customer;
  });
}

async function loadJobs() {
  const prisma = getPrismaClient();

  if (!prisma) {
    return initialJobs;
  }

  const jobs = await prisma.job.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return jobs.map((job) => ({
    id: job.id,
    customerId: job.customerId,
    title: job.title,
    productDetails: job.productDetails,
    quantity: job.quantity,
    price: formatMoney(Number(job.price)),
    deposit: formatMoney(Number(job.deposit)),
    remaining: formatMoney(Number(job.remaining)),
    deliveryDate: formatShortDate(job.deliveryDate),
    status: mapJobStatusToUi(job.status),
    timelineNote: job.timelineNote ?? "No timeline note yet.",
    requirements: job.requirements ?? "No additional requirements yet.",
    createdAt: formatShortDate(job.createdAt)
  })) satisfies Job[];
}

async function loadNotes() {
  const prisma = getPrismaClient();

  if (!prisma) {
    return initialNotes;
  }

  const notes = await prisma.internalNote.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return notes.map((note) => ({
    id: note.id,
    title: note.title,
    detail: note.detail,
    type: mapNoteTypeToUi(note.type),
    customerId: note.customerId ?? undefined
  })) satisfies InternalNote[];
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const prisma = getPrismaClient();

  if (!prisma) {
    return {
      customers: initialCustomers,
      jobs: initialJobs,
      notes: initialNotes,
      storageMode: "mock"
    };
  }

  try {
    const [customers, jobs, notes] = await Promise.all([
      loadCustomers(),
      loadJobs(),
      loadNotes()
    ]);

    return {
      customers,
      jobs,
      notes,
      storageMode: "database"
    };
  } catch {
    return {
      customers: initialCustomers,
      jobs: initialJobs,
      notes: initialNotes,
      storageMode: "mock"
    };
  }
}

export async function createCustomer(input: CreateCustomerInput) {
  const prisma = getPrismaClient();

  if (!prisma) {
    throw new Error("Database is not configured.");
  }

  const customer = await prisma.customer.create({
    data: {
      name: input.name,
      phone: input.phone,
      instagram: input.instagram,
      address: input.address,
      deliveryInfo: input.deliveryInfo,
      preferences: input.preferences
    }
  });

  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    instagram: customer.instagram ?? "@new.client",
    address: customer.address ?? "Address pending",
    deliveryInfo: customer.deliveryInfo ?? "Delivery info pending",
    preferences: customer.preferences ?? "No preferences saved yet.",
    lastOrder: "No orders yet",
    lifetimeValue: "$0"
  } satisfies Customer;
}

export async function updateCustomer(customerId: string, input: UpdateCustomerInput) {
  const prisma = getPrismaClient();

  if (!prisma) {
    throw new Error("Database is not configured.");
  }

  const customer = await prisma.customer.update({
    where: { id: customerId },
    data: {
      name: input.name,
      phone: input.phone,
      instagram: input.instagram,
      address: input.address,
      deliveryInfo: input.deliveryInfo,
      preferences: input.preferences
    },
    include: {
      jobs: true
    }
  });

  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    instagram: customer.instagram ?? "@new.client",
    address: customer.address ?? "Address pending",
    deliveryInfo: customer.deliveryInfo ?? "Delivery info pending",
    preferences: customer.preferences ?? "No preferences saved yet.",
    lastOrder: formatShortDate(customer.jobs[0]?.createdAt ?? customer.lastOrderAt),
    lifetimeValue: formatMoney(
      customer.jobs.reduce((total, job) => total + Number(job.price), 0)
    )
  } satisfies Customer;
}

export async function deleteCustomer(customerId: string) {
  const prisma = getPrismaClient();

  if (!prisma) {
    throw new Error("Database is not configured.");
  }

  await prisma.customer.delete({
    where: { id: customerId }
  });
}

export async function createJob(input: CreateJobInput) {
  const prisma = getPrismaClient();

  if (!prisma) {
    throw new Error("Database is not configured.");
  }

  const price = parseCurrency(input.price);
  const deposit = parseCurrency(input.deposit);
  const remaining = Math.max(price - deposit, 0);

  const job = await prisma.job.create({
    data: {
      orderNumber: `JOB-${Date.now().toString().slice(-6)}`,
      title: input.title,
      customerId: input.customerId,
      productDetails: input.productDetails || "Custom details pending",
      quantity: 1,
      price,
      deposit,
      remaining,
      deliveryDate: new Date(input.deliveryDate),
      status: mapJobStatusToDb(input.status),
      timelineNote: "Recently added from the dashboard.",
      requirements: input.requirements || "No additional requirements yet."
    }
  });

  await prisma.customer.update({
    where: { id: input.customerId },
    data: {
      lastOrderAt: new Date()
    }
  });

  return {
    id: job.id,
    customerId: job.customerId,
    title: job.title,
    productDetails: job.productDetails,
    quantity: job.quantity,
    price: formatMoney(Number(job.price)),
    deposit: formatMoney(Number(job.deposit)),
    remaining: formatMoney(Number(job.remaining)),
    deliveryDate: formatShortDate(job.deliveryDate),
    status: mapJobStatusToUi(job.status),
    timelineNote: job.timelineNote ?? "No timeline note yet.",
    requirements: job.requirements ?? "No additional requirements yet.",
    createdAt: formatShortDate(job.createdAt)
  } satisfies Job;
}

export async function updateJobStatus(jobId: string, status: JobStatus) {
  const prisma = getPrismaClient();

  if (!prisma) {
    throw new Error("Database is not configured.");
  }

  const job = await prisma.job.update({
    where: { id: jobId },
    data: {
      status: mapJobStatusToDb(status)
    }
  });

  return {
    id: job.id,
    customerId: job.customerId,
    title: job.title,
    productDetails: job.productDetails,
    quantity: job.quantity,
    price: formatMoney(Number(job.price)),
    deposit: formatMoney(Number(job.deposit)),
    remaining: formatMoney(Number(job.remaining)),
    deliveryDate: formatShortDate(job.deliveryDate),
    status: mapJobStatusToUi(job.status),
    timelineNote: job.timelineNote ?? "No timeline note yet.",
    requirements: job.requirements ?? "No additional requirements yet.",
    createdAt: formatShortDate(job.createdAt)
  } satisfies Job;
}

export async function deleteJob(jobId: string) {
  const prisma = getPrismaClient();

  if (!prisma) {
    throw new Error("Database is not configured.");
  }

  await prisma.job.delete({
    where: { id: jobId }
  });
}

export async function createNote(input: CreateNoteInput) {
  const prisma = getPrismaClient();

  if (!prisma) {
    throw new Error("Database is not configured.");
  }

  const note = await prisma.internalNote.create({
    data: {
      title: input.title,
      detail: input.detail,
      type: mapNoteTypeToDb(input.type),
      customerId: input.customerId || null
    }
  });

  return {
    id: note.id,
    title: note.title,
    detail: note.detail,
    type: mapNoteTypeToUi(note.type),
    customerId: note.customerId ?? undefined
  } satisfies InternalNote;
}

export async function deleteNote(noteId: string) {
  const prisma = getPrismaClient();

  if (!prisma) {
    throw new Error("Database is not configured.");
  }

  await prisma.internalNote.delete({
    where: { id: noteId }
  });
}
