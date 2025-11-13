/**
 * @module
 *
 * Symbol utilities.
 */

import type { Class } from './class.ts';

/**
 * Define Symbol.toStringTag for class.
 *
 * @param C Class.
 * @param value String tag value.
 */
export function toStringTag(C: Class, value: string): void {
	Object.defineProperty(C.prototype, Symbol.toStringTag, {
		value,
		configurable: true,
		enumerable: false,
		writable: false,
	});
}
