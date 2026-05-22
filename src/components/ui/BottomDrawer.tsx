import { Drawer, type DrawerProps } from "@mantine/core";
import type { ReactNode } from "react";

interface BottomDrawerProps extends Omit<DrawerProps, "position" | "size" | "styles" | "overlayProps"> {
  children: ReactNode;
  title: string;
}

export function BottomDrawer({ children, title, opened, onClose, ...props }: BottomDrawerProps) {
  return (
    <Drawer
      {...props}
      opened={opened}
      onClose={onClose}
      title={title}
      position="bottom"
      radius={0}
      size="calc(100vh - 60px)"
      styles={{
        inner: {
          marginTop: 60,
          height: "calc(100vh - 60px)",
        },
        content: {
          height: "100%",
        },
      }}
      overlayProps={{
        backgroundOpacity: 0.3,
        blur: 1,
        style: { marginTop: 60 },
      }}
    >
      {children}
    </Drawer>
  );
}
