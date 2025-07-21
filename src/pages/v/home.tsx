import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Space } from 'antd';
import React, { ReactElement } from 'react'
import { motion } from "framer-motion";

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <Space size={[8, 16]} wrap>
                {Array.from({ length: 20 }).map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.03, ease: "easeInOut" }}
                        whileHover={{ scale: 1.03, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card title={"Info card " + (index + 1)} extra={<a href="#">More</a>} style={{ width: 300 }}>
                            <p>Card content</p>
                            <p>Card content</p>
                            <p>Card content</p>
                        </Card>
                    </motion.div>
                ))}
            </Space>
        </motion.div>
    )
}

export default Home

Home.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout> {page}</DashboardLayout>;
};