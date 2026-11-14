/** Where useTheme saves the choice, and where themeScript reads it back. */
export const THEME_STORAGE_KEY = "wx-theme";

/**
 * Inline this in <head> so the saved theme is applied before first paint:
 *   <script dangerouslySetInnerHTML={{ __html: themeScript }} />
 */
export const themeScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
