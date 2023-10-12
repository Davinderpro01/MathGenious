import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { VideoCrudComponent } from './video-crud.component';
import { ActivatedRoute } from '@angular/router';

describe('VideoCrudComponent', () => {
  let component: VideoCrudComponent;
  let fixture: ComponentFixture<VideoCrudComponent>;

  const activatedRouteStub = {
    snapshot: {
      paramMap: {
        get: () => '65160c1949479f4a7178095e', // Puedes cambiar esto según tus necesidades
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoCrudComponent ],
      imports: [HttpClientModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub }, // Proporciona el stub simulado aquí
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
