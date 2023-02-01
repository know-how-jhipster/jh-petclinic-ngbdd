import { element, by, ElementFinder } from 'protractor';

export class VisitsComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-visits div table .btn-danger'));
  title = element.all(by.css('jhi-visits div h2#page-heading span')).first();
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

export class VisitsUpdatePage {
  pageTitle = element(by.id('jhi-visits-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  visitdateInput = element(by.id('field_visitdate'));
  descriptionInput = element(by.id('field_description'));

  petSelect = element(by.id('field_pet'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setVisitdateInput(visitdate: string): Promise<void> {
    await this.visitdateInput.sendKeys(visitdate);
  }

  async getVisitdateInput(): Promise<string> {
    return await this.visitdateInput.getAttribute('value');
  }

  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getAttribute('value');
  }

  async petSelectLastOption(): Promise<void> {
    await this.petSelect.all(by.tagName('option')).last().click();
  }

  async petSelectOption(option: string): Promise<void> {
    await this.petSelect.sendKeys(option);
  }

  getPetSelect(): ElementFinder {
    return this.petSelect;
  }

  async getPetSelectedOption(): Promise<string> {
    return await this.petSelect.element(by.css('option:checked')).getText();
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

export class VisitsDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-visits-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-visits'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
