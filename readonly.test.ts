import { assert } from '@std/assert';
import type { ReadonlyKeys } from './readonly.ts';

type IsEqual<X, Y> = (
	<E>() => E extends X ? 1 : 2
) extends (
	<E>() => E extends Y ? 1 : 2
) ? true
	: false;

const requiredRW = Symbol();
const requiredRO = Symbol();
const optionalRW = Symbol();
const optionalRO = Symbol();

const staticRequiredRW = Symbol();
const staticRequiredRO = Symbol();
const staticOptionalRW = Symbol();
const staticOptionalRO = Symbol();

Deno.test('ReadonlyKeys: interface', () => {
	interface Properties {
		requiredRW: number;
		optionalRW?: number;
		[requiredRW]: number;
		[optionalRW]?: number;
		readonly requiredRO: number;
		readonly optionalRO?: number;
		readonly [requiredRO]: number;
		readonly [optionalRO]?: number;
	}
	assert(
		true satisfies IsEqual<
			ReadonlyKeys<Properties>,
			| 'requiredRO'
			| 'optionalRO'
			| typeof requiredRO
			| typeof optionalRO
		>,
	);

	interface IndexRW {
		[index: number]: number;
	}
	assert(true satisfies IsEqual<ReadonlyKeys<IndexRW>, never>);

	interface IndexRO {
		readonly [index: number]: number;
	}
	assert(true satisfies IsEqual<ReadonlyKeys<IndexRO>, number>);
});

Deno.test('ReadonlyKeys: type', () => {
	type Properties = {
		requiredRW: number;
		optionalRW?: number;
		[requiredRW]: number;
		[optionalRW]?: number;
		readonly requiredRO: number;
		readonly optionalRO?: number;
		readonly [requiredRO]: number;
		readonly [optionalRO]?: number;
	};
	assert(
		true satisfies IsEqual<
			ReadonlyKeys<Properties>,
			| 'requiredRO'
			| 'optionalRO'
			| typeof requiredRO
			| typeof optionalRO
		>,
	);

	type IndexRW = {
		[index: number]: number;
	};
	assert(true satisfies IsEqual<ReadonlyKeys<IndexRW>, never>);

	type IndexRO = {
		readonly [index: number]: number;
	};
	assert(true satisfies IsEqual<ReadonlyKeys<IndexRO>, number>);
});

Deno.test('ReadonlyKeys: concrete class', () => {
	class Properties {
		requiredRW = 0;
		optionalRW?: number;
		[requiredRW] = 0;
		[optionalRW]?: number;
		readonly requiredRO = 0;
		readonly optionalRO?: number;
		readonly [requiredRO] = 0;
		readonly [optionalRO]?: number;

		static staticRequiredRW = 0;
		static staticOptionalRW?: number;
		static [staticRequiredRW] = 0;
		static [staticOptionalRW]?: number;
		static readonly staticRequiredRO = 0;
		static readonly staticOptionalRO?: number;
		static readonly [staticRequiredRO] = 0;
		static readonly [staticOptionalRO]?: number;
	}
	assert(Properties);
	assert(
		true satisfies IsEqual<
			ReadonlyKeys<Properties>,
			| 'requiredRO'
			| 'optionalRO'
			| typeof requiredRO
			| typeof optionalRO
		>,
	);
	assert(
		true satisfies IsEqual<
			ReadonlyKeys<typeof Properties>,
			| 'staticRequiredRO'
			| 'staticOptionalRO'
			| typeof staticRequiredRO
			| typeof staticOptionalRO
		>,
	);

	class IndexRW {
		[index: number]: number;
	}
	assert(IndexRW);
	assert(true satisfies IsEqual<ReadonlyKeys<IndexRW>, never>);

	class IndexRO {
		readonly [index: number]: number;
	}
	assert(IndexRO);
	assert(true satisfies IsEqual<ReadonlyKeys<IndexRO>, number>);
});

Deno.test('ReadonlyKeys: abstract class', () => {
	abstract class Properties {
		requiredRW = 0;
		optionalRW?: number;
		[requiredRW] = 0;
		[optionalRW]?: number;
		readonly requiredRO = 0;
		readonly optionalRO?: number;
		readonly [requiredRO] = 0;
		readonly [optionalRO]?: number;

		static staticRequiredRW = 0;
		static staticOptionalRW?: number;
		static [staticRequiredRW] = 0;
		static [staticOptionalRW]?: number;
		static readonly staticRequiredRO = 0;
		static readonly staticOptionalRO?: number;
		static readonly [staticRequiredRO] = 0;
		static readonly [staticOptionalRO]?: number;
	}
	assert(Properties);
	assert(
		true satisfies IsEqual<
			ReadonlyKeys<Properties>,
			| 'requiredRO'
			| 'optionalRO'
			| typeof requiredRO
			| typeof optionalRO
		>,
	);
	assert(
		true satisfies IsEqual<
			ReadonlyKeys<typeof Properties>,
			| 'staticRequiredRO'
			| 'staticOptionalRO'
			| typeof staticRequiredRO
			| typeof staticOptionalRO
		>,
	);

	abstract class IndexRW {
		[index: number]: number;
	}
	assert(IndexRW);
	assert(true satisfies IsEqual<ReadonlyKeys<IndexRW>, never>);

	abstract class IndexRO {
		readonly [index: number]: number;
	}
	assert(IndexRO);
	assert(true satisfies IsEqual<ReadonlyKeys<IndexRO>, number>);
});

Deno.test('ReadonlyKeys: function', () => {
	assert(
		true satisfies IsEqual<
			ReadonlyKeys<
				// deno-lint-ignore ban-types
				Function
			>,
			'length' | 'name'
		>,
	);

	assert(
		true satisfies IsEqual<
			ReadonlyKeys<() => void>,
			never
		>,
	);

	const func = function (): number {
		return 0;
	};
	assert(
		true satisfies IsEqual<
			ReadonlyKeys<typeof func>,
			never
		>,
	);

	const arrow = () => 0;
	assert(
		true satisfies IsEqual<
			ReadonlyKeys<typeof arrow>,
			never
		>,
	);
});
