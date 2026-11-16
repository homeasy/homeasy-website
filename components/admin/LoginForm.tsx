"use client";

import { useActionState } from "react";
import { login } from "@/app/(admin)/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[15px] font-semibold">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className="h-12 w-full rounded-input border border-line bg-white px-4" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-[15px] font-semibold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-describedby={state?.error ? "login-error" : undefined}
          className="h-12 w-full rounded-input border border-line bg-white px-4"
        />
      </div>
      {state?.error && (
        <p id="login-error" role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary min-h-12 w-full disabled:opacity-60">
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
