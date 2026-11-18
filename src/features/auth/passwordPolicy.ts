/**
 * 前端密码策略校验。
 *
 * <p>与后端 {@code AuthService#validatePassword} / {@code AuthProperties.Password} 保持一致：
 * 去掉首尾空白后长度不小于 {@link PASSWORD_MIN_LENGTH}，且同时包含字母与数字。</p>
 *
 * <p>前端校验的唯一目的是避免发起一次必然失败的注册请求——注册接口的验证码是一次性凭证，
 * 一次失败的重试可能让用户不得不重新获取验证码。后端仍是唯一权威校验方。</p>
 */

/** 密码最小长度，需与后端 {@code auth.password.min-length}（默认 8）保持一致。 */
export const PASSWORD_MIN_LENGTH = 8;

export type PasswordPolicyResult = { ok: true } | { ok: false; message: string };

/**
 * 校验密码是否符合注册策略。
 *
 * @param password 密码明文。
 * @returns 符合策略返回 {@code { ok: true }}，否则返回带提示文案的失败结果。
 */
export const validatePassword = (password: string): PasswordPolicyResult => {
  const trimmed = password.trim();
  if (!trimmed) {
    return { ok: false, message: "请设置登录密码" };
  }
  if (trimmed.length < PASSWORD_MIN_LENGTH) {
    return { ok: false, message: `密码长度至少 ${PASSWORD_MIN_LENGTH} 位` };
  }
  // 与 Java 的 Character.isLetter / isDigit 对齐，使用 Unicode 语义而非仅 ASCII。
  const hasLetter = /\p{L}/u.test(trimmed);
  const hasDigit = /\p{Nd}/u.test(trimmed);
  if (!hasLetter || !hasDigit) {
    return { ok: false, message: "密码需同时包含字母和数字" };
  }
  return { ok: true };
};
