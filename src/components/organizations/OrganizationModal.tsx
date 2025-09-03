import { Modal, Form, Input } from "antd";
import type { Organization } from "../../api/organizations";
import { useEffect } from "react";

type Props = {
  open: boolean;
  loading?: boolean;
  initial?: Partial<Pick<Organization, "name" | "version" | "status">> | null;
  isEdit?: boolean;
  onCancel: () => void;
  onSubmit: (values: {
    name: string;
    version?: number;
    status?: Organization["status"];
  }) => void;
};

export default function OrganizationModal({
  open,
  loading,
  initial,
  isEdit,
  onCancel,
  onSubmit,
}: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(initial ?? { version: 1 });
    }
  }, [open, initial, form]);

  return (
    <Modal
      title={
        <div className="text-center w-full">
          <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 bg-clip-text text-transparent">
            {isEdit ? "Редакция на организация" : "Създай нова организация"}
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
          name="name"
          label="Име"
          rules={[{ required: true, message: "Въведете име" }]}
        >
          <Input placeholder="Пример: Unrealsoft Ltd." />
        </Form.Item>

        <Form.Item
          name="version"
          label="Версия"
          rules={[
            { required: true, message: "Въведете версия" },
            {
              pattern: /^\d+\.\d+\.\d+$/,
              message: "Версията трябва да е във формат X.Y.Z (например 1.0.0)",
            },
          ]}
        >
          <Input placeholder="Напр. 1.0.0" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
