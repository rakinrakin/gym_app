import { Activity, ExternalLink, Globe, LogIn } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../app/providers/AuthProvider";
import { blocksConfig, isLoginConfigured } from "../../lib/blocks/config";
import { useT } from "../../lib/i18n/LocalizationProvider";
import { Alert } from "../../shared/ui/Alert";

export function LoginPage({ returnTo }: { returnTo?: string }) {
  const { login } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const { t } = useT();
  const configured = isLoginConfigured();

  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const targetHost = blocksConfig.devHost || "dbipxo-empgw.slsblx.com";
  const isProduction =
    typeof window !== "undefined" &&
    window.location.hostname === targetHost &&
    (!window.location.port || window.location.port === "443" || window.location.port === "80");
  const targetPort = isProduction ? "" : (blocksConfig.devPort || window.location.port || "5173");
  const targetOrigin = targetPort ? `https://${targetHost}:${targetPort}` : `https://${targetHost}`;
  const isWrongOrigin = isLocalhost && window.location.hostname !== targetHost;

  async function handleLogin() {
    setError(undefined);

    // If accessing via localhost, Blocks IAM API blocks CORS and cookie scoping.
    // Seamlessly navigate to the secure dev domain where SSO is fully authorized.
    if (isWrongOrigin) {
      window.location.href = `${targetOrigin}${window.location.pathname}${window.location.search}`;
      return;
    }

    setPending(true);
    try {
      await login(returnTo);
    } catch (caught) {
      const err = caught as Error;
      if (err.message.includes("Failed to fetch") || err.name === "TypeError") {
        setError(
          `Unable to connect to Blocks IAM from ${window.location.origin}. Blocks Single Sign-On requires accessing the app via the configured domain ${targetOrigin}.`
        );
      } else {
        setError(err.message);
      }
      setPending(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark bg-volt-400 text-zinc-950 p-2 rounded-lg flex items-center justify-center font-bold">
            <Activity size={20} className="stroke-[2.5]" />
          </span>
          <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
            PulseRun <span className="text-volt-400 font-normal text-xs uppercase px-1.5 py-0.5 rounded bg-volt-400/10 border border-volt-400/20">Global</span>
          </span>
        </div>
        <h2>Worldwide Running Community</h2>
        <p>Sign in to track your running stats, broadcast your workouts, and connect with athletes worldwide.</p>

        {isWrongOrigin && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-left flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
              <Globe size={15} />
              <span>Project Domain Required for Blocks IAM</span>
            </div>
            <p className="text-amber-200/80 text-xs leading-relaxed">
              Blocks SSO cookies and API CORS require running on the project domain. Clicking below will switch to:
            </p>
            <a
              href={`${targetOrigin}${window.location.pathname}${window.location.search}`}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium text-xs border border-amber-500/30 transition-colors"
            >
              <ExternalLink size={14} /> Open {targetOrigin}
            </a>
          </div>
        )}

        {!configured ? (
          <Alert tone="warn">
            {t("auth.notConfigured")} <code>{window.location.origin}/login/callback</code>
          </Alert>
        ) : null}

        {error ? <Alert tone="error">{error}</Alert> : null}

        <button
          className="primary-button auth-submit bg-volt-400 text-zinc-950 font-bold hover:bg-volt-300 cursor-pointer"
          disabled={!configured || pending}
          onClick={handleLogin}
        >
          <LogIn size={18} />{" "}
          {pending
            ? "Redirecting to Blocks SSO..."
            : isWrongOrigin
            ? `Switch to ${targetHost} & Sign In`
            : "Sign In with Blocks Account"}
        </button>
      </div>
    </div>
  );
}
