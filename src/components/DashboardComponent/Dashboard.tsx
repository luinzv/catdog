import { useEffect, useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type InputFieldProps = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type?: string;
  placeholder?: string;
  showToggle?: boolean;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function InputField({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  showToggle = false,
  isVisible = false,
  onToggleVisibility,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

        <input
          type={showToggle ? (isVisible ? "text" : type) : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-12 py-3 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium outline-none"
        />

        {showToggle && (
          <button
            type="button"
            onClick={onToggleVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function DashboardComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [, setError] = useState('');
  const [formState, setFormState] = useState("login");
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state?.formType) {
      setFormState(location.state.formType);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (formState === "register") {
            if (password !== confirmPassword) {
                setError('Las contraseñas no coinciden');
                return;
            }

            console.log("Datos a enviar:", { nombre, email, password });

            const userData = { nombre, email, password };

            try {
                const response = await fetch('http://localhost:4000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Error en el registro');
                }

                const data = await response.json();
                console.log('Usuario registrado:', data);
                setNombre('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            } catch (err: any) {
                console.error("Detalles del error:", err);
                setError(err.message || 'Error desconocido');
            }

            return;
        }

        console.log("Datos a enviar:", { email, password });

        const loginData = { email, password };

        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Error en el login');
            }

            const data = await response.json();
            console.log('Login exitoso:', data);

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem("user", JSON.stringify(data.usuario));
            }

            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setNombre('');
            navigate('/perfil');
        } catch (err: any) {
            console.error("Detalles del error:", err);
            setError(err.message || 'Error desconocido');
        }
    };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply blur-3xl opacity-10 animate-pulse" />
        <div className="absolute -bottom-8 -left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply blur-3xl opacity-10 animate-pulse" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            CatDog
          </h1>

          <p className="text-gray-600">
            Conecta con tus mascotas
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* Tabs */}
          <div className="flex gap-4 mb-8">

            <button
              onClick={() => setFormState("login")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                formState === "login"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setFormState("register")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                formState === "register"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Registrar
            </button>
          </div>

          {/* LOGIN */}
          {formState === "login" && (
            <form className="animate-fade-in" onSubmit={handleSubmit}>

              <InputField
                label="Correo Electronico"
                icon={Mail}
                type="email"
                placeholder="@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <InputField
                label="Contraseña"
                icon={Lock}
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                showToggle
                isVisible={showPassword}
                onToggleVisibility={() =>
                  setShowPassword(!showPassword)
                }
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mb-4"
              >
                Ingresar
              </button>

              <p className="text-center text-gray-600">
                ¿No posees una cuenta?{" "}
                <button
                  type="button"
                  onClick={() => setFormState("register")}
                  className="text-blue-500 hover:text-blue-600 font-semibold underline"
                >
                  Registrate ahora
                </button>
              </p>
            </form>
          )}

          {/* REGISTER */}
          {formState === "register" && (
            <form className="animate-fade-in" onSubmit={handleSubmit}>

              <InputField
                label="Nombre completo"
                icon={User}
                type="text"
                placeholder="Luis Fernando"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

              <InputField
                label="Correo Electronico"
                icon={Mail}
                type="email"
                placeholder="@gmailcom"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <InputField
                label="Contraseña"
                icon={Lock}
                type="password"
                placeholder="Crea una contraseña"
                showToggle
                isVisible={showPassword}
                onToggleVisibility={() =>
                  setShowPassword(!showPassword)
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <InputField
                label="Confirmar contraseña"
                icon={Lock}
                type="password"
                placeholder="Confirma tu contraseña"
                showToggle
                isVisible={showConfirmPassword}
                onToggleVisibility={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mb-4"
              >
                Crear cuenta
              </button>

              <p className="text-center text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <button
                  type="button"
                  onClick={() => setFormState("login")}
                  className="text-blue-500 hover:text-blue-600 font-semibold underline"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Ingresando, estás de acuerdo con nuestros Terminos de servicio y Politica de privacidad
        </p>
      </div>
    </div>
  );
}