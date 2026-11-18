import { FormEvent, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { ApiError } from "@/services/apiClient";
import { useAuth } from "@/context/AuthContext";
import { validatePassword } from "@/features/auth/passwordPolicy";
import type { IdentifierType, RegisterRequest } from "@/types/auth";
import styles from "./RegisterPage.module.css";
// 注册方式固定为手机号

/**
 * 从接口错误中取出后端业务错误码（如 VERIFICATION_NOT_FOUND）。
 * 后端统一返回 { code, message }，apiClient 只把 message 作为 Error.message 抛出，
 * 因此这里从 data 中读取 code 做稳定分支。
 */
const getErrorCode = (error: unknown): string | undefined => {
  if (error instanceof ApiError && typeof error.data === "object" && error.data !== null && "code" in error.data) {
    return (error.data as { code?: string }).code;
  }
  return undefined;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const identifierType: IdentifierType = "PHONE";
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const redirectTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setTimeout(() => setCountdown(prev => prev - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const handleSendCode = async () => {
    if (!identifier) {
      setError("请先填写账号信息");
      return;
    }
    setError(null);
    setMessage(null);
    setSendingCode(true);
    try {
      await authService.sendCode({
        scene: "REGISTER",
        identifier,
        identifierType
      });
      setMessage("验证码已发送，请注意查收");
      setCountdown(60);
    } catch (err) {
      const info = err instanceof Error ? err.message : "验证码发送失败";
      setError(info);
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    // 密码策略就地校验：不满足时不发起请求，验证码（一次性凭证）就不会被提前消费。
    const policy = validatePassword(password);
    if (!policy.ok) {
      setPasswordError(policy.message);
      return;
    }
    setPasswordError(null);

    setSubmitting(true);
    try {
      const payload: RegisterRequest = {
        identifierType,
        identifier,
        code,
        password,
        agreeTerms
      };
      await register(payload);
      setMessage("注册成功，已自动登录");
      // 直接跳回来源页面或首页
      const from = (location.state as { from?: string } | undefined)?.from ?? "/";
      redirectTimerRef.current = window.setTimeout(() => {
        navigate(from, { replace: true });
      }, 400);
    } catch (err) {
      const info = err instanceof Error ? err.message : "注册失败，请稍后重试";
      const errorCode = getErrorCode(err);
      if (errorCode === "VERIFICATION_NOT_FOUND") {
        setError("验证码已失效或已被使用，请重新获取验证码");
      } else if (errorCode === "PASSWORD_POLICY_VIOLATION") {
        // 后端策略与前端不一致时（例如后端调整了最小长度），把提示落到密码框下方
        setPasswordError(info);
      } else {
        setError(info);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = submitting || !identifier || !code || !password || !agreeTerms;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>加入知光</h1>
          <p className={styles.subtitle}>完成注册，与更多人分享你的知识</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="identifier">手机号</label>
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
            <span className={styles.tips}>验证码用于验证账号所有权，有效期有限，请及时填写。</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              登录密码
            </label>
            <input
              id="password"
              className={`${styles.input} ${passwordError ? styles.inputInvalid : ""}`}
              type="password"
              value={password}
              onChange={event => {
                setPassword(event.target.value);
                if (passwordError) {
                  setPasswordError(null);
                }
              }}
              placeholder="请设置不少于 8 位的密码"
              autoComplete="new-password"
              aria-invalid={passwordError ? true : undefined}
              aria-describedby={passwordError ? "password-error" : "password-tips"}
            />
            {passwordError ? (
              <span id="password-error" className={styles.fieldError} role="alert">
                {passwordError}
              </span>
            ) : (
              <span id="password-tips" className={styles.tips}>
                至少 8 位，需同时包含字母和数字。
              </span>
            )}
          </div>

          

          <div className={styles.field}>
            <div className={styles.checkboxRow}>
              <input
                id="agreeTerms"
                type="checkbox"
                checked={agreeTerms}
                onChange={event => setAgreeTerms(event.target.checked)}
              />
              <label className={styles.label} htmlFor="agreeTerms">
                我已阅读并同意
                <a href="#" onClick={e => e.preventDefault()}>《用户协议》</a>
                和
                <a href="#" onClick={e => e.preventDefault()}>《隐私政策》</a>
              </label>
            </div>
          </div>

          {error ? <div className={styles.error}>{error}</div> : null}
          {message ? <div className={styles.success}>{message}</div> : null}

          <div className={styles.actions}>
            <button type="submit" className={styles.submitButton} disabled={isDisabled}>
              {submitting ? "注册中..." : "立即注册"}
            </button>
            <div className={styles.switchLink}>
              已有账号？
              <button type="button" onClick={() => navigate("/login")}>返回登录</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
