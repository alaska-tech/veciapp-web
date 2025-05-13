import { Typography } from "antd";
import { useRouter } from "next/router";

export interface AutoTitleProps {
  titles: Record<string, string>;
  subtitles: Record<string, string>;
}
export const AutoTitle = ({ titles, subtitles }: AutoTitleProps) => {
  const router = useRouter();

  const replacePlaceholders = (text: string): string => {
    return text.replace(/\${(\w+)}/g, (_, key) =>
      String(router.query[key] || `\${${key}}`)
    );
  };

  const title = titles[router.pathname] || "";
  const subtitle = subtitles[router.pathname] || "";

  return (
    <>
      <Typography.Title level={2} style={{ margin: 0 }}>
        {replacePlaceholders(title)}
      </Typography.Title>
      <Typography.Text type="secondary">
        {replacePlaceholders(subtitle)}
      </Typography.Text>
    </>
  );
};
