export type JobStatus =
  | "new"
  | "current"
  | "pending"
  | "ended"
  | "delivered"
  | "canceled";

export type Customer = {
  id: string;
  name: string;
  phone: string;
  instagram: string;
  address: string;
  deliveryInfo: string;
  preferences: string;
  lastOrder: string;
  lifetimeValue: string;
};

export type Job = {
  id: string;
  customerId: string;
  title: string;
  productDetails: string;
  quantity: number;
  price: string;
  deposit: string;
  remaining: string;
  deliveryDate: string;
  status: JobStatus;
  timelineNote: string;
  requirements: string;
  createdAt: string;
};

export type InternalNoteType =
  | "idea"
  | "task"
  | "reminder"
  | "improvement"
  | "purchase";

export type InternalNote = {
  id: string;
  title: string;
  detail: string;
  type: InternalNoteType;
  customerId?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category?: string;
  colors: string[];
  sizes: string[];
  price: string;
  productionTime: string;
  availability: "available" | "made to order" | "paused";
};

export type InventoryItem = {
  id: string;
  material: string;
  color: string;
  quantity: string;
  minimum: string;
  notes: string;
  low: boolean;
};

export type UserAccess = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Operator" | "Read-only";
  status: "Approved" | "Pending approval" | "Blocked";
};

export const initialCustomers: Customer[] = [
  {
    id: "CUS-001",
    name: "Camila Torres",
    phone: "+593 99 123 4567",
    instagram: "@camitorres.shop",
    address: "Urdesa Central, Guayaquil",
    deliveryInfo: "Late afternoon delivery works best.",
    preferences: "Prefers sand, cream, and low-contrast branding.",
    lastOrder: "Apr 20",
    lifetimeValue: "$460"
  },
  {
    id: "CUS-002",
    name: "Lucia Mena",
    phone: "+593 98 444 1822",
    instagram: "@lulu.mena",
    address: "Samborondon, Plaza Lagos",
    deliveryInfo: "Usually receives orders at the studio front desk.",
    preferences: "Likes bundle pricing and confirms quickly on WhatsApp.",
    lastOrder: "Apr 18",
    lifetimeValue: "$720"
  },
  {
    id: "CUS-003",
    name: "Mateo Cedeno",
    phone: "+593 96 552 7710",
    instagram: "@mat.ced",
    address: "Via a la Costa km 9",
    deliveryInfo: "Needs weekend drop-off with clear package labels.",
    preferences: "Corporate orders need logo proof approval first.",
    lastOrder: "Apr 16",
    lifetimeValue: "$305"
  }
];

export const initialJobs: Job[] = [
  {
    id: "JOB-2401",
    customerId: "CUS-001",
    title: "Custom Linen Tote",
    productDetails: "Sand / Large / Qty 3",
    quantity: 3,
    price: "$96",
    deposit: "$40",
    remaining: "$56",
    deliveryDate: "Apr 26",
    status: "new",
    timelineNote: "Needs confirmation before cutting starts.",
    requirements: "Wide shoulder strap and interior zipper pocket.",
    createdAt: "Apr 22"
  },
  {
    id: "JOB-2398",
    customerId: "CUS-002",
    title: "Gift Box Bundle",
    productDetails: "Rose / Mixed sizes / Qty 8",
    quantity: 8,
    price: "$240",
    deposit: "$120",
    remaining: "$120",
    deliveryDate: "Apr 24",
    status: "current",
    timelineNote: "Final palette approved, production started.",
    requirements: "Include thank-you cards and satin ribbon wrapping.",
    createdAt: "Apr 21"
  },
  {
    id: "JOB-2394",
    customerId: "CUS-003",
    title: "Corporate Apron Set",
    productDetails: "Olive / M-L / Qty 12",
    quantity: 12,
    price: "$360",
    deposit: "$180",
    remaining: "$180",
    deliveryDate: "Apr 28",
    status: "pending",
    timelineNote: "Waiting on final logo file from client.",
    requirements: "Embroidery centered 2 cm below chest seam.",
    createdAt: "Apr 18"
  },
  {
    id: "JOB-2387",
    customerId: "CUS-001",
    title: "Summer Pouch",
    productDetails: "Terracotta / Small / Qty 5",
    quantity: 5,
    price: "$85",
    deposit: "$85",
    remaining: "$0",
    deliveryDate: "Apr 20",
    status: "ended",
    timelineNote: "Completed and ready for next route.",
    requirements: "Soft cotton lining and handwritten tags.",
    createdAt: "Apr 15"
  }
];

export const initialNotes: InternalNote[] = [
  {
    id: "NOTE-001",
    title: "Reorder kraft boxes",
    detail: "Stock is low for medium gift packaging before Friday pickups.",
    type: "purchase"
  },
  {
    id: "NOTE-002",
    title: "Camila follow-up",
    detail: "Confirm embroidery placement before the tote order moves into current work.",
    type: "reminder",
    customerId: "CUS-001"
  },
  {
    id: "NOTE-003",
    title: "Template improvement",
    detail: "Create reusable quote blocks for pouch bundles and apron sets.",
    type: "improvement"
  }
];

export const products: Product[] = [
  {
    id: "PROD-001",
    name: "Custom Linen Tote",
    category: "Bags",
    description: "Daily carry tote with optional interior zipper pocket.",
    colors: ["Sand", "Black", "Terracotta"],
    sizes: ["M", "L"],
    price: "$32",
    productionTime: "2-3 days",
    availability: "made to order"
  },
  {
    id: "PROD-002",
    name: "Summer Pouch",
    category: "Accessories",
    description: "Compact zipper pouch with soft cotton lining.",
    colors: ["Cream", "Olive", "Rose"],
    sizes: ["S", "M"],
    price: "$17",
    productionTime: "1-2 days",
    availability: "available"
  },
  {
    id: "PROD-003",
    name: "Corporate Apron Set",
    category: "Uniforms",
    description: "Heavy cotton apron with embroidery-ready chest panel.",
    colors: ["Olive", "Graphite"],
    sizes: ["M", "L", "XL"],
    price: "$30",
    productionTime: "4-5 days",
    availability: "paused"
  }
];

export const inventory: InventoryItem[] = [
  {
    id: "INV-001",
    material: "Linen roll",
    color: "Sand",
    quantity: "8 m",
    minimum: "10 m",
    notes: "Needed for three tote jobs already scheduled.",
    low: true
  },
  {
    id: "INV-002",
    material: "Thread cone",
    color: "Olive",
    quantity: "14 units",
    minimum: "6 units",
    notes: "Healthy for current production.",
    low: false
  },
  {
    id: "INV-003",
    material: "Metal zipper",
    color: "Gold",
    quantity: "18 units",
    minimum: "20 units",
    notes: "Reorder this week to avoid delay on pouches.",
    low: true
  }
];

export const users: UserAccess[] = [
  {
    id: "USER-001",
    name: "Andrea Salazar",
    email: "andrea@atelier.local",
    role: "Admin",
    status: "Approved"
  },
  {
    id: "USER-002",
    name: "Diego Vera",
    email: "diego@atelier.local",
    role: "Operator",
    status: "Pending approval"
  },
  {
    id: "USER-003",
    name: "Maria Pita",
    email: "maria@atelier.local",
    role: "Read-only",
    status: "Blocked"
  }
];
