export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-b border-border">
      <div className="brand-hero-bg">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col gap-4 text-white sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
              {description && <p className="mt-2 max-w-2xl text-white/85">{description}</p>}
            </div>
            {action}
          </div>
        </div>
      </div>
    </div>
  );
}
