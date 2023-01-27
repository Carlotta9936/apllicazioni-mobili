import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcquistoCreditiComponent } from './acquisto-crediti.component';

describe('AcquistoCreditiComponent', () => {
  let component: AcquistoCreditiComponent;
  let fixture: ComponentFixture<AcquistoCreditiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AcquistoCreditiComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcquistoCreditiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
