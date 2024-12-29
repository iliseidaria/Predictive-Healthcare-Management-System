import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      // You can add interceptors here if needed
      // withInterceptors([])
    ),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
