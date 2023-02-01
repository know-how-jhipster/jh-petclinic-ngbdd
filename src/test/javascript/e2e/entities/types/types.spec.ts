import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { TypesComponentsPage, TypesDeleteDialog, TypesUpdatePage } from './types.page-object';

const expect = chai.expect;

describe('Types e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let typesComponentsPage: TypesComponentsPage;
  let typesUpdatePage: TypesUpdatePage;
  let typesDeleteDialog: TypesDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Types', async () => {
    await navBarPage.goToEntity('types');
    typesComponentsPage = new TypesComponentsPage();
    await browser.wait(ec.visibilityOf(typesComponentsPage.title), 5000);
    expect(await typesComponentsPage.getTitle()).to.eq('petclinicApp.types.home.title');
    await browser.wait(ec.or(ec.visibilityOf(typesComponentsPage.entities), ec.visibilityOf(typesComponentsPage.noResult)), 1000);
  });

  it('should load create Types page', async () => {
    await typesComponentsPage.clickOnCreateButton();
    typesUpdatePage = new TypesUpdatePage();
    expect(await typesUpdatePage.getPageTitle()).to.eq('petclinicApp.types.home.createOrEditLabel');
    await typesUpdatePage.cancel();
  });

  it('should create and save Types', async () => {
    const nbButtonsBeforeCreate = await typesComponentsPage.countDeleteButtons();

    await typesComponentsPage.clickOnCreateButton();

    await promise.all([typesUpdatePage.setNameInput('name')]);

    await typesUpdatePage.save();
    expect(await typesUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await typesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Types', async () => {
    const nbButtonsBeforeDelete = await typesComponentsPage.countDeleteButtons();
    await typesComponentsPage.clickOnLastDeleteButton();

    typesDeleteDialog = new TypesDeleteDialog();
    expect(await typesDeleteDialog.getDialogTitle()).to.eq('petclinicApp.types.delete.question');
    await typesDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(typesComponentsPage.title), 5000);

    expect(await typesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
