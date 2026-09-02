"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ImagePlus, ZoomIn } from "lucide-react";

type Category = "avatars" | "team" | "news" | "projects";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  category: Category;
  /** width / height, e.g. 1 for a square avatar, 1.91 for a wide cover image. */
  aspect?: number;
  outputWidth?: number;
  shape?: "circle" | "rect";
  label?: string;
}

const DISPLAY_WIDTH = 320;

export function ImageUploader({
  value,
  onChange,
  category,
  aspect = 1,
  outputWidth = aspect === 1 ? 512 : 1200,
  shape = aspect === 1 ? "circle" : "rect",
  label = "Fotoğraf",
}: ImageUploaderProps) {
  const displayHeight = Math.round(DISPLAY_WIDTH / aspect);
  const outputHeight = Math.round(outputWidth / aspect);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  const [cropping, setCropping] = useState(false);
  const [scale, setScale] = useState(1);
  const [minScale, setMinScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clampOffset(img: HTMLImageElement, s: number, o: { x: number; y: number }) {
    const w = img.width * s;
    const h = img.height * s;
    const minX = DISPLAY_WIDTH - w;
    const minY = displayHeight - h;
    return {
      x: Math.min(0, Math.max(minX, o.x)),
      y: Math.min(0, Math.max(minY, o.y)),
    };
  }

  function draw(img: HTMLImageElement, s: number, o: { x: number; y: number }) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, DISPLAY_WIDTH, displayHeight);
    ctx.drawImage(img, o.x, o.y, img.width * s, img.height * s);
  }

  function handleFileSelected(file: File) {
    setError(null);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const fitScale = Math.max(DISPLAY_WIDTH / img.width, displayHeight / img.height);
      const initialOffset = clampOffset(img, fitScale, {
        x: (DISPLAY_WIDTH - img.width * fitScale) / 2,
        y: (displayHeight - img.height * fitScale) / 2,
      });
      imgRef.current = img;
      setMinScale(fitScale);
      setScale(fitScale);
      setOffset(initialOffset);
      setCropping(true);
      requestAnimationFrame(() => draw(img, fitScale, initialOffset));
    };
    img.onerror = () => setError("Görsel yüklenemedi.");
    img.src = url;
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    dragRef.current = { x: e.clientX, y: e.clientY, offsetX: offset.x, offsetY: offset.y };
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragRef.current || !imgRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    const next = clampOffset(imgRef.current, scale, {
      x: dragRef.current.offsetX + dx,
      y: dragRef.current.offsetY + dy,
    });
    setOffset(next);
    draw(imgRef.current, scale, next);
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  function handleZoomChange(newScale: number) {
    if (!imgRef.current) return;
    // Keep the visual center fixed while zooming.
    const cx = DISPLAY_WIDTH / 2;
    const cy = displayHeight / 2;
    const imgX = (cx - offset.x) / scale;
    const imgY = (cy - offset.y) / scale;
    const next = clampOffset(imgRef.current, newScale, {
      x: cx - imgX * newScale,
      y: cy - imgY * newScale,
    });
    setScale(newScale);
    setOffset(next);
    draw(imgRef.current, newScale, next);
  }

  const handleSave = useCallback(async () => {
    const img = imgRef.current;
    if (!img) return;
    setUploading(true);
    setError(null);

    try {
      const outCanvas = document.createElement("canvas");
      outCanvas.width = outputWidth;
      outCanvas.height = outputHeight;
      const ratio = outputWidth / DISPLAY_WIDTH;
      const ctx = outCanvas.getContext("2d");
      if (!ctx) throw new Error("Kırpma başarısız oldu.");
      ctx.drawImage(img, offset.x * ratio, offset.y * ratio, img.width * scale * ratio, img.height * scale * ratio);

      const blob: Blob | null = await new Promise((resolve) => outCanvas.toBlob(resolve, "image/jpeg", 0.9));
      if (!blob) throw new Error("Kırpma başarısız oldu.");

      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      const res = await fetch(`/api/proxy/media/upload?category=${category}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.title || data?.message || "Yükleme başarısız oldu.");

      onChange(data.url);
      setCropping(false);
      imgRef.current = null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setUploading(false);
    }
  }, [category, offset, outputHeight, outputWidth, scale, onChange]);

  function handleCancel() {
    setCropping(false);
    imgRef.current = null;
    setError(null);
  }

  return (
    <div>
      {label && <p className="mb-1.5 block text-sm font-medium text-foreground">{label}</p>}

      {cropping ? (
        <div className="space-y-3">
          <canvas
            ref={canvasRef}
            width={DISPLAY_WIDTH}
            height={displayHeight}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={cn(
              "cursor-move touch-none border border-border bg-surface-2",
              shape === "circle" ? "rounded-full" : "rounded-lg"
            )}
            style={{ width: DISPLAY_WIDTH, height: displayHeight }}
          />
          <div className="flex items-center gap-2">
            <ZoomIn size={16} className="text-muted" />
            <input
              type="range"
              min={minScale}
              max={minScale * 3}
              step={minScale / 100}
              value={scale}
              onChange={(e) => handleZoomChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          {error && <p className="text-sm text-accent-hover">{error}</p>}
          <div className="flex gap-2">
            <Button type="button" size="sm" disabled={uploading} onClick={handleSave}>
              {uploading ? "Yükleniyor…" : "Kaydet"}
            </Button>
            <Button type="button" size="sm" variant="secondary" disabled={uploading} onClick={handleCancel}>
              İptal
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className={cn("h-20 w-20 border border-border object-cover", shape === "circle" ? "rounded-full" : "rounded-lg")}
            />
          ) : (
            <div
              className={cn(
                "flex h-20 w-20 items-center justify-center border border-dashed border-border bg-surface-2 text-muted",
                shape === "circle" ? "rounded-full" : "rounded-lg"
              )}
            >
              <ImagePlus size={22} />
            </div>
          )}
          <div>
            <Button type="button" size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
              {value ? "Değiştir" : "Fotoğraf Seç"}
            </Button>
            {error && <p className="mt-1.5 text-sm text-accent-hover">{error}</p>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelected(file);
              e.target.value = "";
            }}
          />
        </div>
      )}
    </div>
  );
}
