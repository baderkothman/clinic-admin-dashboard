"use client";

import { useDeferredValue, useState, useTransition } from "react";
import {
  IconBellRinging,
  IconCalendarEvent,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconClockHour4,
  IconFileText,
  IconLayoutDashboard,
  IconMail,
  IconMessageCircle,
  IconPlus,
  IconSearch,
  IconSettings,
  IconStethoscope,
  IconTrash,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";

type Section = "overview" | "appointments" | "messages" | "cms" | "doctors" | "settings";
type DoctorStatus = "active" | "inactive";
type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled";
type MessageStatus = "new" | "in_progress" | "resolved";
type CmsStatus = "draft" | "published";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  status: DoctorStatus;
  experienceYears: number;
};

type Appointment = {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  service: string;
  doctorId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes: string;
};

type Message = {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  receivedAt: string;
  status: MessageStatus;
};

type CmsPage = {
  id: string;
  title: string;
  slug: string;
  status: CmsStatus;
  updatedAt: string;
  content: string;
};

const NAV_ITEMS: Array<{ key: Section; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { key: "overview", label: "Overview", icon: IconLayoutDashboard },
  { key: "appointments", label: "Appointments", icon: IconCalendarEvent },
  { key: "messages", label: "Messages", icon: IconMessageCircle },
  { key: "cms", label: "CMS", icon: IconFileText },
  { key: "doctors", label: "Doctors", icon: IconUsers },
  { key: "settings", label: "Settings", icon: IconSettings },
];

const SERVICE_OPTIONS = [
  "General Medicine",
  "Dental Care",
  "Physiotherapy",
  "Optometry",
  "Follow-up Consultation",
];

const SPECIALTY_OPTIONS = [
  "General Medicine",
  "Dental Care",
  "Physiotherapy",
  "Optometry",
  "Pediatrics",
  "Dermatology",
];

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: "doc_1",
    name: "Dr. Sarah Al-Mansouri",
    specialty: "General Medicine",
    email: "sarah@clinic-admin.com",
    phone: "+965 5001 1001",
    status: "active",
    experienceYears: 12,
  },
  {
    id: "doc_2",
    name: "Dr. Ahmed Al-Rashidi",
    specialty: "Optometry",
    email: "ahmed@clinic-admin.com",
    phone: "+965 5001 1002",
    status: "active",
    experienceYears: 9,
  },
  {
    id: "doc_3",
    name: "Dr. Lina Al-Farsi",
    specialty: "Dental Care",
    email: "lina@clinic-admin.com",
    phone: "+965 5001 1003",
    status: "active",
    experienceYears: 11,
  },
  {
    id: "doc_4",
    name: "Dr. Khalid Al-Otaibi",
    specialty: "Physiotherapy",
    email: "khalid@clinic-admin.com",
    phone: "+965 5001 1004",
    status: "inactive",
    experienceYears: 8,
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt_1",
    patientName: "Mariam Hassan",
    patientEmail: "mariam@example.com",
    patientPhone: "+965 6990 1111",
    service: "General Medicine",
    doctorId: "doc_1",
    date: "2026-04-19",
    time: "09:00",
    status: "confirmed",
    notes: "Recurring migraine.",
  },
  {
    id: "apt_2",
    patientName: "Faisal Nasser",
    patientEmail: "faisal@example.com",
    patientPhone: "+965 6990 2222",
    service: "Optometry",
    doctorId: "doc_2",
    date: "2026-04-19",
    time: "11:30",
    status: "scheduled",
    notes: "Blurred vision for 3 weeks.",
  },
  {
    id: "apt_3",
    patientName: "Noor Ahmad",
    patientEmail: "noor@example.com",
    patientPhone: "+965 6990 3333",
    service: "Dental Care",
    doctorId: "doc_3",
    date: "2026-04-20",
    time: "14:00",
    status: "confirmed",
    notes: "Tooth sensitivity follow-up.",
  },
  {
    id: "apt_4",
    patientName: "Omar Adel",
    patientEmail: "omar@example.com",
    patientPhone: "+965 6990 4444",
    service: "Physiotherapy",
    doctorId: "doc_4",
    date: "2026-04-21",
    time: "10:30",
    status: "scheduled",
    notes: "Post-ACL rehab.",
  },
  {
    id: "apt_5",
    patientName: "Huda Ali",
    patientEmail: "huda@example.com",
    patientPhone: "+965 6990 5555",
    service: "Follow-up Consultation",
    doctorId: "doc_1",
    date: "2026-04-22",
    time: "16:15",
    status: "completed",
    notes: "Blood pressure review.",
  },
  {
    id: "apt_6",
    patientName: "Majed Karim",
    patientEmail: "majed@example.com",
    patientPhone: "+965 6990 6666",
    service: "Dental Care",
    doctorId: "doc_3",
    date: "2026-04-24",
    time: "08:45",
    status: "cancelled",
    notes: "Cancelled by patient.",
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg_1",
    senderName: "Rana Al-Harbi",
    senderEmail: "rana@example.com",
    subject: "Insurance acceptance",
    body: "Do you accept Bupa insurance for dental visits?",
    receivedAt: "2026-04-17T09:20:00.000Z",
    status: "new",
  },
  {
    id: "msg_2",
    senderName: "Yousef Salem",
    senderEmail: "yousef@example.com",
    subject: "Reschedule request",
    body: "I need to move my appointment from Tuesday to Thursday afternoon.",
    receivedAt: "2026-04-17T08:12:00.000Z",
    status: "in_progress",
  },
  {
    id: "msg_3",
    senderName: "Lama Hamad",
    senderEmail: "lama@example.com",
    subject: "Lab result follow-up",
    body: "Can someone call me regarding my recent blood test result?",
    receivedAt: "2026-04-16T15:05:00.000Z",
    status: "resolved",
  },
];

