import { AuthModel } from "@/models/AuthModel";
import type { User, Session } from "@supabase/supabase-js";

export class AuthPresenter {
  private model: AuthModel;

  constructor() {
    this.model = new AuthModel();
  }

  async handleSignUp(email: string, password: string, fullName: string) {
    if (!email || !password || !fullName) {
      throw new Error("All fields are required");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    try {
      return await this.model.signUp(email, password, fullName);
    } catch (error: any) {
      if (error.message.includes("already registered")) {
        throw new Error("This email is already registered. Please sign in instead.");
      }
      throw new Error(error.message || "Failed to sign up. Please try again.");
    }
  }

  async handleSignIn(email: string, password: string) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    try {
      return await this.model.signIn(email, password);
    } catch (error: any) {
      if (error.message.includes("Invalid")) {
        throw new Error("Invalid email or password");
      }
      throw new Error(error.message || "Failed to sign in. Please try again.");
    }
  }

  async handleSignOut() {
    try {
      await this.model.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      throw new Error("Failed to sign out. Please try again.");
    }
  }

  async getCurrentUser(): Promise<{ user: User | null; session: Session | null }> {
    return await this.model.getSession();
  }

  setupAuthListener(callback: (user: User | null, session: Session | null) => void) {
    return this.model.onAuthStateChange(callback);
  }
}
