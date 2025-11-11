import { assert, assertEquals } from '@std/assert';
import type { Abstract, Concrete } from './class.ts';

type IsEqual<X, Y> = (
	<E>() => E extends X ? 1 : 2
) extends (
	<E>() => E extends Y ? 1 : 2
) ? true
	: false;

abstract class BaseA {
	public readonly a: number;
	protected readonly b: number;
	private readonly c: number;

	constructor(a: number, b: number, c?: number) {
		this.a = a;
		this.b = b;
		this.c = c ?? 0;
	}

	values(): [number, number, number] {
		return [this.a, this.b, this.c];
	}

	public static readonly PUB = 1;
	protected static readonly PRO = 2;
	private static readonly PRI = 3;

	static values(): [number, number, number] {
		return [this.PUB, this.PRO, this.PRI];
	}

	static new(): string {
		return 'new';
	}
}

class BaseC {
	public readonly a: number;
	protected readonly b: number;
	private readonly c: number;

	constructor(a: number, b: number, c?: number) {
		this.a = a;
		this.b = b;
		this.c = c ?? 0;
	}

	values(): [number, number, number] {
		return [this.a, this.b, this.c];
	}

	public static readonly PUB = 1;
	protected static readonly PRO = 2;
	private static readonly PRI = 3;

	static values(): [number, number, number] {
		return [this.PUB, this.PRO, this.PRI];
	}

	static new(): string {
		return 'new';
	}
}

Deno.test('Concrete: abstract', () => {
	class Impl extends BaseA {}
	const CB: Concrete<typeof BaseA> = Impl;

	assert(true satisfies IsEqual<(typeof CB)['prototype'], BaseA>);
	assert(
		true satisfies IsEqual<
			ConstructorParameters<typeof CB>,
			[a: number, b: number, c?: number | undefined]
		>,
	);
	assert(true satisfies IsEqual<InstanceType<typeof CB>, Impl>);

	assertEquals((new CB(1, 2)).values(), [1, 2, 0]);
	assertEquals((new CB(1, 2, 3)).values(), [1, 2, 3]);
	assertEquals(CB.values(), [1, 2, 3]);
	assertEquals(CB.new(), 'new');
});

Deno.test('Concrete: concrete', () => {
	class Impl extends BaseA {}
	const CI: Concrete<typeof Impl> = Impl;

	assert(true satisfies IsEqual<(typeof CI)['prototype'], Impl>);
	assert(
		true satisfies IsEqual<
			ConstructorParameters<typeof CI>,
			[a: number, b: number, c?: number | undefined]
		>,
	);
	assert(true satisfies IsEqual<InstanceType<typeof CI>, Impl>);

	assertEquals((new CI(1, 2)).values(), [1, 2, 0]);
	assertEquals((new CI(1, 2, 3)).values(), [1, 2, 3]);
	assertEquals(CI.values(), [1, 2, 3]);
	assertEquals(CI.new(), 'new');
});

Deno.test('Concrete: new', () => {
	class Impl extends BaseA {}
	const CI: Concrete<typeof Impl> = Impl;
	assert(new CI(1, 2));
});

Deno.test('Concrete: function', () => {
	// @ts-expect-error Class only.
	type Bad = Concrete<() => void>;
	assert(true satisfies IsEqual<Bad, never>);
});

Deno.test('Concrete: super', () => {
	const Base: Concrete<typeof BaseA> = class Base extends BaseA {};

	class GoodSuper extends Base {
		constructor() {
			super(1, 2, 3);
		}
	}
	assert(GoodSuper);

	class BadSuper extends Base {
		constructor() {
			// @ts-expect-error Arguments.
			super();
		}
	}
	assert(BadSuper);
});

Deno.test('Abstract: abstract', () => {
	const BaseA: Abstract<typeof BaseC> = BaseC;
	class Impl extends BaseA {}
	const CB: Concrete<typeof BaseA> = Impl;

	assert(true satisfies IsEqual<(typeof CB)['prototype'], BaseC>);
	assert(
		true satisfies IsEqual<
			ConstructorParameters<typeof CB>,
			[a: number, b: number, c?: number | undefined]
		>,
	);
	assert(true satisfies IsEqual<InstanceType<typeof CB>, Impl>);

	assertEquals((new CB(1, 2)).values(), [1, 2, 0]);
	assertEquals((new CB(1, 2, 3)).values(), [1, 2, 3]);
	assertEquals(CB.values(), [1, 2, 3]);
	assertEquals(CB.new(), 'new');
});

Deno.test('Abstract: concrete', () => {
	const BaseA: Abstract<typeof BaseC> = BaseC;
	class Impl extends BaseA {}
	const CI: Concrete<typeof Impl> = Impl;

	assert(true satisfies IsEqual<(typeof CI)['prototype'], Impl>);
	assert(
		true satisfies IsEqual<
			ConstructorParameters<typeof CI>,
			[a: number, b: number, c?: number | undefined]
		>,
	);
	assert(true satisfies IsEqual<InstanceType<typeof CI>, Impl>);

	assertEquals((new CI(1, 2)).values(), [1, 2, 0]);
	assertEquals((new CI(1, 2, 3)).values(), [1, 2, 3]);
	assertEquals(CI.values(), [1, 2, 3]);
	assertEquals(CI.new(), 'new');
});

Deno.test('Abstract: new', () => {
	const CB: Abstract<typeof BaseA> = BaseA;
	// @ts-expect-error Abstract.
	const o = new CB(1, 2);
	assert(o);
});

Deno.test('Abstract: function', () => {
	// @ts-expect-error Class only.
	type Bad = Abstract<() => void>;
	assert(true satisfies IsEqual<Bad, never>);
});

Deno.test('Abstract: super', () => {
	const Base: Abstract<typeof BaseC> = class Base extends BaseC {};

	class GoodSuper extends Base {
		constructor() {
			super(1, 2, 3);
		}
	}
	assert(GoodSuper);

	class BadSuper extends Base {
		constructor() {
			// @ts-expect-error Arguments.
			super();
		}
	}
	assert(BadSuper);
});
