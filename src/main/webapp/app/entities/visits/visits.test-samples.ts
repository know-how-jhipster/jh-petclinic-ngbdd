import dayjs from 'dayjs/esm';

import { IVisits, NewVisits } from './visits.model';

export const sampleWithRequiredData: IVisits = {
  id: 35290,
  visitdate: dayjs('2023-01-31T14:49'),
  description: 'Personal Berkshire state',
};

export const sampleWithPartialData: IVisits = {
  id: 83531,
  visitdate: dayjs('2023-01-31T20:19'),
  description: 'Assurance',
};

export const sampleWithFullData: IVisits = {
  id: 49530,
  visitdate: dayjs('2023-01-31T22:08'),
  description: 'Avon Kids',
};

export const sampleWithNewData: NewVisits = {
  visitdate: dayjs('2023-02-01T09:02'),
  description: 'GB',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
