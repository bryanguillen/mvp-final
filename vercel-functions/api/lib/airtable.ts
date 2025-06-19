import Airtable from 'airtable';

export class AirtableBase {
  private base: Airtable.Base;

  constructor({ apiKey, baseId }: { apiKey: string; baseId: string }) {
    Airtable.configure({ apiKey });
    this.base = Airtable.base(baseId);
  }

  public get(table: string) {
    return this.base(table);
  }
}
