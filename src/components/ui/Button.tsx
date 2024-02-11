import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = 'default' | 'outline' | 'destructive'

type ButtonSize = 'default' | 'icon'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant,
    size?: ButtonSize
}

const buttonVariants: Record<ButtonVariant, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
}

const buttonSizes: Record<ButtonSize, string> = {
    default: "h-8 px-4 py-2",
    icon: "h-8 w-8 rounded-full",
}

const Button = forwardRef<HTMLButtonElement, Props>(({ variant = 'default', size = 'default', className, ...restProps }, ref) => {
    return (
        <button ref={ref} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", buttonVariants[variant], buttonSizes[size], className)} {...restProps} />
    )
})

export default Button