import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { VisitsComponentsPage, VisitsDeleteDialog, VisitsUpdatePage } from './visits.page-object';

const expect = chai.expect;

describe('Visits e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let visitsComponentsPage: VisitsComponentsPage;
  let visitsUpdatePage: VisitsUpdatePage;
  let visitsDeleteDialog: VisitsDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Visits', async () => {
    await navBarPage.goToEntity('visits');
    visitsComponentsPage = new VisitsComponentsPage();
    await browser.wait(ec.visibilityOf(visitsComponentsPage.title), 5000);
    expect(await visitsComponentsPage.getTitle()).to.eq('petclinicApp.visits.home.title');
    await browser.wait(ec.or(ec.visibilityOf(visitsComponentsPage.entities), ec.visibilityOf(visitsComponentsPage.noResult)), 1000);
  });

  it('should load create Visits page', async () => {
    await visitsComponentsPage.clickOnCreateButton();
    visitsUpdatePage = new VisitsUpdatePage();
    expect(await visitsUpdatePage.getPageTitle()).to.eq('petclinicApp.visits.home.createOrEditLabel');
    await visitsUpdatePage.cancel();
  });

  it('should create and save Visits', async () => {
    const nbButtonsBeforeCreate = await visitsComponentsPage.countDeleteButtons();

    await visitsComponentsPage.clickOnCreateButton();

    await promise.all([
      visitsUpdatePage.setVisitdateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      visitsUpdatePage.setDescriptionInput('description'),
      visitsUpdatePage.petSelectLastOption(),
    ]);

    await visitsUpdatePage.save();
    expect(await visitsUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await visitsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Visits', async () => {
    const nbButtonsBeforeDelete = await visitsComponentsPage.countDeleteButtons();
    await visitsComponentsPage.clickOnLastDeleteButton();

    visitsDeleteDialog = new VisitsDeleteDialog();
    expect(await visitsDeleteDialog.getDialogTitle()).to.eq('petclinicApp.visits.delete.question');
    await visitsDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(visitsComponentsPage.title), 5000);

    expect(await visitsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
