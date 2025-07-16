import AuthForm from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
