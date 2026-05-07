import { useTilt } from '../hooks/useTilt';
import * as content from '../data';

export default function MaintenanceMode() {
  const logoRef = null;

  return (
    <div style={styles.container}>
      <div className="dynamic-bg" aria-hidden="true">
        <div className="dynamic-shape dynamic-shape--1" />
        <div className="dynamic-shape dynamic-shape--2" />
        <div className="dynamic-shape dynamic-shape--3" />
        <div className="dynamic-shape dynamic-shape--4" />
        <div className="dynamic-shape dynamic-shape--5" />
      </div>

      <div style={styles.content}>
        <div style={styles.badge}>Em breve voltamos</div>
        
        <h1 style={styles.title}>
          <span style={styles.titleLine}>Voltamos</span>
          <span style={styles.titleLine}>em breve</span>
        </h1>

        <p style={styles.subtitle}>
          Estamos preparando algo especial para você.<br />
          Fique de olho nas redes sociais para novidades.
        </p>

        <div style={styles.social}>
          <a 
            href={content.footerContent.contact.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.socialLink}
          >
            Instagram
          </a>
          <span style={styles.socialDivider}>•</span>
          <a 
            href={content.footerContent.contact.whatsapp} 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.socialLink}
          >
            WhatsApp
          </a>
        </div>

        <div style={styles.info}>
          <p style={styles.infoText}>
            Enquanto isso, você pode nos encontrar em:
          </p>
          <p style={styles.address}>
            {content.footerContent.address.text.replace('\n', ', ')}
          </p>
        </div>

        <p style={styles.tagline}>
          {content.footerContent.tagline}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    textAlign: 'center',
    maxWidth: '600px',
    zIndex: 1,
  },
  badge: {
    display: 'inline-block',
    background: 'var(--primary)',
    color: '#fff',
    padding: '0.5rem 1.25rem',
    borderRadius: '50px',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '2rem',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(3rem, 10vw, 5rem)',
    fontWeight: 900,
    color: 'var(--primary)',
    lineHeight: 1.1,
    marginBottom: '1.5rem',
  },
  titleLine: {
    display: 'block',
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '1.125rem',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
    marginBottom: '2rem',
  },
  social: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '3rem',
  },
  socialLink: {
    color: 'var(--primary)',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    transition: 'color 0.2s',
  },
  socialDivider: {
    color: 'var(--text-light)',
  },
  info: {
    background: 'rgba(27, 48, 34, 0.05)',
    padding: '1.5rem',
    borderRadius: '16px',
    marginBottom: '2rem',
  },
  infoText: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    marginBottom: '0.5rem',
  },
  address: {
    fontSize: '0.9rem',
    color: 'var(--text-main)',
    fontWeight: 500,
  },
  tagline: {
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    fontStyle: 'italic',
    color: 'var(--accent)',
  },
};