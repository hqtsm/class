/**
 * @module
 *
 * Class utilities.
 */

// deno-lint-ignore-file no-explicit-any ban-types

/**
 * Convert a class to an abstract class.
 *
 * @template C Class.
 * @returns Abstract class.
 */
export type Abstract<
	C extends abstract new (...args: any[]) => any,
> = C extends abstract new (...args: infer A) => infer R
	? (abstract new (...args: A) => R) & Omit<C, never>
	: never;

/**
 * Convert a class to a concrete class.
 *
 * @template C Class.
 * @returns Concrete class.
 */
export type Concrete<
	C extends abstract new (...args: any[]) => any,
> = C extends abstract new (...args: infer A) => infer R
	? (new (...args: A) => R) & Omit<C, never>
	: never;

/**
 * Generic class with optional static properties.
 *
 * @template C Static properties.
 * @returns Class type.
 */
export type Class<C extends object = {}> =
	& (abstract new (...args: any[]) => any)
	& { readonly prototype: object }
	& Omit<C, 'prototype'>;