const INITIAL_CMS_PAGES: CmsPage[] = [
  {
    id: "cms_1",
    title: "Homepage",
    slug: "home",
    status: "published",
    updatedAt: "2026-04-16T10:40:00.000Z",
    content:
      "High-trust bilingual clinic site with quick booking, service highlights, and team profiles.",
  },
  {
    id: "cms_2",
    title: "Services",
    slug: "services",
    status: "published",
    updatedAt: "2026-04-15T14:10:00.000Z",
    content: "Service descriptions, durations, and booking call-to-actions for each specialty.",
  },
  {
    id: "cms_3",
    title: "Insurance FAQ",
    slug: "insurance-faq",
    status: "draft",
    updatedAt: "2026-04-14T12:00:00.000Z",
    content: "Detailed insurance partner list, copay expectations, and claim submission guidance.",
  },
];

function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function dateToKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDateTimeValue(appointment: Appointment): number {
  return new Date(`${appointment.date}T${appointment.time}:00`).getTime();
}

function formatDate(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function getStatusClass(status: AppointmentStatus | MessageStatus | DoctorStatus | CmsStatus): string {
  if (
    status === "confirmed" ||
    status === "completed" ||
    status === "resolved" ||
    status === "active" ||
    status === "published"
  ) {
    return "bg-emerald-100 text-emerald-700";
  }
  if (status === "scheduled" || status === "in_progress") {
    return "bg-sky-100 text-sky-700";
  }
  if (status === "cancelled" || status === "inactive") {
    return "bg-rose-100 text-rose-700";
  }
  return "bg-amber-100 text-amber-700";
}

type CalendarCell = {
  dateKey: string;
  day: number;
  isCurrentMonth: boolean;
  month: number;
  year: number;
};

function buildCalendarCells(viewMonth: Date): CalendarCell[] {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const cells: CalendarCell[] = [];

  for (let index = 0; index < 42; index += 1) {
    const dayOffset = index - firstWeekday + 1;
    if (dayOffset <= 0) {
      const previousDate = new Date(year, month - 1, daysInPrevMonth + dayOffset);
      cells.push({
        dateKey: dateToKey(previousDate),
        day: previousDate.getDate(),
        isCurrentMonth: false,
        month: previousDate.getMonth(),
        year: previousDate.getFullYear(),
      });
      continue;
    }

    if (dayOffset > daysInMonth) {
      const nextDate = new Date(year, month + 1, dayOffset - daysInMonth);
      cells.push({
        dateKey: dateToKey(nextDate),
        day: nextDate.getDate(),
        isCurrentMonth: false,
        month: nextDate.getMonth(),
        year: nextDate.getFullYear(),
      });
      continue;
    }

    const currentDate = new Date(year, month, dayOffset);
    cells.push({
      dateKey: dateToKey(currentDate),
      day: dayOffset,
      isCurrentMonth: true,
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
    });
  }

  return cells;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [isPending, startTransition] = useTransition();

  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [cmsPages, setCmsPages] = useState<CmsPage[]>(INITIAL_CMS_PAGES);
  const [selectedCmsPageId, setSelectedCmsPageId] = useState(INITIAL_CMS_PAGES[0]?.id ?? "");

  const [viewMonth, setViewMonth] = useState(() => new Date(2026, 3, 1));
  const [selectedDate, setSelectedDate] = useState("all");
  const [messageSearch, setMessageSearch] = useState("");
  const deferredMessageSearch = useDeferredValue(messageSearch.trim().toLowerCase());

  const [flash, setFlash] = useState<string | null>(null);

  const [clinicName, setClinicName] = useState("Demo Clinic");
  const [clinicEmail, setClinicEmail] = useState("admin@demo-clinic.com");
  const [clinicPhone, setClinicPhone] = useState("+965 1234 5678");
  const [automationEmail, setAutomationEmail] = useState(true);
  const [automationSms, setAutomationSms] = useState(true);
  const [automationWhatsapp, setAutomationWhatsapp] = useState(false);
  const [autoFollowUps, setAutoFollowUps] = useState(true);
  const [sessionNow] = useState(() => new Date());

  const doctorsById = new Map(doctors.map((doctor) => [doctor.id, doctor]));
  const calendarCells = buildCalendarCells(viewMonth);

  const appointmentsSorted = [...appointments].sort((a, b) => toDateTimeValue(a) - toDateTimeValue(b));
  const upcomingAppointments = appointmentsSorted.filter(
    (appointment) => toDateTimeValue(appointment) >= sessionNow.getTime(),
  );
  const selectedDateAppointments =
    selectedDate === "all"
      ? appointmentsSorted
      : appointmentsSorted.filter((appointment) => appointment.date === selectedDate);

  const filteredMessages = messages.filter((message) => {
    if (!deferredMessageSearch) return true;
    const haystack = `${message.senderName} ${message.senderEmail} ${message.subject} ${message.body}`.toLowerCase();
    return haystack.includes(deferredMessageSearch);
  });

  const selectedCmsPage = cmsPages.find((page) => page.id === selectedCmsPageId) ?? cmsPages[0];

  function pushFlash(message: string) {
    setFlash(message);
    window.setTimeout(() => {
      setFlash((current) => (current === message ? null : current));
    }, 2400);
  }

  function handleSectionChange(section: Section) {
    startTransition(() => setActiveSection(section));
  }

  function handleDoctorCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const specialty = String(formData.get("specialty") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const experienceYears = Number(formData.get("experienceYears") ?? 0);

    if (!name || !specialty || !email || !phone || !experienceYears) {
      pushFlash("Doctor form is incomplete.");
      return;
    }

    setDoctors((current) => [
      {
        id: createId("doc"),
        name,
        specialty,
        email,
        phone,
        status: "active",
        experienceYears,
      },
      ...current,
    ]);

    event.currentTarget.reset();
    pushFlash("Doctor added successfully.");
  }

  function removeDoctor(doctorId: string) {
    setDoctors((current) => current.filter((doctor) => doctor.id !== doctorId));
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.doctorId === doctorId ? { ...appointment, doctorId: "unassigned" } : appointment,
      ),
    );
    pushFlash("Doctor removed. Existing appointments moved to unassigned.");
  }

  function toggleDoctorStatus(doctorId: string) {
    setDoctors((current) =>
      current.map((doctor) =>
        doctor.id === doctorId
          ? { ...doctor, status: doctor.status === "active" ? "inactive" : "active" }
          : doctor,
      ),
    );
  }

  function handleAppointmentCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const patientName = String(formData.get("patientName") ?? "").trim();
    const patientEmail = String(formData.get("patientEmail") ?? "").trim();
    const patientPhone = String(formData.get("patientPhone") ?? "").trim();
    const service = String(formData.get("service") ?? "").trim();
    const doctorId = String(formData.get("doctorId") ?? "").trim();
    const date = String(formData.get("date") ?? "").trim();
    const time = String(formData.get("time") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim();

    if (!patientName || !patientEmail || !patientPhone || !service || !doctorId || !date || !time) {
      pushFlash("Appointment form is incomplete.");
      return;
    }

    setAppointments((current) => [
      {
        id: createId("apt"),
        patientName,
        patientEmail,
        patientPhone,
        service,
        doctorId,
        date,
        time,
        status: "scheduled",
        notes,
      },
      ...current,
    ]);

    event.currentTarget.reset();
    pushFlash("Appointment created.");
  }

  function updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
    setAppointments((current) =>
      current.map((appointment) => (appointment.id === appointmentId ? { ...appointment, status } : appointment)),
    );
  }

  function deleteAppointment(appointmentId: string) {
    setAppointments((current) => current.filter((appointment) => appointment.id !== appointmentId));
    pushFlash("Appointment removed.");
  }

  function handleMessageCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const senderName = String(formData.get("senderName") ?? "").trim();
    const senderEmail = String(formData.get("senderEmail") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();

    if (!senderName || !senderEmail || !subject || !body) {
      pushFlash("Message form is incomplete.");
      return;
    }

    setMessages((current) => [
      {
        id: createId("msg"),
        senderName,
        senderEmail,
        subject,
        body,
        receivedAt: new Date().toISOString(),
        status: "new",
      },
      ...current,
    ]);

    event.currentTarget.reset();
    pushFlash("New inbound message captured.");
  }

  function updateMessageStatus(messageId: string, status: MessageStatus) {
    setMessages((current) => current.map((message) => (message.id === messageId ? { ...message, status } : message)));
  }

  function createCmsPage() {
    const page: CmsPage = {
      id: createId("cms"),
      title: "Untitled Page",
      slug: `page-${cmsPages.length + 1}`,
      status: "draft",
      updatedAt: new Date().toISOString(),
      content: "Start writing content here.",
    };
    setCmsPages((current) => [page, ...current]);
    setSelectedCmsPageId(page.id);
    pushFlash("CMS page created.");
  }

  function updateSelectedCmsPage(updates: Partial<CmsPage>) {
    if (!selectedCmsPage) return;
    setCmsPages((current) =>
      current.map((page) => (page.id === selectedCmsPage.id ? { ...page, ...updates } : page)),
    );
  }

  function saveCmsPage() {
    if (!selectedCmsPage) return;
    setCmsPages((current) =>
      current.map((page) =>
        page.id === selectedCmsPage.id ? { ...page, updatedAt: new Date().toISOString() } : page,
      ),
    );
    pushFlash("CMS page saved.");
  }

  function saveSettings() {
    pushFlash("Admin settings updated.");
  }

  const totalMessagesNew = messages.filter((message) => message.status === "new").length;
  const activeDoctors = doctors.filter((doctor) => doctor.status === "active").length;
  const todaysDateKey = dateToKey(sessionNow);
  const todaysAppointments = appointments.filter((appointment) => appointment.date === todaysDateKey);

  return (
    <div className="min-h-screen bg-[linear-gradient(145deg,#edf4f9_0%,#f2f0eb_45%,#e9f1f6_100%)] text-[#13202b]">
      <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-5 p-4 md:p-6 xl:flex-row">
        <aside className="w-full rounded-3xl border border-white/75 bg-white/70 p-4 shadow-[0_24px_70px_-42px_rgba(19,32,43,0.75)] backdrop-blur-sm xl:w-72">
          <div className="rounded-2xl bg-gradient-to-br from-[#15334a] via-[#1d4966] to-[#2f6a8e] p-4 text-white">
            <p className="text-xs uppercase tracking-[0.14em] text-sky-100/85">Clinic Ops</p>
            <h1 className="mt-1 text-xl font-semibold">Admin Console</h1>
            <p className="mt-2 text-sm text-sky-100/90">Manage content, team, appointments, and patient communication.</p>
          </div>

          <nav className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleSectionChange(item.key)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#1e4e6f] text-white shadow-md"
                      : "bg-white/75 text-[#2b4458] hover:bg-[#e6eef4]"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-4 space-y-2 rounded-2xl border border-[#d7e2ea] bg-[#f3f8fb] p-3 text-sm text-[#2b4458]">
            <p className="font-semibold text-[#18354a]">Today at a glance</p>
            <p className="flex items-center justify-between">
              <span>Appointments</span>
              <span className="font-semibold">{todaysAppointments.length}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Unread messages</span>
              <span className="font-semibold">{totalMessagesNew}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Active doctors</span>
              <span className="font-semibold">{activeDoctors}</span>
            </p>
          </div>
        </aside>

        <main className="flex-1 space-y-4">
          <header className="rounded-3xl border border-white/75 bg-white/70 p-5 shadow-[0_24px_70px_-42px_rgba(19,32,43,0.75)] backdrop-blur-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#5a778f]">Healthcare admin workspace</p>
                <h2 className="mt-1 text-2xl font-semibold text-[#15334a]">
                  {NAV_ITEMS.find((item) => item.key === activeSection)?.label}
                </h2>
                <p className="mt-1 text-sm text-[#436077]">
                  {activeSection === "overview" && "Track operational health and monitor workload distribution."}
                  {activeSection === "appointments" && "Centralized scheduling with a monthly calendar and status controls."}
                  {activeSection === "messages" && "Inbox for inbound patient messages and response workflow tracking."}
                  {activeSection === "cms" && "Edit website content pages and publish updates without code changes."}
                  {activeSection === "doctors" && "Manage doctor profiles, specialties, and availability status."}
                  {activeSection === "settings" && "Configure clinic profile and automation preferences."}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#436077]">
                <IconClockHour4 size={16} />
                Last sync: {sessionNow.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                {isPending && (
                  <span className="rounded bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">Loading…</span>
                )}
              </div>
            </div>
          </header>

          {flash && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {flash}
            </div>
          )}

          <section className="rounded-3xl border border-white/75 bg-white/75 p-4 shadow-[0_24px_70px_-42px_rgba(19,32,43,0.75)] backdrop-blur-sm md:p-6">
            {activeSection === "overview" && (
              <div className="space-y-6">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl bg-[#eff6fb] p-4">
                    <p className="text-xs uppercase tracking-[0.1em] text-[#547188]">Total Appointments</p>
                    <p className="mt-2 text-3xl font-semibold text-[#15334a]">{appointments.length}</p>
                  </div>
                  <div className="rounded-2xl bg-[#edf8f3] p-4">
                    <p className="text-xs uppercase tracking-[0.1em] text-[#4f7762]">Confirmed Today</p>
                    <p className="mt-2 text-3xl font-semibold text-[#20573d]">
                      {todaysAppointments.filter((appointment) => appointment.status === "confirmed").length}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#eef0fb] p-4">
                    <p className="text-xs uppercase tracking-[0.1em] text-[#566295]">New Messages</p>
                    <p className="mt-2 text-3xl font-semibold text-[#314377]">{totalMessagesNew}</p>
                  </div>
                  <div className="rounded-2xl bg-[#fdf2ea] p-4">
                    <p className="text-xs uppercase tracking-[0.1em] text-[#8b5c3b]">Published Pages</p>
                    <p className="mt-2 text-3xl font-semibold text-[#74472b]">
                      {cmsPages.filter((page) => page.status === "published").length}
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
                  <div className="rounded-2xl border border-[#d8e2ea] bg-[#f8fbfd] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#15334a]">Upcoming appointments</h3>
                      <button
                        type="button"
                        onClick={() => handleSectionChange("appointments")}
                        className="text-sm font-semibold text-[#1f5f87] hover:text-[#153f5b]"
                      >
                        Open calendar
                      </button>
                    </div>
                    <div className="space-y-2">
                      {upcomingAppointments.slice(0, 6).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#dbe5ec] bg-white px-3 py-2 text-sm"
                        >
                          <div>
                            <p className="font-semibold text-[#1d3d56]">{appointment.patientName}</p>
                            <p className="text-[#4d6679]">
                              {appointment.service} • {formatDate(appointment.date)} at {appointment.time}
                            </p>
                          </div>
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusClass(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#d8e2ea] bg-[#f8fbfd] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#15334a]">Recent messages</h3>
                      <button
                        type="button"
                        onClick={() => handleSectionChange("messages")}
                        className="text-sm font-semibold text-[#1f5f87] hover:text-[#153f5b]"
                      >
                        Open inbox
                      </button>
                    </div>
                    <div className="space-y-2">
                      {messages
                        .slice()
                        .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
                        .slice(0, 5)
                        .map((message) => (
                          <div key={message.id} className="rounded-xl border border-[#dbe5ec] bg-white p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold text-[#1d3d56]">{message.senderName}</p>
                                <p className="text-sm text-[#4d6679]">{message.subject}</p>
                              </div>
                              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusClass(message.status)}`}>
                                {message.status}
                              </span>
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm text-[#5f7383]">{message.body}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "appointments" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedDate("all")}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      selectedDate === "all" ? "bg-[#1f5f87] text-white" : "bg-[#e4edf4] text-[#466179]"
                    }`}
                  >
                    All dates
                  </button>
                  {selectedDate !== "all" && (
                    <span className="rounded-full bg-[#edf4f9] px-3 py-1 text-xs font-semibold text-[#466179]">
                      {formatDate(selectedDate)}
                    </span>
                  )}
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
                  <div className="rounded-2xl border border-[#d8e2ea] bg-[#f8fbfd] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#15334a]">Monthly calendar</h3>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
                          className="rounded-lg border border-[#c9d8e4] bg-white p-1.5 text-[#30506a] hover:bg-[#f2f8fc]"
                        >
                          <IconChevronLeft size={16} />
                        </button>
                        <p className="w-40 text-center text-sm font-semibold text-[#1d3d56]">{getMonthLabel(viewMonth)}</p>
                        <button
                          type="button"
                          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
                          className="rounded-lg border border-[#c9d8e4] bg-white p-1.5 text-[#30506a] hover:bg-[#f2f8fc]"
                        >
                          <IconChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-[0.08em] text-[#638097]">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
                        <p key={label}>{label}</p>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarCells.map((cell) => {
                        const dayCount = appointments.filter((appointment) => appointment.date === cell.dateKey).length;
                        const isSelected = selectedDate === cell.dateKey;
                        return (
                          <button
                            key={cell.dateKey}
                            type="button"
                            onClick={() => {
                              setSelectedDate(cell.dateKey);
                              if (!cell.isCurrentMonth) {
                                setViewMonth(new Date(cell.year, cell.month, 1));
                              }
                            }}
                            className={`rounded-lg border p-2 text-left transition ${
                              isSelected
                                ? "border-[#2d6f9b] bg-[#2d6f9b] text-white"
                                : cell.isCurrentMonth
                                  ? "border-[#d6e2eb] bg-white hover:bg-[#eef5fb]"
                                  : "border-[#edf2f6] bg-[#f4f7f9] text-[#8ba1b2]"
                            }`}
                          >
                            <p className="text-xs font-semibold">{cell.day}</p>
                            <p className={`mt-1 text-[11px] ${isSelected ? "text-white/85" : "text-[#567286]"}`}>
                              {dayCount} appt
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <form
                    onSubmit={handleAppointmentCreate}
                    className="rounded-2xl border border-[#d8e2ea] bg-[#f8fbfd] p-4"
                  >
                    <h3 className="mb-3 text-lg font-semibold text-[#15334a]">Create appointment</h3>
                    <div className="grid gap-2">
                      <input
                        name="patientName"
                        placeholder="Patient name"
                        className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]"
                        required
                      />
                      <input
                        name="patientEmail"
                        type="email"
                        placeholder="Patient email"
                        className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]"
                        required
                      />
                      <input
                        name="patientPhone"
                        placeholder="Patient phone"
                        className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          name="service"
                          className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]"
                          required
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select service
                          </option>
                          {SERVICE_OPTIONS.map((service) => (
                            <option key={service} value={service}>
                              {service}
                            </option>
                          ))}
                        </select>
                        <select
                          name="doctorId"
                          className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]"
                          required
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Assign doctor
                          </option>
                          {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                              {doctor.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          name="date"
                          type="date"
                          className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]"
                          required
                        />
                        <input
                          name="time"
                          type="time"
                          className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]"
                          required
                        />
                      </div>
                      <textarea
                        name="notes"
                        rows={3}
                        placeholder="Clinical note"
                        className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1f5f87] px-4 py-2 text-sm font-semibold text-white hover:bg-[#164765]"
                      >
                        <IconPlus size={15} />
                        Add appointment
                      </button>
                    </div>
                  </form>
                </div>

                <div className="space-y-2">
                  {selectedDateAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="grid gap-3 rounded-xl border border-[#dbe6ee] bg-white p-3 lg:grid-cols-[1.2fr_1fr_0.8fr_auto]"
                    >
                      <div>
                        <p className="font-semibold text-[#1d3d56]">{appointment.patientName}</p>
                        <p className="text-sm text-[#526a7d]">
                          {appointment.service} • {appointment.date} at {appointment.time}
                        </p>
                        <p className="text-xs text-[#698296]">{doctorsById.get(appointment.doctorId)?.name ?? "Unassigned doctor"}</p>
                      </div>
                      <div className="text-sm text-[#526a7d]">
                        <p>{appointment.patientEmail}</p>
                        <p>{appointment.patientPhone}</p>
                        <p className="mt-1 text-xs text-[#6c8192]">{appointment.notes || "No notes"}</p>
                      </div>
                      <select
                        value={appointment.status}
                        onChange={(event) =>
                          updateAppointmentStatus(appointment.id, event.target.value as AppointmentStatus)
                        }
                        className={`h-9 rounded-lg px-2 py-1.5 text-xs font-semibold ${getStatusClass(appointment.status)}`}
                      >
                        <option value="scheduled">scheduled</option>
                        <option value="confirmed">confirmed</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => deleteAppointment(appointment.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                        aria-label="Delete appointment"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "messages" && (
              <div className="grid gap-4 xl:grid-cols-[1fr_1.5fr]">
                <form onSubmit={handleMessageCreate} className="rounded-2xl border border-[#d8e2ea] bg-[#f8fbfd] p-4">
                  <h3 className="mb-3 text-lg font-semibold text-[#15334a]">Capture inbound message</h3>
                  <div className="grid gap-2">
                    <input name="senderName" placeholder="Sender name" className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]" required />
                    <input name="senderEmail" type="email" placeholder="Sender email" className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]" required />
                    <input name="subject" placeholder="Subject" className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]" required />
                    <textarea name="body" rows={4} placeholder="Message body" className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]" required />
                    <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1f5f87] px-4 py-2 text-sm font-semibold text-white hover:bg-[#164765]">
                      <IconMail size={15} />
                      Add to inbox
                    </button>
                  </div>
                </form>

                <div className="rounded-2xl border border-[#d8e2ea] bg-[#f8fbfd] p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-[#15334a]">Inbox</h3>
                    <p className="text-sm text-[#557088]">{filteredMessages.length} messages</p>
                  </div>
                  <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#ccdae5] bg-white px-2 py-1.5">
                    <IconSearch size={15} className="text-[#557088]" />
                    <input value={messageSearch} onChange={(event) => setMessageSearch(event.target.value)} placeholder="Search sender, subject, body..." className="w-full bg-transparent text-sm outline-none" />
                  </div>
                  <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                    {filteredMessages
                      .slice()
                      .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
                      .map((message) => (
                        <div key={message.id} className="rounded-xl border border-[#dbe6ee] bg-white p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-[#1d3d56]">{message.subject}</p>
                              <p className="text-sm text-[#516b7e]">{message.senderName} • {message.senderEmail}</p>
                            </div>
                            <select value={message.status} onChange={(event) => updateMessageStatus(message.id, event.target.value as MessageStatus)} className={`rounded-md px-2 py-1 text-xs font-semibold ${getStatusClass(message.status)}`}>
                              <option value="new">new</option>
                              <option value="in_progress">in progress</option>
                              <option value="resolved">resolved</option>
                            </select>
                          </div>
                          <p className="mt-2 text-sm text-[#5b7385]">{message.body}</p>
                          <p className="mt-2 text-xs text-[#7d92a2]">{formatDateTime(message.receivedAt)}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "cms" && (
              <div className="grid gap-4 xl:grid-cols-[0.9fr_1.4fr]">
                <div className="rounded-2xl border border-[#d8e2ea] bg-[#f8fbfd] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#15334a]">Pages</h3>
                    <button
                      type="button"
                      onClick={createCmsPage}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#1f5f87] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#164765]"
                    >
                      <IconPlus size={14} />
                      New page
                    </button>
                  </div>
                  <div className="space-y-2">
                    {cmsPages.map((page) => (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => setSelectedCmsPageId(page.id)}
                        className={`w-full rounded-xl border p-3 text-left transition ${
                          selectedCmsPageId === page.id
                            ? "border-[#2d6f9b] bg-[#edf5fb]"
                            : "border-[#dbe6ee] bg-white hover:bg-[#f5f9fc]"
                        }`}
                      >
                        <p className="font-semibold text-[#1d3d56]">{page.title}</p>
                        <p className="text-xs text-[#587488]">/{page.slug}</p>
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className={`rounded-full px-2 py-1 font-semibold ${getStatusClass(page.status)}`}>
                            {page.status}
                          </span>
                          <span className="text-[#7c92a2]">{formatDateTime(page.updatedAt)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#d8e2ea] bg-[#f8fbfd] p-4">
                  {selectedCmsPage ? (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-[#15334a]">Page editor</h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <label className="space-y-1 text-sm">
                          <span className="font-medium text-[#355268]">Title</span>
                          <input
                            value={selectedCmsPage.title}
                            onChange={(event) => updateSelectedCmsPage({ title: event.target.value })}
                            className="w-full rounded-lg border border-[#ccdae5] bg-white px-3 py-2 outline-none focus:border-[#2d6f9b]"
                          />
                        </label>
                        <label className="space-y-1 text-sm">
                          <span className="font-medium text-[#355268]">Slug</span>
                          <input
                            value={selectedCmsPage.slug}
                            onChange={(event) =>
                              updateSelectedCmsPage({
                                slug: event.target.value.toLowerCase().replace(/\s+/g, "-"),
                              })
                            }
                            className="w-full rounded-lg border border-[#ccdae5] bg-white px-3 py-2 outline-none focus:border-[#2d6f9b]"
                          />
                        </label>
                      </div>
                      <label className="space-y-1 text-sm">
                        <span className="font-medium text-[#355268]">Status</span>
                        <select
                          value={selectedCmsPage.status}
                          onChange={(event) =>
                            updateSelectedCmsPage({ status: event.target.value as CmsStatus })
                          }
                          className="w-full rounded-lg border border-[#ccdae5] bg-white px-3 py-2 outline-none focus:border-[#2d6f9b]"
                        >
                          <option value="draft">draft</option>
                          <option value="published">published</option>
                        </select>
                      </label>
                      <label className="space-y-1 text-sm">
                        <span className="font-medium text-[#355268]">Content</span>
                        <textarea
                          value={selectedCmsPage.content}
                          onChange={(event) => updateSelectedCmsPage({ content: event.target.value })}
                          rows={10}
                          className="w-full rounded-lg border border-[#ccdae5] bg-white px-3 py-2 outline-none focus:border-[#2d6f9b]"
                        />
                      </label>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs text-[#6a8498]">Last updated {formatDateTime(selectedCmsPage.updatedAt)}</p>
                        <button
                          type="button"
                          onClick={saveCmsPage}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#1f5f87] px-4 py-2 text-sm font-semibold text-white hover:bg-[#164765]"
                        >
                          <IconCheck size={16} />
                          Save page
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[#557088]">Create a CMS page to begin editing.</p>
                  )}
                </div>
              </div>
            )}

            {activeSection === "doctors" && (
              <div className="grid gap-4 xl:grid-cols-[1fr_1.5fr]">
                <form onSubmit={handleDoctorCreate} className="rounded-2xl border border-[#d8e2ea] bg-[#f8fbfd] p-4">
                  <h3 className="mb-3 text-lg font-semibold text-[#15334a]">Add doctor</h3>
                  <div className="grid gap-2">
                    <input
                      name="name"
                      placeholder="Doctor full name"
                      className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]"
                      required
                    />
                    <select
                      name="specialty"
                      defaultValue=""
                      className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]"
                      required
                    >
                      <option value="" disabled>
                        Select specialty
                      </option>
                      {SPECIALTY_OPTIONS.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                    <input
                      name="email"
                      type="email"
                      placeholder="Email"
                      className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]"
                      required
                    />
                    <input
                      name="phone"
                      placeholder="Phone"
                      className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]"
                      required
                    />
                    <input
                      name="experienceYears"
                      type="number"
                      min={1}
                      max={45}
                      placeholder="Years of experience"
                      className="rounded-lg border border-[#ccdae5] bg-white px-3 py-2 text-sm outline-none focus:border-[#2d6f9b]"
                      required
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1f5f87] px-4 py-2 text-sm font-semibold text-white hover:bg-[#164765]"
                    >
                      <IconUserPlus size={16} />
                      Add doctor
                    </button>
                  </div>
                </form>

                <div className="rounded-2xl border border-[#d8e2ea] bg-[#f8fbfd] p-4">
                  <h3 className="mb-3 text-lg font-semibold text-[#15334a]">Doctor directory</h3>
                  <div className="space-y-2">
                    {doctors.map((doctor) => {
                      const doctorAppointments = appointments.filter(
                        (appointment) => appointment.doctorId === doctor.id,
                      ).length;
                      return (
                        <div
                          key={doctor.id}
                          className="grid gap-2 rounded-xl border border-[#dbe6ee] bg-white p-3 md:grid-cols-[1.1fr_0.8fr_0.7fr_auto]"
                        >
                          <div>
                            <p className="font-semibold text-[#1d3d56]">{doctor.name}</p>
                            <p className="text-sm text-[#557188]">{doctor.specialty}</p>
                          </div>
                          <div className="text-sm text-[#557188]">
                            <p>{doctor.email}</p>
                            <p>{doctor.phone}</p>
                          </div>
                          <div className="text-sm text-[#557188]">
                            <p>{doctor.experienceYears} years exp.</p>
                            <p>{doctorAppointments} appointments</p>
                            <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusClass(doctor.status)}`}>
                              {doctor.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => toggleDoctorStatus(doctor.id)}
                              className="rounded-lg border border-[#cfe0eb] px-3 py-1.5 text-xs font-semibold text-[#284c67] hover:bg-[#eef5fb]"
                            >
                              Toggle
                            </button>
                            <button
                              type="button"
                              onClick={() => removeDoctor(doctor.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                              aria-label="Remove doctor"
                            >
                              <IconTrash size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "settings" && (
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-2xl border border-[#d8e2ea] bg-[#f8fbfd] p-4">
                  <h3 className="mb-3 text-lg font-semibold text-[#15334a]">Clinic profile</h3>
                  <div className="space-y-2">
                    <label className="space-y-1 text-sm">
                      <span className="font-medium text-[#355268]">Clinic name</span>
                      <input
                        value={clinicName}
                        onChange={(event) => setClinicName(event.target.value)}
                        className="w-full rounded-lg border border-[#ccdae5] bg-white px-3 py-2 outline-none focus:border-[#2d6f9b]"
                      />
                    </label>
                    <label className="space-y-1 text-sm">
                      <span className="font-medium text-[#355268]">Notification email</span>
                      <input
                        value={clinicEmail}
                        onChange={(event) => setClinicEmail(event.target.value)}
                        className="w-full rounded-lg border border-[#ccdae5] bg-white px-3 py-2 outline-none focus:border-[#2d6f9b]"
                      />
                    </label>
                    <label className="space-y-1 text-sm">
                      <span className="font-medium text-[#355268]">Phone number</span>
                      <input
                        value={clinicPhone}
                        onChange={(event) => setClinicPhone(event.target.value)}
                        className="w-full rounded-lg border border-[#ccdae5] bg-white px-3 py-2 outline-none focus:border-[#2d6f9b]"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#d8e2ea] bg-[#f8fbfd] p-4">
                  <h3 className="mb-3 text-lg font-semibold text-[#15334a]">Automation controls</h3>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between rounded-lg border border-[#dbe6ee] bg-white px-3 py-2 text-sm">
                      <span className="inline-flex items-center gap-2">
                        <IconMail size={15} className="text-[#1f5f87]" />
                        Email reminders
                      </span>
                      <input type="checkbox" checked={automationEmail} onChange={(event) => setAutomationEmail(event.target.checked)} className="h-4 w-4 accent-[#1f5f87]" />
                    </label>
                    <label className="flex items-center justify-between rounded-lg border border-[#dbe6ee] bg-white px-3 py-2 text-sm">
                      <span className="inline-flex items-center gap-2">
                        <IconBellRinging size={15} className="text-[#1f5f87]" />
                        SMS reminders
                      </span>
                      <input type="checkbox" checked={automationSms} onChange={(event) => setAutomationSms(event.target.checked)} className="h-4 w-4 accent-[#1f5f87]" />
                    </label>
                    <label className="flex items-center justify-between rounded-lg border border-[#dbe6ee] bg-white px-3 py-2 text-sm">
                      <span className="inline-flex items-center gap-2">
                        <IconMessageCircle size={15} className="text-[#1f5f87]" />
                        WhatsApp reminders
                      </span>
                      <input type="checkbox" checked={automationWhatsapp} onChange={(event) => setAutomationWhatsapp(event.target.checked)} className="h-4 w-4 accent-[#1f5f87]" />
                    </label>
                    <label className="flex items-center justify-between rounded-lg border border-[#dbe6ee] bg-white px-3 py-2 text-sm">
                      <span className="inline-flex items-center gap-2">
                        <IconStethoscope size={15} className="text-[#1f5f87]" />
                        Auto follow-up after completed visit
                      </span>
                      <input type="checkbox" checked={autoFollowUps} onChange={(event) => setAutoFollowUps(event.target.checked)} className="h-4 w-4 accent-[#1f5f87]" />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={saveSettings}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1f5f87] px-4 py-2 text-sm font-semibold text-white hover:bg-[#164765]"
                  >
                    <IconCheck size={15} />
                    Save settings
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
