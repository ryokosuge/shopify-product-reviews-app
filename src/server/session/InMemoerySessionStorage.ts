import { SessionInterface } from "@shopify/shopify-api";
import { SessionStorage } from "@shopify/shopify-api/dist/auth/session";

export class InMemorySessionStorag implements SessionStorage {
  private session: { [id: string]: SessionInterface } = {};

  public async storeSession(session: SessionInterface): Promise<boolean> {
    console.log("=== store session ===");
    console.log(`session: ${JSON.stringify(session, null, 2)}`);
    this.session[session.id] = session;
    return true;
  }

  public async loadSession(id: string): Promise<SessionInterface | undefined> {
    console.log("=== load session ===");
    console.log(`session: ${JSON.stringify(this.session[id], null, 2)}`);
    return this.session[id] || undefined;
  }

  public async deleteSession(id: string): Promise<boolean> {
    console.log("=== delete session ===");
    console.log(`session: ${JSON.stringify(this.session[id], null, 2)}`);
    if (this.session[id]) {
      delete this.session[id];
    }
    return true;
  }
}
