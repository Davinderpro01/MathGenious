import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { SubmoduleCrudComponent } from './submodule-crud.component';
import { ActivatedRoute } from '@angular/router';


describe('SubmoduleCrudComponent', () => {
  let component: SubmoduleCrudComponent;
  let fixture: ComponentFixture<SubmoduleCrudComponent>;

  const activatedRouteStub = {
    snapshot: {
      paramMap: {
        get: () => '6515bd2033bfb0a00ea42dde', // Puedes cambiar esto según tus necesidades
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmoduleCrudComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub }, // Proporciona el stub simulado aquí
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmoduleCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
