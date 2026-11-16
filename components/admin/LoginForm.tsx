"use client";

import { useActionState } from "react";
import { login } from "@/app/(admin)/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className="adm-control" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-describedby={state?.error ? "login-error" : undefined}
          className="adm-control"
        />
      </div>
      {state?.error && (
        <p id="login-error" role="alert" className="text-sm text-red-300">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="adm-btn adm-btn-primary w-full">
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
