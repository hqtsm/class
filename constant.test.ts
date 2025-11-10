import { assertEquals } from '@std/assert';
import { constant } from './constant.ts';

type IsEqual<X, Y> = (
	<E>() => E extends X ? 1 : 2
) extends (
	<E>() => E extends Y ? 1 : 2
) ? true
	: false;

const constDesc = <T>(value: T) => ({
	value,
	configurable: false,
	enumerable: false,
	writable: false,
});

Deno.test('constant', () => {
	class Abstract {
		public static readonly staticPubRO = 1;
		protected static readonly staticProRO = 2;
		private static readonly staticPriRO = 3;

		static {
			constant(this, 'staticPubRO');
			constant(this, 'staticProRO' as never);
			constant(this, 'staticPriRO' as never);
		}
	}

	class Concrete extends Abstract {
		static {
			constant(this, 'staticPubRO');
			constant(this, 'staticProRO' as never);
			constant(this, 'staticPriRO' as never);
		}
	}

	void (true satisfies IsEqual<typeof Abstract['staticPubRO'], 1>);
	void (true satisfies IsEqual<typeof Abstract['staticProRO'], 2>);
	void (true satisfies IsEqual<typeof Abstract['staticPriRO'], 3>);

	void (true satisfies IsEqual<typeof Concrete['staticPubRO'], 1>);
	void (true satisfies IsEqual<typeof Concrete['staticProRO'], 2>);
	void (true satisfies IsEqual<typeof Concrete['staticPriRO'], 3>);

	assertEquals(Abstract.staticPubRO, 1);
	assertEquals(Abstract['staticProRO'], 2);
	assertEquals(Abstract['staticPriRO'], 3);

	assertEquals(Concrete.staticPubRO, 1);
	assertEquals(Concrete['staticProRO'], 2);
	assertEquals(Concrete['staticPriRO'], 3);

	assertEquals(
		Object.getOwnPropertyDescriptor(Abstract, 'staticPubRO'),
		constDesc(1),
	);
	assertEquals(
		Object.getOwnPropertyDescriptor(Abstract, 'staticProRO'),
		constDesc(2),
	);
	assertEquals(
		Object.getOwnPropertyDescriptor(Abstract, 'staticPriRO'),
		constDesc(3),
	);

	assertEquals(
		Object.getOwnPropertyDescriptor(Concrete, 'staticPubRO'),
		constDesc(1),
	);
	assertEquals(
		Object.getOwnPropertyDescriptor(Concrete, 'staticProRO'),
		constDesc(2),
	);
	assertEquals(
		Object.getOwnPropertyDescriptor(Concrete, 'staticPriRO'),
		constDesc(3),
	);
});
