import { ref } from 'vue';

export interface ToastOptions {
  title: string;
  message: string;
  toastType: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export const useCustomToast = () => {
  const showToast = (options: ToastOptions) => {
    console.log(`[${options.toastType.toUpperCase()}] ${options.title}: ${options.message}`);
  };

  return { showToast };
};
