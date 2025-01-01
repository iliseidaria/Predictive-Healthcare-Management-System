import { TestBed } from '@angular/core/testing';
import { NavigationService } from './navigation.service';
import { Location } from '@angular/common';

describe('NavigationService', () => {
  let service: NavigationService;
  let location: jasmine.SpyObj<Location>;

  beforeEach(() => {
    location = jasmine.createSpyObj('Location', ['back']);
    
    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: Location, useValue: location }
      ]
    });
    
    service = TestBed.inject(NavigationService);
  });

  it('should navigate back', () => {
    service.goBack();
    expect(location.back).toHaveBeenCalled();
  });
});