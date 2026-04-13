import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCustomerAuth } from "../context/CustomerAuthContext";

export function GoogleSignInButton() {
  const navigate = useNavigate();
  const { signInGoogle } = useCustomerAuth();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = (await res.json()) as { email?: string; name?: string; picture?: string };
        if (!profile.email) {
          toast.error("Google did not return an email.");
          return;
        }
        signInGoogle({
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          provider: "google",
        });
        toast.success("Signed in with Google");
        navigate("/account");
      } catch {
        toast.error("Could not complete Google sign-in.");
      }
    },
    onError: () => toast.error("Google sign-in was cancelled."),
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      className="mt-4 w-full rounded-md border border-black/15 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:border-ink"
    >
      Continue with Google
    </button>
  );
}
