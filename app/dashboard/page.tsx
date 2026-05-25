"use client";

import { useState, useEffect } from "react";
import { Home, Play, Sparkles, UploadCloud, Download, Loader2, Key, Layers, ArrowLeft, Users, PlayCircle, LogOut, Plus, Folder, Trash2, ChevronRight, ChevronDown, MessageSquare, ThumbsUp, Send, Library, Save, CheckCircle2, Minus, Bookmark, Palette, Type, Search, Edit3, Heart, Share2, Award, User, HelpCircle, Layout, Globe, TrendingUp, DollarSign, UserCheck, ShieldCheck, Video, X, Settings, Smile, Stethoscope, BookOpen, Newspaper, Calendar, Image, Camera, Box, ShieldAlert, Zap, Brain, Activity, ShieldOff, Target, Briefcase, Maximize2 } from "lucide-react";
import JSZip from "jszip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { imageDB } from "@/app/lib/db";
import Planner, { PlannerPost } from "./Planner";


const LIBRARY_OF_CLOSURES = [
    { cat: "Cierre Directo", text: "¿Te parece bien si te envío el enlace de pago ahora mismo para que aproveches la promoción?" },
    { cat: "Urgencia", text: "Solo me quedan 3 unidades con este descuento especial. ¿Aseguramos la tuya antes de que se agoten?" },
    { cat: "Escasez", text: "Esta oferta expira en menos de 2 horas. Después volverá a su precio original." },
    { cat: "Bono", text: "Si haces el pedido ahora, te incluiré un bono exclusivo de [BONO] totalmente gratis." }
];

const RESEARCH_MODULES = [
    { title: "Identidad y Esencia del Producto", desc: "Clasificación general, posicionamiento comercial y radiografía principal del artículo." },
    { title: "La Gran Promesa Transformadora", desc: "El cambio épico o resultado definitivo que el producto garantiza ofrecer." },
    { title: "Arsenal de Beneficios Específicos", desc: "Desglose exhaustivo de las mejoras físicas, emocionales, estéticas y prácticas." },
    { title: "Anatomía y Características Clave", desc: "Ingredientes, especificaciones técnicas, materiales y detalles constitutivos." },
    { title: "Naturaleza de la Solución", desc: "El enfoque estratégico: prevención, corrección, alivio, mantenimiento u optimización." },
    { title: "El Arma Secreta (Mecánica Funcional)", desc: "Cómo opera internamente y por qué es más eficaz que la competencia convencional." },
    { title: "Catálogo de Frustraciones a Resolver", desc: "Todas las molestias, problemas cotidianos y dolores de cabeza que elimina." },
    { title: "Aspiraciones y Deseos Profundos", desc: "Lo que realmente persigue el cliente: estatus social, bienestar, validación o lujo." },
    { title: "Picos de Dolor Emocional", desc: "La urgencia implacable o insatisfacción que obliga al consumidor a tomar acción inmediata." },
    { title: "Miedos y Preocupaciones Paralizantes", desc: "Temores sociales o inquietudes ocultas que los detienen al momento de elegir." },
    { title: "El Escenario Ideal (Santo Grial)", desc: "La victoria final y el triunfo impecable que el cliente espera con ansias." },
    { title: "Metamorfosis Exacta", desc: "El paso del estado actual hacia el resultado deseado en todos sus niveles posibles." },
    { title: "Contraste Dramático: Antes vs. Después", desc: "El contraste abismal entre su torturosa incomodidad y la nueva brillante realidad." },
    { title: "Núcleo del Valor Percibido", desc: "Dónde perciben la verdadera ganancia: ahorros de tiempo/dinero, eficiencia o prestigio." },
    { title: "Integración Sin Fricciones", desc: "El mejor paso a paso para consumirlo o aplicarlo en la rutina actual de forma automática." },
    { title: "Peligros y Fricciones de Uso", desc: "Posibles complicaciones o errores comunes que el marketing debe prever y limpiar." },
    { title: "Restricciones y Límites Importantes", desc: "Advertencias médicas, incompatibilidades de cuidado o perfiles donde no encaja." },
    { title: "Casillero Mental del Prospecto", desc: "Cómo se juzga inicialmente este producto comparado con su competencia." },
    { title: "Algoritmo Lógico de Compra", desc: "Los filtros racionales, comparativas de características, tiempos y garantías." },
    { title: "Eventos Gatillo de Alta Urgencia", desc: "Esa situación crucial en la vida que los hace sacar la tarjeta de crédito de inmediato." },
    { title: "Bloqueadores Mentales (Objeciones)", desc: "Excusas típicas para posponer y cómo despedazarlas al instante de forma creíble." },
    { title: "El Demonio Final (Barrera de Cierre)", desc: "El gran obstáculo o indecisión final en el check-out y cómo saltar esa pared." },
    { title: "Exigencia de Educación Comercial", desc: "La densidad y claridad que requerirá su Landing Page o material publicitario en vídeo." },
    { title: "Blindaje de Autoridad Absoluta", desc: "Respaldos clave, componentes patentados, demostraciones o asociaciones prestigiosas." },
    { title: "Blueprint de Testimonios Perfectos", desc: "El modelo ideal de reviews hiper-convincentes que necesitamos fabricar y mostrar." },
    { title: "Rapidez de Gratificación", desc: "El tiempo exacto de espera para sentir resultados y cómo retener toda su atención." },
    { title: "Ángulos Estratégicos Novedosos", desc: "Océanos azules absolutos y usos inusuales que la competencia ha ignorado." },
    { title: "El Botón Reptiliano Comercial", desc: "El pilar psicológico más primitivo que justifica esta compra impulsiva sin lugar a dudas." },
    { title: "Pitch de Ventas Ultra-Letal", desc: "La esencia destilada y venenosa en apenas tres frases para disparar alta atención." },
    { title: "Micro-Nichos Desesperados", desc: "Despiece quirúrgico de los nichos periféricos dispuestos a pagar ya mismo." }
];
const WA_CLIENT_TYPES = [
    "Escéptico e indeciso",
    "Impulsivo y con prisa",
    "Analítico y técnico",
    "Buscador de descuentos",
    "Emocional y soñador",
    "El que manda solo audios",
    "El 'Ya te aviso' (Desaparecido)",
    "Defensivo por malas experiencias",
    "El que necesita todo explicado con manzanas",
    "Profesional / Enfoque B2B"
];


const MASTER_KEY = "AIzaSyAaByLIiFQIcrBkzuObksCf3Fsx9Ss5PZw";

interface Project {
    id: string;
    name: string;
    productName?: string;
    targetAudience?: string;
    productPreview: string;
    userPrompt: string;
    results: { image: string, title?: string, copy?: string, angle: string, isLanding?: boolean }[];
    updatedAt: number;
    primaryColor?: string;
    secondaryColor?: string;
    font?: string;
    logoPreview?: string;
    personPreview?: string;
    type: 'ecommerce' | 'digital';
    idealSolution?: string;
    priceX1?: string;
    priceX2?: string;
    priceX3?: string;
    priceX4?: string; // New
    marcaId?: string; // Associated brand
    bonuses?: string;
    guarantees?: string;
    plannerPosts?: PlannerPost[];
    savedScripts?: any[];
    savedResearch?: any[];
    // States for Landing Page persistency
    landingCategory?: string;
    lPrice1?: string;
    lPrice2?: string;
    lPrice3?: string;
    lPrice4?: string;
    lBefore?: string;
    lAfter?: string;
    lBenefits?: string;
    lCompBrand?: string;
    lCompOthers?: string;
    lTest1?: string;
    lTest2?: string;
    lTest3?: string;
    lAuthExpert?: string;
    lAuthTitle?: string;
    lAuthQuote?: string;
    lUsage?: string;
    lLogistics?: string;
    lFaqs?: { q: string, a: string }[];
}

interface SavedAd {
    id: string;
    image: string;
    angle: string;
    projectName: string;
    savedAt: number;
    copy?: string;
}

interface Comment {
    id: string;
    author: string;
    authorAvatar: string;
    content: string;
    timestamp: number;
    isPinned?: boolean;
}

interface Post {
    id: string;
    author: string;
    authorAvatar: string;
    category: 'all' | 'presentacion' | 'soporte' | 'logros';
    content: string;
    timestamp: number;
    likes: number;
    likedByMe?: boolean;
    comments: Comment[];
    image?: string;
}

interface VideoContent {
    id: string;
    title: string;
    youtubeUrl: string;
    likes: number;
    likedByMe?: boolean;
    comments: Comment[];
}

interface Module {
    id: string;
    title: string;
    cover: string;
    videos: VideoContent[];
}

interface BibliotecaItem {
    id: string;
    image: string;
    type: 'creativo' | 'instagram' | 'studio';
    label: string;
    projectName?: string;
    savedAt: number;
}

const CANVA_PRESETS = [
    "#000000", "#FFFFFF", "#666666", "#999999", "#CCCCCC", "#EEEEEE",
    "#FF0000", "#FF9900", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#9900FF", "#FF00FF",
    "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50"
];

const GOOGLE_FONTS = [
    "Inter", "Poppins", "Montserrat", "Roboto", "Outfit", "Sora", "Lexend", "Archivo", "Syne", "Urbanist",
    "Jost", "Manrope", "Plus Jakarta Sans", "Space Grotesk", "DM Sans"
];

const INITIAL_POSTS: Post[] = [];

const getIconColor = (color?: string) => {
    if (!color) return "#fed627";
    try {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luma < 40 ? "#FFFFFF" : color;
    } catch {
        return color;
    }
};

export interface SavedBrand {
    id: string;
    nombre: string;
    logo?: string;
    colorPrimario?: string;
    creadoEn: string;
}

