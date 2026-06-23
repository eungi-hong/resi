export function PageHeader({ title, kicker, children }: { title: string; kicker?: string; children?: React.ReactNode }) {
  return (
    <div className="page-title" style={{ marginBottom: 22 }}>
      {kicker ? <p className="badge">{kicker}</p> : null}
      <h1>{title}</h1>
      {children ? <p className="lead">{children}</p> : null}
    </div>
  );
}
