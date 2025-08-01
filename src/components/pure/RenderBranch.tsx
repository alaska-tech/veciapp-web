import { Branch } from "@/constants/models";
import { PushpinOutlined } from "@ant-design/icons";
import { Collapse, Image, Space, Typography } from "antd";
import React from "react";

const RenderBranch = ({ branch, href }: { branch: Branch; href?: string }) => {
  const { name, address, location, description } = branch;
  return (
    <Space style={{ alignItems: "flex-start" }}>
      <Image src={branch.logo} width={60} height={60} style={{ borderRadius: "2px" }} />
      <div>
        <Collapse
          style={{
            borderRadius: "2px",
          }}
          items={[
            {
              key: name,
              label: <Typography.Link href={href}>{name}</Typography.Link>,
              children: <p>{description}</p>,
              styles: {
                body: {
                  padding: "0 6px",
                },
                header: {
                  padding: "0 0 0 6px",
                },
              },
            },
          ]}
        />
        {address || location?.coordinates ? (
          <Typography.Link
            style={{
              width: "100px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            //href={`https://www.google.com/maps?q=${location.coordinates[1]},${location.coordinates[0]}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PushpinOutlined style={{ marginRight: 4 }} />
            {address}
          </Typography.Link>
        ) : (
          <Typography.Text type="secondary">
            <PushpinOutlined style={{ marginRight: 4 }} />
            Sin dirección
          </Typography.Text>
        )}
      </div>
    </Space>
  );
};

export default RenderBranch;
