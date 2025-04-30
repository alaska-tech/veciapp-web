import DashboardLayout2 from "@/components/layout/DashboardLayout";
import {
  SearchOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  Table,
  Tag,
  Space,
  Button,
  TableColumnsType,
  TableColumnType,
  Input,
  InputRef,
  Typography,
  Dropdown,
  Divider,
  Card,
} from "antd";
import { FilterDropdownProps, FilterRestProps } from "antd/es/table/interface";
import Link from "next/link";
import React, { ReactElement, useRef, useState } from "react";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  status: `active` | `inactive` | `pending`;
}

type DataIndex = keyof DataType;

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    status: "active",
  },
  {
    key: "2",
    name: "Joe Black",
    age: 42,
    address: "London No. 1 Lake Park",
    status: "inactive",
  },
  {
    key: "3",
    name: "Jim Green",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    status: "pending",
  },
  {
    key: "4",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
    status: "active",
  },
];

const Users = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: (param?: FilterRestProps) => void) => {
    clearFilters({
      closeDropdown: true,
      confirm: true,
    });

    setSearchText("");
    setSearchedColumn("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
    hasFilters: boolean = false
  ): TableColumnType<DataType> => ({
    filterDropdown: !hasFilters
      ? ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
              }
              style={{ marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() =>
                  handleSearch(selectedKeys as string[], confirm, dataIndex)
                }
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{ width: 90 }}
                disabled={selectedKeys.length === 0}
              >
                Reset
              </Button>
            </Space>
          </div>
        )
      : null,
    filterIcon: (filtered: boolean) => (
      <Space wrap>
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        {filtered && (
          <Typography.Text style={{ color: "#1677ff" }}>
            {searchText}
          </Typography.Text>
        )}
      </Space>
    ),
    onFilter: (value, record) => {
      setSearchText(value as string);
      setSearchedColumn(dataIndex);
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase());
    },
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });
  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color: string = "green";
        if (status === "inactive") {
          color = "red";
        } else if (status === "pending") {
          color = "orange";
        }
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
      ...getColumnSearchProps("status", true),
      filters: [
        {
          text: "Active",
          value: "active",
        },
        {
          text: "Inactive",
          value: "inactive",
        },
        {
          text: "Pending",
          value: "pending",
        },
      ],
      filterMultiple: false,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <Link href={`/(admin)/users/${record.key}`}>Edit</Link>
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "1",
                  label: "Edit",
                },
                {
                  key: "2",
                  label: "Delete",
                },
              ],
            }}
            placement="bottomRight"
          >
            <Button type="link">More...</Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
      <Space wrap direction="horizontal">
        <Card
          styles={{
            body: { display: "inline-flex", gap: "0.5rem", padding: 16 },
          }}
        >
          <TeamOutlined style={{ fontSize: "48px" }} />
          <Space direction="vertical" size={0}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              Total Users
            </Typography.Title>
            <Typography.Text type="success" style={{ fontSize: "24px" }}>
              12.124
            </Typography.Text>
          </Space>
        </Card>
        <Card
          styles={{
            body: { display: "inline-flex", gap: "0.5rem", padding: 16 },
          }}
        >
          <UserSwitchOutlined style={{ fontSize: "48px" }} />
          <Space direction="vertical" size={0}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              Pendientes
            </Typography.Title>
            <Typography.Text type="warning" style={{ fontSize: "24px" }}>
              12.124
            </Typography.Text>
          </Space>
        </Card>
      </Space>
      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button href="/(admin)/users/newUser" icon={<UserAddOutlined />}>
          Add User
        </Button>
      </Space>
      <Table<DataType> columns={columns} dataSource={data} />
    </div>
  );
};

export default Users;

Users.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2> {page}</DashboardLayout2>;
};
