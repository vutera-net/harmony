export function Card({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-xl border border-card-border bg-card-bg p-6 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="mb-4 border-b pb-4" {...props}>{children}</div>
}

export function CardTitle({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className="text-xl font-bold text-foreground" {...props}>{children}</h2>
}

export function CardContent({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>
}
