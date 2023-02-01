import { element, by, ElementFinder } from 'protractor';

export class SpecialtiesComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-specialties div table .btn-danger'));
  title = element.all(by.css('jhi-specialties div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class SpecialtiesUpdatePage {
  pageTitle = element(by.id('jhi-specialties-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nameInput = element(by.id('field_name'));

  vetSelect = element(by.id('field_vet'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async vetSelectLastOption(): Promise<void> {
    await this.vetSelect.all(by.tagName('option')).last().click();
  }

  async vetSelectOption(option: string): Promise<void> {
    await this.vetSelect.sendKeys(option);
  }

  getVetSelect(): ElementFinder {
    return this.vetSelect;
  }

  async getVetSelectedOption(): Promise<string> {
    return await this.vetSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class SpecialtiesDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-specialties-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-specialties'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
