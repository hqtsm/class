/**
 * @module
 *
 * Constant utilities.
 */

import type { Readonlys } from './readonly.ts';

/**
 * Define constant.
 *
 * @template T Type.
 * @param obj Object.
 * @param key Key.
 */
export function constant<T extends object>(obj: T, key: Readonlys<T>): void {
	Object.defineProperty(obj, key, {
		value: obj[key],
		configurable: false,
		enumerable: false,
		writable: false,
	});
}
