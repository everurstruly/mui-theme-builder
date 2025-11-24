import { Button, type ButtonProps } from "@mui/material";
import React, { useState } from "react";

export default function FlashStateContent({
  children,
  flash,
  delayMs = 100,
  flashDurationMs = 5000,
  onClick,
  ...rest
}: {
  children: React.ReactNode;
  flash: React.ReactNode;
  delayMs?: number;
  flashDurationMs?: number;
  onClick?: () => void;
} & ButtonProps) {
  const [content, setContent] = useState(children);

  function handleClick() {
    setTimeout(() => {
      setContent(flash);
    }, delayMs);

    setTimeout(() => {
      setContent(children);
    }, flashDurationMs);

    if (onClick) onClick();
  }

  return (
    <Button {...rest} onClick={() => handleClick()}>
      {content}
    </Button>
  );
}
