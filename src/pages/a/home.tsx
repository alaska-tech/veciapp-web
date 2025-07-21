import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, Space, Typography } from "antd";
import React, { ReactElement } from "react";
import { motion } from "framer-motion";

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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.03, ease: "easeInOut" }}
              whileHover={{ scale: 1.03, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
              whileTap={{ scale: 0.98 }}
              style={{ width: 'clamp(280px, calc(100vw - 48px), 320px)', minWidth: '280px' }}
            >
              <Card
                title={"Info card " + (index + 1)}
                extra={<a href="#">More</a>}
                style={{ width: '100%' }}
              >
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </motion.div>
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
