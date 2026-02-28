import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-display font-bold tracking-[.03em] cursor-pointer transition-all duration-150 disabled:opacity-55 disabled:cursor-default",
  {
    variants: {
      variant: {
        primary: "bg-primary border-primary text-white border rounded-md",
        secondary: "bg-bg-elevated border border-border text-text-secondary rounded-md",
        ghost: "bg-transparent border-none text-text-secondary hover:bg-bg-elevated",
        danger: "bg-red border-red text-white border rounded-md",
        success: "bg-green border-green text-white border rounded-md",
      },
      size: {
        sm: "text-sm px-3 py-2",
        md: "text-base px-5 py-3",
        lg: "text-lg px-5 py-3.5 font-extrabold tracking-[.04em]",
        icon: "p-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const Button = ({ className, variant, size, ...props }) => (
  <button
    className={cn(buttonVariants({ variant, size }), className)}
    {...props}
  />
);

export { Button, buttonVariants };
