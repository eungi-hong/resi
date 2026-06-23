import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ResiAvatar } from "@/components/avatar/ResiAvatar";
import { getRecommendedMaterials, getYouthUsers } from "@/src/data/demoData";

export default function PersonalizationDemoPage() {
  const users = getYouthUsers();
  return (
    <main className="page">
      <div className="app-container">
        <PageHeader title="Personalization demo" kicker="Dev/demo controls">Switch profiles to see age band, language, avatar, recommendations, and chat style change.</PageHeader>
        <div className="grid grid-4">
          {users.map((user) => {
            const character = user.avatarId?.startsWith("ree") ? "Ree" : "See";
            const materials = getRecommendedMaterials(user.id);
            return (
              <article className="card" key={user.id}>
                <ResiAvatar character={character} cue="wave" size="md" />
                <span className="badge">{user.age} years old · {user.languagePreference.toUpperCase()}</span>
                <h2>{user.name}</h2>
                <p className="muted">{user.ageBand?.replaceAll("_", " ").toLowerCase()}</p>
                <p><strong>Sample chat style:</strong> {user.ageBand === "CHILD_10_12" ? "simple examples and stronger adult nudges" : user.ageBand === "TEEN_13_15" ? "scenario practice and autonomy" : "decision aids and misinformation checks"}</p>
                <h3>Recommended modules</h3>
                <ul>{materials.slice(0, 2).map((material) => <li key={material.id}>{material.title}</li>)}</ul>
                <Link className="button" href={`/api/demo-login?username=${user.demoUsername}&next=/youth`}>Continue as {user.name}</Link>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
