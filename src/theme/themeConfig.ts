import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    colorLink: "#00573f",
    colorTextBase: "#2b3674",
    borderRadius: 16,
    colorPrimary: "#35b675",
    colorInfo: "#35b675",
  },
  components: {
    Layout: {
      algorithm: true,
    },
    Button: {
      defaultGhostColor: "rgb(209,209,209)",
    },
  },
};

export default theme;
