import { Table, Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Organization } from "../../api/organizations";
import { StatusTag } from "../../utils/ui";

type Props = {
  data: Organization[] | undefined;
  loading?: boolean;
  onEdit: (org: Organization) => void;
  onDelete: (id: number) => void;
};

export default function OrganizationsTable({
  data,
  loading,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Table
      loading={loading}
      rowKey="id"
      dataSource={data ?? []}
      pagination={{ pageSize: 10 }}
      className="[&_.ant-table-thead_th]:!bg-transparent [&_.ant-table-thead_th]:!font-semibold"
      columns={[
        { title: "Ид", dataIndex: "id", width: 80 },
        { title: "Име на организация", dataIndex: "name" },
        {
          title: "Име на организация",
          dataIndex: "name",
          render: (name: string) => (
            <a
              href={`http://${name}-fe.127.0.0.1.nip.io`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800"
            >
              {name}
            </a>
          ),
        },
        { title: "Версия", dataIndex: "version", width: 100 },
        {
          title: "Статус",
          dataIndex: "status",
          width: 140,
          render: (s: Organization["status"]) => <StatusTag value={s} />,
        },
        {
          title: "Действия",
          key: "actions",
          width: 140,
          render: (_: unknown, record: Organization) => (
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
