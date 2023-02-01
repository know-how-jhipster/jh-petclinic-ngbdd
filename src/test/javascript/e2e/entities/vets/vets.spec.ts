import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { VetsComponentsPage, VetsDeleteDialog, VetsUpdatePage } from './vets.page-object';

const expect = chai.expect;

describe('Vets e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let vetsComponentsPage: VetsComponentsPage;
  let vetsUpdatePage: VetsUpdatePage;
  let vetsDeleteDialog: VetsDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Vets', async () => {
    await navBarPage.goToEntity('vets');
    vetsComponentsPage = new VetsComponentsPage();
    await browser.wait(ec.visibilityOf(vetsComponentsPage.title), 5000);
    expect(await vetsComponentsPage.getTitle()).to.eq('petclinicApp.vets.home.title');
    await browser.wait(ec.or(ec.visibilityOf(vetsComponentsPage.entities), ec.visibilityOf(vetsComponentsPage.noResult)), 1000);
  });

  it('should load create Vets page', async () => {
    await vetsComponentsPage.clickOnCreateButton();
    vetsUpdatePage = new VetsUpdatePage();
    expect(await vetsUpdatePage.getPageTitle()).to.eq('petclinicApp.vets.home.createOrEditLabel');
    await vetsUpdatePage.cancel();
  });

  it('should create and save Vets', async () => {
    const nbButtonsBeforeCreate = await vetsComponentsPage.countDeleteButtons();

    await vetsComponentsPage.clickOnCreateButton();

    await promise.all([vetsUpdatePage.setFirstnameInput('firstname'), vetsUpdatePage.setLastnameInput('lastname')]);

    await vetsUpdatePage.save();
    expect(await vetsUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await vetsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Vets', async () => {
    const nbButtonsBeforeDelete = await vetsComponentsPage.countDeleteButtons();
    await vetsComponentsPage.clickOnLastDeleteButton();

    vetsDeleteDialog = new VetsDeleteDialog();
    expect(await vetsDeleteDialog.getDialogTitle()).to.eq('petclinicApp.vets.delete.question');
    await vetsDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(vetsComponentsPage.title), 5000);

    expect(await vetsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
