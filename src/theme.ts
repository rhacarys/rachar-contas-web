import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "brand",
  colors: {
    brand: [
      "#e5f4ff",
      "#cde2ff",
      "#9bc2ff",
      "#64a0ff",
      "#3984fe",
      "#1d72fe",
      "#0968ff",
      "#0058e4",
      "#004ecc",
      "#0043b5",
    ],
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5C5F66",
      "#373A40",
      "#2C2E33",
      "#25262B",
      "#141517",
      "#101113",
      "#0b0c0e",
    ],
  },
  fontFamily: "Inter, system-ui, Avenir, Helvetica, sans-serif",
  headings: {
    fontFamily: "Inter, system-ui, Avenir, Helvetica, sans-serif",
  },
  defaultRadius: "md",
  components: {
    Button: {
      defaultProps: {
        size: "md",
        fw: 600,
      },
    },
    TextInput: {
      defaultProps: {
        variant: "filled",
        size: "md",
      },
    },
    PasswordInput: {
      defaultProps: {
        variant: "filled",
        size: "md",
      },
    },
    Card: {
      defaultProps: {
        p: "lg",
        radius: "md",
      },
      styles: {
        root: {
          backgroundColor: "var(--mantine-color-dark-7)",
          borderColor: "var(--mantine-color-dark-6)",
        },
      },
    },
    AppShell: {
      styles: {
        main: {
          backgroundColor: "var(--mantine-color-dark-8)",
        },
        header: {
          backgroundColor: "var(--mantine-color-dark-8)",
          borderBottom: "1px solid var(--mantine-color-dark-7)",
        },
      },
    },
  },
});
