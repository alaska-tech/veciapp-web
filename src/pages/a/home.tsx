import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, Space, Typography } from "antd";
import React, { ReactElement } from "react";

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div style={{ 
      padding: '24px',
      maxWidth: '100%',
      margin: '0 auto'
    }}>
      {/* Cards Container - Responsive layout */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}>
        <Space 
          size={[16, 24]} 
          wrap 
          style={{
            justifyContent: 'center',
            width: '100%',
            maxWidth: '1200px'
          }}
        >
          {Array.from({ length: 20 }).map((_, index) => (
            <Card
              title={"Info card " + (index + 1)}
              extra={<a href="#">More</a>}
              style={{ 
                width: 'clamp(280px, calc(100vw - 48px), 320px)',
                minWidth: '280px'
              }}
              key={index}
            >
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout> {page}</DashboardLayout>;
};
