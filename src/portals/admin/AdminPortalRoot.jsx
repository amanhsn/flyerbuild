import { useState } from "react";
import { useLang } from "../../i18n/LangContext";
import { Sidebar } from "../../components/shell/Sidebar";
import { BottomNav } from "../../components/shell/BottomNav";
import { useIsMobile } from "../../hooks/useIsMobile";
import { MOCK_SURVEYS } from "../../data/mockSurveys";

import { ExecutiveDashboard } from "./dashboards/ExecutiveDashboard";
import { ProjectDashboard } from "./dashboards/ProjectDashboard";
import { PerformanceDashboard } from "./dashboards/PerformanceDashboard";
import { GisMapView } from "./map/GisMapView";
import { ApprovalFlow } from "./workflow/ApprovalFlow";
import { EngineeringGate } from "./engineering/EngineeringGate";
import { SubcoMonitor } from "./monitoring/SubcoMonitor";
import { DisputeManager } from "./monitoring/DisputeManager";
import { MeetstaaReview } from "./financials/MeetstaaReview";
import { AddressImport } from "./admin/AddressImport";
import { CreateSurvey } from "./admin/CreateSurvey";

const ADMIN_NAV = [
  ["executive",   "dashboard",  "Executive"],
  ["create",      "plus",       "Create Survey"],
  ["project",     "clipboard",  "Project"],
  ["performance", "star",       "Performance"],
  ["map",         "map",        "Map & Table"],
  ["approval",    "check",      "Approvals"],
  ["engineering", "settings",   "Engineering"],
  ["monitoring",  "eye",        "Subco Monitor"],
  ["disputes",    "alert",      "Disputes"],
  ["financials",  "file",       "Financials"],
  ["admin",       "shield",     "Admin"],
];

const ADMIN_MOBILE_NAV = [
  { id: "executive",   icon: "dashboard", label: "Executive" },
  { id: "create",      icon: "plus",      label: "Create" },
  { id: "map",         icon: "map",       label: "Map" },
  { id: "approval",    icon: "check",     label: "Approvals" },
  { id: "more",        icon: "list",      label: "More" },
];

export const AdminPortalRoot = ({ sidebarOpen, onSidebarClose, onMenuToggle }) => {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState("executive");
  const isMobile = useIsMobile();
  const [surveys, setSurveys] = useState(MOCK_SURVEYS);

  const addSurvey = (newSurvey) => {
    setSurveys(prev => [...prev, { ...newSurvey, id: prev.length + 1 }]);
    setActiveTab("executive");
  };

  const handleMobileNav = (id) => {
    if (id === "more") {
      onMenuToggle?.();
    } else {
      setActiveTab(id);
    }
  };

  return (
    <>
      <Sidebar
        active={activeTab}
        setActive={setActiveTab}
        items={ADMIN_NAV}
        roleLabel="Admin Console"
        open={sidebarOpen}
        onClose={onSidebarClose}
      />
      <main className="flex-1 overflow-hidden flex flex-col" style={{ paddingBottom: isMobile ? 60 : 0 }}>
        {activeTab === "executive" && <ExecutiveDashboard surveys={surveys} onCreateSurvey={() => setActiveTab("create")} />}
        {activeTab === "create" && <CreateSurvey onSubmit={addSurvey} onCancel={() => setActiveTab("executive")} />}
        {activeTab === "project" && <ProjectDashboard />}
        {activeTab === "performance" && <PerformanceDashboard />}
        {activeTab === "map" && <GisMapView />}
        {activeTab === "approval" && <ApprovalFlow />}
        {activeTab === "engineering" && <EngineeringGate />}
        {activeTab === "monitoring" && <SubcoMonitor />}
        {activeTab === "disputes" && <DisputeManager />}
        {activeTab === "financials" && <MeetstaaReview />}
        {activeTab === "admin" && <AddressImport />}
      </main>
      {isMobile && (
        <BottomNav
          active={activeTab}
          setActive={handleMobileNav}
          items={ADMIN_MOBILE_NAV}
        />
      )}
    </>
  );
};
