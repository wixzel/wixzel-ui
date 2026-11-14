# wixzel-ui

Wixzel UI components for React 19 and Tailwind CSS v4: calm, tonal, crafted, and
one seed colour away from your brand.

```bash
npm i wixzel-ui
npx wixzel-ui --seed "#E4572E" > src/brand.css
```

```css
@import "tailwindcss";
@import "wixzel-ui/styles.css";
@import "./brand.css";
```

```tsx
import { Button, WixzelProvider } from "wixzel-ui";

<WixzelProvider>
  <Button variant="primary">Save changes</Button>
</WixzelProvider>
```

Docs and live components: https://ui.wixzel.com/docs/react/ · MIT
