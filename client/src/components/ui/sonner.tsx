import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      richColors
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#1d1d1f",
          "--normal-border": "#e5e5e5",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
