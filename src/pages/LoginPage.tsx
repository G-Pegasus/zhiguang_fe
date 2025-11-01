import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { LoginRequest } from "@/types/auth";
import { authService } from "@/services/authService";
import styles from "./LoginPage.module.css";

type LocationState = {
  from?: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, user } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const from = (location.state as LocationState | undefined)?.from ?? "/";

  useEffect(() => {
    if (!isLoading && user) {
      navigate(from, { replace: true });
    }
  }, [isLoading, user, navigate, from]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setTimeout(() => setCountdown(prev => prev - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload: LoginRequest = { identifierType: "PHONE", identifier, code };
      await login(payload);
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "登录失败，请稍后重试";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendCode = async () => {
    if (!identifier) {
      setError("请先填写账号信息");
      return;
    }
    setError(null);
    setSendingCode(true);
    try {
      const response = await authService.sendCode({
        scene: "LOGIN",
        identifierType: "PHONE",
        identifier
      });
      setCountdown(Math.max(1, response.expireSeconds ?? 300));
    } catch (err) {
      const info = err instanceof Error ? err.message : "验证码发送失败";
      setError(info);
    } finally {
      setSendingCode(false);
    }
  };

  const isDisabled = submitting || !identifier || !code;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>欢迎回来</h1>
          <p className={styles.subtitle}>登录知光，与知识发光</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* 只保留手机号 + 验证码登录，不提供选择 */}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="identifier">
              手机号
            </label>
            <input
              id="identifier"
              className={styles.input}
              value={identifier}
              onChange={event => setIdentifier(event.target.value)}
              placeholder="请输入账号"
              type="tel"
              autoComplete="tel"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="code">
              验证码
            </label>
            <div className={styles.codeRow}>
              <input
                id="code"
                className={styles.input}
                value={code}
                onChange={event => setCode(event.target.value)}
                placeholder="请输入验证码"
                autoComplete="one-time-code"
              />
              <button
                type="button"
                className={styles.codeButton}
                disabled={sendingCode || countdown > 0}
                onClick={handleSendCode}
              >
                {countdown > 0 ? `${countdown}s` : "获取验证码"}
              </button>
            </div>
            <span className={styles.tips}>验证码用于校验登录，不需要输入密码。</span>
          </div>

          {error ? <div className={styles.error}>{error}</div> : null}

          <div className={styles.actions}>
            <button type="submit" className={styles.submitButton} disabled={isDisabled}>
              {submitting ? "登录中..." : "登录"}
            </button>
            <div className={styles.switchLink}>
              还没有账号？
              <button
                type="button"
                style={{ background: "none", border: "none", color: "var(--color-primary-strong)", fontWeight: 600, cursor: "pointer" }}
                onClick={() => navigate("/register", { state: { from } })}
              >
                前往注册
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
