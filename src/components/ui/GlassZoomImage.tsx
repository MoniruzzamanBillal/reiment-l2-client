// components/GlassZoomImage.tsx
import React, { useState, useRef } from "react";

interface GlassZoomImageProps {
  imageSrc: string;
  zoomFactor?: number;
  magnifierSize?: number;
}

const GlassZoomImage: React.FC<GlassZoomImageProps> = ({
  imageSrc,
  zoomFactor = 2,
  magnifierSize = 150,
}) => {
  const [magnifierStyle, setMagnifierStyle] = useState<React.CSSProperties>({
    display: "none",
  });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;

    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;

    if (x < 0 || y < 0 || x > width || y > height) {
      setMagnifierStyle({ display: "none" });
    } else {
      setMagnifierStyle({
        display: "block",
        top: `${y - magnifierSize / 2}px`,
        left: `${x - magnifierSize / 2}px`,
        backgroundPosition: `-${x * zoomFactor - magnifierSize / 2}px -${
          y * zoomFactor - magnifierSize / 2
        }px`,
        backgroundSize: `${width * zoomFactor}px ${height * zoomFactor}px`,
      });
    }
  };

  return (
    <div
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMagnifierStyle({ display: "none" })}
      style={{ width: "fit-content" }}
    >
      <img ref={imgRef} src={imageSrc} alt="Zoom" />
      <div
        style={{
          ...magnifierStyle,
          position: "absolute",
          pointerEvents: "none",
          width: magnifierSize,
          height: magnifierSize,
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backgroundImage: `url(${imageSrc})`,
          border: "2px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 8px rgba(0, 0, 0, 0.5)",
        }}
      />
    </div>
  );
};

export default GlassZoomImage;
