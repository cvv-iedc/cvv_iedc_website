// Global Theme Configuration
// Changing values here updates the entire site instantly via CSS variables

export const theme = {
  colors: {
    primary: '#2563EB',
    secondary: '#16A34A',
    accent: '#1D4ED8',
    background: '#FFFFFF',
    surface: '#F0F4FF',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#CBD5E1',
    brandRed: '#DC2626',
    brandBlack: '#0F172A',
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'DM Sans', sans-serif",
    display: "'Bricolage Grotesque', sans-serif",
    accentSerif: "'Playfair Display', serif",
  },
  borderRadius: {
    card: '1.25rem',
    button: '9999px',
    modal: '1.5rem',
  },
  spacing: {
    sectionPadding: '6rem 2rem',
    cardGap: '1.5rem',
  },
}

// Inject theme as CSS variables into :root
export function injectTheme() {
  const root = document.documentElement
  const { colors, fonts, borderRadius } = theme
  
  root.style.setProperty('--color-primary', colors.primary)
  root.style.setProperty('--color-secondary', colors.secondary)
  root.style.setProperty('--color-accent', colors.accent)
  root.style.setProperty('--color-background', colors.background)
  root.style.setProperty('--color-surface', colors.surface)
  root.style.setProperty('--color-text-primary', colors.textPrimary)
  root.style.setProperty('--color-text-secondary', colors.textSecondary)
  root.style.setProperty('--color-text-muted', colors.textMuted)
  root.style.setProperty('--color-brand-red', colors.brandRed)
  root.style.setProperty('--color-brand-black', colors.brandBlack)
  
  root.style.setProperty('--font-heading', fonts.heading)
  root.style.setProperty('--font-body', fonts.body)
  root.style.setProperty('--font-display', fonts.display)
  root.style.setProperty('--font-accent-serif', fonts.accentSerif)
  
  root.style.setProperty('--radius-card', borderRadius.card)
  root.style.setProperty('--radius-button', borderRadius.button)
  root.style.setProperty('--radius-modal', borderRadius.modal)
}
