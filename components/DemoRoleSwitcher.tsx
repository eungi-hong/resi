import Link from "next/link";
import { getYouthUsers } from "@/src/data/demoData";

export function DemoRoleSwitcher() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "false") return null;
  return (
    <div className="demo-switcher" aria-label="Demo role switcher">
      <span>Demo</span>
      <Link href="/api/demo-login?username=asha&next=/youth">Youth</Link>
      <Link href="/api/demo-login?username=parent&next=/parent">Parent</Link>
      <Link href="/api/demo-login?username=admin&next=/admin">Admin</Link>
      <details>
        <summary>Youth profile</summary>
        <div className="demo-menu">
          {getYouthUsers().map((user) => (
            <Link key={user.id} href={`/api/demo-login?username=${user.demoUsername}&next=/youth`}>
              {user.name}, {user.age}
            </Link>
          ))}
        </div>
      </details>
    </div>
  );
}
