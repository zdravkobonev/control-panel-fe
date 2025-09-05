import { Modal, Form, Input, Select } from "antd";
import type { Restaurant, RestaurantStatus } from "../../api/restaurants";
import type { Organization } from "../../api/organizations";
import { useEffect } from "react";

type Props = {
  open: boolean;
  loading?: boolean;
  isEdit?: boolean;
  initial?: Partial<Restaurant> | null;
  orgs: Organization[];
  orgsLoading?: boolean;
  onCancel: () => void;
  onSubmit: (values: {
    restaurantName: string;
    version?: string;
    organizationId: number;
    status?: RestaurantStatus;
    location?: string | null;
    phone?: string | null;
  }) => void;
};

export default function RestaurantModal({
  open,
  loading,
  isEdit,
  initial,
  orgs,
  orgsLoading,
  onCancel,
  onSubmit,
}: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (isEdit && initial) {
      form.setFieldsValue({
        restaurantName: initial?.name,
        organizationId: initial?.organization_id,
        status: initial?.status,
        location: initial?.location ?? undefined,
        phone: initial?.phone ?? undefined,
        version:
          initial?.version !== undefined ? String(initial.version) : undefined,
      });
    } else {
      form.setFieldsValue({ version: "0.0.1" });
    }
  }, [open, initial, isEdit, form]);

  return (
    <Modal
      title={
        <div className="text-center w-full">
          <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 bg-clip-text text-transparent">
            {isEdit ? "Редакция на ресторант" : "Създай ресторант"}
          </span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      onOk={async () => {
        const values = await form.validateFields();
        onSubmit(values);
      }}
      okText={isEdit ? "Запази" : "Създай"}
      cancelText="Отказ"
      confirmLoading={loading}
      styles={{ content: { borderRadius: 16, padding: 24 } }}
      okButtonProps={{
        type: "default",
        className:
          "!h-10 !text-white !font-medium !bg-gradient-to-r !from-blue-600 !via-sky-600 !to-cyan-500 !border-0 hover:opacity-90",
      }}
      cancelButtonProps={{ type: "default", className: "!h-10" }}
      closable={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="restaurantName"
          label="Име на ресторанта"
          rules={[{ required: true, message: "Въведете име на ресторанта" }]}
        >
          <Input placeholder="Пример: Bistro Unreal" disabled={!!isEdit} />
        </Form.Item>

        <Form.Item
          name="version"
          label="Версия"
          rules={[
            { required: true, message: "Въведете версия" },
            {
              pattern: /^\d+\.\d+\.\d+$/,
              message: "Версията трябва да е във формат X.Y.Z (например 0.0.1)",
            },
          ]}
        >
          <Input placeholder="Напр. 0.0.1" />
        </Form.Item>

        <Form.Item
          name="organizationId"
          label="Организация"
          rules={[{ required: true, message: "Изберете организация" }]}
        >
          <Select
            placeholder={
              orgsLoading ? "Зареждане..." : "Изберете организация от списъка"
            }
            loading={orgsLoading}
            options={(orgs ?? []).map((org) => ({
              label: `${org.name} (ID: ${org.id})`,
              value: org.id,
            }))}
            disabled={!!isEdit} // при редакция не сменяме организацията; махни ако трябва
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
