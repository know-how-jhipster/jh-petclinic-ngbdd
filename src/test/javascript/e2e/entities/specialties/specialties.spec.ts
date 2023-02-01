import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { SpecialtiesComponentsPage, SpecialtiesDeleteDialog, SpecialtiesUpdatePage } from './specialties.page-object';

const expect = chai.expect;

describe('Specialties e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let specialtiesComponentsPage: SpecialtiesComponentsPage;
  let specialtiesUpdatePage: SpecialtiesUpdatePage;
  let specialtiesDeleteDialog: SpecialtiesDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Specialties', async () => {
    await navBarPage.goToEntity('specialties');
    specialtiesComponentsPage = new SpecialtiesComponentsPage();
    await browser.wait(ec.visibilityOf(specialtiesComponentsPage.title), 5000);
    expect(await specialtiesComponentsPage.getTitle()).to.eq('petclinicApp.specialties.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(specialtiesComponentsPage.entities), ec.visibilityOf(specialtiesComponentsPage.noResult)),
      1000
    );
  });

  it('should load create Specialties page', async () => {
    await specialtiesComponentsPage.clickOnCreateButton();
    specialtiesUpdatePage = new SpecialtiesUpdatePage();
    expect(await specialtiesUpdatePage.getPageTitle()).to.eq('petclinicApp.specialties.home.createOrEditLabel');
    await specialtiesUpdatePage.cancel();
  });

  it('should create and save Specialties', async () => {
    const nbButtonsBeforeCreate = await specialtiesComponentsPage.countDeleteButtons();

    await specialtiesComponentsPage.clickOnCreateButton();

    await promise.all([
      specialtiesUpdatePage.setNameInput('name'),
      // specialtiesUpdatePage.vetSelectLastOption(),
    ]);

    await specialtiesUpdatePage.save();
    expect(await specialtiesUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await specialtiesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Specialties', async () => {
    const nbButtonsBeforeDelete = await specialtiesComponentsPage.countDeleteButtons();
    await specialtiesComponentsPage.clickOnLastDeleteButton();

    specialtiesDeleteDialog = new SpecialtiesDeleteDialog();
    expect(await specialtiesDeleteDialog.getDialogTitle()).to.eq('petclinicApp.specialties.delete.question');
    await specialtiesDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(specialtiesComponentsPage.title), 5000);

    expect(await specialtiesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
