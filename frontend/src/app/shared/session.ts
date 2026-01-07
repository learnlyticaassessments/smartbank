export class Session {
  static get username(): string { return localStorage.getItem('sb_username') || ''; }
  static set username(v: string) { localStorage.setItem('sb_username', v); }
  static get token(): string { return localStorage.getItem('sb_token') || ''; }
  static set token(t: string) { localStorage.setItem('sb_token', t); }
  static clear() { localStorage.removeItem('sb_username'); localStorage.removeItem('sb_token'); }

  static async logout(): Promise<void> {
    try {
      const token = Session.token;
      if (token) {
        await fetch('/api/customer/logout', { method: 'POST', headers: { 'X-Auth-Token': token } });
      }
    } catch (e) {
      // ignore errors
    }
    Session.clear();
  }
}
