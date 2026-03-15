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
 * @param value Value.
 * @param tag String tag value.
 * @returns True if value has Symbol.toStringTag in prototype chain.
 */
export function hasToStringTag<T>(value: T, tag: string): value is T & {
	[Symbol.toStringTag]: string;
} {
	for (
		let t;
		// deno-lint-ignore no-explicit-any
		(t = (value as any)?.[Symbol.toStringTag]);
		value = Object.getPrototypeOf(value)
	) {
		if (t === tag) {
			return true;
		}
	}
	return false;
}
