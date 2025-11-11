/**
 * @module
 *
 * Readonly utilities.
 */

/**
 * Check if types are equal.
 *
 * @template A Type A.
 * @template B Type B.
 * @template T Type if equal.
 * @template F Type if not equal.
 * @returns Type T or F.
 */
type IfEqual<A, B, T, F> = (
	<E>() => E extends A ? 1 : 2
) extends (
	<E>() => E extends B ? 1 : 2
) ? T
	: F;

/**
 * Readonly keys of type.
 *
 * @template T Type.
 * @returns Readonly keys.
 */
export type ReadonlyKeys<T extends object> = {
	[K in keyof T]-?: IfEqual<
		{ [P in K]: T[K] },
		{ -readonly [P in K]: T[K] },
		never,
		K
	>;
}[keyof T];
