"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  Clock, 
  UploadCloud, 
  Globe, 
  X, 
  Check, 
  Eye, 
  AlertCircle, 
  FolderPlus, 
  Sparkles, 
  Library,
  ChevronDown
} from "lucide-react";

export interface PlannerPost {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  image: string; // Base64 or URL
  copy: string;
  platform: string; // 'Instagram' | 'Facebook' | 'TikTok' | 'LinkedIn' | 'YouTube' | 'X/Twitter' | 'Otro'
  status: 'draft' | 'scheduled' | 'published';
}

interface Project {
  id: string;
  name: string;
  productName?: string;
  targetAudience?: string;
  productPreview: string;
  results: { image: string, title?: string, copy?: string, angle: string }[];
  primaryColor?: string;
  secondaryColor?: string;
  logoPreview?: string;
  plannerPosts?: PlannerPost[];
}

interface BibliotecaItem {
  id: string;
  image: string;
  type: string;
  label: string;
  projectName?: string;
}

interface PlannerProps {
  projects: Project[];
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  updateActiveProject: (updates: Partial<Project>) => void;
  bibliotecaItems: BibliotecaItem[];
  setShowProjectModal: (show: boolean) => void;
  user: any;
}

const PLATFORMS = [
  { name: "Instagram", color: "#EC4899", bg: "rgba(236,72,153,0.15)", border: "rgba(236,72,153,0.3)" },
  { name: "Facebook", color: "#3B82F6", bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)" },
  { name: "TikTok", color: "#22D3EE", bg: "rgba(34,211,238,0.15)", border: "rgba(34,211,238,0.3)" },
  { name: "LinkedIn", color: "#0A66C2", bg: "rgba(10,102,194,0.15)", border: "rgba(10,102,194,0.3)" },
  { name: "YouTube", color: "#EF4444", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)" },
  { name: "X/Twitter", color: "#F3F4F6", bg: "rgba(243,244,246,0.15)", border: "rgba(243,244,246,0.3)" },
  { name: "Otro", color: "#9CA3AF", bg: "rgba(156,163,175,0.15)", border: "rgba(156,163,175,0.3)" }
];

const STATUSES = [
  { id: "draft", label: "Borrador", color: "#9CA3AF" },
  { id: "scheduled", label: "Programado", color: "#FBBF24" },
  { id: "published", label: "Publicado", color: "#10B981" }
];

