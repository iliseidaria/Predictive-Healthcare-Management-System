import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let navigationService: NavigationService;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(() => {
    const mockLocation = jasmine.createSpyObj('Location', ['back']);

    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: Location, useValue: mockLocation }
      ]
    });

    navigationService = TestBed.inject(NavigationService);
    locationSpy = TestBed.inject(Location) as jasmine.SpyObj<Location>;
  });

  it('should be created', () => {
    expect(navigationService).toBeTruthy();
  });

  it('should call location.back() when goBack() is called', () => {
    navigationService.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});
