import Header from "@/components/reuseableComponents/Header";
import LoginForm from "@/components/reuseableComponents/LoginForm";

export default function LoginPage() {


  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <LoginForm/>
    </div>
  );
}