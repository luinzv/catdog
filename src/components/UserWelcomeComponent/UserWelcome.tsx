import { useNavigate } from 'react-router-dom';
export default function WelcomeScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* IMAGEN */}
      <div className="w-full lg:w-1/2 h-96 lg:h-screen relative overflow-hidden">

        <div
          className="absolute inset-0 bg-linear-to-r from-blue-600 via-blue-500 to-cyan-400"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWJyYXpvJTIwcGVycm98ZW58MHx8MHx8fDA%3D"), linear-gradient(135deg, #0ea4e900 0%, #06b5d400 100%)',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
        >

          {/* DIFUMINADO */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-white/80 lg:to-white"></div>

          {/* BLUR */}
          <div className="absolute inset-0 lg:backdrop-blur-[2px] pointer-events-none"></div>

        </div>
      </div>

      {/* CONTENIDO */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:py-0 bg-linear-to-b lg:bg-linear-to-r from-white to-blue-50/50">

        <div className="max-w-md w-full">

          {/* LOGO */}
          <div className="flex justify-center mb-8">

            <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">

              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
              </svg>

            </div>
          </div>

          {/* TITULO */}
          <h1 className="text-5xl lg:text-6xl font-bold text-center text-gray-900 mb-4 tracking-tight">
            CatDog
          </h1>

          {/* SUBTITULO */}
          <p className="text-center text-gray-600 text-lg mb-10 leading-relaxed">
            Cuida, organiza y protege la salud de tus mascotas
          </p>

          {/* BOTONES */}
          <div className="space-y-3">

            <button onClick={() => navigate("/login", { state: { formType: "register" } })} className="w-full bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Unirse
            </button>
            <div className="user-profile">
    </div>
            <button onClick={() => navigate("/login")} className="w-full border-2 border-blue-300 text-blue-600 hover:bg-blue-50 font-semibold py-4 px-6 rounded-xl transition-all duration-300">
              Iniciar Sesión
            </button>

          </div>

          {/* ESTADISTICAS */}
          <div className="mt-12 pt-8 border-t border-gray-200">

            <p className="text-xs text-center text-gray-500 uppercase tracking-widest mb-4">
              Confían en nosotros
            </p>

            <div className="flex items-center justify-center gap-4">

          

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}