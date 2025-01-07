import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate('/goals');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'Email not confirmed':
        return 'Please verify your email address before signing in.';
      default:
        return error.message;
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-sage-900">Welcome to Achievr</CardTitle>
          <CardDescription className="text-sage-600">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#34d399',
                    brandAccent: '#059669',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#34d399',
                    defaultButtonBackgroundHover: '#059669',
                    inputText: '#065f46',
                    inputBackground: 'white',
                    inputBorder: '#d1d5db',
                    inputBorderHover: '#34d399',
                    inputBorderFocus: '#059669',
                  },
                },
              },
              className: {
                button: 'bg-sage-500 hover:bg-sage-600 text-white',
                input: 'border-gray-300 focus:border-sage-500 focus:ring-sage-500',
                label: 'text-sage-900',
              },
            }}
            providers={[]}
          />
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-sage-600 hover:text-sage-700">
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;