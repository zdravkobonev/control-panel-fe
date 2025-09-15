import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  listOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  type Organization,
} from "../api/organizations";
import {
  listRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  type Restaurant,
  type RestaurantStatus,
} from "../api/restaurants";

import {
  Layout,
  Typography,
  Button,
  Space,
  Card,
  message,
  Input,
  Tabs,
} from "antd";
import { motion } from "framer-motion";
import {
  ReloadOutlined,
  LogoutOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { clearToken } from "../lib/auth";
import { useNavigate } from "react-router-dom";

import OrganizationsTable from "../components/organizations/OrganizationsTable";
import OrganizationModal from "../components/organizations/OrganizationModal";
import RestaurantsTable from "../components/restaurants/RestaurantsTable";
import RestaurantModal from "../components/restaurants/RestaurantModal";

import { extractErrorMessage } from "../utils/errors";

const { Header, Content } = Layout;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // Queries
  const {
    data: orgs,
    isLoading: isLoadingOrgs,
    refetch: refetchOrgs,
  } = useQuery<Organization[]>({
    queryKey: ["organizations"],
    queryFn: listOrganizations,
  });

  const {
    data: restaurants,
    isLoading: isLoadingRestaurants,
    refetch: refetchRestaurants,
  } = useQuery<Restaurant[]>({
    queryKey: ["restaurants"],
    queryFn: () => listRestaurants({ limit: 200 }),
  });

  // Org mutations
  const createOrgMut = useMutation({
    mutationFn: (payload: {
      name: string;
      version?: string;
      status?: Organization["status"];
    }) => createOrganization(payload),
    onSuccess: () => {
      messageApi.success("Организацията е създадена");
      setOrgModal({ open: false, editing: null });
      refetchOrgs();
    },
    onError: (err) =>
      messageApi.error(extractErrorMessage(err) || "Неуспешно създаване."),
  });

  const updateOrgMut = useMutation({
    mutationFn: (args: {
      id: number;
      payload: Partial<Pick<Organization, "name" | "version" | "status">>;
    }) => updateOrganization(args.id, args.payload),
    onSuccess: () => {
      messageApi.success("Организацията е обновена");
      setOrgModal({ open: false, editing: null });
      refetchOrgs();
    },
    onError: (err) =>
      messageApi.error(extractErrorMessage(err) || "Неуспешно обновяване."),
  });

  const deleteOrgMut = useMutation({
    mutationFn: (id: number) => deleteOrganization(id),
    onSuccess: () => {
      messageApi.success("Организацията е изтрита");
      refetchOrgs();
    },
    onError: (err) =>
      messageApi.error(extractErrorMessage(err) || "Неуспешно изтриване."),
  });

  // Restaurant mutations
  const createRestaurantMut = useMutation({
    mutationFn: (payload: {
      name: string;
      organization_id: number;
      status?: RestaurantStatus;
      version?: string;
      location?: string | null;
      phone?: string | null;
    }) => createRestaurant(payload),
    onSuccess: () => {
      messageApi.success("Ресторантът е създаден");
      setRestaurantModal({ open: false, editing: null });
      refetchRestaurants();
    },
    onError: (err) =>
      messageApi.error(
        extractErrorMessage(err) || "Неуспешно създаване на ресторант."
      ),
  });

  const updateRestaurantMut = useMutation({
    mutationFn: (args: {
      id: number;
      payload: Partial<
        Pick<Restaurant, "name" | "status" | "location" | "phone" | "version">
      >;
    }) => updateRestaurant(args.id, args.payload),
    onSuccess: () => {
      messageApi.success("Ресторантът е обновен");
      setRestaurantModal({ open: false, editing: null });
      refetchRestaurants();
    },
    onError: (err) =>
      messageApi.error(
        extractErrorMessage(err) || "Неуспешно обновяване на ресторант."
      ),
  });

  const deleteRestaurantMut = useMutation({
    mutationFn: (id: number) => deleteRestaurant(id),
    onSuccess: () => {
      messageApi.success("Ресторантът е изтрит");
      refetchRestaurants();
    },
    onError: (err) =>
      messageApi.error(extractErrorMessage(err) || "Неуспешно изтриване."),
  });

  // Local UI state
  const [orgModal, setOrgModal] = useState<{
    open: boolean;
    editing: Organization | null;
  }>({
    open: false,
    editing: null,
  });

  const [restaurantModal, setRestaurantModal] = useState<{
    open: boolean;
    editing: Restaurant | null;
  }>({ open: false, editing: null });

  // Search
  const [organizationSearch, setOrganizationSearch] = useState("");
  const orgQ = organizationSearch.trim().toLowerCase();

  const [restaurantSearch, setRestaurantSearch] = useState("");
  const restQ = restaurantSearch.trim().toLowerCase();

  const filteredOrgs = useMemo(() => {
    const list = orgs ?? [];
    if (!orgQ) return list;
    return list.filter((o) =>
      [o.name, o.status, o.id].some((v) =>
        String(v).toLowerCase().includes(orgQ)
      )
    );
  }, [orgs, orgQ]);

  const filteredRestaurants = useMemo(() => {
    const list = restaurants ?? [];
    if (!restQ) return list;
    const orgNameById = new Map((orgs ?? []).map((o) => [o.id, o.name]));
    return list.filter((r) => {
      const orgName = orgNameById.get(r.organization_id) ?? "";
      return [r.name, r.status, r.id, r.organization_id, orgName].some((v) =>
        String(v).toLowerCase().includes(restQ)
      );
    });
  }, [restaurants, orgs, restQ]);

  // Handlers
  const openCreateOrg = () => setOrgModal({ open: true, editing: null });
  const openEditOrg = (org: Organization) =>
    setOrgModal({ open: true, editing: org });

  const submitOrg = (values: {
    name: string;
    version?: string;
    status?: Organization["status"];
  }) => {
    if (orgModal.editing) {
      updateOrgMut.mutate({ id: orgModal.editing.id, payload: values });
    } else {
      createOrgMut.mutate(values);
    }
  };

  const openCreateRestaurant = () =>
    setRestaurantModal({ open: true, editing: null });
  const openEditRestaurant = (r: Restaurant) =>
    setRestaurantModal({ open: true, editing: r });

  const submitRestaurant = (values: {
    restaurantName: string;
    version?: string;
    organizationId: number;
    status?: RestaurantStatus;
    location?: string | null;
    phone?: string | null;
  }) => {
    if (restaurantModal.editing) {
      updateRestaurantMut.mutate({
        id: restaurantModal.editing.id,
        payload: {
          name: values.restaurantName,
          status: values.status,
          version: values.version,
          location: values.location ?? null,
          phone: values.phone ?? null,
        },
      });
    } else {
      createRestaurantMut.mutate({
        name: values.restaurantName,
        organization_id: values.organizationId,
        status: values.status,
        version: values.version,
        location: values.location ?? null,
        phone: values.phone ?? null,
      });
    }
  };

  function logout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  // optional: контролирай активния таб (ако решиш да променяш поведението на “Рефреш” според таба)
  // const [activeTab, setActiveTab] = useState<string>("orgs");

  return (
    <Layout className="min-h-screen bg-gray-50">
      {contextHolder}
      <Header className="relative overflow-hidden !bg-gradient-to-r !from-blue-600 !via-sky-600 !to-cyan-500 px-4 py-3">
        <div className="relative z-10 flex items-center justify-between">
          <Typography.Title
            level={4}
            className="!mb-0 bg-gradient-to-r !from-white !via-white !to-white/80 !bg-clip-text !text-transparent"
          >
            Control Panel - Unrealsoft
          </Typography.Title>

          <Space>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  // ако искаш само активния таб да рефрешва,
                  // провери activeTab и извикай съответния refetch
                  refetchOrgs();
                  refetchRestaurants();
                }}
                className="!text-white !border-0 !bg-white/20 hover:!bg-white/30"
              >
                Рефреш
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                icon={<LogoutOutlined />}
                onClick={logout}
                className="!text-white !border-0 !bg-white/20 hover:!bg-white/30"
              >
                Изход
              </Button>
            </motion.div>
          </Space>
        </div>
      </Header>

      <Content className="p-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Tabs
              defaultActiveKey="orgs"
              centered
              items={[
                {
                  key: "orgs",
                  label: `Организации (${orgs?.length ?? 0})`,
                  children: (
                    <Space
                      direction="vertical"
                      size="large"
                      style={{ width: "100%" }}
                    >
                      <div className="flex flex-wrap items-center justify-between">
                        <Input.Search
                          allowClear
                          value={organizationSearch}
                          onChange={(e) =>
                            setOrganizationSearch(e.target.value)
                          }
                          placeholder="Търси в организации..."
                          style={{ maxWidth: 420 }}
                        />

                        <div className="flex items-center">
                          <motion.div whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={openCreateOrg}
                              icon={<PlusOutlined />}
                              className="!text-white !border-0 !bg-gradient-to-r !from-blue-600 !via-sky-600 !to-sky-500 hover:opacity-90"
                            >
                              Създай организация
                            </Button>
                          </motion.div>
                        </div>
                      </div>

                      <Card
                        title="Организации"
                        className="backdrop-blur-md !bg-white/80 !shadow-xl !border-0 !rounded-2xl"
                      >
                        <OrganizationsTable
                          data={filteredOrgs}
                          loading={isLoadingOrgs}
                          onEdit={openEditOrg}
                          onDelete={(id) => deleteOrgMut.mutate(id)}
                        />
                      </Card>
                    </Space>
                  ),
                },
                {
                  key: "rests",
                  label: `Ресторанти (${restaurants?.length ?? 0})`,
                  children: (
                    <Space
                      direction="vertical"
                      size="large"
                      style={{ width: "100%" }}
                    >
                      <div className="flex flex-wrap items-center justify-between">
                        <Input.Search
                          allowClear
                          value={restaurantSearch}
                          onChange={(e) => setRestaurantSearch(e.target.value)}
                          placeholder="Търси в ресторанти…"
                          style={{ maxWidth: 420 }}
                        />

                        <div className="flex items-center">
                          <motion.div whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={openCreateRestaurant}
                              icon={<PlusOutlined />}
                              disabled={!orgs?.length}
                              className="!text-white !border-0 !bg-gradient-to-r !from-blue-600 !via-sky-600 !to-sky-500 hover:opacity-90"
                            >
                              Създай ресторант
                            </Button>
                          </motion.div>
                        </div>
                      </div>

                      <Card
                        title="Ресторанти"
                        className="backdrop-blur-md !bg-white/80 !shadow-xl !border-0 !rounded-2xl"
                      >
                        <RestaurantsTable
                          data={filteredRestaurants}
                          loading={isLoadingRestaurants}
                          orgs={orgs}
                          onEdit={openEditRestaurant}
                          onDelete={(id) => deleteRestaurantMut.mutate(id)}
                        />
                      </Card>
                    </Space>
                  ),
                },
              ]}
            />
          </motion.div>
        </div>
      </Content>

      {/* Modals */}
      <OrganizationModal
        open={orgModal.open}
        isEdit={!!orgModal.editing}
        loading={createOrgMut.isPending || updateOrgMut.isPending}
        initial={
          orgModal.editing
            ? {
                name: orgModal.editing.name,
                version: orgModal.editing.version,
                status: orgModal.editing.status,
              }
            : { version: "0.10.1" }
        }
        onCancel={() => {
          setOrgModal({ open: false, editing: null });
        }}
        onSubmit={submitOrg}
      />

      <RestaurantModal
        open={restaurantModal.open}
        isEdit={!!restaurantModal.editing}
        loading={createRestaurantMut.isPending || updateRestaurantMut.isPending}
        initial={
          restaurantModal.editing
            ? {
                id: restaurantModal.editing.id,
                name: restaurantModal.editing.name,
                organization_id: restaurantModal.editing.organization_id,
                status: restaurantModal.editing.status,
                location: restaurantModal.editing.location,
                phone: restaurantModal.editing.phone,
              }
            : null
        }
        orgs={orgs ?? []}
        orgsLoading={isLoadingOrgs}
        onCancel={() => {
          setRestaurantModal({ open: false, editing: null });
        }}
        onSubmit={submitRestaurant}
      />
    </Layout>
  );
}
