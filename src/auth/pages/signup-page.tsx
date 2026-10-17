import { useState } from 'react';

import { useAuth } from '@/auth/context/auth-context';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Mail,
  UserRound,
  LockKeyhole,
} from 'lucide-react';

import { useForm } from 'react-hook-form';

import {
  Link,
  useNavigate,
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

import {
  getSignupSchema,
  SignupSchemaType,
} from '../forms/signup-schema';

export function SignUpPage() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [passwordVisible, setPasswordVisible] =
    useState(false);

  const [
    confirmPasswordVisible,
    setConfirmPasswordVisible,
  ] = useState(false);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  /* ============================================================
     FORMULAIRE
  ============================================================ */

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(
      getSignupSchema(),
    ),

    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      terms: false,
    },
  });

  /* ============================================================
     INSCRIPTION
  ============================================================ */

  async function onSubmit(
    values: SignupSchemaType,
  ) {
    try {
      setIsProcessing(true);
      setError(null);

      await register(
        values.email,
        values.password,
        values.confirmPassword,
        values.firstName,
        values.lastName,
      );

      setSuccessMessage(
        'Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.',
      );

      setTimeout(() => {
        navigate('/auth/signin');
      }, 3000);
    } catch (err) {
      console.error(
        'Registration error:',
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Une erreur inattendue s'est produite lors de l'inscription. Veuillez réessayer.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="block w-full space-y-3.5"
      >

        {/* ======================================================
            TITRE
        ====================================================== */}

        <div className="space-y-0.5 pb-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#18321D]">
            Créer un compte
          </h1>

          <p className="text-sm text-muted-foreground">
            Rejoignez la plateforme Olivier
          </p>
        </div>

        {/* ======================================================
            ERREUR
        ====================================================== */}

        {error && (
          <Alert
            variant="destructive"
            appearance="light"
            onClose={() => setError(null)}
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
            SUCCÈS
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
            NOM D'AFFICHAGE + NOM UTILISATEUR
        ====================================================== */}

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">

          {/* Nom d'affichage */}

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Nom d'affichage
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <UserRound className="absolute left-3.5 top-1/2 z-10 size-4.5 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      placeholder="Ex : Ayah Ben Ali"
                      {...field}
                      className="h-11 rounded-lg pl-11 text-sm"
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nom utilisateur */}

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Nom d'utilisateur
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <UserRound className="absolute left-3.5 top-1/2 z-10 size-4.5 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      placeholder="Ex : ayah"
                      {...field}
                      className="h-11 rounded-lg pl-11 text-sm"
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        {/* ======================================================
            EMAIL
        ====================================================== */}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Email
                <span className="ml-1 text-red-500">
                  *
                </span>
              </FormLabel>

              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 z-10 size-4.5 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    placeholder="Ex : ayah@example.com"
                    type="email"
                    {...field}
                    className="h-11 rounded-lg pl-11 text-sm"
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
              <FormLabel className="text-sm font-medium">
                Mot de passe
                <span className="ml-1 text-red-500">
                  *
                </span>
              </FormLabel>

              <div className="relative">

                <LockKeyhole className="absolute left-3.5 top-1/2 z-10 size-4.5 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Au moins 6 caractères"
                  type={
                    passwordVisible
                      ? 'text'
                      : 'password'
                  }
                  {...field}
                  className="h-11 rounded-lg pl-11 pr-11 text-sm"
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
                  className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 hover:bg-transparent"
                >
                  {passwordVisible ? (
                    <EyeOff className="size-4.5 text-muted-foreground" />
                  ) : (
                    <Eye className="size-4.5 text-muted-foreground" />
                  )}
                </Button>

              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* ======================================================
            CONFIRMATION
        ====================================================== */}

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Confirmer le mot de passe
                <span className="ml-1 text-red-500">
                  *
                </span>
              </FormLabel>

              <div className="relative">

                <LockKeyhole className="absolute left-3.5 top-1/2 z-10 size-4.5 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Confirmez votre mot de passe"
                  type={
                    confirmPasswordVisible
                      ? 'text'
                      : 'password'
                  }
                  {...field}
                  className="h-11 rounded-lg pl-11 pr-11 text-sm"
                />

                <Button
                  type="button"
                  variant="ghost"
                  mode="icon"
                  onClick={() =>
                    setConfirmPasswordVisible(
                      !confirmPasswordVisible,
                    )
                  }
                  className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 hover:bg-transparent"
                >
                  {confirmPasswordVisible ? (
                    <EyeOff className="size-4.5 text-muted-foreground" />
                  ) : (
                    <Eye className="size-4.5 text-muted-foreground" />
                  )}
                </Button>

              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* ======================================================
            CONDITIONS
        ====================================================== */}

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-2 space-y-0 rounded-md">

              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={
                    field.onChange
                  }
                />
              </FormControl>

              <div className="space-y-1 leading-none">
                <FormLabel className="text-xs text-muted-foreground">
                  J'accepte les{' '}

                  <Link
                    to="#"
                    className="font-semibold text-[#556B2F] underline underline-offset-2 hover:text-[#465A27]"
                  >
                    conditions et la politique de confidentialité
                  </Link>
                </FormLabel>

                <FormMessage />
              </div>

            </FormItem>
          )}
        />

        {/* ======================================================
            BOUTON
        ====================================================== */}

        <Button
          type="submit"
          disabled={isProcessing}
          className="h-12 w-full rounded-lg bg-[#556B2F] text-base font-semibold text-white hover:bg-[#465A27]"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <Spinner className="size-4 animate-spin" />
              Création du compte...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-4">
              <span>
                Créer un compte
              </span>

              <ArrowRight className="size-5" />
            </span>
          )}
        </Button>

        {/* ======================================================
            SÉPARATEUR
        ====================================================== */}

        <div className="relative py-1.5">

          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs text-muted-foreground">
              ou
            </span>
          </div>

        </div>

        {/* ======================================================
            CONNEXION
        ====================================================== */}

        <div className="text-center text-sm text-muted-foreground">
          Vous avez déjà un compte ?{' '}

          <Link
            to="/auth/signin"
            className="font-semibold text-[#556B2F] underline underline-offset-2 hover:text-[#465A27]"
          >
            Se connecter
          </Link>
        </div>

      </form>
    </Form>
  );
}