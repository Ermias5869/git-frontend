// lib/redirect.ts
export class RedirectManager {
  private static readonly REDIRECT_KEY = "auth_redirect_path";

  static setRedirectPath(path: string) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(this.REDIRECT_KEY, path);
    }
  }

  static getRedirectPath(): string {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(this.REDIRECT_KEY) || "/dashboard";
    }
    return "/dashboard";
  }

  static clearRedirectPath() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(this.REDIRECT_KEY);
    }
  }

  static getOAuthState(): string {
    const redirectPath = this.getRedirectPath();
    const stateData = { redirectTo: redirectPath };
    return encodeURIComponent(JSON.stringify(stateData));
  }
}
