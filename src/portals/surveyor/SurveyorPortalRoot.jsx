import { useState } from "react";
import { useLang } from "../../i18n/LangContext";
import { Sidebar } from "../../components/shell/Sidebar";
import { BottomNav } from "../../components/shell/BottomNav";
import { useIsMobile } from "../../hooks/useIsMobile";
import { Dashboard } from "../../components/dashboard/Dashboard";
import { SurveyView } from "../../components/survey/SurveyView";
import { MapScreen } from "../../components/screens/MapScreen";
import { HistoryScreen } from "../../components/screens/HistoryScreen";
import { ProfileScreen } from "../../components/screens/ProfileScreen";

export const SurveyorPortalRoot = ({ sidebarOpen, onSidebarClose }) => {
  const { t } = useLang();
  const [navTab, setNavTab] = useState("dashboard");
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const handleSelectSurvey = (survey) => setSelectedSurvey(survey);
  const handleBackToDashboard = () => setSelectedSurvey(null);
  const handleNav = (id) => { setNavTab(id); setSelectedSurvey(null); };

  const showSurveyView = navTab === "dashboard" && selectedSurvey;
  const isMobile = useIsMobile();

  return (
    <>
      {!showSurveyView && (
        <Sidebar
          active={navTab}
          setActive={handleNav}
          roleLabel="Surveyor"
          open={sidebarOpen}
          onClose={onSidebarClose}
        />
      )}
      <main className="main-content" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", paddingBottom: isMobile && !showSurveyView ? 60 : 0 }}>
        {showSurveyView ? (
          <SurveyView initialSurvey={selectedSurvey} onBack={handleBackToDashboard} />
        ) : navTab === "dashboard" ? (
          <Dashboard onSelectSurvey={handleSelectSurvey} />
        ) : navTab === "map" ? (
          <MapScreen onSelectSurvey={(s) => { setSelectedSurvey(s); setNavTab("dashboard"); }} />
        ) : navTab === "history" ? (
          <HistoryScreen />
        ) : navTab === "profile" ? (
          <ProfileScreen />
        ) : null}
      </main>
      {isMobile && !showSurveyView && (
        <BottomNav active={navTab} setActive={handleNav} />
      )}
    </>
  );
};