const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DAYS_SHORT_ES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function Planner({
  projects,
  activeProjectId,
  setActiveProjectId,
  updateActiveProject,
  bibliotecaItems,
  setShowProjectModal,
  user
}: PlannerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedPost, setSelectedPost] = useState<PlannerPost | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState("");
  
  // Form states
  const [postTitle, setPostTitle] = useState("");
  const [postTime, setPostTime] = useState("09:00");
  const [postPlatform, setPostPlatform] = useState("Instagram");
  const [postStatus, setPostStatus] = useState<PlannerPost['status']>("scheduled");
  const [postCopy, setPostCopy] = useState("");
  const [postImage, setPostImage] = useState("");
  
  // Image picker sub-modal/states
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerTab, setImagePickerTab] = useState<"upload" | "creatives" | "biblioteca">("upload");

  const activeProject = projects.find(p => p.id === activeProjectId) || null;
  const plannerPosts = activeProject?.plannerPosts || [];

  // Reset active brand if it is deleted or not found
  useEffect(() => {
    if (projects.length > 0 && !activeProjectId) {
      setActiveProjectId(projects[0].id);
    }
  }, [projects, activeProjectId, setActiveProjectId]);

  // Calendar Calculation Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getDays = () => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days = [];
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    
    const totalDays = lastDay.getDate();
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }
    
    return days;
  };

  const calendarDays = getDays();

  // Filter posts for a specific date (Format YYYY-MM-DD)
  const getPostsForDate = (dateStr: string) => {
    return plannerPosts.filter(p => p.date === dateStr);
  };

  // Format date helper
  const formatDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Open modal to schedule post on a specific date
  const handleOpenCreateModal = (date: Date) => {
    const dateStr = formatDateString(date);
    setModalDate(dateStr);
    setSelectedPost(null);
    setPostTitle("");
    setPostTime("12:00");
    setPostPlatform("Instagram");
    setPostStatus("scheduled");
    setPostCopy("");
    setPostImage("");
    setShowModal(true);
  };

  // Open modal to edit existing post
  const handleOpenEditModal = (post: PlannerPost, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPost(post);
    setModalDate(post.date);
    setPostTitle(post.title);
    setPostTime(post.time || "12:00");
    setPostPlatform(post.platform);
    setPostStatus(post.status);
    setPostCopy(post.copy);
    setPostImage(post.image);
    setShowModal(true);
  };

  // Handle local image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPostImage(event.target.result as string);
        setShowImagePicker(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle saving the post (create or update)
  const handleSavePost = () => {
    if (!activeProjectId) return;
    if (!postTitle.trim()) {
      alert("Por favor ingresa un título para la publicación");
      return;
    }

    const updatedPosts = [...plannerPosts];

    if (selectedPost) {
      // Editing existing post
      const index = updatedPosts.findIndex(p => p.id === selectedPost.id);
      if (index !== -1) {
        updatedPosts[index] = {
          ...selectedPost,
          title: postTitle,
          date: modalDate,
          time: postTime,
          platform: postPlatform,
          status: postStatus,
          copy: postCopy,
          image: postImage
        };
      }
    } else {
      // Creating new post
      const newPost: PlannerPost = {
        id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: postTitle,
        date: modalDate,
        time: postTime,
        platform: postPlatform,
        status: postStatus,
        copy: postCopy,
        image: postImage
      };
      updatedPosts.push(newPost);
    }

    // Save back to parent state
    updateActiveProject({ plannerPosts: updatedPosts });
    setShowModal(false);
  };

  // Handle deleting a post
  const handleDeletePost = (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta publicación programada?")) return;
    const updatedPosts = plannerPosts.filter(p => p.id !== id);
    updateActiveProject({ plannerPosts: updatedPosts });
    setShowModal(false);
  };

  // Platform styling helpers
  const getPlatformStyle = (name: string) => {
    return PLATFORMS.find(p => p.name === name) || PLATFORMS[PLATFORMS.length - 1];
  };

  const getStatusColor = (status: PlannerPost['status']) => {
    return STATUSES.find(s => s.id === status)?.color || "#9CA3AF";
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }} className="anim-in">
      
      {/* SECTION HEADER & BRAND LIST */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 6, display: "flex", alignItems: "center", gap: 12 }}>
            <CalendarIcon size={32} color="#fed627" /> Planificador de Contenido
          </h1>
          <p style={{ color: "#6B7280", fontSize: 14 }}>
            Organiza tus publicaciones en redes sociales por marca y mantén tu feed impecable.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
          <button 
            onClick={() => setViewMode("calendar")}
            style={{ 
              padding: "8px 16px", borderRadius: 10, border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer",
              background: viewMode === "calendar" ? "#fed627" : "transparent",
              color: viewMode === "calendar" ? "#000" : "#9CA3AF",
              transition: "all 0.2s"
            }}
          >
            Calendario
          </button>
          <button 
            onClick={() => setViewMode("list")}
            style={{ 
              padding: "8px 16px", borderRadius: 10, border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer",
              background: viewMode === "list" ? "#fed627" : "transparent",
              color: viewMode === "list" ? "#000" : "#9CA3AF",
              transition: "all 0.2s"
            }}
          >
            Lista de Publicaciones
          </button>
        </div>
      </div>

      {/* MULTI-BRAND GRID / SELECTOR */}
      <div className="glass-card" style={{ padding: 24, borderRadius: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6B7280" }}>Mis Marcas</h3>
          <button 
            onClick={() => setShowProjectModal(true)}
            style={{ 
              background: "rgba(254,214,39,0.1)", border: "1px solid rgba(254,214,39,0.25)", color: "#fed627", 
              padding: "6px 12px", borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: "pointer", 
              display: "flex", alignItems: "center", gap: 6 
            }}
          >
            <FolderPlus size={12} /> Nueva Marca
          </button>
        </div>

        {projects.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 0", gap: 12 }}>
            <p style={{ color: "#6B7280", fontSize: 13, margin: 0 }}>Aún no has configurado ninguna marca.</p>
            <button onClick={() => setShowProjectModal(true)} className="btn-primary" style={{ padding: "10px 20px", fontSize: 12 }}>
              Crear mi primera marca
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }} className="custom-scrollbar">
            {projects.map(proj => {
              const isSelected = proj.id === activeProjectId;
              const postCount = proj.plannerPosts?.length || 0;
              return (
                <div
                  key={proj.id}
                  onClick={() => setActiveProjectId(proj.id)}
                  style={{
                    minWidth: 200, width: 220, padding: 16, borderRadius: 18, cursor: "pointer",
                    background: isSelected ? "rgba(254,214,39,0.06)" : "rgba(255,255,255,0.01)",
                    border: isSelected ? `2px solid ${proj.primaryColor || "#fed627"}` : "1.5px solid rgba(255,255,255,0.04)",
                    transition: "all 0.2s",
                    display: "flex", flexDirection: "column", gap: 12, position: "relative"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {proj.logoPreview ? (
                      <img src={proj.logoPreview} style={{ width: 32, height: 32, borderRadius: 6, objectFit: "contain", background: "rgba(255,255,255,0.03)", padding: 2 }} />
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: proj.primaryColor || "#fed627", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12 }}>
                        {proj.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, margin: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{proj.name}</h4>
                      <p style={{ fontSize: 10, color: "#6B7280", margin: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{proj.productName || "E-commerce"}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
                    <span>{postCount} publicación{postCount !== 1 ? 'es' : ''}</span>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: proj.primaryColor || "#fed627" }}></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {activeProject && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* BRAND PLANNER BOARD HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 12, height: 28, borderRadius: 100, background: activeProject.primaryColor || "#fed627" }}></div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Planificador de: <span style={{ color: activeProject.primaryColor || "#fed627" }}>{activeProject.name}</span></h2>
            </div>

            {/* Calendar Controls */}
            {viewMode === "calendar" && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={handlePrevMonth} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", padding: 8, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={16} /></button>
                <span style={{ fontSize: 15, fontWeight: 800, minWidth: 120, textAlign: "center" }}>{MONTHS_ES[month]} {year}</span>
                <button onClick={handleNextMonth} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", padding: 8, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={16} /></button>
                <button onClick={handleToday} style={{ background: "rgba(254,214,39,0.1)", border: "none", color: "#fed627", padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 800, cursor: "pointer", marginLeft: 8 }}>Hoy</button>
              </div>
            )}
          </div>

          {/* CALENDAR VIEW */}
          {viewMode === "calendar" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }} className="anim-in">
              {/* Day names */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, textAlign: "center", marginBottom: 8 }}>
                {DAYS_SHORT_ES.map(day => (
                  <div key={day} style={{ fontSize: 12, fontWeight: 900, color: "#6B7280", textTransform: "uppercase" }}>{day}</div>
                ))}
              </div>

              {/* Day grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 8 }}>
                {calendarDays.map((day, idx) => {
                  if (!day) {
                    return <div key={`empty-${idx}`} style={{ background: "rgba(255,255,255,0.005)", border: "1px dashed rgba(255,255,255,0.02)", borderRadius: 16, aspectRatio: "1.1/1" }}></div>;
                  }

                  const dateStr = formatDateString(day);
                  const posts = getPostsForDate(dateStr);
                  const isCurrent = isToday(day);

                  return (
                    <div
                      key={dateStr}
                      onClick={() => handleOpenCreateModal(day)}
                      style={{
                        background: isCurrent ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                        border: isCurrent ? `1.5px solid ${activeProject.primaryColor || "#fed627"}` : "1.5px solid rgba(255,255,255,0.04)",
                        borderRadius: 18, padding: 10, display: "flex", flexDirection: "column", gap: 8,
                        aspectRatio: "1.1/1", minHeight: 110, position: "relative", cursor: "pointer",
                        overflow: "hidden", transition: "all 0.2s"
                      }}
                      className="calendar-day-hover"
                    >
                      {/* Day Number Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ 
                          fontSize: 12, fontWeight: 900, 
                          color: isCurrent ? (activeProject.primaryColor || "#fed627") : "#9CA3AF",
                          background: isCurrent ? "rgba(254,214,39,0.1)" : "transparent",
                          padding: isCurrent ? "2px 6px" : 0,
                          borderRadius: 6
                        }}>
                          {day.getDate()}
                        </span>
                        
                        {/* Plus button indicator visible on cell */}
                        <div className="day-add-indicator" style={{ opacity: 0.1, color: "#fff" }}>
                          <Plus size={10} />
                        </div>
                      </div>

                      {/* Scheduled posts on this day */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1, overflowY: "auto" }} className="custom-scrollbar">
                        {posts.map(post => {
                          const platformInfo = getPlatformStyle(post.platform);
                          return (
                            <div
                              key={post.id}
                              onClick={(e) => handleOpenEditModal(post, e)}
                              style={{
                                background: "rgba(255,255,255,0.02)",
                                border: `1px solid ${platformInfo.border}`,
                                borderRadius: 10, padding: "5px 8px",
                                display: "flex", alignItems: "center", gap: 6,
                                transition: "all 0.2s"
                              }}
                              className="day-post-card"
                            >
                              {post.image && (
                                <img src={post.image} style={{ width: 18, height: 18, borderRadius: 4, objectFit: "cover" }} />
                              )}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 9, fontWeight: 900, color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                  {post.title}
                                </div>
                              </div>
                              <span style={{ width: 5, height: 5, borderRadius: "50%", background: getStatusColor(post.status) }}></span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="anim-in">
              {plannerPosts.length === 0 ? (
                <div className="glass-card" style={{ padding: "60px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                  <CalendarIcon size={48} color="#6B7280" style={{ opacity: 0.5 }} />
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px 0" }}>No hay publicaciones programadas</h3>
                    <p style={{ color: "#6B7280", fontSize: 13, margin: 0 }}>Usa la vista de Calendario para programar publicaciones en los días correspondientes.</p>
                  </div>
                  <button onClick={() => setViewMode("calendar")} className="btn-primary" style={{ padding: "10px 20px", fontSize: 12 }}>
                    Ir al Calendario
                  </button>
                </div>
              ) : (
                [...plannerPosts]
                  .sort((a, b) => new Date(`${a.date}T${a.time || "00:00"}`).getTime() - new Date(`${b.date}T${b.time || "00:00"}`).getTime())
                  .map(post => {
                    const platformInfo = getPlatformStyle(post.platform);
                    const statusInfo = STATUSES.find(s => s.id === post.status);
                    
                    // Format readable date
                    const [y, m, d] = post.date.split("-");
                    const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
                    const formattedDate = `${dateObj.getDate()} de ${MONTHS_ES[dateObj.getMonth()]}, ${dateObj.getFullYear()}`;

                    return (
                      <div 
                        key={post.id}
                        onClick={(e) => handleOpenEditModal(post, e)}
                        style={{
                          background: "rgba(255,255,255,0.01)",
                          border: "1px solid rgba(255,255,255,0.05)",
                          borderRadius: 20, padding: 20, cursor: "pointer",
                          display: "flex", gap: 20, alignItems: "center",
                          transition: "all 0.2s"
                        }}
                        className="post-list-row-hover"
                      >
                        {/* Thumbnail */}
                        {post.image ? (
                          <div style={{ width: 80, height: 80, borderRadius: 14, overflow: "hidden", position: "relative", border: "1px solid rgba(255,255,255,0.1)", background: "#000" }}>
                            <img src={post.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        ) : (
                          <div style={{ width: 80, height: 80, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                            <ImageIcon size={24} color="#6B7280" />
                          </div>
                        )}

                        {/* Details */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <h4 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>{post.title}</h4>
                            
                            {/* Platform Badge */}
                            <span style={{ 
                              background: platformInfo.bg, border: `1px solid ${platformInfo.border}`, 
                              color: platformInfo.color, padding: "2px 8px", borderRadius: 8, fontSize: 10, fontWeight: 900 
                            }}>
                              {post.platform}
                            </span>

                            {/* Status Badge */}
                            <span style={{ 
                              background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.08)`, 
                              color: statusInfo?.color, padding: "2px 8px", borderRadius: 8, fontSize: 10, fontWeight: 900,
                              display: "flex", alignItems: "center", gap: 4
                            }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusInfo?.color }}></span>
                              {statusInfo?.label}
                            </span>
                          </div>

                          <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4 }}>
                            {post.copy || "Sin copy descriptivo."}
                          </p>

                          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 11, color: "#6B7280" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <CalendarIcon size={12} /> {formattedDate}
                            </span>
                            {post.time && (
                              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <Clock size={12} /> {post.time}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quick Edit */}
                        <div style={{ display: "flex", gap: 8 }}>
                          <button 
                            onClick={(e) => handleOpenEditModal(post, e)}
                            style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#fed627", width: 36, height: 36, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}
                            style={{ background: "rgba(239,68,68,0.08)", border: "none", color: "#EF4444", width: 36, height: 36, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          )}

        </div>
      )}

      {/* PLANNER MODAL (CREATE / EDIT) */}
      {showModal && (
        <div 
          onClick={() => setShowModal(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", zIndex: 9990, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-card" 
            style={{ maxWidth: 680, width: "100%", padding: 32, borderRadius: 28, maxHeight: "90vh", overflowY: "auto", position: "relative" }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 900, color: activeProject?.primaryColor || "#fed627", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {selectedPost ? "Editar Publicación" : "Programar Publicación"}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 900, margin: "2px 0 0 0" }}>
                  {selectedPost ? `Editando: ${selectedPost.title}` : "Nueva Publicación"}
                </h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#9CA3AF", width: 36, height: 36, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              
              {/* Form Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                
                {/* Left Side: General info */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 900, color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>Título / Concepto</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Ej: Lanzamiento de verano, Promo..."
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      style={{ padding: "12px 16px" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 900, color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>Fecha</label>
                      <input 
                        type="date" 
                        className="input-field" 
                        value={modalDate}
                        onChange={(e) => setModalDate(e.target.value)}
                        style={{ padding: "12px 16px", fontSize: 12 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 900, color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>Hora</label>
                      <input 
                        type="time" 
                        className="input-field" 
                        value={postTime}
                        onChange={(e) => setPostTime(e.target.value)}
                        style={{ padding: "12px 16px", fontSize: 12 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 900, color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>Red Social</label>
                      <select 
                        className="input-field" 
                        value={postPlatform} 
                        onChange={(e) => setPostPlatform(e.target.value)}
                        style={{ padding: "12px 16px" }}
                      >
                        {PLATFORMS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 900, color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>Estado</label>
                      <select 
                        className="input-field" 
                        value={postStatus} 
                        onChange={(e) => setPostStatus(e.target.value as any)}
                        style={{ padding: "12px 16px" }}
                      >
                        {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Side: Image Picker Slot */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 900, color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>Imagen Publicación</label>
                  
                  {postImage ? (
                    <div style={{ flex: 1, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden", position: "relative", background: "#050505", minHeight: 180, display: "flex", flexDirection: "column" }}>
                      <img src={postImage} style={{ width: "100%", height: 180, objectFit: "contain", flex: 1 }} />
                      <div style={{ display: "flex", gap: 6, padding: 8, background: "rgba(0,0,0,0.7)" }}>
                        <button 
                          onClick={() => setShowImagePicker(true)} 
                          style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700 }}
                        >
                          Cambiar
                        </button>
                        <button 
                          onClick={() => setPostImage("")} 
                          style={{ background: "rgba(239,68,68,0.15)", border: "none", color: "#EF4444", padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700 }}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => setShowImagePicker(true)}
                      style={{ 
                        flex: 1, border: "2px dashed rgba(255,255,255,0.08)", borderRadius: 16, 
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
                        gap: 12, cursor: "pointer", minHeight: 180, background: "rgba(255,255,255,0.01)",
                        transition: "all 0.2s"
                      }}
                      className="calendar-day-hover"
                    >
                      <UploadCloud size={32} color="#6B7280" />
                      <div style={{ textAlign: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: "#fff", display: "block" }}>Seleccionar Imagen</span>
                        <span style={{ fontSize: 10, color: "#6B7280" }}>Biblioteca, creativos o local</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Copy / Caption */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ fontSize: 10, fontWeight: 900, color: "#6B7280", textTransform: "uppercase" }}>Copy / Caption Publicidad</label>
                  <span style={{ fontSize: 10, color: "#6B7280" }}>{postCopy.length} caracteres</span>
                </div>
                <textarea 
                  className="input-field" 
                  placeholder="Escribe el copy promocional, hashtags o comentarios de publicación..."
                  value={postCopy}
                  onChange={(e) => setPostCopy(e.target.value)}
                  style={{ height: 120, resize: "none", padding: 16 }}
                />
              </div>

              {/* Modal Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, gap: 12 }}>
                <div>
                  {selectedPost && (
                    <button 
                      onClick={() => handleDeletePost(selectedPost.id)}
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", padding: "14px 20px", borderRadius: 14, fontSize: 13, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button 
                    onClick={() => setShowModal(false)}
                    style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#9CA3AF", padding: "14px 24px", borderRadius: 14, fontSize: 13, fontWeight: 800, cursor: "pointer" }}
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSavePost}
                    className="btn-primary"
                    style={{ padding: "14px 28px", fontSize: 13, background: activeProject?.primaryColor || "#fed627" }}
                  >
                    <Check size={14} /> Guardar Publicación
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* IMAGE SELECTOR DIALOG */}
      {showImagePicker && (
        <div 
          onClick={() => setShowImagePicker(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(24px)", zIndex: 9995, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-card" 
            style={{ maxWidth: 640, width: "100%", padding: 32, borderRadius: 28, maxHeight: "80vh", display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Picker Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>Elegir Imagen</h3>
              <button 
                onClick={() => setShowImagePicker(false)}
                style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#9CA3AF", width: 32, height: 32, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Tabs selector */}
            <div style={{ display: "flex", gap: 10, background: "rgba(255,255,255,0.02)", padding: 4, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
              <button 
                onClick={() => setImagePickerTab("upload")}
                style={{ 
                  flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer",
                  background: imagePickerTab === "upload" ? "rgba(255,255,255,0.08)" : "transparent",
                  color: imagePickerTab === "upload" ? "#fff" : "#9CA3AF"
                }}
              >
                Subir Archivo
              </button>
              <button 
                onClick={() => setImagePickerTab("creatives")}
                style={{ 
                  flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer",
                  background: imagePickerTab === "creatives" ? "rgba(255,255,255,0.08)" : "transparent",
                  color: imagePickerTab === "creatives" ? "#fff" : "#9CA3AF"
                }}
              >
                Creativos de Marca
              </button>
              <button 
                onClick={() => setImagePickerTab("biblioteca")}
                style={{ 
                  flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer",
                  background: imagePickerTab === "biblioteca" ? "rgba(255,255,255,0.08)" : "transparent",
                  color: imagePickerTab === "biblioteca" ? "#fff" : "#9CA3AF"
                }}
              >
                Mi Biblioteca
              </button>
            </div>

            {/* Picker Content */}
            <div style={{ flex: 1, overflowY: "auto", minHeight: 250, maxHeight: 400 }} className="custom-scrollbar">
              
              {/* Upload file tab */}
              {imagePickerTab === "upload" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 250, gap: 16 }}>
                  <label 
                    style={{ 
                      padding: "20px 40px", border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 16,
                      background: "rgba(255,255,255,0.01)", display: "flex", flexDirection: "column", alignItems: "center",
                      gap: 12, cursor: "pointer", transition: "all 0.2s"
                    }}
                    className="calendar-day-hover"
                  >
                    <UploadCloud size={40} color="#fed627" />
                    <span style={{ fontSize: 13, fontWeight: 800 }}>Haz clic para buscar imagen local</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                  </label>
                </div>
              )}

              {/* Brand creatives tab */}
              {imagePickerTab === "creatives" && (
                <div>
                  {(!activeProject || !activeProject.results || activeProject.results.length === 0) ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 250, opacity: 0.5, gap: 10 }}>
                      <ImageIcon size={36} />
                      <p style={{ fontSize: 13, margin: 0 }}>No hay creativos generados para esta marca.</p>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
                      {activeProject.results.map((res, i) => (
                        <div 
                          key={i} 
                          onClick={() => { setPostImage(res.image); setShowImagePicker(false); }}
                          style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden", cursor: "pointer", aspectRatio: "4/5", position: "relative" }}
                          className="calendar-day-hover"
                        >
                          <img src={res.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 6, background: "rgba(0,0,0,0.6)", fontSize: 9, fontWeight: 800, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {res.angle}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Global library tab */}
              {imagePickerTab === "biblioteca" && (
                <div>
                  {(!bibliotecaItems || bibliotecaItems.length === 0) ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 250, opacity: 0.5, gap: 10 }}>
                      <Library size={36} />
                      <p style={{ fontSize: 13, margin: 0 }}>Tu biblioteca está vacía.</p>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
                      {bibliotecaItems.map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => { setPostImage(item.image); setShowImagePicker(false); }}
                          style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden", cursor: "pointer", aspectRatio: "4/5", position: "relative" }}
                          className="calendar-day-hover"
                        >
                          <img src={item.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 6, background: "rgba(0,0,0,0.6)", fontSize: 9, fontWeight: 800, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Picker Footer */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setShowImagePicker(false)}
                style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled custom transitions for calendar elements */}
      <style>{`
        .calendar-day-hover:hover {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(254, 214, 39, 0.25) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .calendar-day-hover:hover .day-add-indicator {
          opacity: 0.8 !important;
        }
        .day-post-card:hover {
          background: rgba(255,255,255,0.06) !important;
          transform: scale(1.02);
        }
        .post-list-row-hover:hover {
          background: rgba(255,255,255,0.02) !important;
          border-color: rgba(254, 214, 39, 0.2) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        }
      `}</style>
    </div>
  );
}
