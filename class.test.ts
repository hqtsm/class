import { assert, assertEquals } from '@std/assert';
import type { Abstract, Concrete } from './class.ts';

type IsEqual<X, Y> = (
	<E>() => E extends X ? 1 : 2
) extends (
	<E>() => E extends Y ? 1 : 2
) ? true
	: false;

Deno.test('Concrete', () => {
	abstract class Base {
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

	class Impl extends Base {}

	{
		const CB: Concrete<typeof Base> = Impl;

		assert(true satisfies IsEqual<(typeof CB)['prototype'], Base>);
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
	}

	{
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
	}

	{
		// @ts-expect-error Class only.
		// deno-lint-ignore ban-types
		type Type = Concrete<Function>;
		assert(true satisfies IsEqual<Type, never>);
	}

	{
		// @ts-expect-error Class only.
		type Type = Concrete<() => void>;
		assert(true satisfies IsEqual<Type, never>);
	}
});

Deno.test('Abstract', () => {
	class Real {
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

	const Base: Abstract<typeof Real> = Real;

	class Impl extends Base {}

	{
		const CB: Concrete<typeof Base> = Impl;

		assert(true satisfies IsEqual<(typeof CB)['prototype'], Real>);
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
	}

	{
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
	}

	{
		// @ts-expect-error Class only.
		// deno-lint-ignore ban-types
		type Type = Abstract<Function>;
		assert(true satisfies IsEqual<Type, never>);
	}

	{
		// @ts-expect-error Class only.
		type Type = Abstract<() => void>;
		assert(true satisfies IsEqual<Type, never>);
	}

	{
		// @ts-expect-error Abstract.
		const o = new Base();
		assert(o);
	}

	class Bad extends Base {
		constructor() {
			// @ts-expect-error Abstract.
			super();
		}
	}
	assert(Bad);
});
