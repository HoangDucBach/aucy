import { Button as NextButton, ButtonProps} from "@nextui-org/react";
import clsx from "clsx";
import { forwardRef } from "react";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, ...props }, ref) => {
        return (
            <NextButton ref={ref} {...props} className={clsx("font-semibold", props.className)}>
                {children}
            </NextButton>
        );
    }
);