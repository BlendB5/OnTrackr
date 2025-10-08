import * as React from "react"
import { cn } from "@/lib/utils"

export interface TooltipProps {
  children: React.ReactNode
  content: string
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, content, side = "top", className }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)

    return (
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
        {isVisible && (
          <div
            className={cn(
              "absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap",
              {
                "bottom-full left-1/2 transform -translate-x-1/2 mb-2": side === "top",
                "top-full left-1/2 transform -translate-x-1/2 mt-2": side === "bottom",
                "right-full top-1/2 transform -translate-y-1/2 mr-2": side === "left",
                "left-full top-1/2 transform -translate-y-1/2 ml-2": side === "right",
              },
              className
            )}
          >
            {content}
            <div
              className={cn(
                "absolute w-0 h-0 border-4 border-transparent",
                {
                  "top-full left-1/2 transform -translate-x-1/2 border-t-gray-900": side === "top",
                  "bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900": side === "bottom",
                  "left-full top-1/2 transform -translate-y-1/2 border-l-gray-900": side === "left",
                  "right-full top-1/2 transform -translate-y-1/2 border-r-gray-900": side === "right",
                }
              )}
            />
          </div>
        )}
      </div>
    )
  }
)
Tooltip.displayName = "Tooltip"

export { Tooltip }

