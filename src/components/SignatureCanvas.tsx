'use client';

import { useRef, useState, useEffect } from 'react';

export default function SignatureCanvas({ onSave }: { onSave: (signature: string) => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [signatureType, setSignatureType] = useState<'draw' | 'type'>('draw');
    const [typedName, setTypedName] = useState('');

    // Drawing logic
    const startDrawing = (e: any) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#2c2420';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        setTypedName('');
    };

    const saveSignature = () => {
        if (signatureType === 'draw') {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const dataUrl = canvas.toDataURL('image/png');
            onSave(dataUrl);
        } else {
            onSave(typedName);
        }
    };

    return (
        <div style={{
            background: '#faf6ee',
            border: '1px solid #d4cfc2',
            borderRadius: '12px',
            padding: '24px',
            marginTop: '24px'
        }}>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                <button
                    onClick={() => setSignatureType('draw')}
                    style={{
                        padding: '8px 16px',
                        background: signatureType === 'draw' ? '#e05c4a' : 'transparent',
                        color: signatureType === 'draw' ? 'white' : '#6b6458',
                        border: '1px solid #d4cfc2',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontFamily: 'DM Sans',
                        fontSize: '13px'
                    }}
                >
                    ✍️ Draw
                </button>
                <button
                    onClick={() => setSignatureType('type')}
                    style={{
                        padding: '8px 16px',
                        background: signatureType === 'type' ? '#e05c4a' : 'transparent',
                        color: signatureType === 'type' ? 'white' : '#6b6458',
                        border: '1px solid #d4cfc2',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontFamily: 'DM Sans',
                        fontSize: '13px'
                    }}
                >
                    ⌨️ Type
                </button>
            </div>

            {signatureType === 'draw' ? (
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={120}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    style={{
                        border: '1px dashed #d4cfc2',
                        borderRadius: '6px',
                        cursor: 'crosshair',
                        width: '100%',
                        maxWidth: '400px',
                        touchAction: 'none',
                        background: 'white'
                    }}
                />
            ) : (
                <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="Type your name..."
                    style={{
                        width: '100%',
                        padding: '16px',
                        fontFamily: 'Brush Script MT, cursive',
                        fontSize: '28px',
                        border: '1px dashed #d4cfc2',
                        borderRadius: '6px',
                        background: 'white',
                        color: '#2c2420'
                    }}
                />
            )}

            <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                    onClick={clearCanvas}
                    style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        color: '#6b6458',
                        border: '1px solid #d4cfc2',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontFamily: 'DM Sans',
                        fontSize: '14px'
                    }}
                >
                    Clear
                </button>
                <button
                    onClick={saveSignature}
                    style={{
                        padding: '10px 24px',
                        background: '#e05c4a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontFamily: 'DM Sans',
                        fontSize: '14px',
                        fontWeight: '500',
                        boxShadow: '0 4px 16px rgba(224,92,74,0.3)'
                    }}
                >
                    Apply Signature
                </button>
            </div>
        </div>
    );
}
