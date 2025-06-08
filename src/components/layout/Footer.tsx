import type { FC } from 'react';

interface FooterProps {
  className?: string;
}

const Footer: FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`w-full text-center text-muted-foreground text-sm ${className}`}>
      <p>© Team-Veo3 – 2025</p>
    </footer>
  );
};

export default Footer;
