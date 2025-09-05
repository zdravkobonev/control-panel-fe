import { Table, Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Restaurant, RestaurantStatus } from "../../api/restaurants";
import type { Organization } from "../../api/organizations";
import { StatusTag } from "../../utils/ui";

type Props = {
  data: Restaurant[] | undefined;
  loading?: boolean;
  orgs: Organization[] | undefined;
  onEdit: (r: Restaurant) => void;
  onDelete: (id: number) => void;
};

export default function RestaurantsTable({
  data,
  loading,
  orgs,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Table
      loading={loading}
      rowKey="id"
      dataSource={data ?? []}
      pagination={{ pageSize: 10 }}
      columns={[
        { title: "Ид", dataIndex: "id", width: "10%" },
        {
          title: "Име на ресторанта",
          dataIndex: "name",
          width: "25%",
          render: (name: string) => (
            <a
              href={`http://restaurant-${name}-fe.127.0.0.1.nip.io`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800"
            >
              {name}
            </a>
          ),
        },
        {
          title: "Организация (ID)",
          dataIndex: "organization_id",
          width: "25%",
          render: (id: number) => {
            const org = orgs?.find((o) => o.id === id);
            return org ? `${org.name} (ID: ${id})` : `ID: ${id}`;
          },
        },
        { title: "Версия", dataIndex: "version", width: "10%" },
        {
          title: "Статус",
          dataIndex: "status",
          width: "10%",
          render: (s: RestaurantStatus) => <StatusTag value={s} />,
        },
        {
          title: "Действия",
          key: "actions",
          width: "10%",
          render: (_: unknown, record: Restaurant) => (
            <Space>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
              />
              <Popconfirm
                title="Сигурни ли сте, че искате да изтриете?"
                okText="Да"
                cancelText="Не"
                onConfirm={() => onDelete(record.id)}
              >
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          ),
        },
      ]}
    />
  );
}
