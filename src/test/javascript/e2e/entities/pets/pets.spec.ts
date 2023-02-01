import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PetsComponentsPage, PetsDeleteDialog, PetsUpdatePage } from './pets.page-object';

const expect = chai.expect;

describe('Pets e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let petsComponentsPage: PetsComponentsPage;
  let petsUpdatePage: PetsUpdatePage;
  let petsDeleteDialog: PetsDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Pets', async () => {
    await navBarPage.goToEntity('pets');
    petsComponentsPage = new PetsComponentsPage();
    await browser.wait(ec.visibilityOf(petsComponentsPage.title), 5000);
    expect(await petsComponentsPage.getTitle()).to.eq('petclinicApp.pets.home.title');
    await browser.wait(ec.or(ec.visibilityOf(petsComponentsPage.entities), ec.visibilityOf(petsComponentsPage.noResult)), 1000);
  });

  it('should load create Pets page', async () => {
    await petsComponentsPage.clickOnCreateButton();
    petsUpdatePage = new PetsUpdatePage();
    expect(await petsUpdatePage.getPageTitle()).to.eq('petclinicApp.pets.home.createOrEditLabel');
    await petsUpdatePage.cancel();
  });

  it('should create and save Pets', async () => {
    const nbButtonsBeforeCreate = await petsComponentsPage.countDeleteButtons();

    await petsComponentsPage.clickOnCreateButton();

    await promise.all([
      petsUpdatePage.setNameInput('name'),
      petsUpdatePage.setBirthdateInput('2000-12-31'),
      petsUpdatePage.typeSelectLastOption(),
      petsUpdatePage.ownerSelectLastOption(),
    ]);

    await petsUpdatePage.save();
    expect(await petsUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await petsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Pets', async () => {
    const nbButtonsBeforeDelete = await petsComponentsPage.countDeleteButtons();
    await petsComponentsPage.clickOnLastDeleteButton();

    petsDeleteDialog = new PetsDeleteDialog();
    expect(await petsDeleteDialog.getDialogTitle()).to.eq('petclinicApp.pets.delete.question');
    await petsDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(petsComponentsPage.title), 5000);

    expect(await petsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
