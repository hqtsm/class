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

	assertEquals(hasToStringTag(new Alpha(), 'Alpha'), true);
	assertEquals(hasToStringTag(new Beta(), 'Beta'), true);
	assertEquals(hasToStringTag(new Beta(), 'Alpha'), true);
	assertEquals(hasToStringTag(new Alpha(), 'Beta'), false);
	assertEquals(hasToStringTag(new Alpha(), 'alpha'), false);
	assertEquals(hasToStringTag(null, 'Alpha'), false);
	assertEquals(hasToStringTag(undefined, 'Alpha'), false);
	assertEquals(hasToStringTag(0, 'Alpha'), false);
	assertEquals(hasToStringTag(42, 'Alpha'), false);
	assertEquals(hasToStringTag(0n, 'Alpha'), false);
	assertEquals(hasToStringTag(42n, 'Alpha'), false);
	assertEquals(hasToStringTag(true, 'Alpha'), false);
	assertEquals(hasToStringTag(false, 'Alpha'), false);
	assertEquals(hasToStringTag('', 'Alpha'), false);
	assertEquals(hasToStringTag('string', 'Alpha'), false);
	assertEquals(hasToStringTag([], 'Alpha'), false);
	assertEquals(hasToStringTag([1, 2, 3], 'Alpha'), false);
	assertEquals(hasToStringTag({}, 'Alpha'), false);
	assertEquals(hasToStringTag({ a: 1, b: 2 }, 'Alpha'), false);
	assertEquals(hasToStringTag(new Date(), 'Alpha'), false);
	assertEquals(hasToStringTag(Symbol(), 'Alpha'), false);

	// Narrows type.
	const unk: unknown = new Alpha();
	if (hasToStringTag(unk, 'Alpha')) {
		assertEquals(unk[Symbol.toStringTag], 'Alpha');
	}
});
