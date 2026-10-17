import { useEffect, useState } from 'react';

import { SupabaseAdapter } from '@/auth/adapters/supabase-adapter';
import { useAuth } from '@/auth/context/auth-context';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
} from 'lucide-react';

import { useForm } from 'react-hook-form';

import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import {
  Alert,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/alert';

import { Button } from '@/components/ui/button';

import { Checkbox } from '@/components/ui/checkbox';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';

import { Spinner } from '@/components/ui/spinners';

import { Icons } from '@/components/common/icons';

import {
  getSigninSchema,
  SigninSchemaType,
} from '../forms/signin-schema';

export function SignInPage() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const { login } = useAuth();

  const [passwordVisible, setPasswordVisible] =
    useState(false);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [isGoogleLoading, setIsGoogleLoading] =
    useState(false);

  /* ============================================================
     MESSAGES AUTHENTIFICATION
  ============================================================ */

  useEffect(() => {
    const pwdReset =
      searchParams.get('pwd_reset');

    const errorParam =
      searchParams.get('error');

    const errorDescription =
      searchParams.get('error_description');

    if (pwdReset === 'success') {
      setSuccessMessage(
        'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
      );
    }

    if (errorParam) {
      switch (errorParam) {
        case 'auth_callback_failed':
          setError(
            errorDescription ||
              "L'authentification a échoué. Veuillez réessayer.",
          );
          break;

        case 'auth_callback_error':
          setError(
            errorDescription ||
              "Une erreur s'est produite lors de l'authentification. Veuillez réessayer.",
          );
          break;

        case 'auth_token_error':
          setError(
            errorDescription ||
              "Impossible de créer la session d'authentification. Veuillez réessayer.",
          );
          break;

        default:
          setError(
            errorDescription ||
              "Une erreur d'authentification s'est produite. Veuillez réessayer.",
          );
          break;
      }
    }
  }, [searchParams]);

  /* ============================================================
     FORMULAIRE
  ============================================================ */

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(
      getSigninSchema(),
    ),

    defaultValues: {
      email: 'demo@kt.com',
      password: 'demo123',
      rememberMe: true,
    },
  });

  /* ============================================================
     CONNEXION
  ============================================================ */

  async function onSubmit(
    values: SigninSchemaType,
  ) {
    try {
      setIsProcessing(true);

      setError(null);

      console.log(
        'Attempting to sign in with email:',
        values.email,
      );

      /* --------------------------------------------------------
         Validation
      -------------------------------------------------------- */

      if (
        !values.email.trim() ||
        !values.password
      ) {
        setError(
          'Le nom utilisateur et le mot de passe sont obligatoires.',
        );

        return;
      }

      /* --------------------------------------------------------
         Login Supabase
      -------------------------------------------------------- */

      await login(
        values.email,
        values.password,
      );

      /* --------------------------------------------------------
         Redirection
      -------------------------------------------------------- */

      const nextPath =
        searchParams.get('next') || '/';

      navigate(nextPath);
    } catch (err) {
      console.error(
        'Unexpected sign-in error:',
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Une erreur inattendue s'est produite. Veuillez réessayer.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  /* ============================================================
     GOOGLE LOGIN
     
     Conservé comme dans ton fichier original.
     Il n'est simplement plus affiché dans l'interface.
  ============================================================ */

  const handleGoogleSignIn =
    async () => {
      try {
        setIsGoogleLoading(true);

        setError(null);

        const nextPath =
          searchParams.get('next');

        const redirectTo = nextPath
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
          : `${window.location.origin}/auth/callback`;

        console.log(
          'Initiating Google sign-in with redirect:',
          redirectTo,
        );

        await SupabaseAdapter.signInWithOAuth(
          'google',
          {
            redirectTo,
          },
        );
      } catch (err) {
        console.error(
          'Google sign-in error:',
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de se connecter avec Google. Veuillez réessayer.',
        );

        setIsGoogleLoading(false);
      }
    };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          onSubmit,
        )}
        className="block w-full space-y-6"
      >

        {/* ======================================================
            TITRE
        ====================================================== */}

        <div className="space-y-1 pb-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#18321D]">
            Connexion
          </h1>

          <p className="text-base text-muted-foreground">
            Accédez à votre compte Olivier
          </p>
        </div>

        {/* ======================================================
            ERREUR
        ====================================================== */}

        {error && (
          <Alert
            variant="destructive"
            appearance="light"
            onClose={() =>
              setError(null)
            }
          >
            <AlertIcon>
              <AlertCircle />
            </AlertIcon>

            <AlertTitle>
              {error}
            </AlertTitle>
          </Alert>
        )}

        {/* ======================================================
            MESSAGE SUCCÈS
        ====================================================== */}

        {successMessage && (
          <Alert
            appearance="light"
            onClose={() =>
              setSuccessMessage(null)
            }
          >
            <AlertIcon>
              <Check />
            </AlertIcon>

            <AlertTitle>
              {successMessage}
            </AlertTitle>
          </Alert>
        )}

        {/* ======================================================
            NOM UTILISATEUR
        ====================================================== */}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Nom d'utilisateur
                <span className="ml-1 text-red-500">
                  *
                </span>
              </FormLabel>

              <FormControl>
                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    placeholder="Entrez votre nom d'utilisateur"
                    {...field}
                    className="h-14 rounded-lg pl-12 pr-4 text-base"
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* ======================================================
            MOT DE PASSE
        ====================================================== */}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-base font-medium">
                  Mot de passe
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </FormLabel>
              </div>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Entrez votre mot de passe"
                  type={
                    passwordVisible
                      ? 'text'
                      : 'password'
                  }
                  {...field}
                  className="h-14 rounded-lg pl-12 pr-12 text-base"
                />

                <Button
                  type="button"
                  variant="ghost"
                  mode="icon"
                  onClick={() =>
                    setPasswordVisible(
                      !passwordVisible,
                    )
                  }
                  className="absolute right-1 top-1/2 h-12 w-12 -translate-y-1/2 hover:bg-transparent"
                >
                  {passwordVisible ? (
                    <EyeOff className="size-5 text-muted-foreground" />
                  ) : (
                    <Eye className="size-5 text-muted-foreground" />
                  )}
                </Button>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* ======================================================
            MOT DE PASSE OUBLIÉ
        ====================================================== */}

        <div className="-mt-2 flex justify-end">
          <Link
            to="/auth/reset-password"
            className="text-sm font-semibold text-[#556B2F] underline underline-offset-2 hover:text-[#465A27]"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        {/* ======================================================
            BOUTON CONNEXION
        ====================================================== */}

        <Button
          type="submit"
          disabled={isProcessing}
          className="h-14 w-full rounded-lg bg-[#556B2F] text-base font-semibold text-white hover:bg-[#465A27]"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <Spinner className="size-5 animate-spin" />
              Connexion...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-4">
              <span>
                Se connecter
              </span>

              <ArrowRight className="size-6" />
            </span>
          )}
        </Button>

        {/* ======================================================
            SÉPARATEUR
        ====================================================== */}

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-sm text-muted-foreground">
              ou
            </span>
          </div>
        </div>

        {/* ======================================================
            INSCRIPTION
        ====================================================== */}

        <div className="text-center text-sm text-muted-foreground">
          Vous n'avez pas encore de compte ?{' '}

          <Link
            to="/auth/signup"
            className="font-semibold text-[#556B2F] underline underline-offset-2 hover:text-[#465A27]"
          >
            Créer un compte
          </Link>
        </div>

      </form>
    </Form>
  );
}