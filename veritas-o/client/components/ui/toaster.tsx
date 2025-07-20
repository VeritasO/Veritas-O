import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      theme="dark"
      toastOptions={{
        style: {
          background: 'rgb(17 24 39)', // gray-900
          border: '1px solid rgb(107 114 128)', // gray-500
          color: 'rgb(243 244 246)', // gray-100
        },
      }}
    />
  );
}
