/**
 * ThemeInitializer — inline script yang mencegah flash of unstyled content (FOUC).
 * Menggunakan raw <script> tag agar dieksekusi sebelum React hydration.
 * suppressHydrationWarning dipasang agar React tidak komplain perbedaan SSR vs client.
 */
export default function ThemeInitializer() {
  const scriptCode = `
    (function() {
      try {
        var STORAGE_KEY = "site-theme";
        var root = document.documentElement;
        var saved = window.localStorage.getItem(STORAGE_KEY);
        var theme = saved === "light" || saved === "dark" 
            ? saved 
            : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        
        root.dataset.theme = theme;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        root.style.colorScheme = theme;
      } catch (e) {}
    })();
  `;

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: scriptCode }}
    />
  );
}