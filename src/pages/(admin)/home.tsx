import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Space } from 'antd';
import React, { ReactElement } from 'react'

const Home = () => {
    return (
        <Space size={[8, 16]} wrap>
            {Array.from({ length: 20 }).map((_, index) => (
                <Card title={"Info card " + (index + 1)} extra={<a href="#">More</a>} style={{ width: 300 }} key={index}>
                    <p>Card content</p>
                    <p>Card content</p>
                    <p>Card content</p>
                </Card>
            ))}
        </Space>
    )
}

export default Home

Home.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout> {page}</DashboardLayout>;
};