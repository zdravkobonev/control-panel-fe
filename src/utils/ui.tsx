import { Tag } from "antd";

export function StatusTag({ value }: { value: string }) {
  const color =
    value === "active"
      ? "green"
      : value === "pending"
      ? "gold"
      : value === "error"
      ? "red"
      : value === "suspended"
      ? "gray"
      : "red";
  return <Tag color={color}>{value.toUpperCase()}</Tag>;
}
