import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-800">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        // appearance={{
        //   elements: {
        //     // card: "shadow-none bg-gray-900 text-white",
        //     // formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white",
        //     // headerTitle: "text-xl font-bold text-white",
        //     // headerSubtitle: "text-sm text-gray-400",
        //     // formFieldInput: "bg-gray-800 text-white placeholder-gray-400",
        //   },
        // }}
      />
    </div>
  );
}
