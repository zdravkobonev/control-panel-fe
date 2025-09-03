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
        { title: "Ид", dataIndex: "id", width: 80 },
        { title: "Име на ресторанта", dataIndex: "name" },
        {
          title: "Организация (ID)",
          dataIndex: "organization_id",
          width: 200,
          render: (id: number) => {
            const org = orgs?.find((o) => o.id === id);
            return org ? `${org.name} (ID: ${id})` : `ID: ${id}`;
          },
        },
        {
          title: "Статус",
          dataIndex: "status",
          width: 140,
          render: (s: RestaurantStatus) => <StatusTag value={s} />,
        },
        {
          title: "Действия",
          key: "actions",
          width: 160,
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
