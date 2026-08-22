import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  trend?: {
    value: number
    label: string
  }
  variant?: "default" | "primary" | "warning" | "destructive"
  className?: string
}

export function KpiCard({ title, value, icon, description, trend, variant = "default", className }: KpiCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-primary text-primary-foreground border-transparent shadow-md"
      case "warning":
        return "bg-amber-50 border-amber-200 text-amber-950 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-100"
      case "destructive":
        return "bg-red-50 border-red-200 text-red-950 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-100"
      default:
        return "bg-white dark:bg-slate-950 border-border/40 shadow-sm hover:shadow-md transition-all duration-300"
    }
  }

  const getIconColor = () => {
    switch (variant) {
      case "primary": return "text-primary-foreground/80"
      case "warning": return "text-amber-500"
      case "destructive": return "text-red-500"
      default: return "text-muted-foreground"
    }
  }

  return (
    <Card className={cn("p-5 rounded-2xl flex flex-col relative overflow-hidden group", getVariantStyles(), className)}>
      {variant === "primary" && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      )}
      
      <div className="flex items-center gap-3 font-semibold mb-3">
        <div className={cn("p-2 rounded-xl bg-background/50 backdrop-blur-sm", getIconColor())}>
          {icon}
        </div>
        <span className={cn(variant === "primary" ? "text-primary-foreground/90" : "text-muted-foreground")}>
          {title}
        </span>
      </div>
      
      <div className="text-3xl font-black tracking-tight mb-1">
        {value}
      </div>
      
      <div className="flex items-end justify-between mt-auto pt-2 gap-2">
        {description ? (
          <span className={cn("text-sm leading-tight", variant === "primary" ? "text-primary-foreground/80" : "text-muted-foreground")}>
            {description}
          </span>
        ) : <div />}
        
        {trend && (
          <div className={cn(
            "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full shrink-0 max-w-[60%]",
            trend.value > 0 
              ? variant === "primary" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : trend.value < 0 
                ? variant === "primary" ? "bg-black/20 text-white" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                : variant === "primary" ? "bg-white/10 text-white/80" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          )}>
            <div className="flex items-center shrink-0">
              {trend.value > 0 ? <TrendingUp size={14} /> : trend.value < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
              <span className="ml-1">{Math.abs(trend.value)}%</span>
            </div>
            {trend.label && <span className="font-normal opacity-70 ml-1 truncate">{trend.label}</span>}
          </div>
        )}
      </div>
    </Card>
  )
}
