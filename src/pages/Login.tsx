import { useState } from "react";
import { Card, Form, Input, Button, Typography, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { setToken } from "../lib/auth";
import { isAxiosError } from "axios";
import { motion } from "framer-motion";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  async function onFinish(values: { username: string; password: string }) {
    setLoading(true);
    try {
      const res = await login(values.username, values.password);
      setToken(res.access_token);

      api.success({
        message: "Успешен вход",
        description: "Добре дошли обратно!",
        placement: "topRight",
        closeIcon: false,
      });

      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      let detail: string | undefined;

      if (isAxiosError(err)) {
        const data = err.response?.data;
        if (typeof data === "string") {
          detail = data;
        } else if (Array.isArray(data?.detail)) {
          detail = data.detail[0]?.msg;
        } else if (typeof data?.detail === "string") {
          detail = data.detail;
        }
      }

      api.error({
        message: "Неуспешен вход",
        description: detail || "Проверете потребителското име и паролата.",
        placement: "topRight",
        closeIcon: false,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {contextHolder}

      {/* Ляв панел */}
      <div className="hidden lg:flex relative overflow-hidden items-center justify-center bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-500">
        <div className="absolute w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl -top-20 -left-20" />
        <div className="absolute w-[24rem] h-[24rem] rounded-full bg-white/10 blur-3xl bottom-10 right-10" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 text-white p-8"
        >
          <div className="mx-auto w-72 h-72">
            <svg viewBox="0 0 256 256" className="w-full h-full">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.55" />
                </linearGradient>
              </defs>
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="url(#g1)"
                opacity="0.12"
              />
              <circle cx="128" cy="96" r="44" fill="#fff" opacity="0.9" />
              <rect
                x="56"
                y="152"
                width="144"
                height="56"
                rx="28"
                fill="#fff"
                opacity="0.9"
              />
              <path
                d="M88 160h80a20 20 0 0 1 20 20v20H68v-20a20 20 0 0 1 20-20z"
                fill="#fff"
                opacity="1"
              />
            </svg>
          </div>

          <Typography.Title level={2} className="!text-white !m-0 text-center">
            Control Panel
          </Typography.Title>
          <Typography.Paragraph className="!text-white/80 !mt-2 text-center">
            Достъп само за администратори
          </Typography.Paragraph>
        </motion.div>
      </div>

      {/* Десен панел */}
      <div className="flex items-center justify-center bg-gray-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card
            className="backdrop-blur-lg bg-white/80 shadow-xl border-0"
            styles={{ body: { padding: "32px" } }}
          >
            <div className="text-center mb-6">
              <Typography.Title
                level={3}
                className="!mb-1 !bg-gradient-to-r !from-blue-600 !via-sky-600 !to-cyan-500 !bg-clip-text !text-transparent"
              >
                Вход в системата
              </Typography.Title>
              <Typography.Text type="secondary">
                Моля, въведете вашите данни за достъп
              </Typography.Text>
            </div>

            <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
              <Form.Item
                label="Потребител"
                name="username"
                rules={[
                  { required: true, message: "Въведете потребител" },
                  { min: 3, message: "Минимум 3 символа" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="admin"
                  prefix={<UserOutlined className="text-gray-400" />}
                />
              </Form.Item>

              <Form.Item
                label="Парола"
                name="password"
                rules={[
                  { required: true, message: "Въведете парола" },
                  { min: 6, message: "Паролата трябва да е поне 6 символа" },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="••••••••"
                  prefix={<LockOutlined className="text-gray-400" />}
                />
              </Form.Item>

              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  className="!h-12 !bg-gradient-to-r !from-blue-600 !via-sky-600 !to-cyan-500 border-0 hover:opacity-90"
                >
                  Вход
                </Button>
              </motion.div>

              <div className="mt-6 text-center text-xs text-gray-400">
                Защитено с JWT • Anti-brute-force активен
              </div>
            </Form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
