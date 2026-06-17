import {
  PawPrint,
  Bell,
  AlertTriangle,
  User,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Search,
  Map,
  Settings
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: { label: string; href: string; icon: React.ElementType }[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Mascotas",
    icon: PawPrint,
    children: [
      { label: "Mis Mascotas", href: "/mascotas", icon: PawPrint },
      { label: "Mascotas Perdidas", href: "/perdidos", icon: Search },
      { label: "Mapa", href: "/mapa", icon: Map },
    ],
  },
  {
    label: "Cuidado",
    icon: Bell,
    children: [
      { label: "Recordatorios", href: "/recordatorios", icon: Bell },
      { label: "Alertas", href: "/alertas", icon: AlertTriangle },
    ],
  },
  { label: "Perfil", href: "/perfil", icon: User },
  { label: "Configuración", href: "/configuracion", icon: Settings },
];

type NavAction = {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
};

export default function Navbar({ title, action }: { title: string; action?: NavAction }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dropdownAbierto, setDropdownAbierto] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownAbierto(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMenuAbierto(false);
    setDropdownAbierto(null);
  }, [location.pathname]);

  const isActive = (item: NavItem): boolean => {
    if (item.href) return location.pathname === item.href;
    if (item.children) return item.children.some((c) => location.pathname === c.href);
    return false;
  };

  const isChildActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo + Título */}
          <div className="cursor-pointer shrink-0" onClick={() => navigate("/dashboard")}>
            <p className="text-lg font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent leading-tight">
              CatDog
            </p>
            <p className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
              {title}
            </p>
          </div>

          {/* NAV DESKTOP + BOTÓN agrupados a la derecha */}
          <div className="hidden md:flex items-center gap-2">
            <nav className="flex items-center gap-1" ref={dropdownRef}>
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="relative">
                  {item.href ? (
                    <button
                      onClick={() => navigate(item.href!)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        isActive(item)
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ) : (
                    <div>
                      <button
                        onClick={() =>
                          setDropdownAbierto(dropdownAbierto === item.label ? null : item.label)
                        }
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          isActive(item)
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${
                            dropdownAbierto === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {dropdownAbierto === item.label && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                          {item.children!.map((child) => (
                            <button
                              key={child.href}
                              onClick={() => { navigate(child.href); setDropdownAbierto(null); }}
                              className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm transition hover:bg-blue-50 ${
                                isChildActive(child.href)
                                  ? "bg-blue-50 text-blue-600 font-semibold"
                                  : "text-slate-600 font-medium"
                              }`}
                            >
                              <child.icon className="w-4 h-4 shrink-0" />
                              {child.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Separador + botón acción */}
            {action && (
              <>
                <div className="w-px h-6 bg-slate-200 mx-1" />
                <button
                  onClick={action.onClick}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/30 text-white font-semibold rounded-2xl px-5 py-2.5 text-sm transition-all"
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </button>
              </>
            )}
          </div>

          {/* MÓVIL: botón acción + hamburguesa */}
          <div className="md:hidden flex items-center gap-2">
            {action && (
              <button
                onClick={action.onClick}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl px-3 py-2 text-xs transition-all"
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </button>
            )}
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition"
            >
              {menuAbierto
                ? <X className="w-5 h-5 text-slate-700" />
                : <Menu className="w-5 h-5 text-slate-700" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {menuAbierto && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                {item.href ? (
                  <button
                    onClick={() => navigate(item.href!)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                      isActive(item)
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ) : (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <item.icon className="w-3.5 h-3.5" />
                      {item.label}
                    </p>
                    <div className="space-y-0.5 pl-3">
                      {item.children!.map((child) => (
                        <button
                          key={child.href}
                          onClick={() => navigate(child.href)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                            isChildActive(child.href)
                              ? "bg-blue-50 text-blue-600 font-semibold"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <child.icon className="w-4 h-4 shrink-0" />
                          {child.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Botón acción en menú móvil expandido */}
            {action && (
              <div className="pt-2 pb-1">
                <button
                  onClick={() => { action.onClick(); setMenuAbierto(false); }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl px-4 py-3 text-sm transition-all"
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}