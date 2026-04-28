const logoSrc = '/ocp-logo.png';

export default function OcpLogo({ className = '', alt = 'OCP' }) {
  return <img src={logoSrc} alt={alt} className={className} />;
}
