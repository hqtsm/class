import { assertEquals } from '@std/assert';
import { hasToStringTag, isToStringTag, toStringTag } from './symbol.ts';

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

	// Weird but it works.
	assertEquals(hasToStringTag('Alpha', new Undef()), true);
});

Deno.test('isToStringTag', () => {
	class Alpha {
		public a = 1;
		static {
			toStringTag(this, 'Alpha');
		}
	}

	class Beta extends Alpha {
		public b = 2;
		static {
			toStringTag(this, 'Beta');
		}
	}

	class Unrelated {
		static {
			toStringTag(this, 'Unrelated');
		}
	}

	class Untagged {}

	assertEquals(isToStringTag(Alpha, new Alpha()), true);
	assertEquals(isToStringTag(Beta, new Alpha()), false);
	assertEquals(isToStringTag(Alpha, new Beta()), true);
	assertEquals(isToStringTag(Alpha, new Unrelated()), false);
	assertEquals(isToStringTag(Alpha, new Untagged()), false);
	assertEquals(isToStringTag(Untagged, new Alpha()), false);

	const alpha = new Alpha();
	if (isToStringTag(Alpha, alpha)) {
		assertEquals(alpha.a, 1);
	}

	const beta = new Beta();
	if (isToStringTag(Beta, beta)) {
		assertEquals(beta.a, 1);
		assertEquals(beta.b, 2);
	}
});
