import { assert, assertEquals, assertInstanceOf } from '@std/assert';
import type { Abstract, Class, Concrete } from './class.ts';

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

Deno.test('Class: only', () => {
	function getToString(c: Class): unknown {
		return c.toString;
	}

	assertEquals(typeof getToString(BaseC), 'function');
	assertEquals(typeof getToString(Object), 'function');
	assertEquals(typeof getToString(Function), 'function');
	assertEquals(typeof getToString(class {}), 'function');

	// @ts-expect-error Not a class.
	const badFunc = getToString(function (): number {
		return 1;
	});
	assertEquals(typeof badFunc, 'function');

	// @ts-expect-error Not a class.
	const badArrow = getToString(() => 1);
	assertEquals(typeof badArrow, 'function');

	// @ts-expect-error Not a class.
	const badObj = getToString({});
	assertEquals(typeof badObj, 'function');
});

Deno.test('Class: members', () => {
	/**
	 * Get member of class.
	 *
	 * @param c Class.
	 * @returns Member.
	 */
	function getPUB(c: Class<{ PUB: number }>): unknown {
		return c.PUB;
	}

	assertEquals(getPUB(BaseA), 1);
	assertEquals(getPUB(BaseC), 1);

	class Bad {}

	// @ts-expect-error Missing.
	const bad = getPUB(Bad);
	assertEquals(bad, undefined);
});

Deno.test('Class: constructor: concrete', () => {
	class A {
		declare public readonly ['constructor']: Class<typeof A>;
		public a = 1;
		public readonly value: string;
		constructor(value: string) {
			this.value = value;
		}
		public static A = 1;
		public static new(): string {
			return 'new';
		}
	}

	class B extends A {
		declare public readonly ['constructor']: Class<typeof B>;
		public b = 2;
		constructor(value: number) {
			super(String(value));
		}
		public static B = 2;
	}

	class C extends B {
		declare public readonly ['constructor']: typeof C;
		public c = 3;
		constructor(value: boolean) {
			super(value ? 1 : 0);
		}
		public static C = 3;
	}

	const a: A = new A('a');
	// @ts-expect-error Abstract.
	const a2: A = new a.constructor('a');
	assertInstanceOf(a, A);
	assertInstanceOf(a2, A);
	assertEquals(a.constructor.A, 1);
	assertEquals(a.constructor.new(), 'new');

	const b: B = new B(2);
	// @ts-expect-error Abstract.
	const b2: B = new b.constructor(2);
	assertInstanceOf(b, B);
	assertInstanceOf(b2, B);
	assertEquals(b.constructor.B, 2);
	assertEquals(b.constructor.new(), 'new');

	const c: C = new C(true);
	const c2: C = new c.constructor(true);
	assertInstanceOf(c, C);
	assertInstanceOf(c2, C);
	assertEquals(c.constructor.C, 3);
	assertEquals(c.constructor.new(), 'new');
});

Deno.test('Class: constructor: abstract', () => {
	abstract class A {
		declare public readonly ['constructor']: Class<typeof A>;
		public a = 1;
		public readonly value: string;
		constructor(value: string) {
			this.value = value;
		}
		public static A = 1;
		public static new(): string {
			return 'new';
		}
	}

	class B extends A {
		declare public readonly ['constructor']: Class<typeof B>;
		public b = 2;
		constructor(value: number) {
			super(String(value));
		}
		public static B = 2;
	}

	abstract class C extends B {
		declare public readonly ['constructor']: typeof C;
		public c = 3;
		constructor(value: boolean) {
			super(value ? 1 : 0);
		}
		public static C = 3;
	}

	// @ts-expect-error Abstract.
	const a: A = new A('a');
	// @ts-expect-error Abstract.
	const a2: A = new a.constructor('a');
	assertInstanceOf(a, A);
	assertInstanceOf(a2, A);
	assertEquals(a.constructor.A, 1);
	assertEquals(a.constructor.new(), 'new');

	const b: B = new B(2);
	// @ts-expect-error Abstract.
	const b2: B = new b.constructor(2);
	assertInstanceOf(b, B);
	assertInstanceOf(b2, B);
	assertEquals(b.constructor.B, 2);
	assertEquals(b.constructor.new(), 'new');

	// @ts-expect-error Abstract.
	const c: C = new C(true);
	// @ts-expect-error Abstract.
	const c2: C = new c.constructor(true);
	assertInstanceOf(c, C);
	assertInstanceOf(c2, C);
	assertEquals(c.constructor.C, 3);
	assertEquals(c.constructor.new(), 'new');
});
