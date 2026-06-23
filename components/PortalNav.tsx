import Link from "next/link";

const youthLinks = [
  ["/youth", "Dashboard"],
  ["/youth/chat", "Chat"],
  ["/youth/library", "Library"],
  ["/youth/quiz", "Quiz"],
  ["/youth/progress", "Progress"],
  ["/youth/trusted-adult", "Trusted adult"],
  ["/youth/profile", "Profile"],
  ["/youth/resources", "Resources"]
];

const parentLinks = [
  ["/parent", "Dashboard"],
  ["/parent/asha", "Asha insights"],
  ["/parent/asha/alerts", "Alerts"],
  ["/parent/asha/conversation-guides", "Guides"],
  ["/parent/settings", "Settings"]
];

const adminLinks = [
  ["/admin", "Overview"],
  ["/admin/analytics", "Analytics"],
  ["/admin/content", "Content"],
  ["/admin/risk-trends", "Risk trends"],
  ["/admin/settings", "Settings"]
];

export function PortalNav({ portal }: { portal: "youth" | "parent" | "admin" }) {
  const links = portal === "youth" ? youthLinks : portal === "parent" ? parentLinks : adminLinks;
  return (
    <aside className="sidebar" aria-label={`${portal} navigation`}>
      {links.map(([href, label]) => (
        <Link href={href} key={href}>{label}</Link>
      ))}
    </aside>
  );
}
