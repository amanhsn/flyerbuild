import { cn } from "@/lib/utils"

function Card({ className, ...props }) {
  return (
    <div
      className={cn("bg-bg-raised border border-border rounded-lg", className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 p-4 pb-0", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("font-display text-base font-bold tracking-wide text-text-primary", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn("font-mono text-xs text-text-secondary", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return (
    <div className={cn("p-4", className)} {...props} />
  )
}

function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center p-4 pt-0", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
