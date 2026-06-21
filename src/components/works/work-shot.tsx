import Image from "next/image";

export function WorkShot({
  src,
  alt,
  ratio,
  sizes,
  objectPosition,
  className,
}: {
  src: string;
  alt: string;
  /** proporção do tile, ex. "831 / 674" */
  ratio: string;
  sizes: string;
  objectPosition?: string;
  className?: string;
}) {
  return (
    // z-[3] levanta a imagem acima do overlay de scanlines global (z-2 em globals.css)
    <div
      className={`relative z-[3] w-full overflow-hidden${className ? ` ${className}` : ""}`}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={100}
        // screenshots com texto: servir o PNG original sem recompressão do Next
        // (a otimização padrão q75 + WebP/AVIF borrava o texto)
        unoptimized
        style={objectPosition ? { objectPosition } : undefined}
        className="object-cover"
      />
    </div>
  );
}
