import Link from "next/link";
import { demoUsers } from "@/src/data/demoData";

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const next = params?.next;
  return (
    <main className="page">
      <div className="container">
        <div className="page-title">
          <p className="badge">Demo auth</p>
          <h1>Choose a role</h1>
          <p className="lead">The MVP uses role-switching demo auth. No secrets or real accounts are required.</p>
        </div>
        <div className="grid grid-3">
          {demoUsers.map((user) => (
            <div className="card" key={user.id}>
              <span className="badge">{user.role.toLowerCase()}</span>
              <h2>{user.name}</h2>
              <p className="muted">@{user.demoUsername}{user.age ? `, age ${user.age}` : ""}</p>
              <Link className="button" href={`/api/demo-login?username=${user.demoUsername}${next ? `&next=${encodeURIComponent(next)}` : ""}`}>
                Continue
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
