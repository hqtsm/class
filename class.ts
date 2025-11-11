/**
 * @module
 *
 * Class utilities.
 */

// deno-lint-ignore-file no-explicit-any

/**
 * Convert a class to an abstract class.
 *
 * @template C Class.
 */
export type Abstract<
	C extends abstract new (...args: any[]) => any,
> = C extends abstract new (...args: infer A) => infer R
	? (abstract new (...args: A) => R) & C
	: never;

/**
 * Convert a class to a concrete class.
 *
 * @template C Class.
 */
export type Concrete<
	C extends abstract new (...args: any[]) => any,
> = C extends abstract new (...args: infer A) => infer R
	? (new (...args: A) => R) & C
	: never;
