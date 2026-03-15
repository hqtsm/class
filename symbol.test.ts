import { assertEquals } from '@std/assert';
import { hasToStringTag, toStringTag } from './symbol.ts';

Deno.test('toStringTag', () => {
	class Alpha {}
	assertEquals(String(new Alpha()), '[object Object]');
	toStringTag(Alpha, 'Alpha');
	assertEquals(String(new Alpha()), '[object Alpha]');
	assertEquals(Object.prototype.toString.call(new Alpha()), '[object Alpha]');

	class Beta extends Alpha {
		static {
			assertEquals(String(new Beta()), '[object Alpha]');
			toStringTag(Beta, 'Beta');
		}
	}
	assertEquals(String(new Beta()), '[object Beta]');

	class NotSet {
		static {
			toStringTag(NotSet, 'Set');
		}
	}
	assertEquals(String(new NotSet()), '[object Set]');
	assertEquals(
		Object.getOwnPropertyDescriptor(NotSet.prototype, Symbol.toStringTag),
		Object.getOwnPropertyDescriptor(Set.prototype, Symbol.toStringTag),
	);

	class ProtectedConstructor {
		protected constructor() {}
		static create(): ProtectedConstructor {
			return new ProtectedConstructor();
		}
		static {
			toStringTag(ProtectedConstructor, 'ProtectedConstructor');
		}
	}
	assertEquals(
		String(ProtectedConstructor.create()),
		'[object ProtectedConstructor]',
	);

	class PrivateConstructor {
		private constructor() {}
		static create(): PrivateConstructor {
			return new PrivateConstructor();
		}
		static {
			toStringTag(PrivateConstructor, 'PrivateConstructor');
		}
	}
	assertEquals(
		String(PrivateConstructor.create()),
		'[object PrivateConstructor]',
	);
});

Deno.test('hasToStringTag', () => {
	class Alpha {
		static {
			toStringTag(this, 'Alpha');
		}
	}

	class Beta extends Alpha {
		static {
			toStringTag(this, 'Beta');
		}
	}

	class Undef extends Alpha {
		static {
			Object.defineProperty(this.prototype, Symbol.toStringTag, {
				value: undefined,
				configurable: true,
				enumerable: false,
				writable: false,
			});
		}
	}

	assertEquals(hasToStringTag('Alpha', new Alpha()), true);
	assertEquals(hasToStringTag('Beta', new Beta()), true);
	assertEquals(hasToStringTag('Alpha', new Beta()), true);
	assertEquals(hasToStringTag('Beta', new Alpha()), false);
	assertEquals(hasToStringTag('alpha', new Alpha()), false);
	assertEquals(hasToStringTag('Alpha', null), false);
	assertEquals(hasToStringTag('Alpha', undefined), false);
	assertEquals(hasToStringTag('Alpha', 0), false);
	assertEquals(hasToStringTag('Alpha', 42), false);
	assertEquals(hasToStringTag('Alpha', 0n), false);
	assertEquals(hasToStringTag('Alpha', 42n), false);
	assertEquals(hasToStringTag('Alpha', true), false);
	assertEquals(hasToStringTag('Alpha', false), false);
	assertEquals(hasToStringTag('Alpha', ''), false);
	assertEquals(hasToStringTag('Alpha', 'string'), false);
	assertEquals(hasToStringTag('Alpha', []), false);
	assertEquals(hasToStringTag('Alpha', [1, 2, 3]), false);
	assertEquals(hasToStringTag('Alpha', {}), false);
	assertEquals(hasToStringTag('Alpha', { a: 1, b: 2 }), false);
	assertEquals(hasToStringTag('Alpha', new Date()), false);
	assertEquals(hasToStringTag('Alpha', Symbol()), false);

	// Narrows type.
	const unk: unknown = new Alpha();
	if (hasToStringTag('Alpha', unk)) {
		assertEquals(unk[Symbol.toStringTag], 'Alpha');
	}

	// Weird but it works.
	assertEquals(hasToStringTag('Alpha', new Undef()), true);
});
