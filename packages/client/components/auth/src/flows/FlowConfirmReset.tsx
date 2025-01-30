import { clientController } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import { useNavigate, useParams } from "@revolt/routing";
import { Button, Text } from "@revolt/ui";

import { FlowTitle } from "./Flow";
import { Fields, Form } from "./Form";

/**
 * Flow for confirming a new password
 */
export default function FlowConfirmReset() {
  const t = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();

  /**
   * Confirm new password
   * @param data Form Data
   */
  async function reset(data: FormData) {
    const password = data.get("new-password") as string;
    const confirmPassword = data.get("confirm-password") as string;
    const remove_sessions = !!(data.get("log-out") as "on" | undefined);

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    // If passwords match, submit the form
    await clientController.api.patch("/auth/account/reset_password", {
      password,
      token,
      remove_sessions,
    });

    navigate("/login/auth", { replace: true });
  }

  return (
    <>
      <FlowTitle>{t("login.reset")}</FlowTitle>
      <Form onSubmit={reset}>
        <Fields fields={["new-password", "confirm-password", "log-out"]} />
        <Button type="submit">{t("login.reset")}</Button>
      </Form>
      <a href="/login/auth">{t("login.remembered")}</a>
    </>
  );
}

