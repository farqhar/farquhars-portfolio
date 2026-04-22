const KEY = "fm_admin_pw";

export const cmsSession = {
  set(password: string) {
    sessionStorage.setItem(KEY, password);
    sessionStorage.setItem("fm_admin_session", "true");
  },
  get(): string | null {
    return sessionStorage.getItem(KEY);
  },
  clear() {
    sessionStorage.removeItem(KEY);
    sessionStorage.removeItem("fm_admin_session");
  },
  isAuthed(): boolean {
    return sessionStorage.getItem("fm_admin_session") === "true";
  },
};