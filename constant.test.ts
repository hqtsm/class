import { assertEquals } from '@std/assert';
import { constant } from './constant.ts';

type IsEqual<X, Y> = (
	<E>() => E extends X ? 1 : 2
) extends (
	<E>() => E extends Y ? 1 : 2
) ? true
	: false;

const desc = <T>(value: T) => ({
	value,
	configurable: false,
	enumerable: false,
	writable: false,
});

Deno.test('constant', () => {
	abstract class Abstract {
		public static readonly PUB = 1;
		protected static readonly PRO = 2;
		private static readonly PRI = 3;

		static {
			constant(this, 'PUB');
			constant(this, 'PRO' as never);
			constant(this, 'PRI' as never);
		}
	}

	class Concrete extends Abstract {
		static {
			constant(this, 'PUB');
			constant(this, 'PRO' as never);
			constant(this, 'PRI' as never);
		}
	}

	void (true satisfies IsEqual<typeof Abstract['PUB'], 1>);
	void (true satisfies IsEqual<typeof Abstract['PRO'], 2>);
	void (true satisfies IsEqual<typeof Abstract['PRI'], 3>);

	void (true satisfies IsEqual<typeof Concrete['PUB'], 1>);
	void (true satisfies IsEqual<typeof Concrete['PRO'], 2>);
	void (true satisfies IsEqual<typeof Concrete['PRI'], 3>);

	assertEquals(Abstract.PUB, 1);
	assertEquals(Abstract['PRO'], 2);
	assertEquals(Abstract['PRI'], 3);

	assertEquals(Concrete.PUB, 1);
	assertEquals(Concrete['PRO'], 2);
	assertEquals(Concrete['PRI'], 3);

	assertEquals(Object.getOwnPropertyDescriptor(Abstract, 'PUB'), desc(1));
	assertEquals(Object.getOwnPropertyDescriptor(Abstract, 'PRO'), desc(2));
	assertEquals(Object.getOwnPropertyDescriptor(Abstract, 'PRI'), desc(3));

	assertEquals(Object.getOwnPropertyDescriptor(Concrete, 'PUB'), desc(1));
	assertEquals(Object.getOwnPropertyDescriptor(Concrete, 'PRO'), desc(2));
	assertEquals(Object.getOwnPropertyDescriptor(Concrete, 'PRI'), desc(3));
});
