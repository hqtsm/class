import { assertEquals } from '@std/assert';
import { toStringTag } from './symbol.ts';

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