export interface SavedProduct {
    id: string;
    marcaId?: string;
    nombre: string;
    categoria: string;
    descripcion: string;
    precio: string;
    publico: string;
    tono: string;
    colorMarca: string;
    creadoEn: string;
    imagenes?: string[];
}

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);
    const [activeTab, setActiveTab] = useState<string>("dashboard");
    const [streakDays, setStreakDays] = useState(0);
    const [weekActivity, setWeekActivity] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [instagramDescription, setInstagramDescription] = useState("");
    const [instagramPosts, setInstagramPosts] = useState<any[]>([]);
    const [selectedProjectProducts, setSelectedProjectProducts] = useState<string[]>([]);
    const [productImageCounts, setProductImageCounts] = useState<Record<string, number>>({});
    const [isGeneratingInstagram, setIsGeneratingInstagram] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [apiKey, setApiKey] = useState("");
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const [selectedRatio, setSelectedRatio] = useState<'4:5' | '9:16' | 'both'>('both');

    // Novedad: Output Size & Language para Creativos
    const [selectedOutputSize, setSelectedOutputSize] = useState("1080x1350");
    const [isFinAIOn, setIsFinAIOn] = useState(false);
    const [finAIResult, setFinAIResult] = useState("");
    const [selectedOutputLanguage, setSelectedOutputLanguage] = useState("Español");

    // Instagram planner tab switcher (5 Posts | Carrusel)
    const [instagramPlannerTab, setInstagramPlannerTab] = useState<'posts' | 'carousel'>('posts');

    // Mis Marcas States
    const [savedBrands, setSavedBrands] = useState<SavedBrand[]>([]);
    const [activeBrandId, setActiveBrandId] = useState<string | null>(null);
    const [showNewBrandModal, setShowNewBrandModal] = useState(false);
    const [newBrandName, setNewBrandName] = useState("");
    const [newBrandColor, setNewBrandColor] = useState("#8B5CF6");
    const [newBrandLogo, setNewBrandLogo] = useState<string | null>(null);

    // Mis Productos States
    const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
    const [showNewProductModal, setShowNewProductModal] = useState(false);
    const [newProdName, setNewProdName] = useState("");
    const [newProdCategory, setNewProdCategory] = useState("Suplementos");
    const [newProdDesc, setNewProdDesc] = useState("");
    const [newProdPrice, setNewProdPrice] = useState("");
    const [newProdAudience, setNewProdAudience] = useState("");
    const [newProdTone, setNewProdTone] = useState("Profesional");
    const [newProdColor, setNewProdColor] = useState("#8B5CF6");
    const [newProdImages, setNewProdImages] = useState<string[]>([]);

    // Carousel States
    const [carouselTema, setCarouselTema] = useState("");
    const [carouselTono, setCarouselTono] = useState("Educativo");
    const [carouselNumSlides, setCarouselNumSlides] = useState(5);
    const [isGeneratingCarousel, setIsGeneratingCarousel] = useState(false);
    const [carouselData, setCarouselData] = useState<any | null>(null);
    const [carouselEditingSlide, setCarouselEditingSlide] = useState<any | null>(null);

    // Estados para Refinamiento de Piezas
    const [refiningIndex, setRefiningIndex] = useState<number | null>(null);
    const [refiningText, setRefiningText] = useState("");
    const [isRefining, setIsRefining] = useState(false);
    const [showLandingRefine, setShowLandingRefine] = useState(false);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [tutorialVideoOpen, setTutorialVideoOpen] = useState<string | null>(null);
    const [editingPost, setEditingPost] = useState<any | null>(null);

    const OUTPUT_SIZES = [
        { label: "Móvil Landing (447x800)", value: "447x800" },
        { label: "Original Vertical 4:5", value: "1080x1350" },
        { label: "Facebook/LinkedIn (1200x628)", value: "1.91:1" },
        { label: "Instagram Cuadrado (1080x1080)", value: "1:1" },
        { label: "Instagram Stories (1080x1920)", value: "9:16" },
        { label: "YouTube/HD (1920x1080)", value: "16:9" },
        { label: "Banner Medium (300x250)", value: "1.2:1" },
        { label: "Leaderboard (728x90)", value: "8:1" },
        { label: "Skyscraper (160x600)", value: "1:4" }
    ];
    const OUTPUT_LANGS = [
        "Español", "Inglés", "Portugués", "Francés", "Alemán",
        "Italiano", "Neerlandés", "Ruso", "Chino", "Japonés",
        "Coreano", "Árabe", "Hindi", "Turco", "Polaco"
    ];

    // Auth Protection RESTORED - Selective access check
    useEffect(() => {
        const storedProducts = localStorage.getItem("clickads_productos");
        if (storedProducts) {
            try {
                setSavedProducts(JSON.parse(storedProducts));
            } catch (e) {
                console.error("Error parsing saved products", e);
            }
        }

        const storedBrands = localStorage.getItem("clickads_marcas");
        if (storedBrands) {
            try {
                setSavedBrands(JSON.parse(storedBrands));
            } catch (e) {
                console.error("Error parsing saved brands", e);
            }
        }


        const savedUser = localStorage.getItem("clickads_user");
        if (!savedUser) {
            router.push("/login");
        } else {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Auth parse error:", e);
                localStorage.removeItem("clickads_user");
                router.push("/login");
            }
        }

        // Admin Mode state recovery
        const adminStatus = localStorage.getItem(getUKey("clickads_admin_mode")) === 'true';
        setIsAdmin(adminStatus);
    }, [router]);

    // Admin State (In a real app, this comes from auth/roles)
    const [isAdmin, setIsAdmin] = useState(false);
    const [secretKey, setSecretKey] = useState("");

    // Community States
    const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
    const [activeCategory, setActiveCategory] = useState<'all' | 'presentacion' | 'soporte' | 'logros'>('all');
    const [newPostContent, setNewPostContent] = useState("");
    const [newPostImage, setNewPostImage] = useState<string | null>(null);
    const [postingTo, setPostingTo] = useState<'presentacion' | 'soporte' | 'logros'>('presentacion');

    const [modules, setModules] = useState<Module[]>([
        {
            id: "1",
            title: "Módulo 1: Fundamentos",
            cover: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop",
            videos: [
                {
                    id: "v1",
                    title: "Introducción a PosteA",
                    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    likes: 15,
                    comments: []
                },
                {
                    id: "v2",
                    title: "Estrategia de Ventas",
                    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    likes: 12,
                    comments: []
                }
            ]
        }
    ]);

    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [selectedAngle, setSelectedAngle] = useState("HERO");
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

    const [showModuleModal, setShowModuleModal] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");
    const [newModuleCover, setNewModuleCover] = useState("");

    const [showVideoModal, setShowVideoModal] = useState(false);
    const [newVideoTitle, setNewVideoTitle] = useState("");
    const [newVideoUrl, setNewVideoUrl] = useState("");
    const [showApiModal, setShowApiModal] = useState(false);
    const [tempApiKey, setTempApiKey] = useState("");
    const activeProject = projects.find(p => p.id === activeProjectId) || null;

    const handleSaveBrand = () => {
        if (!newBrandName) {
            setToast({ msg: "El nombre de la marca es obligatorio", type: 'error' });
            return;
        }

        const newBrand: SavedBrand = {
            id: Math.random().toString(36).substr(2, 9),
            nombre: newBrandName,
            colorPrimario: newBrandColor,
            logo: newBrandLogo || undefined,
            creadoEn: new Date().toISOString().split('T')[0]
        };

        const updatedBrands = [...savedBrands, newBrand];
        setSavedBrands(updatedBrands);
        localStorage.setItem("clickads_marcas", JSON.stringify(updatedBrands));
        
        setShowNewBrandModal(false);
        setNewBrandName("");
        setNewBrandColor("#8B5CF6");
        setNewBrandLogo(null);
        setToast({ msg: "Marca guardada exitosamente", type: 'success' });
    };

    const handleDeleteBrand = (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar esta marca y todos sus productos?")) return;
        const updatedBrands = savedBrands.filter(b => b.id !== id);
        const updatedProducts = savedProducts.filter(p => p.marcaId !== id);
        
        setSavedBrands(updatedBrands);
        setSavedProducts(updatedProducts);
        
        localStorage.setItem("clickads_marcas", JSON.stringify(updatedBrands));
        localStorage.setItem("clickads_productos", JSON.stringify(updatedProducts));
        setToast({ msg: "Marca eliminada", type: 'success' });
        
        if (activeBrandId === id) setActiveBrandId(null);
    };

    const handleSaveProduct = () => {
        if (!newProdName || !newProdDesc) {
            setToast({ msg: "El nombre y la descripción son obligatorios", type: 'error' });
            return;
        }

        const newProduct: SavedProduct = {
            id: Math.random().toString(36).substr(2, 9),
            marcaId: activeBrandId || undefined,
            nombre: newProdName,
            categoria: newProdCategory,
            descripcion: newProdDesc,
            precio: newProdPrice,
            publico: newProdAudience,
            tono: newProdTone,
            colorMarca: newProdColor,
            creadoEn: new Date().toISOString().split('T')[0],
            imagenes: newProdImages
        };

        const updatedProducts = [...savedProducts, newProduct];
        setSavedProducts(updatedProducts);
        localStorage.setItem("clickads_productos", JSON.stringify(updatedProducts));
        
        setShowNewProductModal(false);
        setNewProdName("");
        setNewProdDesc("");
        setNewProdPrice("");
        setNewProdAudience("");
        setNewProdImages([]);
        setToast({ msg: "Producto guardado exitosamente", type: 'success' });
    };

    const handleDeleteProduct = (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
        const updatedProducts = savedProducts.filter(p => p.id !== id);
        setSavedProducts(updatedProducts);
        localStorage.setItem("clickads_productos", JSON.stringify(updatedProducts));
        setToast({ msg: "Producto eliminado", type: 'success' });
    };

    const buildProductPrompt = (p: SavedProduct) => {
        return `PRODUCTO: ${p.nombre}\nDESCRIPCIÓN: ${p.descripcion}\nCATEGORÍA: ${p.categoria}\nPÚBLICO OBJETIVO: ${p.publico}\nTONO: ${p.tono}\nPRECIO: ${p.precio}`;
    };

    const handleGeneratePostsFromProduct = (product: SavedProduct) => {
        setInstagramDescription(buildProductPrompt(product));
        setInstagramPlannerTab('posts');
    };

    const handleGenerateCarouselFromProduct = (product: SavedProduct) => {
        setCarouselTema(buildProductPrompt(product));
        setCarouselTono(product.tono);
        setInstagramPlannerTab('carousel');
    };

    const [generatingCopyIndex, setGeneratingCopyIndex] = useState<number | null>(null);

    // Clinics States
    const [clinicBefore, setClinicBefore] = useState<string | null>(null);
    const [clinicAfter, setClinicAfter] = useState<string | null>(null);
    const [clinicTreatment, setClinicTreatment] = useState("");
    const [clinicResults, setClinicResults] = useState<{ image: string, angle: string }[]>([]);
    const [isClinicLoading, setIsClinicLoading] = useState(false);
    const [selectedClinicAngle, setSelectedClinicAngle] = useState("ALL");

    // Digital Products States
    const [digitalPerson, setDigitalPerson] = useState<string | null>(null);
    const [digitalProduct, setDigitalProduct] = useState<string | null>(null);
    const [digitalLogo, setDigitalLogo] = useState<string | null>(null);
    const [digitalPrompt, setDigitalPrompt] = useState("");
    const [digitalResults, setDigitalResults] = useState<{ image: string, angle: string }[]>([]);
    const [isDigitalLoading, setIsDigitalLoading] = useState(false);
    const [selectedDigitalAngle, setSelectedDigitalAngle] = useState("ALL");

    // Logo Generator States
    const [logoBusinessName, setLogoBusinessName] = useState("");
    const [logoSector, setLogoSector] = useState("");
    const [logoPrimaryColor, setLogoPrimaryColor] = useState("#fed627");
    const [logoSecondaryColor, setLogoSecondaryColor] = useState("#FFFFFF");
    const [logoStep, setLogoStep] = useState(0); // 0: Form, 1: Result & Iteration
    const [likedLogos, setLikedLogos] = useState<string[]>([]);
    const [finalLogo, setFinalLogo] = useState<string | null>(null);
    const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
    const [logoLikedFeedback, setLogoLikedFeedback] = useState("");
    const [logoDislikedFeedback, setLogoDislikedFeedback] = useState("");





    // Landing Page States
    const [landingCategory, setLandingCategory] = useState('Hero');
    const [landingResults, setLandingResults] = useState<{ image: string, angle: string } | null>(null);
    const [isLandingLoading, setIsLandingLoading] = useState(false);
    const [lPrice1, setLPrice1] = useState("");
    const [lPrice2, setLPrice2] = useState("");
    const [lPrice3, setLPrice3] = useState("");
    const [lPrice4, setLPrice4] = useState("");
    const [lBefore, setLBefore] = useState("");
    const [lAfter, setLAfter] = useState("");
    const [lBenefits, setLBenefits] = useState("");
    const [lCompBrand, setLCompBrand] = useState("");
    const [lCompOthers, setLCompOthers] = useState("");
    const [lTest1, setLTest1] = useState("");
    const [lTest2, setLTest2] = useState("");
    const [lTest3, setLTest3] = useState("");
    const [lAuthExpert, setLAuthExpert] = useState("");
    const [lAuthTitle, setLAuthTitle] = useState("");
    const [lAuthQuote, setLAuthQuote] = useState("");
    const [lUsage, setLUsage] = useState("");
    const [lLogistics, setLLogistics] = useState("");
    const [lFaqs, setLFaqs] = useState(Array(10).fill({ q: "", a: "" }));

    // ===== ANÁLISIS FINANCIERO STATES =====
    const [finFleteIda, setFinFleteIda] = useState("15000");
    const [finFleteDevolucion, setFinFleteDevolucion] = useState("0");
    const [finRecaudo, setFinRecaudo] = useState("3");
    const [finGastosFijos, setFinGastosFijos] = useState("5000000");
    const [finOrdenesMensuales, setFinOrdenesMensuales] = useState("1000");
    const [finPrecioCOD, setFinPrecioCOD] = useState("79900");
    const [finCostoProducto, setFinCostoProducto] = useState("15000");
    const [finCancelaciones, setFinCancelaciones] = useState("15");
    const [finDevoluciones, setFinDevoluciones] = useState("30");
    const [finGarantias, setFinGarantias] = useState("1");
    const [finChargebacks, setFinChargebacks] = useState("0.5");
    const [finCPAObjetivo, setFinCPAObjetivo] = useState("23");
    const [finUtilidad, setFinUtilidad] = useState("25");
    const [finMoneda, setFinMoneda] = useState("COP");
    const [finCalculado, setFinCalculado] = useState(false);
    const [finSnapshot, setFinSnapshot] = useState<any>(null);
    const FIN_MONEDAS = [
        { code: 'COP', label: '🇨🇴 COP – Peso Colombiano', symbol: '$' },
        { code: 'USD', label: '🇺🇸 USD – Dólar Americano', symbol: '$' },
        { code: 'EUR', label: '🇪🇺 EUR – Euro', symbol: '€' },
        { code: 'MXN', label: '🇲🇽 MXN – Peso Mexicano', symbol: '$' },
        { code: 'PEN', label: '🇵🇪 PEN – Sol Peruano', symbol: 'S/' },
        { code: 'ARS', label: '🇦🇷 ARS – Peso Argentino', symbol: '$' },
        { code: 'BRL', label: '🇧🇷 BRL – Real Brasileño', symbol: 'R$' },
        { code: 'CLP', label: '🇨🇱 CLP – Peso Chileno', symbol: '$' },
        { code: 'GTQ', label: '🇬🇹 GTQ – Quetzal Guatemalteco', symbol: 'Q' },
        { code: 'HNL', label: '🇭🇳 HNL – Lempira Hondureño', symbol: 'L' },
    ];
    // Financial Helpers & Logic
    const fmt = (v: any) => new Intl.NumberFormat().format(Math.round(Number(v) || 0));
    const fmtPct = (v: any) => (Number(v) || 0).toFixed(1) + '%';
    const snap = finSnapshot;
    const liveGastoAdmin = Number(finOrdenesMensuales) > 0 ? (Number(finGastosFijos) / Number(finOrdenesMensuales)) : 0;

    const calcular = () => {
        const pVenta = Number(finPrecioCOD);
        const cProd = Number(finCostoProducto);
        const fIda = Number(finFleteIda);
        const fDev = Number(finFleteDevolucion);
        const pRec = Number(finRecaudo) / 100;
        const oMens = Number(finOrdenesMensuales);
        const gFijos = Number(finGastosFijos);

        const pCan = Number(finCancelaciones) / 100;
        const pDevol = Number(finDevoluciones) / 100;
        const pGar = Number(finGarantias) / 100;
        const pChar = Number(finChargebacks) / 100;
        const pCpa = Number(finCPAObjetivo) / 100;

        const costoRecaudo = pVenta * pRec;
        const costoCPA = pVenta * pCpa;
        const gastoAdmin = oMens > 0 ? gFijos / oMens : 0;
        const costoGarantias = cProd * pGar;
        const costoChargebacks = pVenta * pChar;
        const costoFleteTotal = fIda + (pDevol * fDev);

        const entregadas = 1 - pCan - pDevol;
        const ingresoPorVenta = pVenta * entregadas;
        const totalCostos = costoFleteTotal + cProd + costoRecaudo + gastoAdmin + costoCPA + costoGarantias + costoChargebacks;

        const utilidadNeta = ingresoPorVenta - totalCostos;
        const margenReal = pVenta > 0 ? (utilidadNeta / pVenta) * 100 : 0;
        const utilidadMensualBruta = utilidadNeta * oMens;
        const roiMensual = totalCostos > 0 ? (utilidadNeta / totalCostos) * 100 : 0;

        const preciosOptimos = [
            { margen: 15, precio: totalCostos / (entregadas - 0.15) },
            { margen: 25, precio: totalCostos / (entregadas - 0.25) },
            { margen: 35, precio: totalCostos / (entregadas - 0.35) },
            { margen: 45, precio: totalCostos / (entregadas - 0.45), label: 'Recomendado' }
        ];

        setFinSnapshot({
            utilidadNeta,
            margenReal,
            utilidadMensualBruta,
            roiMensual,
            costoProd: cProd,
            gastoAdmin,
            costoRecaudo,
            costoFleteTotal,
            costoCPA,
            costoGarantias,
            costoChargebacks,
            totalCostos,
            precioCOD: pVenta,
            preciosOptimos,
            precioSugerido: preciosOptimos[3].precio,
            moneda: finMoneda,
            sym: FIN_MONEDAS.find(m => m.code === finMoneda)?.symbol || '$'
        });
        setFinCalculado(true);
        setToast({ msg: "Análisis financiero calculado", type: 'success' });
    };

    const handleGenerateFinAI = async () => {
        if (!snap) return;
        setIsFinAIOn(true);
        try {
            const prompt = `Analiza estos números financieros de un negocio de E-commerce (COD):
            - Precio: ${snap.sym}${fmt(snap.precioCOD)}
            - Costo Producto: ${snap.sym}${fmt(snap.costoProd)}
            - Utilidad Neta: ${snap.sym}${fmt(snap.utilidadNeta)}
            - Margen Real: ${fmtPct(snap.margenReal)}
            - ROI Mensual: ${fmtPct(snap.roiMensual)}
            
            Dame 3 consejos estratégicos breves para mejorar la rentabilidad.`;

            const res = await fetch("/api/vertex-ai/generate-text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, systemPrompt: "Eres un analista financiero experto en E-commerce." })
            });
            const data = await res.json();
            if (data.success) {
                setFinAIResult(data.result);
                setToast({ msg: "Estrategia generada con éxito", type: 'success' });
            }
        } catch (e: any) {
            setToast({ msg: "Error en IA Financiera: " + e.message, type: 'error' });
        } finally {
            setIsFinAIOn(false);
        }
    };

    // Photo Studio States
    const [studioInputImage, setStudioInputImage] = useState<string | null>(null);
    const [isStudioLoading, setIsStudioLoading] = useState(false);
    const [studioResults, setStudioResults] = useState<{ image: string, angle: string }[]>([]);

    // Biblioteca State
    const [bibliotecaItems, setBibliotecaItems] = useState<BibliotecaItem[]>([]);
    const [bibliotecaFilter, setBibliotecaFilter] = useState<'all' | 'creativo' | 'instagram' | 'studio'>('all');
    const [bibliotecaZoom, setBibliotecaZoom] = useState<BibliotecaItem | null>(null);

    // Save to biblioteca helper
    const saveToBiblioteca = (image: string, type: BibliotecaItem['type'], label: string, projectName?: string) => {
        const newItem: BibliotecaItem = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            image,
            type,
            label,
            projectName,
            savedAt: Date.now()
        };
        setBibliotecaItems(prev => {
            const updated = [newItem, ...prev];
            const userId = (user as any)?.email || "global";
            imageDB.saveBiblioteca(userId, updated).catch(err => {
                console.error("Error saving to IndexedDB library:", err);
            });
            try {
                localStorage.setItem('postea_biblioteca', JSON.stringify(updated));
            } catch (e) {
                console.warn("Storage quota exceeded in localStorage, saved only in IndexedDB");
            }
            return updated;
        });
    };

    const deleteFromBiblioteca = (id: string) => {
        setBibliotecaItems(prev => {
            const updated = prev.filter(item => item.id !== id);
            const userId = (user as any)?.email || "global";
            imageDB.saveBiblioteca(userId, updated).catch(err => {
                console.error("Error deleting from IndexedDB library:", err);
            });
            try {
                localStorage.setItem('postea_biblioteca', JSON.stringify(updated));
            } catch (e) {}
            return updated;
        });
    };

    // Research States
    const [researchName, setResearchName] = useState("");
    const [researchDescription, setResearchDescription] = useState("");
    const [isResearchLoading, setIsResearchLoading] = useState(false);
    const [researchResults, setResearchResults] = useState<string[] | null>(null);
    const [expandedResearch, setExpandedResearch] = useState<number | null>(0);
    const [researchHistory, setResearchHistory] = useState<{ id: string; name: string; description: string; date: string; results: string[] }[]>([]);
    const [isEvaluatingWa, setIsEvaluatingWa] = useState(false);
    const [waSimEvaluation, setWaSimEvaluation] = useState<any | null>(null);
    const [waSimMessages, setWaSimMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [waSimInput, setWaSimInput] = useState("");
    const [waSimClientType, setWaSimClientType] = useState("Escéptico e indeciso");
    const [isWaSimLoading, setIsWaSimLoading] = useState(false);
    const [objectionProductName, setObjectionProductName] = useState("");
    const [objectionTargetAudience, setObjectionTargetAudience] = useState("");
    const [manualObjections, setManualObjections] = useState("");
    const [isObjectionLoading, setIsObjectionLoading] = useState(false);
    const [objectionResults, setObjectionResults] = useState<{ objection: string, hiddenFear: string, script: string, psychology: string }[] | null>(null);



    useEffect(() => {
        if (activeTab === 'landing') {
            setSelectedOutputSize("447x800");
        }
    }, [activeTab]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Track streak and weekly activity
    useEffect(() => {
        if (!user) return;
        const streakKey = getUKey('clickads_streak');
        const weekKey = getUKey('clickads_week_activity');
        const savedStreak = localStorage.getItem(streakKey);
        const savedWeek = localStorage.getItem(weekKey);
        if (savedStreak) setStreakDays(parseInt(savedStreak, 10));
        if (savedWeek) { try { setWeekActivity(JSON.parse(savedWeek)); } catch (e) { } }
    }, [user]);

    // Library State
    const [library, setLibrary] = useState<SavedAd[]>([]);
    const [libProjectFilter, setLibProjectFilter] = useState("all");

    // Helper for unique storage
    const getUKey = (base: string) => user ? `${base}_${user.email}` : base;

    useEffect(() => {
        if (!user) return;

        // Cargar API Key (Primero por usuario, luego Global como fallback)
        const savedKey = localStorage.getItem(getUKey("clickads_api_key")) || localStorage.getItem("clickads_api_key_global");
        if (savedKey) {
            setApiKey(savedKey);
            setTempApiKey(savedKey);
        }

        const adminStatus = localStorage.getItem(getUKey("clickads_admin_mode")) === 'true';
        setIsAdmin(adminStatus);

        // Cargar Proyectos (IndexedDB con fallback a LocalStorage)
        const loadProjects = async () => {
            const userId = (user as any).email || "global";
            const idbProjects = await imageDB.getProjects(userId);

            if (idbProjects && idbProjects.length > 0) {
                setProjects(idbProjects);
            } else {
                // Fallback a localStorage para migración inicial
                const savedProjects = localStorage.getItem(getUKey("clickads_projects"));
                const legacyProjects = localStorage.getItem("clickads_projects");

                let found: Project[] = [];
                if (savedProjects) {
                    try { found = JSON.parse(savedProjects); } catch (e) { console.error(e); }
                } else if (legacyProjects && user?.email) {
                    try { found = JSON.parse(legacyProjects); } catch (e) { console.error(e); }
                }

                if (found.length > 0) {
                    setProjects(found);
                    // Migrar a IndexedDB inmediatamente
                    await imageDB.saveProjects(userId, found);
                    // Opcional: limpiar localStorage gradualmente o dejarlo hasta estar seguros
                } else {
                    setProjects([]);
                }
            }
        };
        loadProjects();

        // Cargar Biblioteca (IndexedDB)
        const loadLib = async () => {
            const userId = (user as any).email || "global";
            const idbLib = await imageDB.getLibrary(userId);
            if (idbLib && idbLib.length > 0) {
                setLibrary(idbLib);
            } else {
                const savedLib = localStorage.getItem(getUKey("clickads_library"));
                if (savedLib) {
                    try {
                        const parsed = JSON.parse(savedLib);
                        setLibrary(parsed);
                        await imageDB.saveLibrary(userId, parsed);
                    } catch (e) { console.error(e); }
                } else {
                    setLibrary([]);
                }
            }
        };
        loadLib();

        // Cargar Biblioteca Items de Postea (IndexedDB)
        const loadPosteaBiblioteca = async () => {
            const userId = (user as any).email || "global";
            const idbBib = await imageDB.getBiblioteca(userId);
            if (idbBib && idbBib.length > 0) {
                setBibliotecaItems(idbBib);
            } else {
                const savedBib = localStorage.getItem('postea_biblioteca');
                if (savedBib) {
                    try {
                        const parsed = JSON.parse(savedBib);
                        setBibliotecaItems(parsed);
                        await imageDB.saveBiblioteca(userId, parsed);
                    } catch (e) { console.error(e); }
                } else {
                    setBibliotecaItems([]);
                }
            }
        };
        loadPosteaBiblioteca();

        const savedPhoto = localStorage.getItem(getUKey("clickads_user_photo")) || (user as any)?.photo;
        if (savedPhoto) setUserPhoto(savedPhoto);
        else setUserPhoto(null);

        const savedResearch = localStorage.getItem(getUKey("clickads_research_history"));
        if (savedResearch) {
            try { setResearchHistory(JSON.parse(savedResearch)); } catch (e) { }
        }

        const savedPosts = localStorage.getItem("clickads_community_posts");
        if (savedPosts) {
            try { setPosts(JSON.parse(savedPosts)); } catch (e) { console.error(e); }
        }
    }, [user]);

    // Synchronize local states with active project to ensure isolation
    useEffect(() => {
        setInstagramDescription("");
        setInstagramPosts([]);
        if (!activeProject) {
            // Reset states if no project is active
            setLandingCategory('Hero');
            setLPrice1(""); setLPrice2(""); setLPrice3(""); setLPrice4("");
            setLBefore(""); setLAfter(""); setLBenefits("");
            setLCompBrand(""); setLCompOthers("");
            setLTest1(""); setLTest2(""); setLTest3("");
            setLAuthExpert(""); setLAuthTitle(""); setLAuthQuote("");
            setLUsage(""); setLLogistics("");
            setLFaqs(Array(10).fill({ q: "", a: "" }));
            setLandingResults(null);
            return;
        }

        setLandingCategory(activeProject.landingCategory || 'Hero');
        setLPrice1(activeProject.lPrice1 || "");
        setLPrice2(activeProject.lPrice2 || "");
        setLPrice3(activeProject.lPrice3 || "");
        setLPrice4(activeProject.lPrice4 || "");
        setLBefore(activeProject.lBefore || "");
        setLAfter(activeProject.lAfter || "");
        setLBenefits(activeProject.lBenefits || "");
        setLCompBrand(activeProject.lCompBrand || "");
        setLCompOthers(activeProject.lCompOthers || "");
        setLTest1(activeProject.lTest1 || "");
        setLTest2(activeProject.lTest2 || "");
        setLTest3(activeProject.lTest3 || "");
        setLAuthExpert(activeProject.lAuthExpert || "");
        setLAuthTitle(activeProject.lAuthTitle || "");
        setLAuthQuote(activeProject.lAuthQuote || "");
        setLUsage(activeProject.lUsage || "");
        setLLogistics(activeProject.lLogistics || "");
        setLFaqs(activeProject.lFaqs || Array(10).fill({ q: "", a: "" }));

    }, [activeProjectId]);

    // Persistencia de Proyectos con IndexedDB (Capacidad Ilimitada)
    useEffect(() => {
        if (user && projects.length > 0) {
            const userId = (user as any).email || "global";
            imageDB.saveProjects(userId, projects);
        }
    }, [projects, user]);

    // Persistencia de Biblioteca (Capacidad Ilimitada)
    useEffect(() => {
        if (user && library.length > 0) {
            const userId = (user as any).email || "global";
            imageDB.saveLibrary(userId, library);
        }
    }, [library, user]);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            const res = event.target?.result as string;
            setUserPhoto(res);
            localStorage.setItem(getUKey("clickads_user_photo"), res);

            setToast({ msg: "Foto de perfil actualizada", type: 'success' });
        };
        reader.readAsDataURL(file);
    };

    const getAvatarUrl = () => {
        if (userPhoto) return userPhoto;
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`;
    };

    const toggleAdmin = () => {
        if (secretKey === "CLICKADS2025") { // Llave secreta para activar modo admin
            const newAdminStatus = !isAdmin;
            setIsAdmin(newAdminStatus);
            localStorage.setItem(getUKey("clickads_admin_mode"), newAdminStatus.toString());
            setToast({ msg: newAdminStatus ? "Modo Administrador Activo" : "Modo Usuario Activo", type: 'success' });
            setSecretKey("");
        } else {
            setToast({ msg: "Clave incorrecta", type: 'error' });
        }
    };

    const deletePost = (id: string) => {
        if (!isAdmin) return;
        const newPosts = posts.filter(p => p.id !== id);
        setPosts(newPosts);
        localStorage.setItem("clickads_community_posts", JSON.stringify(newPosts));
        setToast({ msg: "Publicación eliminada", type: 'success' });
    };

    const deleteModule = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!isAdmin) return;
        setModules(prev => prev.filter(m => m.id !== id));
        setToast({ msg: "Módulo eliminado", type: 'success' });
    };

    const deleteVideo = (moduleId: string, videoId: string) => {
        if (!isAdmin) return;
        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, videos: m.videos.filter(v => v.id !== videoId) } : m));
        setToast({ msg: "Video eliminado", type: 'success' });
    };

    const handleModuleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            setNewModuleCover(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const addModule = () => {
        if (!newModuleTitle.trim()) return;
        const newModule: Module = {
            id: Math.random().toString(),
            title: newModuleTitle,
            cover: newModuleCover || "https://images.unsplash.com/photo-1557833006-c9f403002771?w=800",
            videos: []
        };
        setModules([...modules, newModule]);
        setShowModuleModal(false);
        setNewModuleTitle("");
        setNewModuleCover("");
        setToast({ msg: "Módulo creado", type: 'success' });
    };

    const addVideoToModule = (moduleId: string) => {
        if (!newVideoTitle.trim() || !newVideoUrl.trim()) return;

        // Convert youtube link to embed link if needed
        let embedUrl = newVideoUrl;
        if (newVideoUrl.includes("watch?v=")) {
            embedUrl = newVideoUrl.replace("watch?v=", "embed/");
        } else if (newVideoUrl.includes("youtu.be/")) {
            embedUrl = newVideoUrl.replace("youtu.be/", "youtube.com/embed/");
        }

        const newVid: VideoContent = {
            id: Math.random().toString(),
            title: newVideoTitle,
            youtubeUrl: embedUrl,
            likes: 0,
            comments: []
        };

        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, videos: [...m.videos, newVid] } : m));
        setShowVideoModal(false);
        setNewVideoTitle("");
        setNewVideoUrl("");
        setToast({ msg: "Video añadido", type: 'success' });
    };

    const toggleVideoLike = (moduleId: string, videoId: string) => {
        setModules(prev => prev.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    videos: m.videos.map(v => {
                        if (v.id === videoId) {
                            const liked = !v.likedByMe;
                            return { ...v, likedByMe: liked, likes: liked ? v.likes + 1 : v.likes - 1 };
                        }
                        return v;
                    })
                };
            }
            return m;
        }));
    };

    const addVideoComment = (moduleId: string, videoId: string, content: string) => {
        if (!content.trim()) return;
        const newComment: Comment = {
            id: Math.random().toString(),
            author: user?.name || "Usuario",
            authorAvatar: getAvatarUrl(),
            content: content,
            timestamp: Date.now()
        };
        setModules(prev => prev.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    videos: m.videos.map(v => v.id === videoId ? { ...v, comments: [...v.comments, newComment] } : v)
                };
            }
            return m;
        }));
    };

    // Placeholder data for Admin Dashboard
    const adminStats = {
        activeClients: 142,
        mrr: 2840,
        mrrGrowth: "+12%",
        newClientsToday: 5
    };

    const [projectNameInput, setProjectNameInput] = useState("");
    const [productNameInput, setProductNameInput] = useState("");
    const [targetAudienceInput, setTargetAudienceInput] = useState("");
    const [selectedPrimary, setSelectedPrimary] = useState("#fed627");
    const [selectedSecondary, setSelectedSecondary] = useState("#FFFFFF");
    const [selectedFont, setSelectedFont] = useState("Inter");
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [newProjectPreview, setNewProjectPreview] = useState<string | null>(null);
    const [newProjectLogo, setNewProjectLogo] = useState<string | null>(null);
    const [newProjectPerson, setNewProjectPerson] = useState<string | null>(null);
    const [newProjectType, setNewProjectType] = useState<'ecommerce' | 'digital'>('ecommerce');
    const [newProjectMarcaId, setNewProjectMarcaId] = useState<string>("");
    const [idealSolutionInput, setIdealSolutionInput] = useState("");
    const [bonusesInput, setBonusesInput] = useState("");
    const [guaranteesInput, setGuaranteesInput] = useState("");

    const createProject = () => {
        if (!projectNameInput.trim()) return;
        const newProject: Project = {
            id: Math.random().toString(36).substr(2, 9),
            name: projectNameInput,
            productName: productNameInput,
            targetAudience: targetAudienceInput,
            productPreview: newProjectPreview || "",
            userPrompt: "",
            marcaId: newProjectMarcaId,
            results: [],
            updatedAt: Date.now(),
            primaryColor: selectedPrimary,
            secondaryColor: selectedSecondary,
            font: selectedFont,
            logoPreview: newProjectLogo || "",
            personPreview: newProjectPerson || "",
            type: newProjectType,
            idealSolution: idealSolutionInput,
            bonuses: bonusesInput,
            guarantees: guaranteesInput
        };
        const newProjects = [newProject, ...projects];
        setProjects(newProjects);
        setActiveProjectId(newProject.id);
        setProjectNameInput("");
        setProductNameInput("");
        setTargetAudienceInput("");
        setNewProjectPreview(null);
        setNewProjectLogo(null);
        setNewProjectPerson(null);
        setNewProjectMarcaId("");
        setIdealSolutionInput("");
        setBonusesInput("");
        setGuaranteesInput("");
        setShowProjectModal(false);
    };

    const deleteProject = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("¿Eliminar proyecto?")) return;
        const newProjects = projects.filter(p => p.id !== id);
        setProjects(newProjects);
        if (activeProjectId === id) setActiveProjectId(null);
    };

    const updateActiveProject = (updates: Partial<Project>) => {
        if (!activeProjectId) return;
        const newProjects = projects.map(p => {
            if (p.id === activeProjectId) {
                const merged = { ...p, ...updates, updatedAt: Date.now() };
                return merged;
            }
            return p;
        });
        setProjects(newProjects);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => updateActiveProject({ productPreview: reader.result as string });
        reader.readAsDataURL(file);
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => updateActiveProject({ logoPreview: reader.result as string });
        reader.readAsDataURL(file);
    };



    const handleGenerate = async (angleId?: string, count: number = 1) => {
        if (!apiKey) {
            setToast({ msg: "⚠️ Configura tu API Key en la pestaña de Configuración para activar la IA", type: 'error' });
            return;
        }
        if (!activeProject?.productPreview) {
            setToast({ msg: "Sube una foto de producto primero", type: 'error' });
            return;
        }
        setIsLoading(true);
        updateActiveProject({ results: [] });

        const outputLang = selectedOutputLanguage || "ESPAÑOL";
        const logoInstruction = activeProject.logoPreview ? " YOU MUST INTEGRATE THE LOGO: Use the provided second image as the brand logo. Position it professionally." : "";

        const brandingContext = ` PRODUCT: "${activeProject.productName || 'unknown'}". TARGET AUDIENCE: "${activeProject.targetAudience || 'general'}". ${logoInstruction} VISUAL THEME: Use the colors ${activeProject.primaryColor || "luxury"} and ${activeProject.secondaryColor || "neutral"} for backgrounds and accents. 
        CRITICAL RULES for TEXT AND TYPOGRAPHY: 
        1. BAN ON META-TEXT: DO NOT RENDER "${activeProject.primaryColor}" OR "${activeProject.secondaryColor}" AS TEXT.
        2. NO TECHNICAL LABELS: NEVER write "CABECERA", "SUBTITULAR", "TITULAR", etc.
        3. REGLA DE IDIOMA Y PRECISIÓN (MÁXIMA PRIORIDAD): TODO EL TEXTO DEBE ESTAR 100% EN ESPAÑOL. Usa el nombre exacto del producto. NUNCA uses sinónimos incorrectos (ej: no uses "GORRO" si el producto es un "SOMBRERO"). Usa ortografía perfecta. No escribas "INSCRÁLA AT ACIÓN" ni palabras inventadas.
        4. FONT STYLE: USE VERY BOLD, CLEAN SANS-SERIF fonts.
        5. NO OFFERS OR PRICES: Never render discounts, prices, percent offs, sales, or promotional offer badges on the image.
        6. EXACT PRODUCT: The product in the generated image must look exactly like the product in the input image. Do not change the label design, container type, brand details, or overall appearance.`;

        const allAdTypes = [
            { id: "TESTIMONIAL", name: "TESTIMONIAL", style: "Cinematic professional product photography with dramatic commercial lighting.", goal: `Añadir 2-3 burbujas de testimonios elegantes con FOTOGRAFÍAS REALES DE PERSONAS. Texto corto en ${outputLang}.` },
            { id: "SALES_CTA", name: "SALES_CTA", style: "Urban premium lifestyle editorial photography.", goal: `Incluir un titular impactante en ${outputLang} relacionado con el producto. Añadir un botón flotante moderno.` },
            { id: "BENEFITS", name: "BENEFITS", style: "Clean luxury minimalist showroom.", goal: `Resaltar 3 beneficios clave del producto "${activeProject.productName || 'de la imagen'}" para el público "${activeProject.targetAudience || 'general'}" usando iconos minimalistas en ${outputLang}.` },
            { id: "INFOGRAPHIC", name: "INFOGRAPHIC", style: "Flat-lay professional editorial layout.", goal: `Crear una infografía premium. Señalar 3-4 características REALES. Texto breve en ${outputLang}.` },
            { id: "BEFORE_AFTER", name: "BEFORE_AFTER", style: "Cinematic ultra-high conversion split-screen comparison.", goal: `Diseño 'ANTES/DESPUÉS' impactante. Lado izquierdo "ANTES" (problema) y Lado derecho "DESPUÉS" (éxito). Producto en el centro.` },
            { id: "HERO", name: "HERO", style: "Premium high-energy lifestyle advertising photography.", goal: `Diseño 'HERO': Titular GIGANTE en ${outputLang}, 3 beneficios con checks, badges de "ENVÍO SEGURO", y persona feliz.` },
            { id: "LIFESTYLE_ELITE", name: "LIFESTYLE_ELITE", style: "Premium cinematic gym or lifestyle setting.", goal: `Diseño 'LIFESTYLE PREMIUN': Titular GIGANTE y ENÉRGICO. Producto en primer plano. Lista de 6 beneficios cortos.` },
            { id: "WHAT_IS_IT_FOR", name: "WHAT_IS_IT_FOR", style: "Clean minimalist studio photography.", goal: `Diseño 'PARA QUÉ SIRVE': Escribir "¿PARA QUÉ SIRVE?" en letras grandes. Lista vertical del 1 al 5. Producto a la derecha.` },
            { id: "PROBLEM_QUESTION", name: "PROBLEM_QUESTION", style: "High-energy cinematic background.", goal: `Diseño 'PREGUNTA PROBLEMA': Una PREGUNTA GIGANTE e IMPACTANTE sobre un dolor del usuario. Lista de 4 beneficios.` },
            { id: "END_OF_PROBLEM", name: "END_OF_PROBLEM", style: "High-voltage cinematic background.", goal: `Diseño 'EL FIN DE TU PROBLEMA': Escribir "EL FIN DE [PROBLEMA]" en letras blancas ultra-gruesas. 4 iconos de beneficios.` },
            { id: "OVERCOME_LIMITS", name: "OVERCOME_LIMITS", style: "High-exposure energetic clean studio layout.", goal: `Diseño 'SUPERA TUS LÍMITES': Escribir "SUPERA TUS LÍMITES" en letras GIGANTES. Banner con frase de beneficio.` },
            { id: "TRANSFORMATION", name: "TRANSFORMATION", style: "Elite graphic comparison layout.", goal: `Diseño 'TRANSFORMACIÓN': Escribir "TRANSFORMA TU VIDA". Comparativa con "ANTES" y "DESPUÉS" muy contrastados.` },
            { id: "BEST_FRIEND", name: "BEST_FRIEND", style: "Infographic-style photographic layout.", goal: `Diseño 'TU MEJOR AMIGO': Mostrar 3 pasos de uso con fotos pequeñas. 4 beneficios cortos resaltados.` },
            { id: "WHY_IS_IT_SPECIAL", name: "WHY_IS_IT_SPECIAL", style: "Elite product showcase with minimalist architecture.", goal: `¿POR QUÉ ES TAN ESPECIAL? en letras GIGANTES. Producto en un pedestal. Lista de 4 beneficios a la derecha.` },
            { id: "PROBLEM_VS_SOLUTION", name: "PROBLEM_VS_SOLUTION", style: "Clean vertical split layout.", goal: `Diseño 'PROBLEMA VS SOLUCIÓN': División vertical. Lado IZQ con problemas, lado DER con solución y persona feliz.` },
            { id: "COMPARISON", name: "COMPARISON", style: "Side-by-side luxurious product face-off.", goal: `Comparativa premium: 'OTROS' vs 'NOSOTROS'.` }
        ];

        const targetAngle = allAdTypes.find(a => a.id === (angleId || "HERO")) || allAdTypes[5];
        const variations: any[] = [];
        const base64Data = activeProject.productPreview?.split(",")[1] || "";
        const mimeType = activeProject.productPreview.includes("image/png") ? "image/png" : "image/jpeg";

        try {
            // Direct Google API Call
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;

            const tasks = Array.from({ length: count }).map(async (_, i) => {
                const customContext = activeProject.userPrompt ? ` INSTRUCCIONES ADICIONALES DEL USUARIO: ${activeProject.userPrompt}.` : "";
                const finalPrompt = `Create a high quality commercial ad image. Professional photography style: ${targetAngle.style}. AD CREATIVE OBJECTIVE: ${targetAngle.goal}. ${brandingContext} ${customContext} DIMENSIONS: ${selectedOutputSize || '1:1'}. Variation ${i + 1}`;

                const reqParts: any[] = [{ inlineData: { mimeType, data: base64Data } }];
                if (activeProject.logoPreview) {
                    reqParts.push({ inlineData: { mimeType: "image/png", data: activeProject.logoPreview.split(",")[1] || "" } });
                }
                reqParts.push({ text: finalPrompt });

                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: reqParts
                        }],
                        generationConfig: {
                            responseModalities: ["TEXT", "IMAGE"],
                            imageConfig: {
                                aspectRatio: "4:5"
                            }
                        }
                    })
                });

                if (res.status === 429) throw new Error("Google Rate Limit (429). Espera unos minutos.");

                const data = await res.json();
                if (data.error) throw new Error(data.error.message || "Error Gemini");

                const part = data.candidates?.[0]?.content?.parts?.[0];
                if (part?.inlineData) {
                    const newVar = { image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`, title: targetAngle.name, copy: "", angle: targetAngle.name };

                    // Generate Copy directly after image
                    try {
                        const copyRes = await fetch('/api/vertex-ai/generate-copy', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                productName: activeProject.productName,
                                targetAudience: activeProject.targetAudience,
                                angle: targetAngle.name,
                                imageBase64: part.inlineData.data,
                                mimeType: part.inlineData.mimeType,
                                apiKey: apiKey
                            })
                        });
                        const copyData = await copyRes.json();
                        newVar.copy = copyData.copy || "";
                    } catch (e) { console.error("Copy error", e); }

                    return newVar;
                }
                return null;
            });

            const results = await Promise.all(tasks);
            const validResults = results.filter(r => r !== null) as any[];
            updateActiveProject({ results: validResults });
            // Auto-save to Biblioteca
            validResults.forEach(r => {
                saveToBiblioteca(r.image, 'creativo', r.angle || 'Creativo', activeProject?.name);
            });
        } catch (error: any) {
            setToast({ msg: error.message || "Error en la generación.", type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateCopy = async (index: number) => {
        if (!apiKey || !activeProject) return;
        setGeneratingCopyIndex(index);
        try {
            const image = activeProject.results[index].image;
            const base64Data = image?.split(",")[1] || "";
            const mimeType = image.includes("image/png") ? "image/png" : "image/jpeg";

            const res = await fetch('/api/vertex-ai/generate-copy', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productName: activeProject.productName,
                    targetAudience: activeProject.targetAudience,
                    angle: activeProject.results[index].angle || "General",
                    imageBase64: base64Data,
                    mimeType: mimeType,
                    apiKey: apiKey
                })
            });
            if (!res.ok) {
                const errorText = await res.text();
                let errorMsg = "Error en el servidor (404/500)";
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error || errorMsg;
                } catch (e) {}
                throw new Error(errorMsg);
            }
            const data = await res.json();
            const copy = data.copy || "";

            const newResults = [...(activeProject?.results || [])];
            newResults[index].copy = copy;
            updateActiveProject({ results: newResults });
            setToast({ msg: "Copy generado con éxito", type: 'success' });
        } catch (error: any) {
            console.error("Error generating copy:", error);
            setToast({ msg: error.message || "Error al generar copy.", type: 'error' });
        } finally {
            setGeneratingCopyIndex(null);
        }
    };

    const handleGenerateInstagram = async () => {
        if (!apiKey) {
            setToast({ msg: "⚠️ Configura tu API Key en la pestaña de Configuración para activar la IA", type: 'error' });
            return;
        }

        const selectedProductsObj = savedProducts.filter(p => selectedProjectProducts.includes(p.id));
        const hasSelectedProducts = selectedProductsObj.length > 0;
        const hasCustomImage = !!activeProject?.productPreview;

        if (!hasCustomImage && !hasSelectedProducts) {
            setToast({ msg: "Sube una foto de tu producto o selecciona productos de la marca.", type: 'error' });
            return;
        }

        const productNames = hasSelectedProducts ? selectedProductsObj.map(p => p.nombre).join(', ') : activeProject?.productName || "Mis Productos";
        // Create flattened array based on counts early so we can map it to posts
        let flattenedProducts: any[] = [];
        if (hasSelectedProducts) {
            selectedProductsObj.forEach(p => {
                const count = productImageCounts[p.id] || 1;
                for (let i = 0; i < count; i++) {
                    flattenedProducts.push(p);
                }
            });
        }
        if (flattenedProducts.length === 0) {
            flattenedProducts = selectedProductsObj; // fallback
        }

        const productSequenceNames = [];
        for (let i = 0; i < 5; i++) {
            const product = hasSelectedProducts ? flattenedProducts[i % flattenedProducts.length] : { nombre: activeProject?.productName || "Mis Productos" };
            productSequenceNames.push(product.nombre);
        }

        const extraDesc = hasSelectedProducts ? "Productos seleccionados: " + selectedProductsObj.map(p => `${p.nombre} (${p.categoria})`).join('. ') : "";
        const combinedDescription = instagramDescription.trim() ? `${instagramDescription}\n\n${extraDesc}` : extraDesc;

        setIsGeneratingInstagram(true);
        setInstagramPosts([]);

        try {
            const res = await fetch("/api/vertex-ai/generate-instagram-posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productName: productNames,
                    productSequence: productSequenceNames,
                    productDescription: combinedDescription,
                    apiKey: apiKey
                })
            });

            if (!res.ok) {
                const errText = await res.text();
                let errMsg = "Error al generar ideas";
                try {
                    const parsed = JSON.parse(errText);
                    errMsg = parsed.error || errMsg;
                } catch (e) {}
                throw new Error(errMsg);
            }

            const data = await res.json();
            if (data.success && data.posts) {
                // Initialize posts with loading state for images
                const postsWithLoadingImages = data.posts.map((p: any) => ({
                    ...p,
                    image: null,
                    isGeneratingImage: true,
                    imageError: null
                }));
                setInstagramPosts(postsWithLoadingImages);
                setToast({ msg: "Ideas generadas. Creando las 5 imágenes del plan...", type: 'success' });

                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;

                const generarImagen = async (post: any, index: number) => {
                    // Use flattened array to respect user counts
                    const selectedProductForThisPost = hasSelectedProducts ? flattenedProducts[index % flattenedProducts.length] : null;
                    const primaryImageToUse = activeProject?.productPreview || selectedProductForThisPost?.imagenes?.[0] || "";
                    const productBase64 = primaryImageToUse ? primaryImageToUse.split(",")[1] || "" : "";
                    const mimeType = primaryImageToUse && primaryImageToUse.includes("image/png") ? "image/png" : "image/jpeg";
                    const currentProductName = activeProject?.productName || selectedProductForThisPost?.nombre || productNames;

                    const maxRetries = 4;
                    let attempt = 0;
                    
                    while (attempt <= maxRetries) {
                        try {
                            const isFirstImage = index === 0;
                            const firstImageOverrides = isFirstImage ? 
                                `\nCRITICAL FIRST IMAGE RULE: The image MUST feature a person actively using or interacting with the product. ALSO, you MUST render a short, catchy word or phrase related to the product prominently on the image.` : "";

                            const finalPrompt = `Create a high quality commercial Instagram post image. 
PRODUCT: "${currentProductName}".
POST TYPE: ${post.tipo}.
CONCEPT: ${post.concepto}.
VISUAL DESCRIPTION: ${post.descripcion_imagen}.
TEXT IN IMAGE: ${post.texto_en_imagen && post.texto_en_imagen.toLowerCase() !== 'ninguno' ? `Render the text "${post.texto_en_imagen}" clearly and beautifully on the image using bold clean typography.` : 'Do NOT add any text to the image.'}${firstImageOverrides}
Use the colors ${activeProject?.primaryColor || "#fed627"} and ${activeProject?.secondaryColor || "#FFFFFF"} for backgrounds and accents.

MANDATORY RULES:
1. EXTREMELY CRITICAL: DO NOT MODIFY, CHANGE, OR SUBSTITUTE THE PRODUCT SHOWN IN THE INPUT IMAGE UNDER ANY CIRCUMSTANCES. Keep its exact aesthetic, appearance, label, packaging, shape, and details perfectly identical to the provided input image.
2. YOU ARE FORBIDDEN FROM GENERATING MULTIPLE PRODUCTS IN THE IMAGE. Even if the visual description mentions other products or flavors, you MUST IGNORE it. You must render ONLY the single product provided in the input image. DO NOT MIX PRODUCTS.
3. The product MUST always be the main protagonist. It should never be just a decorative background element.
4. If any person is present in the scene, they MUST be actively interacting with the product.
5. Use high-end, premium, and creative backgrounds. NEVER use plain beige background or generic interior stock photos.
6. If the product is a drink or supplement, showcase the powder being mixed, the glass with the prepared drink, or the person actively drinking it.
7. No technical labels, no meta-text. High quality, premium design, modern photography style.
8. DO NOT generate any text, elements, badges, or overlays indicating discounts, sales, offers, percentages (e.g. '50% OFF'), or pricing.`;

                            const reqParts: any[] = [];
                            if (productBase64) reqParts.push({ inlineData: { mimeType, data: productBase64 } });
                            if (activeProject?.logoPreview) {
                                reqParts.push({ inlineData: { mimeType: "image/png", data: activeProject.logoPreview.split(",")[1] || "" } });
                            }
                            reqParts.push({ text: finalPrompt });

                            const imgRes = await fetch(url, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    contents: [{
                                        parts: reqParts
                                    }],
                                    generationConfig: { 
                                        responseModalities: ["TEXT", "IMAGE"],
                                        imageConfig: {
                                            aspectRatio: "3:4"
                                        }
                                    }
                                })
                            });

                            if (!imgRes.ok) {
                                throw new Error(`Error de API: ${imgRes.status}`);
                            }

                            const imgData = await imgRes.json();
                            console.log(`Gemini full response post ${post.id}:`, JSON.stringify(imgData, null, 2));

                            const part = imgData.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
                            if (part?.inlineData) {
                                const generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                                setInstagramPosts(prev => prev.map(p => p.id === post.id ? { ...p, image: generatedImageUrl, isGeneratingImage: false } : p));
                                // Auto-save to Biblioteca
                                saveToBiblioteca(generatedImageUrl, 'instagram', `Post ${post.id}: ${post.tipo || ''}`, activeProject?.name);
                                return; // Success! Exit function.
                            } else {
                                const candidate = imgData.candidates?.[0]?.content?.parts?.[0];
                                const errorSuffix = candidate?.text ? `: "${candidate.text.substring(0, 100)}..."` : "";
                                throw new Error("No se devolvió ninguna imagen en la respuesta" + errorSuffix);
                            }
                        } catch (err: any) {
                            console.error(`Attempt ${attempt + 1} failed for post ${post.id}:`, err);
                            attempt++;
                            if (attempt <= maxRetries) {
                                // Wait 5 seconds before retry
                                await new Promise(r => setTimeout(r, 5000));
                            } else {
                                setInstagramPosts(prev => prev.map(p => p.id === post.id ? { ...p, isGeneratingImage: false, imageError: err.message || "Error de red" } : p));
                            }
                        }
                    }
                };

                const runSequentialGeneration = async () => {
                    let index = 0;
                    for (const post of postsWithLoadingImages) {
                        await generarImagen(post, index);
                        await new Promise(r => setTimeout(r, 3000));
                        index++;
                    }
                    setToast({ msg: "Todas las imágenes de los posts han sido generadas", type: 'success' });
                };

                runSequentialGeneration();
            } else {
                throw new Error(data.error || "Formato de respuesta inválido");
            }
        } catch (error: any) {
            console.error("Instagram generation error:", error);
            setToast({ msg: error.message || "Error al conectar con la IA", type: 'error' });
        } finally {
            setIsGeneratingInstagram(false);
        }
    };

    const handleSaveTextOnly = (updatedPost: any) => {
        setInstagramPosts(prev => prev.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p));
        setEditingPost(null);
        setToast({ msg: `Post ${updatedPost.id}: Texto actualizado`, type: 'success' });
    };

    const handleSaveAndRegeneratePost = async (updatedPost: any) => {
        // Update local text first and show loader on image
        setInstagramPosts(prev => prev.map(p => p.id === updatedPost.id ? { 
            ...p, 
            ...updatedPost, 
            image: null, 
            isGeneratingImage: true, 
            imageError: null 
        } : p));
        
        // Close modal immediately
        setEditingPost(null);
        setToast({ msg: `Regenerando imagen para Post ${updatedPost.id}...`, type: 'success' });

        try {
            if (!apiKey) {
                throw new Error("⚠️ Configura tu API Key en la pestaña de Configuración para activar la IA");
            }
            if (!activeProject?.productPreview) {
                throw new Error("⚠️ Sube una foto de tu producto en la sección superior para poder generar las imágenes.");
            }

            const productBase64 = activeProject.productPreview.split(",")[1] || "";
            const mimeType = activeProject.productPreview.includes("image/png") ? "image/png" : "image/jpeg";
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;

            const finalPrompt = `Create a high quality commercial Instagram post image. 
PRODUCT: "${activeProject.productName}".
POST TYPE: ${updatedPost.tipo}.
CONCEPT: ${updatedPost.concepto}.
VISUAL DESCRIPTION: ${updatedPost.descripcion_imagen}.
TEXT IN IMAGE: ${updatedPost.texto_en_imagen && updatedPost.texto_en_imagen.toLowerCase() !== 'ninguno' ? `Render the text "${updatedPost.texto_en_imagen}" clearly and beautifully on the image using bold clean typography.` : 'Do NOT add any text to the image.'}
Use the colors ${activeProject.primaryColor || "#fed627"} and ${activeProject.secondaryColor || "#FFFFFF"} for backgrounds and accents.

MANDATORY RULES:
1. The product MUST always be the main protagonist or being actively used. It should never be just a decorative background element.
2. If any person is present in the scene, they MUST be actively interacting with the product.
3. Use high-end, premium, and creative backgrounds, such as color gradients, natural textures, marble surfaces, or stylized nature. NEVER use plain beige background or generic interior stock photos.
4. If the product is a drink or supplement, showcase the powder being mixed, the glass with the prepared drink, or the person actively drinking it.
5. No technical labels, no meta-text. High quality, premium design, modern photography style.
6. DO NOT modify, change, or substitute the product shown in the input image. Keep its appearance, label, packaging, container, and details exactly the same. Do not generate a different bottle, box, or product format.
7. DO NOT generate any text, elements, badges, or overlays indicating discounts, sales, offers, percentages (e.g. '50% OFF'), or pricing. Keep the visual entirely focused on the product itself.`;

            const reqParts: any[] = [{ inlineData: { mimeType, data: productBase64 } }];
            if (activeProject.logoPreview) {
                reqParts.push({ inlineData: { mimeType: "image/png", data: activeProject.logoPreview.split(",")[1] || "" } });
            }
            reqParts.push({ text: finalPrompt });

            const imgRes = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: reqParts
                    }],
                    generationConfig: { 
                        responseModalities: ["TEXT", "IMAGE"],
                        imageConfig: {
                            aspectRatio: "4:5"
                        }
                    }
                })
            });

            if (!imgRes.ok) {
                throw new Error(`Error de API: ${imgRes.status}`);
            }

            const imgData = await imgRes.json();
            const part = imgData.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
            if (part?.inlineData) {
                const generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                setInstagramPosts(prev => prev.map(p => p.id === updatedPost.id ? { ...p, image: generatedImageUrl, isGeneratingImage: false } : p));
                setToast({ msg: `Post ${updatedPost.id}: ¡Imagen regenerada con éxito!`, type: 'success' });
            } else {
                const candidate = imgData.candidates?.[0]?.content?.parts?.[0];
                const errorSuffix = candidate?.text ? `: "${candidate.text.substring(0, 100)}..."` : "";
                throw new Error("No se devolvió ninguna imagen en la respuesta" + errorSuffix);
            }
        } catch (err: any) {
            console.error(`Error regenerating image for post ${updatedPost.id}:`, err);
            setInstagramPosts(prev => prev.map(p => p.id === updatedPost.id ? { ...p, isGeneratingImage: false, imageError: err.message || "Error al regenerar" } : p));
            setToast({ msg: `Error en Post ${updatedPost.id}: ${err.message}`, type: 'error' });
        }
    };

    const saveToLibrary = (image: string, angle: string, copy?: string) => {
        if (library.some(item => item.image === image)) { setToast({ msg: "Ya está en tu biblioteca", type: 'success' }); return; }
        const newAd: SavedAd = { id: Math.random().toString(36).substr(2, 9), image, angle: angle || "Mix", projectName: activeProject?.name || "Global", savedAt: Date.now(), copy };
        const newLib = [newAd, ...library];
        setLibrary(newLib);
        setToast({ msg: "¡Guardado con éxito!", type: 'success' });
    };

    const removeFromLibrary = (id: string) => {
        const newLib = library.filter(a => a.id !== id);
        setLibrary(newLib);
        localStorage.setItem(getUKey("clickads_library"), JSON.stringify(newLib));
    };

    const handlePost = () => {
        if (!newPostContent.trim()) return;
        const newPost: Post = {
            id: Math.random().toString(36).substr(2, 9),
            author: user?.name || "Admin PosteA",
            authorAvatar: getAvatarUrl(),
            category: postingTo,
            content: newPostContent,
            timestamp: Date.now(),
            likes: 0,
            comments: [],
            image: newPostImage || undefined
        };
        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        localStorage.setItem("clickads_community_posts", JSON.stringify(updatedPosts));
        setNewPostContent("");
        setNewPostImage(null);
        setToast({ msg: "Publicación compartida", type: 'success' });
    };

    const handleGenerateCarousel = async () => {
        if (!apiKey) {
            setToast({ msg: "⚠️ Configura tu API Key para activar la IA", type: 'error' });
            return;
        }

        const selectedProductsObj = savedProducts.filter(p => selectedProjectProducts.includes(p.id));
        const hasSelectedProducts = selectedProductsObj.length > 0;
        const hasCustomImage = !!activeProject?.productPreview;

        if (!hasCustomImage && !hasSelectedProducts) {
            setToast({ msg: "Sube una foto de tu producto o selecciona productos de la marca.", type: 'error' });
            return;
        }

        const productNames = hasSelectedProducts ? selectedProductsObj.map(p => p.nombre).join(', ') : activeProject?.productName || "Mis Productos";
        const extraDesc = hasSelectedProducts ? "Productos seleccionados: " + selectedProductsObj.map(p => `${p.nombre} (${p.categoria})`).join('. ') : "";
        const finalTema = carouselTema.trim() ? `${carouselTema}\n\n${extraDesc}` : `Vender ${productNames}\n\n${extraDesc}`;

        setIsGeneratingCarousel(true);
        setCarouselData(null);

        try {
            // STEP 1: Generate structure with Gemini
            const res = await fetch('/api/vertex-ai/generate-carousel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tema: finalTema,
                    tono: carouselTono,
                    numSlides: carouselNumSlides,
                    apiKey
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || `Error ${res.status}`);
            }

            const data = await res.json();
            if (!data.success || !data.carousel) throw new Error("Respuesta inválida del servidor");

            const carousel = data.carousel;
            // Initialize slides with image loading state
            const slidesWithLoading = carousel.slides.map((s: any) => ({
                ...s,
                image: null,
                isGeneratingImage: true,
                imageError: null
            }));
            setCarouselData({ ...carousel, slides: slidesWithLoading });
            setToast({ msg: `✅ Estructura generada. Creando ${carouselNumSlides} imágenes secuencialmente...`, type: 'success' });

            // STEP 2: Generate images sequentially
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;

            // Create flattened array based on counts
            let flattenedProducts: any[] = [];
            if (hasSelectedProducts) {
                selectedProductsObj.forEach(p => {
                    const count = productImageCounts[p.id] || 1;
                    for (let i = 0; i < count; i++) {
                        flattenedProducts.push(p);
                    }
                });
            }
            if (flattenedProducts.length === 0) {
                flattenedProducts = selectedProductsObj; // fallback
            }

            const primaryColor = activeProject?.primaryColor || "#fed627";
            const secondaryColor = activeProject?.secondaryColor || "#1a1a2e";

            // Style anchor defined in slide 1 for visual consistency
            const styleAnchor = `Premium Instagram carousel visual style: bold geometric shapes, rich gradient backgrounds using ${primaryColor} and ${secondaryColor}, high-contrast typography, modern editorial design. Dark sophisticated aesthetic. 1080x1350 vertical 4:5 format.`;

            for (let i = 0; i < slidesWithLoading.length; i++) {
                const slide = slidesWithLoading[i];
                const isFirst = i === 0;
                const maxRetries = 4;
                let attempt = 0;

                while (attempt <= maxRetries) {
                    try {
                        const consistencyNote = isFirst
                            ? `This is Slide 1 (COVER). Define the visual style for the entire carousel.`
                            : `This is Slide ${slide.numero}. MANDATORY: Use EXACTLY the same visual style, color palette (${primaryColor} and ${secondaryColor}), and design aesthetic as slide 1 of this carousel. Visual consistency is critical.`;

                        const textInstruction = slide.texto_en_imagen && slide.texto_en_imagen.toLowerCase() !== 'ninguno'
                            ? `Render this text prominently on the image with bold, clean typography: "${slide.texto_en_imagen}"`
                            : 'Do NOT add any text overlay to this image.';

                        const prompt = `Create a premium Instagram carousel slide image (1080x1350 vertical 4:5 format).
${consistencyNote}

SLIDE TYPE: ${slide.tipo}
TITLE CONCEPT: ${slide.titulo || ''}
VISUAL DESCRIPTION: ${slide.descripcion_imagen}
${textInstruction}

MANDATORY RULES:
1. EXTREMELY CRITICAL: DO NOT MODIFY, CHANGE, OR SUBSTITUTE THE PRODUCT SHOWN IN THE INPUT IMAGE UNDER ANY CIRCUMSTANCES. Keep its exact aesthetic, appearance, label, packaging, shape, and details perfectly identical to the provided input image.
2. YOU ARE FORBIDDEN FROM GENERATING MULTIPLE PRODUCTS IN THE IMAGE. Even if the visual description mentions other products or flavors, you MUST IGNORE it. You must render ONLY the single product provided in the input image. DO NOT MIX PRODUCTS.
3. The product MUST always be the main protagonist. It should never be just a decorative background element.
4. If any person is present in the scene, they MUST be actively interacting with the product.
5. Use high-end, premium, and creative backgrounds. NEVER use plain white, plain beige background or generic interior stock photos. Use bold gradients, geometric patterns, abstract art, textured surfaces, or premium dark backgrounds.
6. Color palette MUST use ${primaryColor} as primary accent and ${secondaryColor} as secondary
7. Typography: bold, modern sans-serif, highly legible
8. Feel: premium, editorial, scroll-stopping
9. DO NOT generate any text, elements, badges, or overlays indicating discounts, sales, offers, percentages (e.g. '50% OFF'), or pricing.`;

                        // Cycle through products if multiple are selected
                        const selectedProductForThisSlide = hasSelectedProducts ? flattenedProducts[i % flattenedProducts.length] : null;
                        const primaryImageToUse = activeProject?.productPreview || selectedProductForThisSlide?.imagenes?.[0] || "";
                        const productBase64 = primaryImageToUse ? primaryImageToUse.split(",")[1] || "" : "";
                        const currentMimeType = primaryImageToUse && primaryImageToUse.includes("image/png") ? "image/png" : "image/jpeg";

                        const reqParts: any[] = [];
                        if (productBase64) reqParts.push({ inlineData: { mimeType: currentMimeType, data: productBase64 } });
                        if (activeProject?.logoPreview) {
                            reqParts.push({ inlineData: { mimeType: "image/png", data: activeProject.logoPreview.split(",")[1] || "" } });
                        }
                        reqParts.push({ text: prompt });

                        const imgRes = await fetch(url, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: [{ parts: reqParts }],
                                generationConfig: { 
                                    responseModalities: ["TEXT", "IMAGE"],
                                    imageConfig: {
                                        aspectRatio: "3:4"
                                    }
                                }
                            })
                        });

                        if (!imgRes.ok) throw new Error(`API error: ${imgRes.status}`);

                        const imgData = await imgRes.json();
                        const part = imgData.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);

                        if (part?.inlineData) {
                            const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                            setCarouselData((prev: any) => ({
                                ...prev,
                                slides: prev.slides.map((s: any) =>
                                    s.numero === slide.numero ? { ...s, image: imageUrl, isGeneratingImage: false } : s
                                )
                            }));
                            // Auto-save to Biblioteca
                            saveToBiblioteca(imageUrl, 'instagram', `Carrusel: ${slide.titulo || `Slide ${slide.numero}`}`, activeProject?.name);
                            break; // success
                        } else {
                            throw new Error("Sin imagen en la respuesta");
                        }
                    } catch (err: any) {
                        attempt++;
                        if (attempt <= maxRetries) {
                            await new Promise(r => setTimeout(r, 5000));
                        } else {
                            setCarouselData((prev: any) => ({
                                ...prev,
                                slides: prev.slides.map((s: any) =>
                                    s.numero === slide.numero ? { ...s, isGeneratingImage: false, imageError: err.message } : s
                                )
                            }));
                        }
                    }
                }

                // 3s delay between images to avoid rate limiting
                if (i < slidesWithLoading.length - 1) {
                    await new Promise(r => setTimeout(r, 3000));
                }
            }

            setToast({ msg: "🎉 ¡Carrusel completado!", type: 'success' });
        } catch (error: any) {
            setToast({ msg: error.message || "Error generando el carrusel", type: 'error' });
        } finally {
            setIsGeneratingCarousel(false);
        }
    };

    const handleGenerateLogo = async (isIteration: boolean = false) => {
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        setIsGeneratingLogo(true);
        if (!isIteration) setFinalLogo(null);

        try {
            const mediaParts = [];
            const likedSelection = likedLogos.slice(0, 6);
            if (finalLogo) likedSelection.push(finalLogo);

            for (const logoUrl of likedSelection) {
                if (logoUrl.startsWith('data:')) {
                    const base64 = logoUrl?.split(',')[1] || "";
                    const header = logoUrl?.split(',')[0] || "";
                    const mimeType = header.match(/:(.*?);/)?.[1] || "image/png";
                    mediaParts.push({ inlineData: { mimeType, data: base64 } });
                }
            }

            const feedbackContext = (logoLikedFeedback || logoDislikedFeedback) ? `
                USER FEEDBACK FOR THIS ITERATION:
                The user likes: "${logoLikedFeedback || 'no specific likes provided'}"
                The user wants to CHANGE or remove: "${logoDislikedFeedback || 'no specific dislikes provided'}"
                Please incorporate this feedback strictly in the new generation.
            ` : "";

            const prompt = `
                TASK: Generate a high-end, professional brand logo.
                BUSINESS NAME: "${logoBusinessName}"
                SECTOR: "${logoSector}"
                PRIMARY COLOR: "${logoPrimaryColor}"
                SECONDARY COLOR: "${logoSecondaryColor}"
                ${feedbackContext}
                
                STYLE GUIDELINES:
                1. MODERN & MINIMALIST: Use clean lines and balanced proportions.
                2. VECTOR STYLE: The final result should look like a professional vector logo on a clean background.
                3. COLOR HARMONY: Primarily use ${logoPrimaryColor} and ${logoSecondaryColor}. No neon unless specified.
                4. LEGIBILITY: The name "${logoBusinessName}" must be clearly legible if text is included.
                5. SYMBOLISM: Incorporate a subtle icon or symbol relevant to the ${logoSector} sector.
                6. BACKGROUND: Use a solid, clean neutral background (e.g., white or light grey) to make the logo pop.
                7. REFERENCE: Synthesize the aesthetic of the provided example images while making it unique and superior.
                8. DIMENSIONS: 1080x1080 pixels (Square).
                
                NO TECHNICAL LABELS: Do not include words like "Logo", "Design", "Concept", color names as text.
            `;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            ...mediaParts,
                            { text: prompt }
                        ]
                    }],
                    generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error.message || "Error Gemini");

            const part = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
            if (part && part.inlineData) {
                const logo = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                setFinalLogo(logo);
                setLogoStep(1);
                if (isIteration) {
                    setLogoLikedFeedback("");
                    setLogoDislikedFeedback("");
                    setToast({ msg: "Logo refinado con éxito", type: 'success' });
                }
            } else {
                throw new Error("No se pudo generar el logo. Intenta de nuevo.");
            }
        } catch (error: any) {
            setToast({ msg: error.message, type: 'error' });
        } finally {
            setIsGeneratingLogo(false);
        }
    };


    const handleGenerateLanding = async () => {
        if (!apiKey) {
            setToast({ msg: "⚠️ Ve a Configuración y guarda tu API Key de Gemini", type: 'error' });
            return;
        }
        if (!activeProject) {
            setToast({ msg: "Selecciona o crea un proyecto primero", type: 'error' });
            return;
        }
        setIsLandingLoading(true);
        setLandingResults(null);
        try {
            const mediaParts: any[] = [];
            const images = [activeProject.productPreview, activeProject.logoPreview].filter(Boolean) as string[];
            images.forEach((img: string) => {
                const data = img?.split(",")[1] || "";
                const mimeType = img.includes("image/png") ? "image/png" : "image/jpeg";
                mediaParts.push({ inlineData: { data, mimeType } });
            });

            const colorStyle = `Color Primario: ${activeProject.primaryColor || '#fed627'}, Secundario: ${activeProject.secondaryColor || '#FFFFFF'}, Fuente: ${activeProject.font || 'Inter'}.`;
            const language = selectedOutputLanguage || "ESPAÑOL";

            let specificPrompt = "";
            if (landingCategory === "Antes/Después") {
                specificPrompt = `Sección Antes/Después. Antes: "${lBefore}". Después: "${lAfter}".`;
            } else if (landingCategory === "Hero") {
                specificPrompt = `Hero Section de alto impacto. Producto héroe, titular persuasivo.`;
            } else if (landingCategory === "Oferta") {
                specificPrompt = `Sección de Oferta. Precios: x1: ${lPrice1}, x2: ${lPrice2}, x3: ${lPrice3}, x4: ${lPrice4}.`;
            } else if (landingCategory === "Beneficios") {
                specificPrompt = `Sección de Beneficios. Detalles: ${lBenefits}.`;
            } else if (landingCategory === "Preguntas Frecuentes") {
                specificPrompt = `Sección de FAQ. Preguntas: ${lFaqs.map(f => f.q).join(", ")}.`;
            } else {
                specificPrompt = `Sección de ${landingCategory} para el producto ${activeProject.productName}.`;
            }

            const customContext = activeProject.userPrompt ? ` INSTRUCCIONES ADICIONALES: ${activeProject.userPrompt}.` : "";
            const prompt = `Crea un gráfico para una landing page. DIMENSIONES: ${selectedOutputSize || '(447x800)'}. CATEGORÍA: ${landingCategory}. IDIOMA: ${language}. ${specificPrompt} ${customContext} ${colorStyle} ORTOGRAFÍA PERFECTA EN ${language}. CALIDAD 8K.`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [...mediaParts, { text: prompt }] }],
                    generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error.message || "Error Gemini");

            const part = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
            if (part && part.inlineData) {
                const newImg = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                setLandingResults({ image: newImg, angle: landingCategory || "Landing" });
                updateActiveProject({ results: [...(activeProject.results || []), { image: newImg, title: landingCategory, angle: landingCategory || "Landing", isLanding: true }] });
            } else {
                throw new Error("No se pudo generar la sección.");
            }
        } catch (e: any) {
            setToast({ msg: e.message, type: 'error' });
        } finally {
            setIsLandingLoading(false);
        }
    };

    const handleRefine = async (index: number, isLanding = false) => {
        if (!refiningText.trim()) return;
        setIsRefining(true);

        let prevImage = "";
        let currentAngle = "Refinamiento";

        if (isLanding) {
            if (!landingResults) return;
            prevImage = landingResults.image;
            currentAngle = landingResults.angle || "Landing";
        } else {
            const target = activeProject!.results[index];
            if (!target) return;
            prevImage = target.image;
            currentAngle = target.angle || "Refinamiento";
        }

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;
            const base64Data = prevImage?.split(",")[1] || "";

            const prompt = `ADJUSTMENT REQUESTED BY USER: "${refiningText}". 
            Context: This image is part of a marketing campaign for "${activeProject?.productName}".
            TASK: Re-generate the image making the specific changes requested. KEEP the exact same composition, layout and aesthetic, but apply the fix: "${refiningText}". 
            Primary Color: ${activeProject?.primaryColor}, Secondary: ${activeProject?.secondaryColor}.
            Output Language: ${selectedOutputLanguage || 'Español'}.
            IMPORTANT: Do not invent a new concept, just refine the current one.`;

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
                            { text: prompt }
                        ]
                    }],
                    generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error.message || "Error Gemini");

            const part = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
            if (part && part.inlineData) {
                const newImg = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                let newCopy = "";

                // Generate new copy based on adjusted image using OpenAI backend
                try {
                    const copyRes = await fetch('/api/vertex-ai/generate-copy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            productName: activeProject!.productName,
                            targetAudience: activeProject!.targetAudience,
                            angle: currentAngle,
                            imageBase64: part.inlineData.data,
                            mimeType: part.inlineData.mimeType,
                            apiKey: apiKey
                        })
                    });
                    const copyData = await copyRes.json();
                    newCopy = copyData.copy || "";
                } catch (e) {
                    console.error("Copy error", e);
                }

                if (isLanding) {
                    setLandingResults({ image: newImg, angle: currentAngle });
                    setShowLandingRefine(false);
                } else {
                    const newResults = [...activeProject!.results];
                    newResults[index] = {
                        ...newResults[index],
                        image: newImg,
                        copy: newCopy || newResults[index].copy
                    };
                    updateActiveProject({ results: newResults });
                    setRefiningIndex(null);
                }
                setRefiningText("");
                setToast({ msg: "✅ Ajuste completado con éxito", type: 'success' });
            } else {
                throw new Error("No se pudo generar el ajuste.");
            }
        } catch (e: any) {
            setToast({ msg: "Error al ajustar: " + e.message, type: 'error' });
        } finally {
            setIsRefining(false);
        }
    };



    const downloadSingleImage = async (image: string, name: string) => {
        try {
            let blob: Blob | null = null;
            if (image.startsWith('data:')) {
                const img = new window.Image();
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = image;
                });
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/jpeg", 0.95));
                }
            }
            if (!blob) {
                const byteString = atob(image?.split(',')[1] || "");
                const mimeString = image?.split(',')[0]?.split(':')[1]?.split(';')[0] || "";
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
                blob = new Blob([ab], { type: mimeString });
            }
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setToast({ msg: "¡JPEG descargado!", type: 'success' });
        } catch (error) {
            console.error("Error downloading image:", error);
            const link = document.createElement("a");
            link.href = image;
            link.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
            link.click();
        }
    };

    const downloadAsZip = async (images: { image: string, name: string }[], zipName: string) => {
        try {
            const zip = new JSZip();
            setToast({ msg: "Preparando carpeta ZIP...", type: 'success' });
            for (let i = 0; i < images.length; i++) {
                const { image, name } = images[i];
                if (image.startsWith('data:')) {
                    let base64Data = image?.split(',')[1] || "";
                    if (!image.startsWith('data:image/jpeg')) {
                        try {
                            const img = new window.Image();
                            await new Promise((resolve, reject) => {
                                img.onload = resolve;
                                img.onerror = reject;
                                img.src = image;
                            });
                            const canvas = document.createElement("canvas");
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext("2d");
                            if (ctx) {
                                ctx.fillStyle = "#FFFFFF";
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                                ctx.drawImage(img, 0, 0);
                                base64Data = canvas.toDataURL("image/jpeg", 0.95)?.split(',')[1] || "";
                            }
                        } catch (e) { }
                    }
                    zip.file(`${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${i + 1}.jpg`, base64Data, { base64: true });
                } else {
                    const response = await fetch(image);
                    const blob = await response.blob();
                    zip.file(`${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${i + 1}.jpg`, blob);
                }
            }
            const content = await zip.generateAsync({ type: "blob" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = `${zipName.replace(/[^a-z0-9]/gi, '_')}.zip`;
            link.click();
            setToast({ msg: "¡ZIP descargado!", type: 'success' });
        } catch (error) {
            setToast({ msg: "Error al crear el ZIP", type: 'error' });
        }
    };

    const handleGenerateClinic = async () => {
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        if (!clinicBefore || !clinicAfter) {
            setToast({ msg: "Sube ambas fotos (Antes y Después)", type: 'error' });
            return;
        }
        setIsClinicLoading(true);
        setClinicResults([]);
        try {
            const mediaParts = [
                { inlineData: { data: clinicBefore?.split(",")[1] || "", mimeType: "image/jpeg" } },
                { inlineData: { data: clinicAfter?.split(",")[1] || "", mimeType: "image/jpeg" } }
            ];
            const prompt = `Diseño de Antes y Después impactante. Texto en ESPAÑOL. Ángulo: ${selectedClinicAngle}. Contexto: ${clinicTreatment}. Calidad fotorealista profesional.`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [...mediaParts, { text: prompt }] }],
                    generationConfig: { 
                        responseModalities: ["TEXT", "IMAGE"],
                        imageConfig: {
                            aspectRatio: "4:5"
                        }
                    }
                })
            });
            const data = await res.json();
            const part = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
            if (part && part.inlineData) {
                const img = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                setClinicResults([{ image: img, angle: selectedClinicAngle || "Generado" }]);
            } else {
                throw new Error("No se pudo generar");
            }
        } catch (e: any) {
            setToast({ msg: e.message, type: 'error' });
        } finally {
            setIsClinicLoading(false);
        }
    };

    const handleGenerateStudio = async () => {
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        if (!studioInputImage) {
            setToast({ msg: "Sube una foto tomada con tu teléfono", type: 'error' });
            return;
        }
        setIsStudioLoading(true);
        setStudioResults([]);

        const angles = [
            "Ángulo frontal directo (Front View)",
            "Ángulo ligeramente inclinado desde arriba (Top-Down / 45°)",
            "Ángulo de perfil o tres cuartos (Side/3/4 View)",
            "Ángulo en detalle de primer plano (Close-Up)"
        ];

        try {
            const mediaParts = [{ inlineData: { data: studioInputImage.split(",")[1] || "", mimeType: "image/jpeg" } }];
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;

            const promises = angles.map(async (angle) => {
                const prompt = `Extrae el producto de la imagen proporcionada. Transformalo en una fotografía de estudio ultra realista en calidad Full HD (Alta resolución). Fondo debe ser TOTALMENTE BLANCO 100% PURO (#FFFFFF). El producto debe verse limpio, profesional y bien iluminado. Ángulo: ${angle}.`;

                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [...mediaParts, { text: prompt }] }],
                        generationConfig: { 
                            responseModalities: ["TEXT", "IMAGE"],
                            imageConfig: {
                                aspectRatio: "4:5"
                            }
                        }
                    })
                });
                const data = await res.json();
                if (data.error) throw new Error(data.error.message || "Error Gemini");
                const part = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
                if (part && part.inlineData) {
                    return { image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`, angle };
                }
                return null;
            });

            const resultsRaw = await Promise.all(promises);
            const validResults = resultsRaw.filter(Boolean) as { image: string, angle: string }[];
            setStudioResults(validResults);

            if (validResults.length === 0) {
                throw new Error("No se pudo generar");
            } else {
                setToast({ msg: "¡Imágenes de Photo Studio generadas!", type: 'success' });
                // Auto-save to Biblioteca
                validResults.forEach(r => {
                    saveToBiblioteca(r.image, 'studio', r.angle || 'Photo Studio', activeProject?.name);
                });
            }
        } catch (e: any) {
            setToast({ msg: e.message || "Error al procesar", type: 'error' });
        } finally {
            setIsStudioLoading(false);
        }
    };

    const handleResearch = async () => {
        if (!researchName.trim()) {
            setToast({ msg: "Escribe el nombre del producto", type: 'error' });
            return;
        }
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        setIsResearchLoading(true);
        setResearchResults(null);
        try {
            const res = await fetch("/api/vertex-ai/research", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: researchName, description: researchDescription, apiKey: apiKey })
            });
            if (!res.ok) {
                const errorText = await res.text();
                let errorMsg = "Error en el servidor (404/500)";
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error || errorMsg;
                } catch (e) {}
                throw new Error(errorMsg);
            }

            const data = await res.json();
            if (data.success) {
                setResearchResults(data.results);
                const newHistory = [{ id: Math.random().toString(), name: researchName, description: researchDescription, date: new Date().toLocaleDateString(), results: data.results }, ...researchHistory];
                setResearchHistory(newHistory);
                localStorage.setItem(getUKey("clickads_research_history"), JSON.stringify(newHistory));
                setToast({ msg: "Investigación completada con éxito", type: 'success' });
            } else {
                throw new Error(data.error || "Error en investigación");
            }
        } catch (e: any) {
            setToast({ msg: e.message, type: 'error' });
        } finally {
            setIsResearchLoading(false);
        }
    };


    const handleObjections = async () => {
        if (!objectionProductName.trim()) {
            setToast({ msg: "Escribe el nombre del producto", type: 'error' });
            return;
        }
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        setIsObjectionLoading(true);
        setObjectionResults(null);
        try {
            const res = await fetch("/api/vertex-ai/objections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productName: objectionProductName, targetAudience: objectionTargetAudience, manualObjections: manualObjections, apiKey: apiKey })
            });
            if (!res.ok) {
                const errorText = await res.text();
                let errorMsg = "Error en el servidor (404/500)";
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error || errorMsg;
                } catch (e) {}
                throw new Error(errorMsg);
            }
            const data = await res.json();
            if (data.success) {
                setObjectionResults(data.objections);
                setToast({ msg: "Objeciones destruidas con éxito", type: 'success' });
            } else {
                throw new Error(data.error || "Error al procesar objeciones");
            }
        } catch (e: any) {
            setToast({ msg: e.message, type: 'error' });
        } finally {
            setIsObjectionLoading(false);
        }
    };


    const handleWaSimEvaluate = async () => {
        if (waSimMessages.length < 2) {
            setToast({ msg: "Necesitas al menos 2 mensajes para evaluar", type: 'error' });
            return;
        }
        setIsEvaluatingWa(true);
        setWaSimEvaluation(null);
        try {
            const chatStr = waSimMessages.map(m => `${m.role === 'user' ? 'Vendedor' : 'Cliente'}: ${m.content}`).join("\n");
            const res = await fetch("/api/vertex-ai/whatsapp-closer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "evaluate",
                    userMessage: chatStr,
                    clientType: waSimClientType,
                    apiKey: apiKey,
                    productName: activeProject?.productName,
                    targetAudience: activeProject?.targetAudience
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                let errorMsg = `Error del servidor: ${res.status}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error || errorMsg;
                } catch (e) {}
                throw new Error(errorMsg);
            }

            const data = await res.json();
            if (data.success && data.evaluation) {
                console.log("Evaluación recibida correctamente:", data.evaluation);
                setWaSimEvaluation(data.evaluation);
                setToast({ msg: "Evaluación generada con éxito", type: 'success' });
            } else {
                throw new Error(data.error || "La IA no devolvió una evaluación válida.");
            }
        } catch (e: any) {
            console.error("Error crítico en evaluación:", e);
            setToast({ msg: "Error al evaluar: " + e.message, type: 'error' });
        } finally {
            setIsEvaluatingWa(false);
        }
    };

    const handleWaSimStart = async () => {
        if (isWaSimLoading) return;
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        if (!activeProjectId) {
            setToast({ msg: "Selecciona un proyecto arriba para comenzar", type: 'error' });
            return;
        }

        setWaSimMessages([]);
        setWaSimEvaluation(null);
        setIsWaSimLoading(true);

        try {
            const res = await fetch("/api/vertex-ai/whatsapp-closer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "simulate",
                    chatHistory: [],
                    clientType: waSimClientType,
                    userMessage: "Hola, vi el anuncio y me interesa. Por favor, inicia tú la conversación como si fueras el cliente escribiéndome.",
                    apiKey: apiKey,
                    productName: activeProject?.productName,
                    targetAudience: activeProject?.targetAudience
                })
            });
            if (!res.ok) {
                const errorText = await res.text();
                let errorMsg = "Error en el servidor (404/500)";
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error || errorMsg;
                } catch (e) {}
                throw new Error(errorMsg);
            }
            const data = await res.json();
            if (data.success) {
                setWaSimMessages([{ role: 'assistant', content: data.response }]);
                setToast({ msg: "Simulación iniciada por el cliente", type: 'success' });
            } else {
                throw new Error(data.error || "Error al iniciar simulación");
            }
        } catch (e: any) {
            setToast({ msg: "Error: " + e.message, type: 'error' });
        } finally {
            setIsWaSimLoading(false);
        }
    };

    const handleWaSimMessage = async () => {
        if (!waSimInput.trim() || isWaSimLoading) return;
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }

        const newUserMsg = { role: 'user' as const, content: waSimInput };
        const updatedMessages = [...waSimMessages, newUserMsg];
        setWaSimMessages(updatedMessages);
        setWaSimInput("");
        setIsWaSimLoading(true);

        try {
            const res = await fetch("/api/vertex-ai/whatsapp-closer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "simulate",
                    chatHistory: updatedMessages,
                    clientType: waSimClientType,
                    userMessage: waSimInput,
                    apiKey: apiKey,
                    productName: activeProject?.productName,
                    targetAudience: activeProject?.targetAudience
                })
            });
            if (!res.ok) {
                const errorText = await res.text();
                let errorMsg = "Error en el servidor (404/500)";
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error || errorMsg;
                } catch (e) {}
                throw new Error(errorMsg);
            }
            const data = await res.json();
            if (data.success) {
                setWaSimMessages([...updatedMessages, { role: 'assistant', content: data.response }]);
            } else {
                throw new Error(data.error || "Error en la simulación");
            }
        } catch (e: any) {
            setToast({ msg: "Error: " + e.message, type: 'error' });
        } finally {
            setIsWaSimLoading(false);
        }
    };


    const handleGenerateDigital = async () => {
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        if (!digitalProduct) {
            setToast({ msg: "Sube una foto del producto", type: 'error' });
            return;
        }
        setIsDigitalLoading(true);
        setDigitalResults([]);
        try {
            const mediaParts = [{ inlineData: { data: digitalProduct?.split(",")[1] || "", mimeType: "image/jpeg" } }];
            if (digitalPerson || digitalLogo) {
                const imgData = digitalPerson || digitalLogo;
                if (imgData) {
                    mediaParts.push({ inlineData: { data: imgData?.split(",")[1] || "", mimeType: "image/jpeg" } });
                }
            }
            const prompt = `Diseño de anuncio digital premium. Producto: ${activeProject?.productName}. Ángulo: ${selectedDigitalAngle}. Texto: ${digitalPrompt}.`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [...mediaParts, { text: prompt }] }],
                    generationConfig: { 
                        responseModalities: ["TEXT", "IMAGE"],
                        imageConfig: {
                            aspectRatio: "4:5"
                        }
                    }
                })
            });
            const data = await res.json();
            const part = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
            if (part && part.inlineData) {
                const img = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                setDigitalResults([{ image: img, angle: selectedDigitalAngle || "Generado" }]);
            } else {
                throw new Error("No se pudo generar");
            }
        } catch (e: any) {
            setToast({ msg: e.message, type: 'error' });
        } finally {
            setIsDigitalLoading(false);
        }
    };

    const handleGenerateResearch = async () => {
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        if (!researchName || !researchDescription) {
            setToast({ msg: "Completa el nombre y la información del producto", type: 'error' });
            return;
        }
        setIsResearchLoading(true);
        setResearchResults(null);
        try {
            const res = await fetch("/api/vertex-ai/research", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: researchName,
                    description: researchDescription,
                    apiKey
                })
            });
            if (!res.ok) {
                const errorText = await res.text();
                let errorMsg = "Error en el servidor (404/500)";
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error || errorMsg;
                } catch (e) {}
                throw new Error(errorMsg);
            }
            const data = await res.json();

            if (data.results) {
                setResearchResults(data.results);
                const newHist = {
                    id: Date.now().toString(),
                    name: researchName,
                    description: researchDescription,
                    date: new Date().toLocaleDateString(),
                    results: data.results
                };
                const updatedHist = [newHist, ...researchHistory];
                setResearchHistory(updatedHist);
                localStorage.setItem(getUKey("clickads_research_history"), JSON.stringify(updatedHist));
                setToast({ msg: "Investigación completada y guardada", type: 'success' });
            } else {
                throw new Error(data.error || "No se pudo generar. Revisa tu API Key.");
            }
        } catch (e: any) {
            setToast({ msg: e.message, type: 'error' });
        } finally {
            setIsResearchLoading(false);
        }
    };

    const ColorPicker = ({ label, color, onChange }: { label: string, color: string, onChange: (c: string) => void }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase" }}>{label}</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ position: "relative", width: 44, height: 44, borderRadius: 12, border: "2px solid rgba(255,255,255,0.1)", background: color, cursor: "pointer", overflow: "hidden" }}>
                    <input type="color" value={color} onChange={(e) => onChange(e.target.value)} style={{ position: "absolute", top: -10, left: -10, width: 64, height: 64, cursor: "pointer" }} />
                </div>
                <input className="input-field" style={{ padding: "10px 16px", width: 120, fontSize: 13, textTransform: "uppercase" }} value={color} onChange={(e) => onChange(e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6, marginTop: 4 }}>
                {CANVA_PRESETS.map(c => (
                    <div key={c} onClick={() => onChange(c)} style={{ width: "100%", aspectRatio: "1/1", borderRadius: 4, background: c, cursor: "pointer", border: color === c ? "2px solid #fff" : "1px solid rgba(255,255,255,0.1)" }} />
                ))}
            </div>
        </div>
    );


    const toggleLike = (postId: string) => {
        const updatedPosts = posts.map(p => {
            if (p.id === postId) {
                const liked = !p.likedByMe;
                return { ...p, likedByMe: liked, likes: liked ? p.likes + 1 : p.likes - 1 };
            }
            return p;
        });
        setPosts(updatedPosts);
        localStorage.setItem("clickads_community_posts", JSON.stringify(updatedPosts));
    };

    const [commentingTo, setCommentingTo] = useState<string | null>(null);
    const [tempComment, setTempComment] = useState("");

    const addComment = (postId: string) => {
        if (!tempComment.trim()) return;
        const newComment: Comment = {
            id: Math.random().toString(),
            author: user?.name || "Usuario",
            authorAvatar: getAvatarUrl(),
            content: tempComment,
            timestamp: Date.now()
        };
        const updatedPosts = posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p);
        setPosts(updatedPosts);
        localStorage.setItem("clickads_community_posts", JSON.stringify(updatedPosts));
        setTempComment("");
        setCommentingTo(null);
        setToast({ msg: "Comentario añadido", type: 'success' });
    };

    const togglePinComment = (postId: string, commentId: string) => {
        if (!isAdmin) return;
        const updatedPosts = posts.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    comments: p.comments.map(c => c.id === commentId ? { ...c, isPinned: !c.isPinned } : c)
                };
            }
            return p;
        });
        setPosts(updatedPosts);
        localStorage.setItem("clickads_community_posts", JSON.stringify(updatedPosts));
        setToast({ msg: "Estado de anclaje actualizado", type: 'success' });
    };

    return (
        <div style={{ background: "#030303", minHeight: "100vh", color: "#fff", fontFamily: "Inter, sans-serif", display: "flex" }}>
            {tutorialVideoOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', padding: 24 }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: 1000, background: '#000', borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)' }}>
                        <button onClick={() => setTutorialVideoOpen(null)} style={{ position: 'absolute', top: -20, right: -20, background: '#EF4444', border: 'none', color: '#fff', width: 40, height: 40, borderRadius: 20, cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                            <X size={20} />
                        </button>
                        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 24, overflow: 'hidden' }}>
                            <iframe
                                src={tutorialVideoOpen}
                                frameBorder="0"
                                allowFullScreen
                                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                            </iframe>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                ${GOOGLE_FONTS.map(f => `@import url('https://fonts.googleapis.com/css2?family=${f.replace(/ /g, '+')}:wght@400;700;900&display=swap');`).join('\n')}
                .glass-card { background: rgba(10, 10, 15, 0.8); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 32px; backdrop-filter: blur(12px); }
                .btn-primary { background: #fed627; color: #000; border: none; padding: 16px 32px; border-radius: 16px; font-weight: 800; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 10px; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(254, 214, 39, 0.4); }
                .input-field { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; color: #fff; padding: 16px; width: 100%; outline: none; transition: 0.2s; }
                .input-field option { background: #111; color: #fff; }

                .nav-item { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 12px; cursor: pointer; transition: 0.2s; color: #6B7280; font-weight: 600; font-size: 14px; border: 1px solid transparent; }
                .nav-item:hover { color: #D1D5DB; background: rgba(255,255,255,0.03); }
                .nav-item.active { background: rgba(254, 214, 39,0.08); border-color: rgba(254, 214, 39,0.15); color: #fed627; }
                .project-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 24px; cursor: pointer; transition: 0.2s; }
                .project-card:hover { border-color: #fed627; background: rgba(255,255,255,0.04); }
                .community-cat { padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 14px; color: #9CA3AF; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
                .community-cat.active { background: #fed627; color: #000; }
                .post-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 24px; margin-bottom: 20px; transition: 0.2s; position: relative; }
                .stat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 12px; }
                .home-stat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 28px 24px; display:flex; flex-direction:column; gap:8px; transition:0.2s; }
                .home-stat:hover { border-color: rgba(254, 214, 39,0.25); background: rgba(254, 214, 39,0.04); }
                .home-tool-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 24px; cursor:pointer; transition:0.2s; display:flex; flex-direction:column; gap:12px; }
                .home-tool-card:hover { border-color: rgba(254, 214, 39,0.3); background: rgba(254, 214, 39,0.04); transform: translateY(-2px); }
                .home-proj-row { display:flex; align-items:center; gap:16px; padding:14px 20px; border-radius:14px; transition:0.2s; cursor:pointer; }
                .home-proj-row:hover { background: rgba(255,255,255,0.04); }
                @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
                .anim-in { animation: fadeInUp 0.4s ease forwards; }
                .bar-col { display:flex; flex-direction:column; align-items:center; gap:6px; flex:1; }

                /* SLA Specific Styles */
                .hero-card { background: #0A0A0A; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 40px; position: relative; overflow: hidden; }
                .lesson-item { display: flex; align-items: center; gap: 16px; padding: 12px 16px; border-radius: 12px; cursor: pointer; transition: 0.2s; }
                .lesson-item:hover { background: rgba(255,255,255,0.03); transform: translateX(4px); }
                .btn-purple { background: #fed627; color: #000; border: none; padding: 14px 24px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; width: 100%; font-size: 14px; }
                .btn-purple:hover { background: #e5c123; transform: scale(1.02); }
                .progress-bar { height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; position: relative; }
                .progress-fill { height: 100%; background: #fed627; border: 1px solid rgba(255,255,255,0.05); }

                .image-zoom-container:hover .hover-zoom { transform: scale(1.05); }
                .image-zoom-container:hover .zoom-overlay { opacity: 1 !important; }
                .biblioteca-card:hover { border-color: rgba(254,214,39,0.25) !important; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
                .biblioteca-card:hover .hover-zoom { transform: scale(1.06); }
                .biblioteca-card:hover .zoom-overlay { opacity: 1 !important; }

                @media print {
                    @page { margin: 15mm; size: auto; }
                    body, html, main { background: #fff !important; color: #000 !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; height: auto !important; }
                    aside, .no-print, button, nav, .btn-primary { display: none !important; }
                    .print-module { break-inside: avoid; margin-bottom: 24px !important; border: 1px solid #ddd !important; background: #fff !important; border-radius: 8px !important; display: block !important; }
                    .print-module-header { display: flex !important; align-items: center !important; gap: 16px !important; background: #f9fafb !important; padding: 12px 16px !important; border-bottom: 1px solid #eee !important; justify-content: flex-start !important; }
                    .print-module-num { background: #e5e7eb !important; color: #000 !important; border: 1px solid #ccc !important; border-radius: 8px !important; padding: 6px 12px !important; font-weight: bold !important; font-family: monospace !important; }
                    .print-module-title { color: #000 !important; font-size: 16px !important; font-weight: 800 !important; margin-bottom: 4px !important; }
                    .print-module-desc { display: none !important; }
                    .print-module-body-open, .print-module-body-closed { display: block !important; padding: 16px !important; background: #fff !important; border: none !important; }
                    .print-text { color: #000 !important; font-size: 13px !important; line-height: 1.6 !important; white-space: pre-wrap !important; }
                    .glass-card { box-shadow: none !important; border: none !important; background: transparent !important; }
                    * { color: #000 !important; }
                }
            `}</style>

            {/* Sidebar */}
            <aside style={{ width: 280, borderRight: "1px solid rgba(255,255,255,0.05)", padding: "40px 24px", display: "flex", flexDirection: "column", height: "100vh", position: "fixed", background: "#050505" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 48, padding: "0 4px" }}>
                    <img src="/logo.png" alt="PosteA" style={{ width: 140, height: 40, objectFit: "contain" }} />
                </div>
                <nav style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
                    <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><Layout size={18} /> Dashboard</div>
                    <div className={`nav-item ${activeTab === 'marcas' ? 'active' : ''}`} onClick={() => setActiveTab('marcas')}><Briefcase size={18} /> Mis Marcas</div>
                    <div className={`nav-item ${activeTab === 'generator' ? 'active' : ''}`} onClick={() => setActiveTab('generator')}><Sparkles size={18} /> Genera Creativos</div>
                    <div className={`nav-item ${activeTab === 'photo_studio' ? 'active' : ''}`} onClick={() => setActiveTab('photo_studio')}><Camera size={18} /> Photo Studio</div>
                    <div className={`nav-item ${activeTab === 'biblioteca' ? 'active' : ''}`} onClick={() => setActiveTab('biblioteca')} style={{ position: 'relative' }}>
                        <Library size={18} /> Biblioteca
                        {bibliotecaItems.length > 0 && (
                            <span style={{ marginLeft: 'auto', background: '#fed627', color: '#000', fontSize: 10, fontWeight: 900, padding: '2px 7px', borderRadius: 100, minWidth: 18, textAlign: 'center' }}>
                                {bibliotecaItems.length}
                            </span>
                        )}
                    </div>
                    <div className={`nav-item ${activeTab === 'planificador' ? 'active' : ''}`} onClick={() => setActiveTab('planificador')}>
                        <Calendar size={18} /> Planificador
                    </div>

                    <div className={`nav-item ${activeTab === 'clickads' ? 'active' : ''}`} onClick={() => setActiveTab('clickads')}><Globe size={18} color="#fed627" /> ClickADS</div>
                </nav>

                {user && (
                    <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                        <img src={getAvatarUrl()} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.05)" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
                            <div style={{ fontSize: 10, color: "#6B7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
                        </div>
                    </div>
                )}


                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                    <button onClick={() => { setTempApiKey(apiKey); setShowApiModal(true); }} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF", padding: "12px 24px", borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}><Key size={14} /> Configuración API</button>
                    <button
                        onClick={() => { localStorage.removeItem("clickads_user"); router.push("/login"); }}
                        style={{ color: "#4B5563", background: "none", border: "none", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, padding: "0 24px", cursor: "pointer", textAlign: "left" }}
                    >
                        <LogOut size={14} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: 300, flex: 1, padding: "40px 20px", overflowX: 'hidden' }}>




                {activeTab === 'marcas' && (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
                        {!activeBrandId ? (
                            <>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                    <div>
                                        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                                            <Briefcase size={28} color="#fed627" /> Mis Marcas
                                        </h1>
                                        <p style={{ color: "#9CA3AF", fontSize: 15, maxWidth: 600, lineHeight: 1.5 }}>
                                            Organiza tus productos por marca. Crea una nueva marca para empezar a clasificar tu inventario y agilizar la generación de contenido.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setShowNewBrandModal(true)}
                                        className="btn-primary" 
                                        style={{ padding: "12px 24px", fontSize: 14 }}
                                    >
                                        <Plus size={16} /> Crear Marca
                                    </button>
                                </div>

                                {savedBrands.length === 0 ? (
                                    <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 24, border: "1px dashed rgba(255,255,255,0.1)" }}>
                                        <Briefcase size={40} color="#4B5563" style={{ margin: "0 auto 20px" }} />
                                        <h4 style={{ color: "#D1D5DB", fontSize: 18, fontWeight: 800, marginBottom: 12 }}>No tienes marcas creadas</h4>
                                        <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
                                            Crea tu primera marca para empezar a agregar productos y generar posts y carruseles estructurados.
                                        </p>
                                        <button 
                                            onClick={() => setShowNewBrandModal(true)}
                                            className="btn-primary"
                                            style={{ margin: "0 auto" }}
                                        >
                                            + Crear mi primera marca
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
                                        {savedBrands.map(b => (
                                            <div 
                                                key={b.id} 
                                                onClick={() => setActiveBrandId(b.id)}
                                                className="glass-card"
                                                style={{ padding: 24, cursor: "pointer", transition: "0.2s", display: "flex", flexDirection: "column", gap: 16 }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                    {b.logo ? (
                                                        <div style={{ width: 60, height: 60, borderRadius: 16, overflow: "hidden", background: "#fff", flexShrink: 0 }}>
                                                            <img src={b.logo} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
                                                        </div>
                                                    ) : (
                                                        <div style={{ width: 60, height: 60, borderRadius: 16, background: b.colorPrimario || "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: getIconColor(b.colorPrimario), flexShrink: 0 }}>
                                                            {b.nombre.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div style={{ flex: 1 }}>
                                                        <h3 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 4px 0" }}>{b.nombre}</h3>
                                                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                                                            {savedProducts.filter(p => p.marcaId === b.id).length} Productos
                                                        </span>
                                                    </div>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteBrand(b.id); }}
                                                        style={{ background: "transparent", border: "none", color: "#6B7280", cursor: "pointer", padding: 8 }}
                                                        title="Eliminar Marca"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            // BRAND DETAIL VIEW
                            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                {(() => {
                                    const b = savedBrands.find(br => br.id === activeBrandId);
                                    if (!b) return null;
                                    const brandProducts = savedProducts.filter(p => p.marcaId === b.id);
                                    return (
                                        <>
                                            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                                                <button 
                                                    onClick={() => setActiveBrandId(null)}
                                                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                                >
                                                    <ArrowLeft size={18} />
                                                </button>
                                                <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, display: "flex", alignItems: "center", gap: 12 }}>
                                                    {b.logo ? (
                                                        <img src={b.logo} style={{ width: 32, height: 32, objectFit: "contain", background: "#fff", borderRadius: 8, padding: 2 }} />
                                                    ) : (
                                                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: b.colorPrimario }} />
                                                    )}
                                                    {b.nombre}
                                                </h1>
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                                <div>
                                                    <h3 style={{ fontSize: 16, fontWeight: 900, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}><Box size={16} color={b.colorPrimario || "#fed627"} /> Productos de la Marca</h3>
                                                    <p style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.4 }}>Gestiona el inventario y genera contenido cruzado.</p>
                                                </div>
                                                <button 
                                                    onClick={() => setShowNewProductModal(true)}
                                                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                                                >
                                                    <Plus size={14} /> Nuevo producto
                                                </button>
                                            </div>

                                            {brandProducts.length === 0 ? (
                                                <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.1)" }}>
                                                    <Box size={32} color="#4B5563" style={{ margin: "0 auto 16px" }} />
                                                    <h4 style={{ color: "#D1D5DB", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Esta marca no tiene productos</h4>
                                                    <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 20 }}>Añade productos a {b.nombre} para autocompletar tus creativos.</p>
                                                    <button 
                                                        onClick={() => setShowNewProductModal(true)}
                                                        className="btn-primary"
                                                        style={{ padding: "10px 24px", fontSize: 13, margin: "0 auto" }}
                                                    >
                                                        + Crear producto en {b.nombre}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                                                    {brandProducts.map(p => (
                                                        <div key={p.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, position: "relative" }}>
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                                                <div>
                                                                    <h4 style={{ color: "#fff", fontSize: 15, fontWeight: 800, margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: 6 }}>
                                                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.colorMarca || "#fed627" }} />
                                                                        {p.nombre}
                                                                    </h4>
                                                                    <span style={{ fontSize: 11, color: "#9CA3AF", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 12 }}>{p.categoria}</span>
                                                                </div>
                                                                <div style={{ display: "flex", gap: 4 }}>
                                                                    <button onClick={() => handleDeleteProduct(p.id)} style={{ background: "transparent", border: "none", color: "#6B7280", cursor: "pointer", padding: 4 }} title="Eliminar">
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            {p.imagenes && p.imagenes.length > 0 && (
                                                                <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto" }}>
                                                                    {p.imagenes.map((img, i) => (
                                                                        <div key={i} style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
                                                                            <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                                <button 
                                                                    onClick={() => handleGeneratePostsFromProduct(p)}
                                                                    style={{ background: "rgba(254, 214, 39, 0.1)", border: "1px solid rgba(254, 214, 39, 0.2)", color: "#fed627", padding: "8px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}
                                                                >
                                                                    <Send size={12} /> Generar Posts
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleGenerateCarouselFromProduct(p)}
                                                                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#D1D5DB", padding: "8px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}
                                                                >
                                                                    <Layers size={12} /> Generar Carrusel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'dashboard' && (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
                        {/* Welcome Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 6 }}>Hola, {user?.name || "Creador"} 👋</h1>
                                <p style={{ color: "#6B7280", fontSize: 14 }}>Bienvenido al centro de mando de PosteA. Aquí tienes tus estadísticas y accesos rápidos.</p>
                            </div>
                            <div style={{ background: "rgba(254,214,39,0.1)", border: "1px solid rgba(254,214,39,0.25)", color: "#fed627", padding: "10px 20px", borderRadius: 16, fontSize: 13, fontWeight: 800 }}>
                                API Gemini: {apiKey ? "🟢 Conectada" : "🔴 Sin Configurar"}
                            </div>
                        </div>

                        {/* Metric Grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
                            {/* Metric 1 */}
                            <div className="glass-card" style={{ padding: 24, borderRadius: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 12, fontWeight: 900, color: "#6B7280", textTransform: "uppercase" }}>Imágenes creadas</span>
                                    <Library size={18} color="#fed627" />
                                </div>
                                <div style={{ fontSize: 32, fontWeight: 900 }}>{bibliotecaItems.length}</div>
                                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Imágenes guardadas en tu biblioteca</div>
                            </div>
                            {/* Metric 2 */}
                            <div className="glass-card" style={{ padding: 24, borderRadius: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 12, fontWeight: 900, color: "#6B7280", textTransform: "uppercase" }}>Proyectos Activos</span>
                                    <Folder size={18} color="#10B981" />
                                </div>
                                <div style={{ fontSize: 32, fontWeight: 900 }}>{projects.length}</div>
                                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Estructuras y productos guardados</div>
                            </div>
                            {/* Metric 3 */}
                            <div className="glass-card" style={{ padding: 24, borderRadius: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 12, fontWeight: 900, color: "#6B7280", textTransform: "uppercase" }}>Tipo de Formato</span>
                                    <Layers size={18} color="#8B5CF6" />
                                </div>
                                <div style={{ fontSize: 24, fontWeight: 900 }}>Vertical 4:5</div>
                                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Optimizado para alto CTR en Meta/IG</div>
                            </div>
                        </div>

                        {/* Middle Section: Recent Projects & Quick Tips */}
                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
                            {/* Recent Projects */}
                            <div className="glass-card" style={{ padding: 24, borderRadius: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Marcas Recientes</h3>
                                {savedBrands.length === 0 ? (
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", color: "#6B7280" }}>
                                        <Briefcase size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                                        <p style={{ fontSize: 13, margin: 0, textAlign: "center" }}>No tienes marcas creadas todavía.</p>
                                        <button onClick={() => { setActiveTab('marcas'); setShowNewBrandModal(true); }} className="btn-primary" style={{ marginTop: 12, padding: "8px 16px", fontSize: 12 }}>Crear primera marca</button>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        {savedBrands.slice(0, 4).map(b => (
                                            <div 
                                                key={b.id} 
                                                onClick={() => { setActiveBrandId(b.id); setActiveTab('marcas'); }}
                                                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, cursor: "pointer", transition: "background 0.2s" }}
                                                className="project-row-hover"
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                    {b.logo ? (
                                                        <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", background: "#fff", flexShrink: 0 }}>
                                                            <img src={b.logo} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 2 }} />
                                                        </div>
                                                    ) : (
                                                        <div style={{ width: 36, height: 36, borderRadius: 8, background: b.colorPrimario || "#fed627", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: getIconColor(b.colorPrimario), fontSize: 14 }}>
                                                            {b.nombre.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div style={{ fontSize: 13, fontWeight: 800 }}>{b.nombre}</div>
                                                        <div style={{ fontSize: 10, color: "#6B7280" }}>
                                                            {savedProducts.filter(p => p.marcaId === b.id).length} Productos
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} color="#6B7280" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Tips and Quick Links */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                {/* Tips */}
                                <div className="glass-card" style={{ padding: 24, borderRadius: 24, background: "linear-gradient(135deg, rgba(139,92,246,0.07) 0%, rgba(236,72,153,0.03) 100%)", border: "1px solid rgba(139,92,246,0.15)", display: "flex", flexDirection: "column", gap: 12 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <Sparkles size={16} color="#8B5CF6" />
                                        <span style={{ fontSize: 12, fontWeight: 900, color: "#8B5CF6", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tip de Conversión</span>
                                    </div>
                                    <p style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.5, margin: 0 }}>
                                        "Los carruseles verticales **4:5** en Instagram tienen un **30% más de interacción** que los formatos cuadrados. Asegúrate de incluir el texto clave en el centro para evitar cortes en el feed."
                                    </p>
                                </div>

                                {/* Quick Links */}
                                <div className="glass-card" style={{ padding: 24, borderRadius: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                                    <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Accesos Rápidos</h3>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                        <button onClick={() => setActiveTab('generator')} className="btn-primary" style={{ padding: "12px", borderRadius: 12, fontSize: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, justifyContent: "center", height: 70, border: "none" }}>
                                            <Sparkles size={16} /> Genera Creativos
                                        </button>
                                        <button onClick={() => setActiveTab('photo_studio')} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "12px", borderRadius: 12, fontSize: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, justifyContent: "center", height: 70, cursor: "pointer" }}>
                                            <Camera size={16} color="#10B981" /> Photo Studio
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ClickADS Banner */}
                        <div 
                            className="glass-card" 
                            style={{ 
                                padding: "28px 32px", 
                                borderRadius: 24, 
                                background: "linear-gradient(135deg, rgba(254, 214, 39, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)", 
                                border: "1px solid rgba(254, 214, 39, 0.15)",
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "space-between", 
                                gap: 24,
                                flexWrap: "wrap",
                                position: "relative",
                                overflow: "hidden",
                                marginTop: 12
                            }}
                        >
                            {/* Decorative background glow */}
                            <div style={{ position: "absolute", right: "-10%", top: "-50%", width: 300, height: 300, borderRadius: "50%", background: "rgba(254, 214, 39, 0.05)", filter: "blur(60px)", pointerEvents: "none" }} />
                            
                            <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1, minWidth: 280, position: "relative", zIndex: 2 }}>
                                <div style={{ 
                                    width: 60, 
                                    height: 60, 
                                    borderRadius: 16, 
                                    background: "linear-gradient(135deg, #fed627 0%, #ff9900 100%)", 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    color: "#000",
                                    fontWeight: 900,
                                    fontSize: 24,
                                    boxShadow: "0 8px 24px rgba(254, 214, 39, 0.2)",
                                    flexShrink: 0
                                }}>
                                    CA
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                                        ClickADS
                                        <span style={{ fontSize: 9, fontWeight: 900, background: "#fed627", color: "#000", padding: "2px 6px", borderRadius: 4, textTransform: "uppercase" }}>Pro</span>
                                    </h3>
                                    <p style={{ fontSize: 14, color: "#9CA3AF", margin: 0, lineHeight: 1.5 }}>
                                        Si buscas imágenes para pauta, esta es nuestra app estrella. Lleva tus anuncios al siguiente nivel con IA de alta conversión.
                                    </p>
                                </div>
                            </div>
                            
                            <a 
                                href="https://pay.hotmart.com/K105295235F?off=63n0f59e&bid=1779591976914" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{ 
                                    background: "#fed627", 
                                    color: "#000", 
                                    padding: "14px 28px", 
                                    borderRadius: 14, 
                                    fontSize: 13, 
                                    fontWeight: 900, 
                                    textDecoration: "none", 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: 8,
                                    transition: "all 0.2s",
                                    boxShadow: "0 4px 12px rgba(254, 214, 39, 0.15)",
                                    position: "relative",
                                    zIndex: 2
                                }}
                                className="clickads-btn"
                            >
                                Descubrir ClickADS <ChevronRight size={16} />
                            </a>
                        </div>
                    </div>
                )}

                {activeTab === 'clickads' && (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
                        {/* Header */}
                        <div>
                            <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 6, display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ color: "#fed627" }}>ClickADS</span> Pro
                            </h1>
                            <p style={{ color: "#6B7280", fontSize: 14 }}>Nuestra aplicación estrella para la creación de imágenes y creativos de pauta publicitaria.</p>
                        </div>

                        {/* Banner Principal */}
                        <div className="glass-card" style={{ padding: 40, borderRadius: 28, background: "linear-gradient(135deg, rgba(254, 214, 39, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)", border: "1px solid rgba(254, 214, 39, 0.2)", position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", right: "-10%", top: "-30%", width: 400, height: 400, borderRadius: "50%", background: "rgba(254, 214, 39, 0.05)", filter: "blur(80px)", pointerEvents: "none" }} />
                            
                            <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 20, position: "relative", zIndex: 2 }}>
                                <div style={{ background: "rgba(254, 214, 39, 0.15)", color: "#fed627", fontSize: 11, fontWeight: 900, padding: "6px 12px", borderRadius: 8, alignSelf: "flex-start", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    App de Pautas Estrella
                                </div>
                                <h2 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2, margin: 0 }}>
                                    ¿Buscas imágenes para pauta publicitaria de alto rendimiento?
                                </h2>
                                <p style={{ fontSize: 15, color: "#D1D5DB", lineHeight: 1.6, margin: 0 }}>
                                    Lleva tus campañas de Meta, TikTok y Google Ads al siguiente nivel. Genera ángulos psicológicos ilimitados, variaciones de creativos y copies hiper-persuasivos en segundos.
                                </p>
                                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                                    <a 
                                        href="https://pay.hotmart.com/K105295235F?off=63n0f59e&bid=1779591976914" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn-primary"
                                        style={{ 
                                            padding: "14px 28px", 
                                            borderRadius: 14, 
                                            fontSize: 14, 
                                            fontWeight: 900, 
                                            textDecoration: "none", 
                                            display: "flex", 
                                            alignItems: "center", 
                                            gap: 8,
                                            boxShadow: "0 8px 24px rgba(254, 214, 39, 0.2)"
                                        }}
                                    >
                                        Ir a la App Estrella <ChevronRight size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Grid de Características */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                            <div className="glass-card" style={{ padding: 24, borderRadius: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(254, 214, 39, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fed627" }}>
                                    <Sparkles size={20} />
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Creativos con IA</h3>
                                <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0, lineHeight: 1.5 }}>
                                    Diseño automatizado basado en datos de conversión reales para superar la fatiga de anuncios.
                                </p>
                            </div>

                            <div className="glass-card" style={{ padding: 24, borderRadius: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                                    <Layers size={20} />
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Variación de Ángulos</h3>
                                <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0, lineHeight: 1.5 }}>
                                    Prueba diferentes motivadores de compra (ahorro, estatus, urgencia) con un solo clic.
                                </p>
                            </div>

                            <div className="glass-card" style={{ padding: 24, borderRadius: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(139, 92, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8B5CF6" }}>
                                    <Globe size={20} />
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Distribución Global</h3>
                                <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0, lineHeight: 1.5 }}>
                                    Exporta en formatos óptimos listos para subir a tu administrador de anuncios de Meta o TikTok.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'generator' && (
                    <div style={{ width: "100%" }}>
                        <div style={{ marginBottom: 24 }}>
                            <button onClick={() => setTutorialVideoOpen('https://www.loom.com/embed/0d6c811957394d4e822ddef39cf57978')} style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(254, 214, 39, 0.1)', color: '#fed627', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
                                <PlayCircle size={16} /> Ir a video tutorial de esta sección
                            </button>
                        </div>
                        {!activeProjectId ? (
                            <>
                                <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40 }}>Mis Proyectos</h1>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                                    <div onClick={() => setShowProjectModal(true)} className="project-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, border: "2px dashed rgba(254, 214, 39,0.3)" }}>
                                        <Plus size={24} /> <span style={{ fontWeight: 800 }}>Nuevo Proyecto</span>
                                    </div>
                                    {projects.filter(p => !p.type || p.type === 'ecommerce').map(project => (
                                        <div key={project.id} onClick={() => setActiveProjectId(project.id)} className="project-card">
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                                                <div style={{ display: "flex", gap: 4 }}>
                                                    <div style={{ width: 32, height: 32, background: project.primaryColor || "#fed627", borderRadius: 8 }} />
                                                    <div style={{ width: 16, height: 32, background: project.secondaryColor || "#FFFFFF", borderRadius: 4 }} />
                                                </div>
                                                <button onClick={(e) => deleteProject(project.id, e)} style={{ background: "none", border: "none", color: "#4B5563", cursor: "pointer" }}><Trash2 size={16} /></button>
                                            </div>
                                            <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: project.font }}>{project.name}</h3>
                                            {project.marcaId && (
                                                <div style={{ fontSize: 11, color: "#fed627", marginTop: 4, fontWeight: 800 }}>
                                                    MARCA ASOCIADA
                                                </div>
                                            )}
                                            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{(project.results || []).filter(r => !r.isLanding).length} creativos</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
                                    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                                        <button onClick={() => setActiveProjectId(null)} style={{ color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}><ArrowLeft size={16} /> Volver</button>
                                        <button onClick={() => updateActiveProject({ results: [], productPreview: "" })} style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#EF4444", padding: "6px 16px", borderRadius: 100, fontSize: 11, fontWeight: 800, cursor: "pointer" }}>Empezar de nuevo</button>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.5 }}>PROYECTO ACTIVO</div>
                                        <div style={{ fontWeight: 900, fontSize: 24, fontFamily: activeProject?.font, color: activeProject?.primaryColor }}>{activeProject?.name}</div>
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40, maxWidth: 600, margin: "0 auto" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                                                                {activeProject?.marcaId && savedProducts.filter(p => p.marcaId === activeProject.marcaId).length > 0 && (
                                            <div className="glass-card" style={{ padding: 40, height: "fit-content" }}>
                                                <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 16, color: activeProject?.primaryColor || "#fed627", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}><Box size={18} /> Elegir Productos</h3>
                                                <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>Selecciona uno o varios productos de la marca para incluirlos en la generación de tus posts o carruseles.</p>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                                    {savedProducts.filter(p => p.marcaId === activeProject.marcaId).map(p => {
                                                        const isSelected = selectedProjectProducts.includes(p.id);
                                                        const currentCount = productImageCounts[p.id] || 1;
                                                        
                                                        // Calculate sum of counts of other selected products
                                                        const otherSelectedCounts = selectedProjectProducts.filter(id => id !== p.id).reduce((sum, id) => sum + (productImageCounts[id] || 1), 0);
                                                        const maxAllowedForThis = Math.max(1, 5 - otherSelectedCounts);

                                                        return (
                                                        <div key={p.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                            <label style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "rgba(255,255,255,0.03)", border: isSelected ? `2px solid ${activeProject?.primaryColor || "#fed627"}` : "2px solid rgba(255,255,255,0.05)", borderRadius: 16, cursor: "pointer", transition: "0.2s" }}>
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={isSelected}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            if (selectedProjectProducts.length >= 3) {
                                                                                setToast({ msg: "Máximo 3 productos permitidos para generación.", type: 'error' });
                                                                            } else {
                                                                                const currentTotal = selectedProjectProducts.reduce((sum, id) => sum + (productImageCounts[id] || 1), 0);
                                                                                if (currentTotal >= 5) {
                                                                                    setToast({ msg: "Límite de 5 imágenes alcanzado. Reduce el número de otro producto para poder añadir este.", type: 'error' });
                                                                                } else {
                                                                                    setSelectedProjectProducts(prev => [...prev, p.id]);
                                                                                    setProductImageCounts(prev => ({ ...prev, [p.id]: 1 }));
                                                                                }
                                                                            }
                                                                        }
                                                                        else {
                                                                            setSelectedProjectProducts(prev => prev.filter(id => id !== p.id));
                                                                            setProductImageCounts(prev => {
                                                                                const updated = { ...prev };
                                                                                delete updated[p.id];
                                                                                return updated;
                                                                            });
                                                                        }
                                                                    }}
                                                                    style={{ width: 18, height: 18, accentColor: activeProject?.primaryColor || "#fed627", cursor: "pointer" }}
                                                                />
                                                                <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1, minWidth: 0 }}>
                                                                    {p.imagenes?.[0] ? <img src={p.imagenes[0]} style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover" }} /> : <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}><Box size={14} color="#9CA3AF" /></div>}
                                                                    <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.nombre}</div>
                                                                </div>
                                                            </label>
                                                            {isSelected && (
                                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", background: "rgba(0,0,0,0.2)", borderRadius: 12, paddingBottom: 8, paddingTop: 8, marginTop: -4 }}>
                                                                    <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700 }}>Cuántas imágenes (de 5):</span>
                                                                    <input 
                                                                        type="number" 
                                                                        min={1} 
                                                                        max={maxAllowedForThis}
                                                                        value={currentCount} 
                                                                        onChange={(e) => {
                                                                            const val = parseInt(e.target.value) || 1;
                                                                            const newCount = Math.max(1, Math.min(maxAllowedForThis, val));
                                                                            setProductImageCounts(prev => ({ ...prev, [p.id]: newCount }));
                                                                        }}
                                                                        style={{ 
                                                                            width: 50, 
                                                                            padding: "4px 8px", 
                                                                            background: "rgba(255,255,255,0.05)", 
                                                                            border: "1px solid rgba(255,255,255,0.1)", 
                                                                            borderRadius: 8, 
                                                                            color: "#fff", 
                                                                            fontSize: 12, 
                                                                            textAlign: "center" 
                                                                        }} 
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )})}
                                                </div>
                                            </div>
                                        )}


                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                            {/* Card 2: Instagram Content Planner */}
                                            <div className="glass-card" style={{ padding: 24, height: "100%", display: "flex", flexDirection: "column" }}>
                                                <h3 style={{ fontSize: 16, fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={16} color={activeProject?.primaryColor || "#fed627"} /> 5 Posts Completos</h3>
                                                <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 20, lineHeight: 1.4, flex: 1 }}>Genera 5 posts listos para publicar (imagen, copy persuasivo y hashtags) basados en tus productos.</p>
                                                
                                                <button 
                                                    className="btn-primary" 
                                                    style={{ width: "100%", justifyContent: "center", background: activeProject?.primaryColor || "#fed627", color: activeProject?.primaryColor ? "#fff" : "#000", padding: "12px 16px" }} 
                                                    onClick={handleGenerateInstagram} 
                                                    disabled={isGeneratingInstagram || selectedProjectProducts.length === 0}
                                                >
                                                    {isGeneratingInstagram ? <Loader2 className="animate-spin" /> : <><Send size={14} /> Generar 5 Posts</>}
                                                </button>
                                            </div>

                                            {/* Card 3: Carrusel Generator */}
                                            <div className="glass-card" style={{ padding: 24, height: "100%", display: "flex", flexDirection: "column" }}>
                                                <h3 style={{ fontSize: 16, fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}><Layers size={16} color={activeProject?.primaryColor || "#fed627"} /> Carrusel Completo</h3>
                                                <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 12, lineHeight: 1.4 }}>Genera un carrusel completo de 5 a 7 slides basado en tus productos.</p>
                                                
                                                <textarea 
                                                    className="input-field" 
                                                    placeholder="¿De qué quieres que trate el carrusel? (Opcional)" 
                                                    style={{ height: 60, resize: "none", marginBottom: 12, fontSize: 12, padding: 12, flex: 1 }}
                                                    value={carouselTema}
                                                    onChange={(e) => setCarouselTema(e.target.value)}
                                                />

                                                <button 
                                                    className="btn-primary" 
                                                    style={{ width: "100%", justifyContent: "center", background: activeProject?.primaryColor || "#fed627", color: activeProject?.primaryColor ? "#fff" : "#000", padding: "12px 16px" }} 
                                                    onClick={handleGenerateCarousel} 
                                                    disabled={isGeneratingCarousel || selectedProjectProducts.length === 0}
                                                >
                                                    {isGeneratingCarousel ? <Loader2 className="animate-spin" /> : <><Layers size={14} /> Generar Carrusel</>}
                                                </button>
                                            </div>
                                        </div>

                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>


{/* NEW INSTAGRAM POSTS */}
                                        {instagramPosts.length > 0 && (
                                            <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 12 }}>
                                                <h3 style={{ fontSize: 20, fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}>
                                                    <Sparkles size={18} color={activeProject?.primaryColor || "#fed627"} />
                                                    Plan de Instagram
                                                </h3>
                                                
                                                {instagramPosts.map((post: any) => (
                                                    <div 
                                                        key={post.id} 
                                                        className="glass-card" 
                                                        style={{ 
                                                            padding: "16px", 
                                                            borderRadius: "20px", 
                                                            border: "1px solid rgba(255, 255, 255, 0.08)",
                                                            background: "rgba(255, 255, 255, 0.03)",
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "12px"
                                                        }}
                                                    >
                                                        {/* Header Mockup */}
                                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                                <div 
                                                                    style={{ 
                                                                        width: "36px", 
                                                                        height: "36px", 
                                                                        borderRadius: "50%", 
                                                                        background: `linear-gradient(135deg, ${activeProject?.primaryColor || "#fed627"}, ${activeProject?.secondaryColor || "#EC4899"})`,
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        color: "#fff",
                                                                        fontSize: "14px",
                                                                        fontWeight: "bold"
                                                                    }}
                                                                >
                                                                    {activeProject?.name ? activeProject.name.substring(0, 2).toUpperCase() : "IG"}
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                                                                        {activeProject?.name || "Tu Marca"}
                                                                    </div>
                                                                    <div style={{ fontSize: "10px", color: "#9CA3AF" }}>
                                                                        Post {post.id} • {post.tipo}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <span 
                                                                style={{ 
                                                                    fontSize: "10px", 
                                                                    fontWeight: 800, 
                                                                    color: activeProject?.primaryColor || "#fed627", 
                                                                    background: `${activeProject?.primaryColor || "#fed627"}15`, 
                                                                    padding: "4px 8px", 
                                                                    borderRadius: "6px" 
                                                                }}
                                                            >
                                                                IG POST
                                                            </span>
                                                        </div>

                                                        {/* Post Image with Aspect Ratio 1:1 */}
                                                        <div 
                                                            onClick={() => post.image && setZoomedImage(post.image)}
                                                            style={{ 
                                                                width: "100%", 
                                                                aspectRatio: "3/4", 
                                                                borderRadius: "12px", 
                                                                overflow: "hidden", 
                                                                background: "rgba(255, 255, 255, 0.02)", 
                                                                border: "1px solid rgba(255, 255, 255, 0.05)", 
                                                                position: "relative", 
                                                                display: "flex", 
                                                                alignItems: "center", 
                                                                justifyContent: "center",
                                                                cursor: post.image ? "zoom-in" : "default"
                                                            }}
                                                        >
                                                            {post.image ? (
                                                                <>
                                                                    <img src={post.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            downloadSingleImage(post.image, `instagram_post_${post.id}`);
                                                                        }}
                                                                        style={{ 
                                                                            position: "absolute", 
                                                                            bottom: 12, 
                                                                            right: 12, 
                                                                            background: "rgba(0, 0, 0, 0.6)", 
                                                                            border: "1px solid rgba(255, 255, 255, 0.2)", 
                                                                            borderRadius: "50%", 
                                                                            width: 32, 
                                                                            height: 32, 
                                                                            display: "flex", 
                                                                            alignItems: "center", 
                                                                            justifyContent: "center", 
                                                                            cursor: "pointer", 
                                                                            color: "#fff",
                                                                            backdropFilter: "blur(4px)"
                                                                        }}
                                                                    >
                                                                        <Download size={14} />
                                                                    </button>
                                                                </>
                                                            ) : post.isGeneratingImage ? (
                                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "#9CA3AF" }}>
                                                                    <Loader2 className="animate-spin" size={24} color={activeProject?.primaryColor || "#fed627"} />
                                                                    <span style={{ fontSize: 11, fontWeight: 700 }}>Generando...</span>
                                                                </div>
                                                            ) : post.imageError ? (
                                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 16, textAlign: "center", gap: 8, color: "#EF4444" }}>
                                                                    <ShieldAlert size={24} />
                                                                    <span style={{ fontSize: 10, fontWeight: 800 }}>Error al generar imagen</span>
                                                                    <span style={{ fontSize: 9, opacity: 0.7 }}>{post.imageError}</span>
                                                                </div>
                                                            ) : (
                                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: 0.3 }}>
                                                                    <Image size={24} /> 
                                                                    <span style={{ fontSize: 10 }}>Sin imagen</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Details Section */}
                                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "rgba(255, 255, 255, 0.02)", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                                                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                                                <span style={{ fontSize: "9px", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Concepto</span>
                                                                <span style={{ fontSize: "12px", color: "#E5E7EB" }}>{post.concepto}</span>
                                                            </div>
                                                            {post.texto_en_imagen && post.texto_en_imagen.toLowerCase() !== 'ninguno' && (
                                                                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                                                    <span style={{ fontSize: "9px", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Texto en Imagen</span>
                                                                    <span style={{ fontSize: "12px", color: "#10B981", fontWeight: 700 }}>{post.texto_en_imagen}</span>
                                                                </div>
                                                            )}
                                                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                                                <span style={{ fontSize: "9px", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Fondo / Props</span>
                                                                <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{post.descripcion_imagen}</span>
                                                            </div>
                                                        </div>

                                                        {/* Caption / Copy Section */}
                                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                                            <div style={{ fontSize: "12px", color: "#D1D5DB", lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
                                                                <strong style={{ marginRight: "6px", color: "#fff" }}>{activeProject?.name || "Tu Marca"}</strong>
                                                                {post.caption}
                                                            </div>
                                                            
                                                            {/* Suggested Hashtags */}
                                                            {post.hashtags && post.hashtags.length > 0 && (
                                                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                                                                    {post.hashtags.map((tag: string, idx: number) => (
                                                                        <span key={idx} style={{ color: activeProject?.primaryColor || "#fed627", fontSize: "12px", fontWeight: 600 }}>
                                                                            {tag.startsWith("#") ? tag : `#${tag}`}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "4px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "12px" }}>
                                                            <button 
                                                                onClick={() => {
                                                                    const copyText = post.caption + "\n\n" + (post.hashtags || []).map((tag: string) => tag.startsWith("#") ? tag : `#${tag}`).join(" ");
                                                                    navigator.clipboard.writeText(copyText);
                                                                    setToast({ msg: "¡Caption y hashtags copiados!", type: 'success' });
                                                                }} 
                                                                style={{ 
                                                                    background: "rgba(255, 255, 255, 0.05)", 
                                                                    border: "none", 
                                                                    color: "#fff", 
                                                                    padding: "8px 12px", 
                                                                    borderRadius: "8px", 
                                                                    cursor: "pointer", 
                                                                    fontSize: "11px", 
                                                                    fontWeight: 800, 
                                                                    display: "flex", 
                                                                    alignItems: "center", 
                                                                    justifyContent: "center",
                                                                    gap: "6px" 
                                                                }}
                                                            >
                                                                <Bookmark size={12} /> Copiar Copy
                                                            </button>
                                                            <button 
                                                                onClick={() => setEditingPost({ ...post })}
                                                                style={{ 
                                                                    background: `${activeProject?.primaryColor || "#fed627"}20`, 
                                                                    border: `1px solid ${activeProject?.primaryColor || "#fed627"}40`, 
                                                                    color: activeProject?.primaryColor || "#fed627", 
                                                                    padding: "8px 12px", 
                                                                    borderRadius: "8px", 
                                                                    cursor: "pointer", 
                                                                    fontSize: "11px", 
                                                                    fontWeight: 800, 
                                                                    display: "flex", 
                                                                    alignItems: "center", 
                                                                    justifyContent: "center",
                                                                    gap: "6px" 
                                                                }}
                                                            >
                                                                <Edit3 size={12} /> Editar Post
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}


                                        {/* NEW CAROUSEL OUTPUT */}
                                        {carouselData && (
                                            <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 12 }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <h3 style={{ fontSize: 20, fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}>
                                                        <Layers size={18} color={activeProject?.primaryColor || "#fed627"} />
                                                        Carrusel: {carouselData.titulo}
                                                    </h3>
                                                    <button 
                                                        onClick={() => {
                                                            const validSlides = (carouselData.slides || []).filter((s:any) => s.image);
                                                            if(validSlides.length === 0) return setToast({msg: "No hay imágenes para descargar", type: "error"});
                                                            downloadAsZip(validSlides.map((s:any, idx:number) => ({ image: s.image, name: `carrusel_slide_${idx+1}` })), "carrusel_completo");
                                                        }}
                                                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "8px 16px", borderRadius: 12, cursor: "pointer", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}
                                                    >
                                                        <Download size={14} /> Descargar ZIP
                                                    </button>
                                                </div>
                                                
                                                <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center", paddingBottom: 32 }}>
                                                    {(carouselData.slides || []).map((slide: any, idx: number) => (
                                                        <div key={idx} className="glass-card" style={{ width: "100%", maxWidth: 500, padding: 24, borderRadius: 24, position: "relative" }}>
                                                            <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", color: "#fff", padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 900, zIndex: 10 }}>
                                                                {idx + 1} / {carouselData.slides.length}
                                                            </div>
                                                            <div 
                                                                onClick={() => slide.image && setZoomedImage(slide.image)}
                                                                style={{ width: "100%", aspectRatio: "3/4", borderRadius: 12, overflow: "hidden", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", position: "relative", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", cursor: slide.image ? "zoom-in" : "default" }}
                                                            >
                                                                {slide.image ? (
                                                                    <>
                                                                        <img src={slide.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                                        <button 
                                                                            onClick={(e) => { e.stopPropagation(); downloadSingleImage(slide.image, `slide_${idx+1}`); }}
                                                                            style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                                        >
                                                                            <Download size={12} />
                                                                        </button>
                                                                    </>
                                                                ) : slide.isGeneratingImage ? (
                                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#9CA3AF" }}><Loader2 className="animate-spin" size={20} color={activeProject?.primaryColor || "#fed627"} /><span style={{ fontSize: 10, fontWeight: 700 }}>Generando...</span></div>
                                                                ) : slide.imageError ? (
                                                                    <div style={{ color: "#EF4444", fontSize: 10, textAlign: "center", padding: 12 }}>Error: {slide.imageError}</div>
                                                                ) : <Image size={24} color="#4B5563" />}
                                                            </div>
                                                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                                <span style={{ fontSize: 9, fontWeight: 800, color: activeProject?.primaryColor || "#fed627", textTransform: "uppercase" }}>{slide.tipo}</span>
                                                                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, lineHeight: 1.2 }}>{slide.titulo}</h4>
                                                                {slide.cuerpo && <p style={{ margin: 0, fontSize: 11, color: "#D1D5DB", lineHeight: 1.4 }}>{slide.cuerpo}</p>}
                                                                {slide.texto_en_imagen && slide.texto_en_imagen !== 'ninguno' && (
                                                                    <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10B981", padding: "6px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700 }}>
                                                                        Texto en imagen: {slide.texto_en_imagen}
                                                                    </div>
                                                                )}
                                                                <button onClick={() => setCarouselEditingSlide(slide)} style={{ marginTop: 8, width: "100%", padding: "6px", background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 8, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Editar Slide</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}


                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'photo_studio' && (
                    <div style={{ width: "100%" }}>
                        <div style={{ marginBottom: 24 }}>
                            <button onClick={() => setTutorialVideoOpen('https://www.loom.com/embed/b9b611cefb724181b755d62b06dd96fe')} style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(254, 214, 39, 0.1)', color: '#fed627', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
                                <PlayCircle size={16} /> Ir a video tutorial de esta sección
                            </button>
                        </div>
                        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40 }}>Photo Studio</h1>
                        <p style={{ color: "#9CA3AF", fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>
                            Sube una foto de tu producto tomada con el teléfono. La Inteligencia Artificial eliminará el fondo, ajustará la iluminación y generará fotos en diferentes ángulos con fondo blanco puro, listas para usar en tus e-commerce.
                        </p>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                            <div className="glass-card" style={{ padding: 40, height: "fit-content" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#fed627", marginBottom: 12 }}>FOTO DEL PRODUCTO (TELÉFONO)</label>
                                        <div style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 24, height: 260, position: "relative", marginBottom: 24, overflow: "hidden" }}>
                                            <input type="file" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => setStudioInputImage(reader.result as string);
                                                    reader.readAsDataURL(file);
                                                }
                                            }} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} />
                                            {studioInputImage ? <img src={studioInputImage} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, opacity: 0.3 }}><UploadCloud /> <span>Sube tu foto aquí</span></div>}
                                        </div>
                                    </div>

                                    <button className="btn-primary" style={{ width: "100%", justifyContent: "center", background: "#fed627", color: "#000" }} onClick={handleGenerateStudio} disabled={isStudioLoading}>
                                        {isStudioLoading ? <Loader2 className="animate-spin" /> : <><Sparkles /> Generar en Alta Calidad</>}
                                    </button>
                                </div>
                            </div>

                            <div>
                                {(studioResults || []).length > 0 && (
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                        <h3 style={{ fontSize: 18, fontWeight: 800 }}>Resultados Full HD</h3>
                                        {studioResults.length > 1 && (
                                            <button
                                                onClick={() => downloadAsZip(studioResults.map((r, idx) => ({ image: r.image, name: `PhotoStudio_${idx}` })), "PhotoStudio_Results")}
                                                className="btn-primary"
                                                style={{ padding: "8px 16px", fontSize: 11, background: "rgba(255,255,255,0.05)", border: `1px solid #fed627`, color: "#fed627" }}
                                            >
                                                <Layers size={14} /> Descargar Todos (.ZIP)
                                            </button>
                                        )}
                                    </div>
                                )}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                    {(studioResults || []).map((res, i) => (
                                        <div key={i} className="glass-card" style={{ padding: 12, position: "relative" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                                <div style={{ fontSize: 10, fontWeight: 800, color: "#fed627" }}>{res.angle}</div>
                                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                                    <button onClick={() => downloadSingleImage(res.image, `PhotoStudio_${i}.jpg`)} style={{ background: "none", border: "none", color: "#fed627", cursor: "pointer" }}><Download size={16} /></button>
                                                    <button onClick={() => saveToLibrary(res.image, res.angle || "Photo Studio")} style={{ background: "none", border: "none", color: "#fed627", cursor: "pointer" }}>
                                                        <Bookmark size={16} fill={library.some(a => a.image === res.image) ? "#fed627" : "none"} />
                                                    </button>
                                                    <button onClick={() => setZoomedImage(res.image)} style={{ background: "none", border: "none", color: "#fed627", cursor: "pointer" }}>
                                                        <Search size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div
                                                style={{ position: "relative", cursor: "zoom-in", overflow: "hidden", borderRadius: 16 }}
                                                onClick={() => setZoomedImage(res.image)}
                                                className="image-zoom-container"
                                            >
                                                <img src={res.image} style={{ width: "100%", transition: "transform 0.3s ease" }} className="hover-zoom" />
                                                <div className="zoom-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s ease" }}>
                                                    <Search size={32} color="#fff" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* BIBLIOTECA TAB */}
                {activeTab === 'biblioteca' && (
                    <div style={{ width: "100%" }}>
                        {/* Header */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
                            <div>
                                <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 6, display: "flex", alignItems: "center", gap: 12 }}>
                                    <Library size={32} color="#fed627" /> Biblioteca
                                </h1>
                                <p style={{ color: "#6B7280", fontSize: 14 }}>
                                    {bibliotecaItems.length === 0 ? "Aquí aparecerán todas las imágenes que generes." : `${bibliotecaItems.length} imagen${bibliotecaItems.length !== 1 ? 'es' : ''} guardada${bibliotecaItems.length !== 1 ? 's' : ''}`}
                                </p>
                            </div>
                            {bibliotecaItems.length > 0 && (
                                <button
                                    onClick={() => {
                                        if (confirm('¿Eliminar toda la biblioteca?')) {
                                            setBibliotecaItems([]);
                                            const userId = (user as any)?.email || "global";
                                            imageDB.saveBiblioteca(userId, []);
                                            localStorage.removeItem('postea_biblioteca');
                                        }
                                    }}
                                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", padding: "10px 20px", borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                                >
                                    <Trash2 size={14} /> Limpiar todo
                                </button>
                            )}
                        </div>

                        {/* Filters */}
                        <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
                            {([
                                { key: 'all', label: '✦ Todos', count: bibliotecaItems.length },
                                { key: 'creativo', label: '🎨 Creativos', count: bibliotecaItems.filter((i: BibliotecaItem) => i.type === 'creativo').length },
                                { key: 'instagram', label: '📸 Instagram', count: bibliotecaItems.filter((i: BibliotecaItem) => i.type === 'instagram').length },
                                { key: 'studio', label: '🏷️ Photo Studio', count: bibliotecaItems.filter((i: BibliotecaItem) => i.type === 'studio').length },
                            ] as const).map(f => (
                                <button
                                    key={f.key}
                                    onClick={() => setBibliotecaFilter(f.key as any)}
                                    style={{
                                        padding: "10px 20px", borderRadius: 100,
                                        border: bibliotecaFilter === f.key ? "none" : "1px solid rgba(255,255,255,0.08)",
                                        background: bibliotecaFilter === f.key ? "#fed627" : "rgba(255,255,255,0.03)",
                                        color: bibliotecaFilter === f.key ? "#000" : "#9CA3AF",
                                        fontWeight: 800, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                                        display: "flex", alignItems: "center", gap: 8
                                    }}
                                >
                                    {f.label}
                                    <span style={{ background: bibliotecaFilter === f.key ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: 100, fontSize: 11, fontWeight: 900 }}>
                                        {f.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Grid or Empty State */}
                        {bibliotecaItems.filter((i: BibliotecaItem) => bibliotecaFilter === 'all' || i.type === bibliotecaFilter).length === 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 40px", gap: 20, opacity: 0.5 }}>
                                <Library size={64} color="#6B7280" />
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Tu biblioteca está vacía</div>
                                    <div style={{ fontSize: 14, color: "#6B7280" }}>Las imágenes que generes se guardarán aquí automáticamente</div>
                                </div>
                                <button onClick={() => setActiveTab('generator')} className="btn-primary" style={{ padding: "12px 24px", fontSize: 13 }}>
                                    <Sparkles size={14} /> Generar mi primer creativo
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
                                {bibliotecaItems
                                    .filter((i: BibliotecaItem) => bibliotecaFilter === 'all' || i.type === bibliotecaFilter)
                                    .map((item: BibliotecaItem) => (
                                        <div key={item.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden", transition: "all 0.2s" }}>
                                            {/* Image */}
                                            <div style={{ position: "relative", cursor: "zoom-in", overflow: "hidden", aspectRatio: "3/4" }} onClick={() => setBibliotecaZoom(item)}>
                                                <img src={item.image} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease", display: "block" }} className="hover-zoom" />
                                                {/* Type badge */}
                                                <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", color: item.type === 'creativo' ? '#fed627' : item.type === 'instagram' ? '#EC4899' : '#10B981', fontSize: 10, fontWeight: 900, padding: "4px 10px", borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                    {item.type === 'creativo' ? '🎨 Creativo' : item.type === 'instagram' ? '📸 Instagram' : '🏷️ Studio'}
                                                </div>
                                                {/* Hover overlay */}
                                                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", opacity: 0, transition: "opacity 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }} className="zoom-overlay">
                                                    <Search size={28} color="#fff" />
                                                </div>
                                            </div>
                                            {/* Footer */}
                                            <div style={{ padding: "12px 14px" }}>
                                                <div style={{ fontSize: 12, fontWeight: 700, color: "#E5E7EB", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</div>
                                                {item.projectName && <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>{item.projectName}</div>}
                                                <div style={{ display: "flex", gap: 8 }}>
                                                    <button onClick={() => downloadSingleImage(item.image, `postea_${item.type}_${item.id.substring(0,8)}`)} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "none", color: "#9CA3AF", padding: "7px", borderRadius: 10, cursor: "pointer", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                                                        <Download size={12} /> Descargar
                                                    </button>
                                                    <button onClick={() => deleteFromBiblioteca(item.id)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#EF4444", padding: "7px 10px", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                {/* PLANIFICADOR TAB */}
                {activeTab === 'planificador' && (
                    <Planner 
                        projects={projects}
                        activeProjectId={activeProjectId}
                        setActiveProjectId={setActiveProjectId}
                        updateActiveProject={updateActiveProject}
                        bibliotecaItems={bibliotecaItems}
                        setShowProjectModal={setShowProjectModal}
                        user={user}
                    />
                )}



                {/* Biblioteca Zoom Modal */}
                {bibliotecaZoom && (
                    <div onClick={() => setBibliotecaZoom(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "zoom-out" }}>
                        <div style={{ position: "relative", maxWidth: 800, maxHeight: "90vh", width: "100%" }} onClick={e => e.stopPropagation()}>
                            <img src={bibliotecaZoom.image} style={{ width: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: 20 }} />
                            <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
                                <button onClick={() => downloadSingleImage(bibliotecaZoom.image, `postea_${bibliotecaZoom.type}`)} className="btn-primary" style={{ padding: "12px 24px", fontSize: 13 }}>
                                    <Download size={16} /> Descargar
                                </button>
                                <button onClick={() => setBibliotecaZoom(null)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", padding: "12px 24px", borderRadius: 16, fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                                    <X size={16} /> Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── CAROUSEL SLIDE EDIT MODAL ── */}
                {carouselEditingSlide && (
                    <div
                        onClick={() => setCarouselEditingSlide(null)}
                        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(24px)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
                    >
                        <div
                            onClick={e => e.stopPropagation()}
                            className="glass-card"
                            style={{ maxWidth: 560, width: "100%", padding: 40, borderRadius: 28, maxHeight: "90vh", overflowY: "auto" }}
                        >
                            {/* Header */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 900, color: activeProject?.primaryColor || "#fed627", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                                        Editar Slide #{carouselEditingSlide.numero}
                                    </div>
                                    <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>
                                        {carouselEditingSlide.tipo === 'portada' ? '🎯 Portada' : carouselEditingSlide.tipo === 'cierre_cta' ? '🚀 Cierre + CTA' : '📖 Contenido'}
                                    </h2>
                                </div>
                                <button onClick={() => setCarouselEditingSlide(null)} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#6B7280", width: 36, height: 36, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Current Image Preview */}
                            {carouselEditingSlide.image && (
                                <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 24, aspectRatio: "3/4", maxHeight: 200 }}>
                                    <img src={carouselEditingSlide.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                            )}

                            {/* Editable fields */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: activeProject?.primaryColor || "#fed627", marginBottom: 8, textTransform: "uppercase" }}>Título</label>
                                    <input
                                        className="input-field"
                                        value={carouselEditingSlide.titulo || ""}
                                        onChange={e => setCarouselEditingSlide((prev: any) => ({ ...prev, titulo: e.target.value }))}
                                        style={{ width: "100%" }}
                                    />
                                </div>

                                {carouselEditingSlide.tipo === 'portada' && (
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: activeProject?.primaryColor || "#fed627", marginBottom: 8, textTransform: "uppercase" }}>Subtítulo</label>
                                        <input
                                            className="input-field"
                                            value={carouselEditingSlide.subtitulo || ""}
                                            onChange={e => setCarouselEditingSlide((prev: any) => ({ ...prev, subtitulo: e.target.value }))}
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                )}

                                {carouselEditingSlide.tipo === 'contenido' && (
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: activeProject?.primaryColor || "#fed627", marginBottom: 8, textTransform: "uppercase" }}>Cuerpo del Slide</label>
                                        <textarea
                                            className="input-field"
                                            value={carouselEditingSlide.cuerpo || ""}
                                            onChange={e => setCarouselEditingSlide((prev: any) => ({ ...prev, cuerpo: e.target.value }))}
                                            style={{ height: 100, resize: "none", width: "100%" }}
                                        />
                                    </div>
                                )}

                                {carouselEditingSlide.tipo === 'cierre_cta' && (
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: activeProject?.primaryColor || "#fed627", marginBottom: 8, textTransform: "uppercase" }}>CTA (Llamada a la Acción)</label>
                                        <input
                                            className="input-field"
                                            value={carouselEditingSlide.cta || ""}
                                            onChange={e => setCarouselEditingSlide((prev: any) => ({ ...prev, cta: e.target.value }))}
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: activeProject?.primaryColor || "#fed627", marginBottom: 8, textTransform: "uppercase" }}>Texto en imagen</label>
                                    <input
                                        className="input-field"
                                        value={carouselEditingSlide.texto_en_imagen || ""}
                                        onChange={e => setCarouselEditingSlide((prev: any) => ({ ...prev, texto_en_imagen: e.target.value }))}
                                        placeholder="Texto corto para superponer en la imagen (o 'ninguno')"
                                        style={{ width: "100%" }}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
                                    <button
                                        onClick={() => {
                                            // Save edits to carouselData
                                            setCarouselData((prev: any) => ({
                                                ...prev,
                                                slides: prev.slides.map((s: any) =>
                                                    s.numero === carouselEditingSlide.numero ? { ...carouselEditingSlide } : s
                                                )
                                            }));
                                            setToast({ msg: "✅ Slide actualizado", type: 'success' });
                                            setCarouselEditingSlide(null);
                                        }}
                                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "14px", borderRadius: 14, fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                                    >
                                        <Save size={14} /> Guardar cambios
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (!apiKey || !activeProject?.productPreview) {
                                                setToast({ msg: "Necesitas API Key y foto del producto", type: 'error' });
                                                return;
                                            }
                                            // Update state first
                                            setCarouselData((prev: any) => ({
                                                ...prev,
                                                slides: prev.slides.map((s: any) =>
                                                    s.numero === carouselEditingSlide.numero ? { ...carouselEditingSlide, image: null, isGeneratingImage: true, imageError: null } : s
                                                )
                                            }));
                                            setCarouselEditingSlide(null);
                                            setToast({ msg: `🎨 Regenerando imagen del slide ${carouselEditingSlide.numero}...`, type: 'success' });

                                            try {
                                                const productBase64 = activeProject.productPreview.split(",")[1] || "";
                                                const mimeType = activeProject.productPreview.includes("image/png") ? "image/png" : "image/jpeg";
                                                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;
                                                const primaryColor = activeProject.primaryColor || "#fed627";
                                                const secondaryColor = activeProject.secondaryColor || "#1a1a2e";

                                                const textInstruction = carouselEditingSlide.texto_en_imagen && carouselEditingSlide.texto_en_imagen.toLowerCase() !== 'ninguno'
                                                    ? `Render this text prominently: "${carouselEditingSlide.texto_en_imagen}"`
                                                    : 'Do NOT add text overlay.';

                                                const prompt = `Create a premium Instagram carousel slide (1080x1350 vertical 4:5 format). SLIDE: ${carouselEditingSlide.tipo}. TITLE: ${carouselEditingSlide.titulo}. VISUAL: ${carouselEditingSlide.descripcion_imagen}. ${textInstruction}. Use colors ${primaryColor} and ${secondaryColor}. Rich gradient or textured background. Never plain white or beige. Modern bold typography. Premium editorial feel.`;

                                                const reqParts: any[] = [{ inlineData: { mimeType, data: productBase64 } }];
                                                if (activeProject.logoPreview) reqParts.push({ inlineData: { mimeType: "image/png", data: activeProject.logoPreview.split(",")[1] || "" } });
                                                reqParts.push({ text: prompt });

                                                const imgRes = await fetch(url, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ 
                                                        contents: [{ parts: reqParts }], 
                                                        generationConfig: { 
                                                            responseModalities: ["TEXT", "IMAGE"],
                                                            imageConfig: {
                                                                aspectRatio: "4:5"
                                                            }
                                                        } 
                                                    })
                                                });
                                                const imgData = await imgRes.json();
                                                const part = imgData.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);

                                                if (part?.inlineData) {
                                                    const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                                                    setCarouselData((prev: any) => ({
                                                        ...prev,
                                                        slides: prev.slides.map((s: any) =>
                                                            s.numero === carouselEditingSlide.numero ? { ...carouselEditingSlide, image: imageUrl, isGeneratingImage: false } : s
                                                        )
                                                    }));
                                                    saveToBiblioteca(imageUrl, 'instagram', `Carrusel editado: ${carouselEditingSlide.titulo}`, activeProject?.name);
                                                    setToast({ msg: "✅ ¡Imagen regenerada!", type: 'success' });
                                                } else {
                                                    throw new Error("Sin imagen en la respuesta");
                                                }
                                            } catch (err: any) {
                                                setCarouselData((prev: any) => ({
                                                    ...prev,
                                                    slides: prev.slides.map((s: any) =>
                                                        s.numero === carouselEditingSlide.numero ? { ...carouselEditingSlide, isGeneratingImage: false, imageError: err.message } : s
                                                    )
                                                }));
                                                setToast({ msg: "Error regenerando imagen", type: 'error' });
                                            }
                                        }}
                                        className="btn-primary"
                                        style={{ background: activeProject?.primaryColor || "#fed627", color: "#000", padding: "14px", borderRadius: 14, fontSize: 13 }}
                                    >
                                        <Zap size={14} /> Regenerar imagen
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showNewBrandModal && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                        <div className="glass-card" style={{ maxWidth: 500, width: "100%", padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{ fontSize: 22, fontWeight: 900 }}>Nueva Marca</h2>
                                <button onClick={() => setShowNewBrandModal(false)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}><X size={20} /></button>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#9CA3AF", marginBottom: 8 }}>NOMBRE DE LA MARCA *</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        placeholder="Ej. Mi Empresa S.A." 
                                        value={newBrandName} 
                                        onChange={e => setNewBrandName(e.target.value)} 
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#9CA3AF", marginBottom: 8 }}>COLOR PRIMARIO</label>
                                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                        <input 
                                            type="color" 
                                            value={newBrandColor} 
                                            onChange={e => setNewBrandColor(e.target.value)} 
                                            style={{ width: 40, height: 40, border: "none", borderRadius: 8, cursor: "pointer", background: "none", padding: 0 }}
                                        />
                                        <input 
                                            type="text" 
                                            className="input-field" 
                                            value={newBrandColor} 
                                            onChange={e => setNewBrandColor(e.target.value)} 
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#9CA3AF", marginBottom: 8 }}>LOGO (OPCIONAL)</label>
                                    <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 12, cursor: "pointer" }}>
                                        {newBrandLogo ? (
                                            <img src={newBrandLogo} style={{ height: 60, objectFit: "contain" }} />
                                        ) : (
                                            <>
                                                <UploadCloud size={24} color="#6B7280" style={{ marginBottom: 8 }} />
                                                <span style={{ fontSize: 12, color: "#6B7280" }}>Subir imagen (.png, .jpg)</span>
                                            </>
                                        )}
                                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    setNewBrandLogo(event.target?.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }} />
                                    </label>
                                    {newBrandLogo && (
                                        <button onClick={() => setNewBrandLogo(null)} style={{ background: "transparent", border: "none", color: "#EF4444", fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 8, display: "block" }}>
                                            Quitar logo
                                        </button>
                                    )}
                                </div>
                            </div>
                            <button 
                                onClick={handleSaveBrand} 
                                className="btn-primary" 
                                style={{ padding: 16, fontSize: 14, marginTop: 12 }}
                            >
                                Guardar Marca
                            </button>
                        </div>
                    </div>
                )}
                {showNewProductModal && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                        <div className="glass-card" style={{ maxWidth: 600, width: "100%", padding: 32, maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{ fontSize: 22, fontWeight: 900 }}>Nuevo Producto</h2>
                                <button onClick={() => setShowNewProductModal(false)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}><X size={20} /></button>
                            </div>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", marginBottom: 8, display: "block", textTransform: "uppercase" }}>Nombre del producto*</label>
                                    <input className="input-field" placeholder="Ej: Belfan Açaí" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", marginBottom: 8, display: "block", textTransform: "uppercase" }}>Categoría*</label>
                                    <select className="input-field" value={newProdCategory} onChange={(e) => setNewProdCategory(e.target.value)}>
                                        <option value="Suplementos">Suplementos</option>
                                        <option value="Skincare">Skincare</option>
                                        <option value="Ropa y moda">Ropa y moda</option>
                                        <option value="Alimentos">Alimentos</option>
                                        <option value="Tecnología">Tecnología</option>
                                        <option value="Hogar">Hogar</option>
                                        <option value="Servicios">Servicios</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", marginBottom: 8, display: "block", textTransform: "uppercase" }}>Descripción del producto*</label>
                                <textarea className="input-field" placeholder="Qué es, para quién es, qué problema resuelve..." value={newProdDesc} onChange={(e) => setNewProdDesc(e.target.value)} style={{ height: 100, resize: "none" }} maxLength={400} />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", marginBottom: 8, display: "block", textTransform: "uppercase" }}>Público objetivo</label>
                                    <input className="input-field" placeholder="Ej: mujeres 25-45 años" value={newProdAudience} onChange={(e) => setNewProdAudience(e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", marginBottom: 8, display: "block", textTransform: "uppercase" }}>Precio (opcional)</label>
                                    <input className="input-field" placeholder="Ej: $89.000" value={newProdPrice} onChange={(e) => setNewProdPrice(e.target.value)} />
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", marginBottom: 8, display: "block", textTransform: "uppercase" }}>Tono de marca</label>
                                    <select className="input-field" value={newProdTone} onChange={(e) => setNewProdTone(e.target.value)}>
                                        <option value="Profesional">Profesional</option>
                                        <option value="Cercano y humano">Cercano y humano</option>
                                        <option value="Divertido">Divertido</option>
                                        <option value="Inspiracional">Inspiracional</option>
                                        <option value="Directo y vendedor">Directo y vendedor</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", marginBottom: 8, display: "block", textTransform: "uppercase" }}>Color Principal</label>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <input type="color" value={newProdColor} onChange={(e) => setNewProdColor(e.target.value)} style={{ width: 40, height: 40, padding: 0, border: "none", borderRadius: 8, cursor: "pointer" }} />
                                        <span style={{ color: "#D1D5DB", fontSize: 13, fontFamily: "monospace" }}>{newProdColor}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", marginBottom: 8, display: "block", textTransform: "uppercase" }}>Imágenes del producto (Máx 3)</label>
                                <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
                                    {newProdImages.map((img, idx) => (
                                        <div key={idx} style={{ position: "relative", width: 80, height: 80, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                                            <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            <button onClick={() => setNewProdImages(prev => prev.filter((_, i) => i !== idx))} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", borderRadius: "50%", padding: 2, cursor: "pointer" }}><X size={12} /></button>
                                        </div>
                                    ))}
                                    {newProdImages.length < 3 && (
                                        <div style={{ width: 80, height: 80, borderRadius: 12, border: "2px dashed rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer", background: "rgba(255,255,255,0.02)" }}>
                                            <input type="file" accept="image/*" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => setNewProdImages(prev => [...prev, ev.target?.result as string]);
                                                    reader.readAsDataURL(file);
                                                }
                                                e.target.value = '';
                                            }} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                                            <Plus size={20} color="#6B7280" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button onClick={handleSaveProduct} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 14 }}>
                                Guardar producto
                            </button>
                        </div>
                    </div>
                )}

                {showProjectModal && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div className="glass-card" style={{ maxWidth: 600, width: "100%", padding: 40, maxHeight: "90vh", overflowY: "auto" }}>
                            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 32, textAlign: "center" }}>Configurar Marca</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", textTransform: "uppercase" }}>Datos de la Marca y Producto</label>
                                    <select 
                                        className="input-field" 
                                        value={newProjectMarcaId}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setNewProjectMarcaId(val);
                                            const marca = savedBrands.find(b => b.id === val);
                                            if (marca) {
                                                if (marca.colorPrimario) setSelectedPrimary(marca.colorPrimario);
                                            }
                                        }}
                                        style={{ background: newProjectMarcaId ? "rgba(254, 214, 39, 0.05)" : undefined }}
                                    >
                                        <option value="">-- Seleccionar Marca (Opcional) --</option>
                                        {savedBrands.map(b => (
                                            <option key={b.id} value={b.id}>{b.nombre}</option>
                                        ))}
                                    </select>
                                    <input className="input-field" placeholder="Nombre del proyecto / producto..." value={projectNameInput} onChange={(e) => setProjectNameInput(e.target.value)} />
                                    
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
                                        <div>
                                            <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", marginBottom: 8, display: "block", textTransform: "uppercase" }}>Color Principal (Pantone)</label>
                                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                <input type="color" value={selectedPrimary} onChange={(e) => setSelectedPrimary(e.target.value)} style={{ width: 40, height: 40, padding: 0, border: "none", borderRadius: 8, cursor: "pointer", background: "transparent" }} />
                                                <span style={{ color: "#D1D5DB", fontSize: 13, fontFamily: "monospace" }}>{selectedPrimary}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", marginBottom: 8, display: "block", textTransform: "uppercase" }}>Tipografía</label>
                                            <select className="input-field" value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)} style={{ fontFamily: selectedFont }}>
                                                <option value="Inter" style={{ fontFamily: "Inter" }}>Inter</option>
                                                <option value="Outfit" style={{ fontFamily: "Outfit" }}>Outfit</option>
                                                <option value="Poppins" style={{ fontFamily: "Poppins" }}>Poppins</option>
                                                <option value="Playfair Display" style={{ fontFamily: "Playfair Display" }}>Playfair Display</option>
                                                <option value="Montserrat" style={{ fontFamily: "Montserrat" }}>Montserrat</option>
                                                <option value="Syne" style={{ fontFamily: "Syne" }}>Syne</option>
                                                <option value="Space Grotesk" style={{ fontFamily: "Space Grotesk" }}>Space Grotesk</option>
                                                <option value="Bricolage Grotesque" style={{ fontFamily: "Bricolage Grotesque" }}>Bricolage Grotesque</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                                    <button onClick={() => setShowProjectModal(false)} style={{ flex: 1, padding: 16, borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "none", color: "#6B7280", fontWeight: 900, cursor: "pointer" }}>CANCELAR</button>
                                    <button onClick={createProject} className="btn-primary" style={{ flex: 2, justifyContent: "center", background: selectedPrimary }}>CREAR PROYECTO</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {
                    showApiModal && (
                        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div className="glass-card" style={{ maxWidth: 450, width: "100%", padding: 40 }}>
                                <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Configurar Gemini</h2>
                                <p style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 32 }}>Ingresa tu API Key de Google AI Studio para activar la generación de creativos.</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                    <div>
                                        <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", marginBottom: 8, display: "block" }}>TU GOOGLE API KEY</label>
                                        <input type="password" className="input-field" placeholder="sk-..." value={tempApiKey} onChange={(e) => setTempApiKey(e.target.value)} />
                                    </div>
                                    <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                                        <button onClick={() => setShowApiModal(false)} style={{ flex: 1, padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", cursor: "pointer" }}>Cancelar</button>
                                        <button onClick={() => {
                                            setApiKey(tempApiKey);
                                            localStorage.setItem(getUKey("clickads_api_key"), tempApiKey);
                                            setShowApiModal(false);
                                            setToast({ msg: "Configuración guardada", type: 'success' });
                                        }} className="btn-primary" style={{ flex: 2, justifyContent: "center" }}>Guardar Cambios</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    editingPost && (
                        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div className="glass-card" style={{ maxWidth: 600, width: "100%", padding: 32, maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <h2 style={{ fontSize: 22, fontWeight: 900 }}>Editar Post {editingPost.id}</h2>
                                    <button onClick={() => setEditingPost(null)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}><X size={20} /></button>
                                </div>
                                
                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>ÁNGULO / TIPO DE POST</label>
                                        <input 
                                            className="input-field" 
                                            value={editingPost.tipo || ""} 
                                            onChange={(e) => setEditingPost({ ...editingPost, tipo: e.target.value })} 
                                        />
                                    </div>
                                    
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>CONCEPTO</label>
                                        <input 
                                            className="input-field" 
                                            value={editingPost.concepto || ""} 
                                            onChange={(e) => setEditingPost({ ...editingPost, concepto: e.target.value })} 
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>TEXTO EN IMAGEN</label>
                                        <input 
                                            className="input-field" 
                                            value={editingPost.texto_en_imagen || ""} 
                                            onChange={(e) => setEditingPost({ ...editingPost, texto_en_imagen: e.target.value })} 
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>DESCRIPCIÓN VISUAL (AMBIENTE / FONDO)</label>
                                        <textarea 
                                            className="input-field" 
                                            style={{ height: 80, resize: "none" }}
                                            value={editingPost.descripcion_imagen || ""} 
                                            onChange={(e) => setEditingPost({ ...editingPost, descripcion_imagen: e.target.value })} 
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>COPY / CAPTION</label>
                                        <textarea 
                                            className="input-field" 
                                            style={{ height: 100, resize: "none" }}
                                            value={editingPost.caption || ""} 
                                            onChange={(e) => setEditingPost({ ...editingPost, caption: e.target.value })} 
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>HASHTAGS (SEPARADOS POR COMA)</label>
                                        <input 
                                            className="input-field" 
                                            value={editingPost.hashtags ? editingPost.hashtags.join(", ") : ""} 
                                            onChange={(e) => {
                                                const tags = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                                                setEditingPost({ ...editingPost, hashtags: tags });
                                            }} 
                                        />
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                                    <button 
                                        onClick={() => handleSaveTextOnly(editingPost)}
                                        style={{ 
                                            padding: 14, 
                                            borderRadius: 12, 
                                            background: "rgba(255,255,255,0.05)", 
                                            border: "none", 
                                            color: "#fff", 
                                            fontWeight: 800, 
                                            cursor: "pointer" 
                                        }}
                                    >
                                        SOLO GUARDAR TEXTO
                                    </button>
                                    <button 
                                        onClick={() => handleSaveAndRegeneratePost(editingPost)}
                                        className="btn-primary" 
                                        style={{ 
                                            justifyContent: "center", 
                                            background: activeProject?.primaryColor || "#fed627", padding: 14, borderRadius: 12, border: "none", color: activeProject?.primaryColor ? "#fff" : "#000", 
                                            fontWeight: 800, 
                                            cursor: "pointer" 
                                        }}
                                    >
                                        GUARDAR Y REGENERAR IMAGEN
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    toast && (
                        <div style={{ position: "fixed", bottom: 40, right: 40, background: toast.type === 'error' ? '#EF4444' : '#fed627', color: toast.type === 'error' ? '#fff' : '#000', padding: "16px 32px", borderRadius: 16, fontWeight: 800, boxShadow: "0 10px 40px rgba(0,0,0,0.5)", zIndex: 10000 }}>
                            {toast.msg}
                        </div>
                    )
                }
                {
                    zoomedImage && (
                        <div
                            onClick={() => setZoomedImage(null)}
                            style={{
                                position: "fixed",
                                inset: 0,
                                background: "rgba(0,0,0,0.9)",
                                backdropFilter: "blur(10px)",
                                zIndex: 10000,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "zoom-out",
                                padding: 40
                            }}
                        >
                            <button
                                onClick={() => setZoomedImage(null)}
                                style={{ position: "absolute", top: 30, right: 30, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 50, height: 50, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                <X size={24} />
                            </button>
                            <img
                                src={zoomedImage}
                                style={{ maxWidth: "95%", maxHeight: "95%", borderRadius: 12, boxShadow: "0 20px 80px rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )
                }
            </main>
        </div >
    );
}
