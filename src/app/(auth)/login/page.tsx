import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex max-w-[1500px] h-screen bg-white">
      <div className="w-full max-w-md bg-white flex flex-col justify-center items-center px-2 py-1 mx-auto">
        <h2 className="mt-2 -mb-4 text-center text-xl font-semibold">
          Faça o login em sua conta
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
