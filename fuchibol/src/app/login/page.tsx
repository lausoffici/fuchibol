import { LoginButton } from "@/components/auth/login-button";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50">
      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md space-y-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="mt-6 bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-5xl font-black tracking-tight text-transparent">
            FutStats
          </h1>
          <h2 className="mt-2 text-2xl font-bold text-gray-800">
            Tu fútbol amateur, nivel profesional
          </h2>
          <p className="mt-4 text-gray-600">
            Lleva el registro de tus partidos con amigos, arma equipos
            equilibrados y descubre quién es realmente el crack del grupo.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">
                Ingresa con tu cuenta
              </span>
            </div>
          </div>

          <LoginButton />

          <div className="mt-8 space-y-4 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 p-6">
            <p className="text-center text-sm font-medium text-blue-700">
              ¿Qué podrás hacer?
            </p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-blue-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                Registrar resultados y goles de cada partido
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-blue-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                Ver estadísticas individuales y grupales
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-blue-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                Armar equipos equilibrados automáticamente
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-blue-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                Ranking de goleadores y asistencias
              </li>
            </ul>
          </div>

          <p className="text-center text-xs text-gray-500">
            ¡Deja de anotar en papel o WhatsApp! Únete a la comunidad de
            FutStats y lleva tu fútbol amateur al siguiente nivel.
          </p>
        </div>
      </div>
    </div>
  );
}
