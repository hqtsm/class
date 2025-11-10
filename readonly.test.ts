import type { Readonlys } from './readonly.ts';

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

Deno.test('Readonlys: interface', () => {
	interface Properties {
		requiredRW: number;
		readonly requiredRO: number;
		optionalRW?: number;
		readonly optionalRO?: number;
		[requiredRW]: number;
		readonly [requiredRO]: number;
		[optionalRW]?: number;
		readonly [optionalRO]?: number;
	}
	void (true satisfies IsEqual<
		Readonlys<Properties>,
		| 'requiredRO'
		| 'optionalRO'
		| typeof requiredRO
		| typeof optionalRO
	>);

	interface IndexRW {
		[index: number]: number;
	}
	void (true satisfies IsEqual<Readonlys<IndexRW>, never>);

	interface IndexRO {
		readonly [index: number]: number;
	}
	void (true satisfies IsEqual<Readonlys<IndexRO>, number>);
});

Deno.test('Readonlys: type', () => {
	type Properties = {
		requiredRW: number;
		readonly requiredRO: number;
		optionalRW?: number;
		readonly optionalRO?: number;
		[requiredRW]: number;
		readonly [requiredRO]: number;
		[optionalRW]?: number;
		readonly [optionalRO]?: number;
	};
	void (true satisfies IsEqual<
		Readonlys<Properties>,
		| 'requiredRO'
		| 'optionalRO'
		| typeof requiredRO
		| typeof optionalRO
	>);

	type IndexRW = {
		[index: number]: number;
	};
	void (true satisfies IsEqual<Readonlys<IndexRW>, never>);

	type IndexRO = {
		readonly [index: number]: number;
	};
	void (true satisfies IsEqual<Readonlys<IndexRO>, number>);
});

Deno.test('Readonlys: concrete class', () => {
	class Properties {
		requiredRW = 0;
		readonly requiredRO = 0;
		optionalRW?: number;
		readonly optionalRO?: number;
		[requiredRW] = 0;
		readonly [requiredRO] = 0;
		[optionalRW]?: number;
		readonly [optionalRO]?: number;

		static staticRequiredRW = 0;
		static readonly staticRequiredRO = 0;
		static staticOptionalRW?: number;
		static readonly staticOptionalRO?: number;
		static [staticRequiredRW] = 0;
		static readonly [staticRequiredRO] = 0;
		static [staticOptionalRW]?: number;
		static readonly [staticOptionalRO]?: number;
	}
	void Properties;
	void (true satisfies IsEqual<
		Readonlys<Properties>,
		| 'requiredRO'
		| 'optionalRO'
		| typeof requiredRO
		| typeof optionalRO
	>);
	void (true satisfies IsEqual<
		Readonlys<typeof Properties>,
		| 'staticRequiredRO'
		| 'staticOptionalRO'
		| typeof staticRequiredRO
		| typeof staticOptionalRO
	>);

	class IndexRW {
		[index: number]: number;
	}
	void IndexRW;
	void (true satisfies IsEqual<Readonlys<IndexRW>, never>);

	class IndexRO {
		readonly [index: number]: number;
	}
	void IndexRO;
	void (true satisfies IsEqual<Readonlys<IndexRO>, number>);
});

Deno.test('Readonlys: abstract class', () => {
	abstract class Properties {
		requiredRW = 0;
		readonly requiredRO = 0;
		optionalRW?: number;
		readonly optionalRO?: number;
		[requiredRW] = 0;
		readonly [requiredRO] = 0;
		[optionalRW]?: number;
		readonly [optionalRO]?: number;

		static staticRequiredRW = 0;
		static readonly staticRequiredRO = 0;
		static staticOptionalRW?: number;
		static readonly staticOptionalRO?: number;
		static [staticRequiredRW] = 0;
		static readonly [staticRequiredRO] = 0;
		static [staticOptionalRW]?: number;
		static readonly [staticOptionalRO]?: number;
	}
	void Properties;
	void (true satisfies IsEqual<
		Readonlys<Properties>,
		| 'requiredRO'
		| 'optionalRO'
		| typeof requiredRO
		| typeof optionalRO
	>);
	void (true satisfies IsEqual<
		Readonlys<typeof Properties>,
		| 'staticRequiredRO'
		| 'staticOptionalRO'
		| typeof staticRequiredRO
		| typeof staticOptionalRO
	>);

	abstract class IndexRW {
		[index: number]: number;
	}
	void IndexRW;
	void (true satisfies IsEqual<Readonlys<IndexRW>, never>);

	abstract class IndexRO {
		readonly [index: number]: number;
	}
	void IndexRO;
	void (true satisfies IsEqual<Readonlys<IndexRO>, number>);
});

Deno.test('Readonlys: function', () => {
	void (true satisfies IsEqual<
		Readonlys<
			// deno-lint-ignore ban-types
			Function
		>,
		'length' | 'name'
	>);

	void (true satisfies IsEqual<
		Readonlys<() => void>,
		never
	>);

	const func = function (): number {
		return 0;
	};
	void (true satisfies IsEqual<
		Readonlys<typeof func>,
		never
	>);

	const arrow = () => 0;
	void (true satisfies IsEqual<
		Readonlys<typeof arrow>,
		never
	>);
});
