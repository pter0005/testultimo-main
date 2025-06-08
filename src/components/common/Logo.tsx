import type { FC } from 'react';

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className }) => {
  return (
    <div className={`font-headline text-4xl tracking-wider text-center ${className}`}>
      <span className="text-foreground">TEAM-</span>
      <span className="text-primary">VEO3</span>
    </div>
  );
};

export default Logo;
