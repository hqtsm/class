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

/**
 * Check if value has Symbol.toStringTag in prototype chain.
 *
 * @param tag String tag value.
 * @param value Value.
 * @returns True if value has Symbol.toStringTag in prototype chain.
 */
export function hasToStringTag<T>(tag: string, value: T): value is T & {
	[Symbol.toStringTag]: string;
} {
	for (
		let t = Object(value);
		t && Symbol.toStringTag in t;
		t = Object.getPrototypeOf(t)
	) {
		if (t[Symbol.toStringTag] === tag) {
			return true;
		}
	}
	return false;
}
