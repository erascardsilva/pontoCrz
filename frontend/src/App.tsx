// PontoCrz — Interface Principal
// Autor: Erasmo Cardoso - Software Engineer | Electronics Specialist
import React, { useState, useEffect } from 'react';
import './App.css';
import { PickFile, ProcessImage, SaveImage } from "../wailsjs/go/main/App.js";
import { backend } from "../wailsjs/go/models.js";
import { BrowserOpenURL } from "../wailsjs/runtime/runtime";
import paypalLogo from './assets/images/paypal.png';

function App() {
    const [imagePath, setImagePath] = useState('');
    const [result, setResult] = useState<backend.ProcessedImage | null>(null);
    const [width, setWidth] = useState(80);
    const [colors, setColors] = useState(24);
    const [pontoSize, setPontoSize] = useState(10);
    const [exportFormat, setExportFormat] = useState('A4'); // A4, A3, SCREEN
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showAbout, setShowAbout] = useState(false);

    const handleDonate = () => {
        BrowserOpenURL("https://www.paypal.com/ncp/payment/8V6WQCGN6HDCQ");
    };

    const handlePickFile = async () => {
        try {
            const path = await PickFile();
            if (path) {
                setImagePath(path);
                process(path, width, colors);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const process = async (path: string, w: number, c: number) => {
        if (!path) return;
        setLoading(true);
        try {
            const res = await ProcessImage(path, w, c);
            setResult(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (imagePath) process(imagePath, width, colors);
        }, 500);
        return () => clearTimeout(timer);
    }, [width, colors]);

    const handleSave = async () => {
        if (!imagePath || !result) return;
        setSaving(true);
        try {
            let finalPontoSize = pontoSize * 2; // Default (Screen)

            if (exportFormat === 'A4') {
                // A4 a 300 DPI tem ~2480 pixels de largura (portrait)
                // Se a imagem for landscape, usamos a largura maior (~3508)
                const targetWidth = result.width > result.height ? 3508 : 2480;
                finalPontoSize = Math.floor(targetWidth / result.width);
            } else if (exportFormat === 'A3') {
                const targetWidth = result.width > result.height ? 4961 : 3508;
                finalPontoSize = Math.floor(targetWidth / result.width);
            }

            if (finalPontoSize < 5) finalPontoSize = 5;

            await SaveImage(imagePath, width, colors, finalPontoSize);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="main-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '0.5rem' }}>
                <h1 className="title">PontoCrz</h1>
                <button
                    onClick={() => setShowAbout(true)}
                    title="Sobre e Ajuda"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 28, height: 28, color: 'var(--accent-color)', fontWeight: 800, cursor: 'pointer', fontSize: 14 }}
                >?</button>
            </div>

            {showAbout && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '2rem 2.5rem', maxWidth: 560, width: '90%', position: 'relative' }}>
                        <button
                            onClick={() => setShowAbout(false)}
                            style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}
                        >×</button>
                        <h2 style={{ margin: '0 0 0.5rem', color: 'var(--accent-color)' }}>🧵 PontoCrz — Como Usar</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: 0, fontSize: 13 }}>Transforme suas fotos em gráficos profissionais de ponto cruz</p>
                        <ol style={{ color: 'var(--text-primary)', lineHeight: 2, paddingLeft: '1.2rem', fontSize: 14 }}>
                            <li><strong>Abrir Foto</strong> — Clique no botão e selecione uma imagem (JPG, PNG).</li>
                            <li><strong>Tamanho (Pontos)</strong> — Defina quantos pontos de largura terá o bordado. Menos pontos = bordado maior e mais simples.</li>
                            <li><strong>Qtd. Cores DMC</strong> — Limite o número de cores de linha a usar. Recomendado: 10–30 para iniciantes.</li>
                            <li><strong>Zoom do Ponto</strong> — Aumenta ou diminui os quadradinhos na tela para facilitar a visualização.</li>
                            <li><strong>Papel (A4/A3)</strong> — Escolha o tamanho da folha antes de salvar para impressão em alta resolução (300 DPI).</li>
                            <li><strong>Salvar JPG</strong> — Exporta o gráfico com grade técnica pronto para imprimir e bordar.</li>
                        </ol>
                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                            <button onClick={handleDonate} className="btn-donate">
                                <img src={paypalLogo} alt="PayPal" style={{ height: 20, marginRight: 8 }} />
                                Apoiar Projeto
                            </button>
                        </div>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '1.2rem', paddingTop: '0.8rem', fontSize: 12, color: 'var(--text-secondary)', textAlign: 'right' }}>
                            <strong style={{ color: 'var(--accent-color)', fontSize: '13px' }}>Erasmo Cardoso</strong><br />
                            Software Engineer | Electronics Specialist
                        </div>
                    </div>
                </div>
            )}

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Transforme fotos em arte de bordado manualmente.</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-primary" onClick={handlePickFile}>
                            {imagePath ? 'Trocar Foto' : 'Abrir Foto'}
                        </button>
                        {imagePath && (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <select
                                    className="btn-primary"
                                    style={{ background: 'rgba(255,255,255,0.1)', padding: '0 10px', fontSize: '13px' }}
                                    value={exportFormat}
                                    onChange={(e) => setExportFormat(e.target.value)}
                                >
                                    <option value="A4">Papel A4 (300 DPI)</option>
                                    <option value="A3">Papel A3 (300 DPI)</option>
                                    <option value="SCREEN">Tamanho da Tela</option>
                                </select>
                                <button className="btn-primary" style={{ background: 'var(--accent-color)' }} onClick={handleSave} disabled={saving}>
                                    {saving ? 'Salvando...' : 'Salvar JPG'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="preview-container">
                    <div className="preview-box">
                        {imagePath ? (
                            <img src={`/image?path=${encodeURIComponent(imagePath)}`} alt="Original"
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        ) : (
                            <p style={{ color: 'var(--text-secondary)' }}>Nenhuma imagem</p>
                        )}
                        <div className="preview-label">📷 ORIGINAL</div>
                    </div>
                    <div className="preview-box">
                        {result ? (
                            <div className="stitch-grid" style={{
                                gridTemplateColumns: `repeat(${result.width}, ${pontoSize}px)`,
                                gridTemplateRows: `repeat(${result.height}, ${pontoSize}px)`
                            }}>
                                {result.pixels.map((row: string[], y: number) => row.map((hex: string, x: number) => (
                                    <div
                                        key={`${y}-${x}`}
                                        className={`stitch-pixel ${(x + 1) % 10 === 0 ? 'major-grid-x' : ''} ${(y + 1) % 10 === 0 ? 'major-grid-y' : ''}`}
                                        style={{ backgroundColor: hex, width: `${pontoSize}px`, height: `${pontoSize}px` }}
                                        title={`X: ${x + 1}, Y: ${y + 1} - Hex: ${hex}`}
                                    />
                                )))}
                            </div>
                        ) : <p>{loading ? 'Processando...' : 'Aguardando imagem'}</p>}
                        <div className="preview-label">🧵 PONTO CRUZ</div>
                    </div>
                </div>

                <div className="controls-panel">
                    <div className="control-item">
                        <label className="control-label">
                            Tamanho (Pontos) <span className="value">{width}</span>
                        </label>
                        <input type="range" min="10" max="200" value={width} onChange={(e) => setWidth(parseInt(e.target.value))} />
                    </div>
                    <div className="control-item">
                        <label className="control-label">
                            Qtd. Cores DMC <span className="value">{colors}</span>
                        </label>
                        <input type="range" min="2" max="100" value={colors} onChange={(e) => setColors(parseInt(e.target.value))} />
                    </div>
                    <div className="control-item">
                        <label className="control-label">
                            Zoom do Ponto <span className="value">{pontoSize}px</span>
                        </label>
                        <input type="range" min="4" max="30" value={pontoSize} onChange={(e) => setPontoSize(parseInt(e.target.value))} />
                    </div>
                </div>
            </div>

            {result && (
                <div className="glass-card" style={{ marginTop: '1rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0' }}>Paleta DMC Utilizada ({result.dmcList.length} cores)</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {result.dmcList.map((dmc: backend.DMCColor) => (
                            <div key={dmc.ID} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '8px' }}>
                                <div style={{ width: 16, height: 16, backgroundColor: dmc.Hex, borderRadius: 4 }} />
                                <span style={{ fontSize: 12, fontWeight: 600 }}>{dmc.ID}</span>
                                <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{dmc.Name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button className="btn-donate-fixed" onClick={handleDonate} title="Apoie o Desenvolvedor">
                <img src={paypalLogo} alt="Apoiar" />
                <span>Apoia</span>
            </button>
        </div>
    );
}

export default App;
