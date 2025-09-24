import { User } from "@/constants/models";
import {
  UserOutlined,
} from "@ant-design/icons";
import {
  ButtonProps,
  theme,
  Dropdown,
  Space,
  Typography,
  Divider,
  Button,
  Avatar,
  DropdownProps,
} from "antd";
import React from "react";
import styles from './ProfileButton.module.css';

interface ProfileButtonProps {
  width: number;
  user: User;
  dropdownProps?: DropdownProps;
  buttonProps?:ButtonProps
}
export const ProfileButton = ({
  width,
  user,
  dropdownProps,
  buttonProps
}: ProfileButtonProps) => {
  const {
    token: { borderRadiusLG, colorBgElevated, boxShadowSecondary },
  } = theme.useToken();
  const contentStyle = {
    backgroundColor: colorBgElevated,
    borderRadius: 8,
    boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
    minWidth: '160px',
    padding: '4px'
  };
  const isCollapsed = width < 90;
  return (
    <Dropdown
      trigger={["click"]}
      dropdownRender={(menu) => (
        <div style={contentStyle}>
          {React.cloneElement(menu as React.ReactElement)}
        </div>
      )}
      {...dropdownProps}
    >
      <Button
        size="large"
        type="text"
        icon={
          <Avatar 
            icon={<UserOutlined />}
            style={{
              backgroundColor: '#175FBE',
              color: 'white',
              marginRight: isCollapsed ? 0 : 8
            }}
          />
        }
        style={{
          width: width,
          overflow: "hidden",
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          background: 'transparent',
          transition: 'all 0.3s ease',
          padding: '12px',
          borderRadius: '8px',
        }}
        className={styles['profile-button']}
        {...buttonProps}
      >
        {buttonProps?.children || (
          <div style={{
            display: isCollapsed ? 'none' : 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            overflow: 'hidden'
          }}>
            <Typography.Text
              style={{
                color: '#000000d9',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '20px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}
            >
              {user.fullName || "Usuario desconocido"}
            </Typography.Text>
            <Typography.Text
              type="secondary"
              style={{
                fontSize: '12px',
                lineHeight: '16px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}
            >
              {user.email || "Email desconocido"}
            </Typography.Text>
          </div>
        )}
      </Button>
    </Dropdown>
  );
};
