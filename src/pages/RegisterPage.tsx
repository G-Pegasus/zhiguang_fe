import { FormEvent, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import type { IdentifierType, RegisterRequest } from "@/types/auth";
import styles from "./RegisterPage.module.css";
import Select from "@/components/common/Select";

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [identifierType, setIdentifierType] = useState<IdentifierType>("PHONE");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
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
      const response = await authService.sendCode({
        scene: "REGISTER",
        identifier,
        identifierType
      });
      setMessage("验证码已发送，请注意查收");
      setCountdown(Math.max(1, response.expireSeconds ?? 300));
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
    setSubmitting(true);
    try {
      const payload: RegisterRequest = {
        identifierType,
        identifier,
        code,
        password,
        nickname,
        agreeTerms
      };
      await register(payload);
      setMessage("注册成功，请使用账号登录");
      redirectTimerRef.current = window.setTimeout(() => {
        const from = (location.state as { from?: string } | undefined)?.from ?? "/";
        navigate("/login", { replace: true, state: { from } });
      }, 600);
    } catch (err) {
      const info = err instanceof Error ? err.message : "注册失败，请稍后重试";
      setError(info);
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = submitting || !identifier || !code || !password || !nickname || !agreeTerms;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>加入知光</h1>
          <p className={styles.subtitle}>完成注册，与更多人分享你的知识</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Select
            id="identifierType"
            label="注册方式"
            value={identifierType}
            onChange={val => setIdentifierType(val as IdentifierType)}
            options={[
              { label: "手机号", value: "PHONE" },
              { label: "邮箱", value: "EMAIL" },
              { label: "用户名", value: "USERNAME" }
            ]}
          />

          <div className={styles.field}>
            <label className={styles.label} htmlFor="identifier">
              {identifierType === "PHONE" ? "手机号" : identifierType === "EMAIL" ? "邮箱" : "用户名"}
            </label>
            <input
              id="identifier"
              className={styles.input}
              value={identifier}
              onChange={event => setIdentifier(event.target.value)}
              placeholder="请输入账号"
              type={identifierType === "PHONE" ? "tel" : identifierType === "EMAIL" ? "email" : "text"}
              autoComplete={identifierType === "PHONE" ? "tel" : identifierType === "EMAIL" ? "email" : "username"}
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
              className={styles.input}
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="请设置不少于 8 位的密码"
              autoComplete="new-password"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="nickname">
              昵称
            </label>
            <input
              id="nickname"
              className={styles.input}
              value={nickname}
              onChange={event => setNickname(event.target.value)}
              placeholder="如何称呼你"
              autoComplete="nickname"
            />
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
