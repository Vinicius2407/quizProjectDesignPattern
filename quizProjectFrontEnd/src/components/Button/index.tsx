import { HTMLProps, ReactNode } from "react";

import { MyButton } from "./styles";

type ButtonProps = HTMLProps<HTMLButtonElement> & {
  children?: ReactNode;
};

export function Button({ children, ...rest }: ButtonProps) {
  return (
    <MyButton {...(rest as any)} type={rest.type || "button"}>
      {children}
    </MyButton>
  );
}
