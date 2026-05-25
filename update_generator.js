const fs = require('fs');

let page = fs.readFileSync('app/dashboard/page.tsx', 'utf8');
let fixed = fs.readFileSync('app/dashboard/page.fixed.tsx', 'utf8');

const igRegex = /\{\/\* NEW INSTAGRAM POSTS \*\/\}[\s\S]*?(?=\s*\{\/\* ── CAROUSEL SLIDE EDIT MODAL ── \*\/\}|\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}\s*<\/div>\s*\)\}\s*\{activeTab === 'photo_studio')/;
const igMatch = fixed.match(igRegex);
let igCode = igMatch ? igMatch[0] : "";
if (!igCode) console.log("Warning: could not find IG code");
else console.log("Found IG code:", igCode.substring(0, 100));

let carouselCode = `
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
                                                            downloadAsZip(validSlides.map((s:any, idx:number) => ({ image: s.image, name: \`carrusel_slide_\${idx+1}\` })), "carrusel_completo");
                                                        }}
                                                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "8px 16px", borderRadius: 12, cursor: "pointer", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}
                                                    >
                                                        <Download size={14} /> Descargar ZIP
                                                    </button>
                                                </div>
                                                
                                                <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 16, scrollSnapType: "x mandatory" }} className="custom-scrollbar">
                                                    {(carouselData.slides || []).map((slide: any, idx: number) => (
                                                        <div key={idx} className="glass-card" style={{ minWidth: 280, width: 280, padding: 16, borderRadius: 20, flexShrink: 0, scrollSnapAlign: "start", position: "relative" }}>
                                                            <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", color: "#fff", padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 900, zIndex: 10 }}>
                                                                {idx + 1} / {carouselData.slides.length}
                                                            </div>
                                                            <div 
                                                                onClick={() => slide.image && setZoomedImage(slide.image)}
                                                                style={{ width: "100%", aspectRatio: "4/5", borderRadius: 12, overflow: "hidden", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", position: "relative", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", cursor: slide.image ? "zoom-in" : "default" }}
                                                            >
                                                                {slide.image ? (
                                                                    <>
                                                                        <img src={slide.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                                        <button 
                                                                            onClick={(e) => { e.stopPropagation(); downloadSingleImage(slide.image, \`slide_\${idx+1}\`); }}
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
`;

const target1 = '<div className="glass-card" style={{ padding: 40, height: "fit-content" }}>\n                                            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>\n                                                <div>\n                                                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 12 }}>PRODUCTO</label>';
const replacement1 = `                                        {activeProject?.marcaId && savedProducts.filter(p => p.marcaId === activeProject.marcaId).length > 0 && (
                                            <div className="glass-card" style={{ padding: 40, height: "fit-content" }}>
                                                <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 16, color: activeProject?.primaryColor || "#fed627", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}><Box size={18} /> Elegir Productos</h3>
                                                <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>Selecciona uno o varios productos de la marca para incluirlos en la generación de tus posts o carruseles.</p>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                                    {savedProducts.filter(p => p.marcaId === activeProject.marcaId).map(p => (
                                                        <label key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "rgba(255,255,255,0.03)", border: selectedProjectProducts.includes(p.id) ? \`2px solid \${activeProject?.primaryColor || "#fed627"}\` : "2px solid rgba(255,255,255,0.05)", borderRadius: 16, cursor: "pointer", transition: "0.2s" }}>
                                                            <input 
                                                                type="checkbox" 
                                                                checked={selectedProjectProducts.includes(p.id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) setSelectedProjectProducts(prev => [...prev, p.id]);
                                                                    else setSelectedProjectProducts(prev => prev.filter(id => id !== p.id));
                                                                }}
                                                                style={{ width: 18, height: 18, accentColor: activeProject?.primaryColor || "#fed627", cursor: "pointer" }}
                                                            />
                                                            <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1, minWidth: 0 }}>
                                                                {p.imagenes?.[0] ? <img src={p.imagenes[0]} style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover" }} /> : <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}><Box size={14} color="#9CA3AF" /></div>}
                                                                <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.nombre}</div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="glass-card" style={{ padding: 40, height: "fit-content" }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                                <div>
                                                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 12 }}>FOTO CUSTOM O DESCRIBE (OPCIONAL)</label>`;

if(page.includes(target1)) {
    page = page.replace(target1, replacement1);
    console.log("Replaced target1");
} else {
    console.log("Could not find target1");
}

const target2 = `                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>`;
const replacement2 = `                                                </button>
                                            </div>
                                        </div>

                                        {/* Card 2: Instagram Content Planner */}
                                        <div className="glass-card" style={{ padding: 40, height: "fit-content" }}>
                                            <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={18} color={activeProject?.primaryColor || "#fed627"} /> Ideas para Instagram (5 Posts)</h3>
                                            <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20, lineHeight: 1.4 }}>Genera 5 ideas de posts basados en los productos seleccionados de tu marca.</p>
                                            
                                            <button 
                                                className="btn-primary" 
                                                style={{ width: "100%", justifyContent: "center", background: activeProject?.primaryColor || "#fed627", color: activeProject?.primaryColor ? "#fff" : "#000" }} 
                                                onClick={handleGenerateInstagram} 
                                                disabled={isGeneratingInstagram || selectedProjectProducts.length === 0}
                                            >
                                                {isGeneratingInstagram ? <Loader2 className="animate-spin" /> : <><Send size={14} /> Planificar 5 Posts</>}
                                            </button>
                                        </div>

                                        {/* Card 3: Carrusel Generator */}
                                        <div className="glass-card" style={{ padding: 40, height: "fit-content" }}>
                                            <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}><Layers size={18} color={activeProject?.primaryColor || "#fed627"} /> Carrusel Educativo / Venta</h3>
                                            <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20, lineHeight: 1.4 }}>Genera un carrusel completo de 5 a 7 slides basado en los productos seleccionados.</p>
                                            
                                            <button 
                                                className="btn-primary" 
                                                style={{ width: "100%", justifyContent: "center", background: activeProject?.primaryColor || "#fed627", color: activeProject?.primaryColor ? "#fff" : "#000" }} 
                                                onClick={handleGenerateCarousel} 
                                                disabled={isGeneratingCarousel || selectedProjectProducts.length === 0}
                                            >
                                                {isGeneratingCarousel ? <Loader2 className="animate-spin" /> : <><Layers size={14} /> Generar Carrusel</>}
                                            </button>
                                        </div>

                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>`;
if(page.includes(target2)) {
    page = page.replace(target2, replacement2);
    console.log("Replaced target2");
} else {
    console.log("Could not find target2");
}

const target3 = `                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>`;
const replacement3 = `                                                    ))}
                                                </div>
                                            </div>
                                        )}

${igCode}

${carouselCode}

                                    </div>
                                </div>`;
if(page.includes(target3)) {
    page = page.replace(target3, replacement3);
    console.log("Replaced target3");
} else {
    console.log("Could not find target3");
}

fs.writeFileSync('app/dashboard/page.tsx', page);
console.log("Done");
