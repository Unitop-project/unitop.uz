const cache = new Map<string, string>();

export function extractBrandColor(imgUrl: string): Promise<string | null> {
  const cached = cache.get(imgUrl);
  if (cached !== undefined) return Promise.resolve(cached || null);

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const size = 64;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }

      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);

      const buckets = new Map<string, number>();
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i] ?? 0;
        const g = data[i + 1] ?? 0;
        const b = data[i + 2] ?? 0;
        const a = data[i + 3] ?? 0;
        if (a < 128) continue;
        if (r > 240 && g > 240 && b > 240) continue;
        if (r < 15 && g < 15 && b < 15) continue;

        const qr = (r >> 3) << 3;
        const qg = (g >> 3) << 3;
        const qb = (b >> 3) << 3;
        const key = `${qr},${qg},${qb}`;
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
      }

      let bestKey = "";
      let bestCount = 0;
      for (const [key, count] of buckets) {
        if (count > bestCount) {
          bestCount = count;
          bestKey = key;
        }
      }

      if (!bestKey) {
        resolve(null);
        return;
      }

      const [r, g, b] = bestKey.split(",").map(Number);
      const hex = "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
      cache.set(imgUrl, hex);
      resolve(hex);
    };
    img.onerror = () => {
      cache.set(imgUrl, "");
      resolve(null);
    };
    img.src = imgUrl;
  });
}

export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export interface BrandStyle {
  brand: string;
  brandLight: string;
  brandDark: string;
  brandText: string;
  brandBorder: string;
  brandIconBg: string;
}

export function brandStyles(hex: string | null): BrandStyle {
  if (!hex)
    return {
      brand: "#2563eb",
      brandLight: "#f0f7ff",
      brandDark: "#1e3a5f",
      brandText: "#1d4ed8",
      brandBorder: "#bfdbfe",
      brandIconBg: "#dbeafe",
    };
  const { h, s, l } = hexToHSL(hex);
  return {
    brand: hex,
    brandLight: `hsl(${h} ${Math.min(s, 90)}% ${Math.min(l + 35, 97)}%)`,
    brandDark: `hsl(${h} ${Math.min(s + 10, 100)}% ${Math.max(l - 30, 10)}%)`,
    brandText: `hsl(${h} ${Math.min(s + 10, 100)}% ${Math.max(l - 20, 20)}%)`,
    brandBorder: `hsl(${h} ${Math.min(s, 80)}% ${Math.min(l + 10, 85)}%)`,
    brandIconBg: `hsl(${h} ${Math.min(s, 80)}% ${Math.min(l + 25, 95)}%)`,
  };
}
