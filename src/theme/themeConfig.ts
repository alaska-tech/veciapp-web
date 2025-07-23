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
    Input: {
      controlHeight: 45,
      controlHeightLG: 45,
      controlHeightSM: 8,
    },
    InputNumber: {
      controlHeight: 45,
      controlHeightLG: 45,
      controlHeightSM: 8,
    },
    Dropdown: {
      controlHeight: 45,
      controlHeightLG: 45,
      controlHeightSM: 8,
    },
    Select: {
      controlHeight: 45,
      controlHeightLG: 45,
      controlHeightSM: 8,
    },
  },
};

export default theme;
