import { add, Dinero, dinero } from 'dinero.js';
import { USD } from '@dinero.js/currencies';

export const dineroUSD = (amount: number) => dinero({ amount, currency: USD });

export const addMany = (addends: Dinero<number>[]) => addends.reduce(add);
