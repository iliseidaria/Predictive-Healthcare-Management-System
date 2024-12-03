import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Adjust the path as necessary
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes'; // Adjust the path as necessary
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(
      BrowserAnimationsModule,
      ReactiveFormsModule // Import these modules correctly
    ),
    provideHttpClient(withFetch()) // Configure HttpClient with fetch
  ]
}).catch(err => console.error(err));
