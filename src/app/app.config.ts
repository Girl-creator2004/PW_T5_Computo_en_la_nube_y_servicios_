import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const supabaseConfig = {
  url: 'https://idzpjvlrxmwqzkfshdgk.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkenBqdmxyeG13cXprZnNoZGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTQwODEsImV4cCI6MjA5NjUzMDA4MX0.eg05QIm5btCsVoMa84vOBhNtZ4Fv2b2F_OgK4PqMYEI'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};