/**
 * @module
 *
 * Symbol utilities.
 */

import type { IsClass } from './class.ts';

/**
 * Define Symbol.toStringTag for class.
 *
 * @param Class Class.
 * @param value String tag value.
 */
export function toStringTag<T>(
	Class: T & IsClass<T>,
	value: string,
): void {
	Object.defineProperty(Class.prototype, Symbol.toStringTag, {
		value,
		configurable: true,
		enumerable: false,
		writable: false,
	});
}
