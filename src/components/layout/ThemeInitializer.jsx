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
      dangerouslySetInnerHTML={{ __html: scriptCode }}
      suppressHydrationWarning
    />
  );
}