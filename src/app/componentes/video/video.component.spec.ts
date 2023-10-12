import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { VideoComponent } from './video.component';
import { ActivatedRoute } from '@angular/router';

describe('VideoComponent', () => {
  let component: VideoComponent;
  let fixture: ComponentFixture<VideoComponent>;

  const activatedRouteStub = {
    snapshot: {
      paramMap: {
        get: () => '65160c1949479f4a7178095e', // Puedes cambiar esto según tus necesidades
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub }, // Proporciona el stub simulado aquí
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
