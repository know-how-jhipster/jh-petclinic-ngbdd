import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { OwnersComponentsPage, OwnersDeleteDialog, OwnersUpdatePage } from './owners.page-object';

const expect = chai.expect;

describe('Owners e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let ownersComponentsPage: OwnersComponentsPage;
  let ownersUpdatePage: OwnersUpdatePage;
  let ownersDeleteDialog: OwnersDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Owners', async () => {
    await navBarPage.goToEntity('owners');
    ownersComponentsPage = new OwnersComponentsPage();
    await browser.wait(ec.visibilityOf(ownersComponentsPage.title), 5000);
    expect(await ownersComponentsPage.getTitle()).to.eq('petclinicApp.owners.home.title');
    await browser.wait(ec.or(ec.visibilityOf(ownersComponentsPage.entities), ec.visibilityOf(ownersComponentsPage.noResult)), 1000);
  });

  it('should load create Owners page', async () => {
    await ownersComponentsPage.clickOnCreateButton();
    ownersUpdatePage = new OwnersUpdatePage();
    expect(await ownersUpdatePage.getPageTitle()).to.eq('petclinicApp.owners.home.createOrEditLabel');
    await ownersUpdatePage.cancel();
  });

  it('should create and save Owners', async () => {
    const nbButtonsBeforeCreate = await ownersComponentsPage.countDeleteButtons();

    await ownersComponentsPage.clickOnCreateButton();

    await promise.all([
      ownersUpdatePage.setFirstnameInput('firstname'),
      ownersUpdatePage.setLastnameInput('lastname'),
      ownersUpdatePage.setAddressInput('address'),
      ownersUpdatePage.setCityInput('city'),
      ownersUpdatePage.setTelephoneInput('telephone'),
    ]);

    await ownersUpdatePage.save();
    expect(await ownersUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await ownersComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Owners', async () => {
    const nbButtonsBeforeDelete = await ownersComponentsPage.countDeleteButtons();
    await ownersComponentsPage.clickOnLastDeleteButton();

    ownersDeleteDialog = new OwnersDeleteDialog();
    expect(await ownersDeleteDialog.getDialogTitle()).to.eq('petclinicApp.owners.delete.question');
    await ownersDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(ownersComponentsPage.title), 5000);

    expect(await ownersComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
