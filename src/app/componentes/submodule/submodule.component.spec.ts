import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SubmoduleComponent } from './submodule.component';

describe('SubmoduleComponent', () => {
  let component: SubmoduleComponent;
  let fixture: ComponentFixture<SubmoduleComponent>;

  const activatedRouteStub = {
    snapshot: {
      paramMap: {
        get: () => '6515bd2033bfb0a00ea42dde', // Puedes cambiar esto según tus necesidades
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmoduleComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub }, // Proporciona el stub simulado aquí
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
