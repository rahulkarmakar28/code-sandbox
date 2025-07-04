import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-800">
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          // appearance={{
          //   elements: {
          //     card: "shadow-none",
          //     formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
          //     headerTitle: "text-xl font-bold text-gray-800",
          //     headerSubtitle: "text-sm text-gray-600",
          //   },
          // }}
        />
    </div>
  );
}
