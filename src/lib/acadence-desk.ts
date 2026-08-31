/**
 * Acadence 90/10 spoken desk — snapshot for the signed-in HQ surface.
 *
 * Live API is Mike’s desk (list_queue / desk_health). This site cannot call
 * it from the browser. The snapshot is the last honest readout we took.
 * Speak at most nine lines. This page never sends to colleges.
 */

export const ACADENCE_BUCKETS = [
  "ready",
  "mail",
  "hold",
  "sent",
  "skip",
] as const;

export type AcadenceBucket = (typeof ACADENCE_BUCKETS)[number];

export type AcadenceDeskRow = {
  schoolName: string;
  spoken: string;
  percent9010: number;
  channel: "email" | "mail" | "phone";
  bucket: AcadenceBucket;
};

export type AcadenceHealth = {
  product: string;
  version: string;
  store: "ok" | "down";
  ready: number;
  mail: number;
  sent: number;
  hold: number;
  followUp: string;
  asOf: string;
  reviewer: string;
};

export const ACADENCE_HEALTH: AcadenceHealth = {
  product: "acadence-9010",
  version: "1.0.26238.19",
  store: "ok",
  ready: 15,
  mail: 11,
  sent: 0,
  hold: 0,
  followUp: "planned",
  asOf: "2026-08-29",
  reviewer: "Mike Strelick",
};

export const ACADENCE_ROWS: AcadenceDeskRow[] = [
  {
    schoolName: "Colorado Technical University",
    spoken: "Colorado Technical University, inquiries@perdoceoed.com",
    percent9010: 88,
    channel: "email",
    bucket: "ready",
  },
  {
    schoolName: "CBT Technology Institute",
    spoken: "CBT Technology Institute, hector@cbt.edu",
    percent9010: 94.54,
    channel: "email",
    bucket: "ready",
  },
  {
    schoolName: "Martinsburg College",
    spoken: "Martinsburg College, info@martinsburgcollege.edu",
    percent9010: 98.73,
    channel: "email",
    bucket: "ready",
  },
  {
    schoolName: "Florida Education Institute",
    spoken: "Florida Education Institute, services@fei.edu",
    percent9010: 92.28,
    channel: "email",
    bucket: "ready",
  },
  {
    schoolName: "St. Louis College of Health Careers",
    spoken: "St. Louis College of Health Careers, admissions@slchc.edu",
    percent9010: 91.52,
    channel: "email",
    bucket: "ready",
  },
  {
    schoolName: "Fremont University",
    spoken: "Fremont University, info@fremont.edu",
    percent9010: 90.6,
    channel: "email",
    bucket: "ready",
  },
  {
    schoolName: "Gwinnett College",
    spoken: "Gwinnett College, tdavis@gwinnettcollege.edu",
    percent9010: 97.48,
    channel: "email",
    bucket: "ready",
  },
  {
    schoolName: "Houston Barber School",
    spoken: "Houston Barber School, info@htxbarberschool.com",
    percent9010: 85.72,
    channel: "email",
    bucket: "ready",
  },
  {
    schoolName: "Southern California Health Institute (SOCHI)",
    spoken: "Southern California Health Institute (SOCHI), info@sochi.edu",
    percent9010: 90.99,
    channel: "email",
    bucket: "ready",
  },
  {
    schoolName: "DeVry University",
    spoken: "DeVry University, paper",
    percent9010: 89.6,
    channel: "mail",
    bucket: "mail",
  },
  {
    schoolName: "Strayer University",
    spoken: "Strayer University, investor.relations@strategiced.com",
    percent9010: 89.47,
    channel: "mail",
    bucket: "mail",
  },
  {
    schoolName: "American Public University System",
    spoken: "American Public University System, investorrelations@apei.com",
    percent9010: 89,
    channel: "mail",
    bucket: "mail",
  },
  {
    schoolName: "MyComputerCareer at Indianapolis",
    spoken: "MyComputerCareer at Indianapolis, paper",
    percent9010: 96.59,
    channel: "mail",
    bucket: "mail",
  },
  {
    schoolName: "Crescent City School of Gaming & Bartending",
    spoken: "Crescent City School of Gaming & Bartending, paper",
    percent9010: 88.93,
    channel: "mail",
    bucket: "mail",
  },
  {
    schoolName: "Escuela Tecnica De Electricidad",
    spoken: "Escuela Tecnica De Electricidad, paper",
    percent9010: 90.48,
    channel: "mail",
    bucket: "mail",
  },
  {
    schoolName: "LaBarberia Institute of Hair",
    spoken: "LaBarberia Institute of Hair, paper",
    percent9010: 91.71,
    channel: "mail",
    bucket: "mail",
  },
  {
    schoolName: "Industrial Technical College",
    spoken: "Industrial Technical College, paper",
    percent9010: 88.67,
    channel: "mail",
    bucket: "mail",
  },
  {
    schoolName: "Woodruff Medical and Wellness Training",
    spoken: "Woodruff Medical and Wellness Training, paper",
    percent9010: 96.04,
    channel: "phone",
    bucket: "mail",
  },
];

export const ACADENCE_SPEAK_LIMIT = 9;

export function acadenceCount(bucket: AcadenceBucket): number {
  if (bucket === "ready") return ACADENCE_HEALTH.ready;
  if (bucket === "mail") return ACADENCE_HEALTH.mail;
  if (bucket === "sent") return ACADENCE_HEALTH.sent;
  if (bucket === "hold") return ACADENCE_HEALTH.hold;
  return ACADENCE_ROWS.filter((r) => r.bucket === bucket).length;
}

export function acadenceQueue(bucket: AcadenceBucket): AcadenceDeskRow[] {
  return ACADENCE_ROWS.filter((r) => r.bucket === bucket).slice(
    0,
    ACADENCE_SPEAK_LIMIT,
  );
}

export function acadenceHealthReadout(health = ACADENCE_HEALTH): string {
  return `Desk ${health.version}, store ${health.store}, ${health.ready} ready, ${health.mail} mail, ${health.sent} sent, ${health.hold} hold.`;
}

export function formatPercent9010(n: number): string {
  return n.toFixed(n % 1 === 0 ? 0 : 2) + "%";
}
