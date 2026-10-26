import { useEffect, useState } from "react";
import { AppShell } from "../layout/AppShell";
import { RedirectIfAuthenticated, RequireAuth } from "./guards";
import { CallbackPage } from "../../features/auth/CallbackPage";
import { ErrorPage } from "../../features/auth/ErrorPage";
import { LoginPage } from "../../features/auth/LoginPage";
import { NotFoundPage } from "../../features/auth/NotFoundPage";
import { ProfilePage } from "../../features/profile/ProfilePage";
import { DashboardPage } from "../../features/running/DashboardPage";
import { ExplorePage } from "../../features/running/ExplorePage";
import { RunnersDirectoryPage } from "../../features/running/RunnersDirectoryPage";
import { OnboardingModal } from "../../features/running/components/OnboardingModal";
import { useCurrentUser } from "../../features/profile/useCurrentUser";
import { fetchUserProfile } from "../../features/running/runningApi";
import type { UserProfileData } from "../../features/running/types";

function getAppPath(pathname: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  if (normalizedBase && pathname.startsWith(normalizedBase)) {
    const stripped = pathname.slice(normalizedBase.length);
    return stripped.startsWith("/") ? stripped : `/${stripped}`;
  }
  return pathname;
}

export function AppRouter() {
  const [path, setPath] = useState(() => getAppPath(window.location.pathname));
  const [search, setSearch] = useState(() => window.location.search);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const me = useCurrentUser();
  const iamUser = me.data?.data;

  useEffect(() => {
    const onPopState = () => {
      setPath(getAppPath(window.location.pathname));
      setSearch(window.location.search);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Check if current user has completed onboarding
  useEffect(() => {
    if (iamUser?.itemId) {
      fetchUserProfile(iamUser.itemId).then((profile) => {
        if (profile) {
          setUserProfile(profile);
        } else {
          // If profile does not exist yet, trigger the runner onboarding modal
          setShowOnboarding(true);
        }
      });
    }
  }, [iamUser?.itemId]);

  function navigate(nextPath: string) {
    const [nextPathname = "/", queryString = ""] = nextPath.split("?");
    const base = import.meta.env.BASE_URL || "/";
    const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const fullPath = normalizedBase
      ? `${normalizedBase}${nextPathname.startsWith("/") ? nextPathname : `/${nextPathname}`}${queryString ? `?${queryString}` : ""}`
      : nextPath;
    window.history.pushState({}, "", fullPath);
    setPath(nextPathname);
    setSearch(queryString ? `?${queryString}` : "");
  }

  if (path === "/login/callback") {
    return <CallbackPage onNavigate={navigate} />;
  }

  if (path === "/login") {
    const returnTo = new URLSearchParams(search).get("returnTo") || undefined;
    return (
      <RedirectIfAuthenticated onNavigate={navigate}>
        <LoginPage returnTo={returnTo} />
      </RedirectIfAuthenticated>
    );
  }

  const renderCurrentPage = () => {
    switch (path) {
      case "/":
        return (
          <DashboardPage
            currentUserProfile={userProfile}
            onNavigate={navigate}
            onActivityCreated={() => {
              if (iamUser?.itemId) {
                fetchUserProfile(iamUser.itemId).then(setUserProfile);
              }
            }}
          />
        );
      case "/explore":
        return (
          <ExplorePage
            currentUserProfile={userProfile}
            onActivityCreated={() => {
              if (iamUser?.itemId) {
                fetchUserProfile(iamUser.itemId).then(setUserProfile);
              }
            }}
          />
        );
      case "/runners":
        return <RunnersDirectoryPage />;
      case "/profile":
        return (
          <RequireAuth currentPath={path} onNavigate={navigate}>
            <ProfilePage />
          </RequireAuth>
        );
      case "/error":
        return <ErrorPage />;
      default:
        return <NotFoundPage onNavigate={navigate} />;
    }
  };

  return (
    <AppShell activePath={path} onNavigate={navigate}>
      {renderCurrentPage()}

      {iamUser?.itemId && (
        <OnboardingModal
          isOpen={showOnboarding}
          userId={iamUser.itemId}
          initialEmail={iamUser.email}
          initialName={`${iamUser.firstName || ""} ${iamUser.lastName || ""}`.trim()}
          onComplete={(profile) => {
            setUserProfile(profile);
            setShowOnboarding(false);
          }}
        />
      )}
    </AppShell>
  );
}
