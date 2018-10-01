import { AppComponent } from './app.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from './app.module';
import { AppRoutingModule } from './app-routing.module';
import { APP_BASE_HREF } from '@angular/common';


describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [AppRoutingModule, AppModule],
            providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
