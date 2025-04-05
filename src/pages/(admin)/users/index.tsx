import DashboardLayout from '@/components/layout/DashboardLayout';
import { Table, Tag, Space, Button } from 'antd';
import Column from 'antd/es/table/Column';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import Link from 'next/link';
import React, { ReactElement } from 'react'

interface DataType {
    key: React.Key;
    firstName: string;
    lastName: string;
    age: number;
    address: string;
    tags: string[];
}

const data: DataType[] = [
    {
        key: '1',
        firstName: 'John',
        lastName: 'Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        firstName: 'Jim',
        lastName: 'Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        firstName: 'Joe',
        lastName: 'Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];


const Users = () => {
    return (
        <div style={{ gap: '1rem', display: 'flex', flexDirection: 'column' }}>
            <Space>
                <Button type="primary">Add User</Button>
            </Space>
            <Table<DataType> dataSource={data}>
                <ColumnGroup title="Name">
                    <Column title="First Name" dataIndex="firstName" key="firstName" />
                    <Column title="Last Name" dataIndex="lastName" key="lastName" />
                </ColumnGroup>
                <Column title="Age" dataIndex="age" key="age" />
                <Column title="Address" dataIndex="address" key="address" />
                <Column
                    title="Tags"
                    dataIndex="tags"
                    key="tags"
                    render={(tags: string[]) => (
                        <>
                            {tags.map((tag) => {
                                let color = tag.length > 5 ? 'geekblue' : 'green';
                                if (tag === 'loser') {
                                    color = 'volcano';
                                }
                                return (
                                    <Tag color={color} key={tag}>
                                        {tag.toUpperCase()}
                                    </Tag>
                                );
                            })}
                        </>
                    )}
                />
                <Column
                    title="Action"
                    key="action"
                    render={(_: any, record: DataType) => (
                        <Space size="middle">
                            <a>Invite {record.lastName}</a>
                            <a>Delete</a>
                            <Link href={`/(admin)/users/${record.key}`}>Details</Link>
                        </Space>
                    )}
                />
            </Table></div>
    )
}

export default Users

Users.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout> {page}</DashboardLayout>;
};